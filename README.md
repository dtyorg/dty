# D3TY — cocktail recipes

Payload CMS 3 + Next.js 16 + MongoDB, deployed on Vercel. The frontend follows **Material Design 3** (https://m3.material.io) with an **olive-green** color scheme in light and dark.

## Content model

| Collection | Purpose |
|---|---|
| **Recipes** | Title, description, image, **ingredients** (amount / unit / name / note), **steps**, notes, details (difficulty, prep time, servings, method, glass, garnish, alcohol-free), **Trending** flag, drafts + live preview, SEO |
| **Categories** | Two levels. **Sections** (no parent): Cocktails, Spirits, Wines. Each has a hero (headline, description, image), an icon and an optional feature promo. **Sub-categories** (with a parent): Classic, Fruity, Sour… These show as filter chips inside the section. A recipe can be in several categories; list its main section first. |
| Pages | Block-built pages: Immersive/standard hero, Category tiles, Recipe grid/strip, Feature, Newsletter, Rich text, Cards, CTA, Media. The page with slug `home` is the homepage. |
| Subscribers | Newsletter sign-ups (public form → server action; admin-only API). |
| Media, Users | Uploads (Vercel Blob in production) and admin users. |
| Header / Footer | Navigation, footer links, social links, legal line. |

Routes: `/`, `/recipes`, `/recipes/[slug]`, `/categories/[slug]`, `/search?q=`, `/[slug]` (guide, about, faqs, privacy), `/admin`.

## Images for the demo content

Paste image links into **`src/seed/images.ts`** (one entry per hero, section and recipe), then run `pnpm seed`. Each URL is downloaded once into Media and attached; empty entries keep the olive placeholder. Re-running only imports new URLs.

## Local development

```bash
cp .env.example .env          # set DATABASE_URL + PAYLOAD_SECRET
pnpm install
pnpm dev                      # http://localhost:3000 — create the first admin at /admin
pnpm seed                     # demo: 3 sections, 13 sub-categories, 21 recipes, pages, nav
```

Need MongoDB locally? `docker compose up -d` or a free MongoDB Atlas cluster.

## Theme (Material 3)

- `src/app/(frontend)/theme/tokens.css` – all M3 color roles for light and dark, **generated** from the seed color `#6B7F3A` with Google's `material-color-utilities`. To change it, run `pnpm theme:generate "#hex"`.
- Typefaces follow M3's brand/plain split: **Cormorant Garamond** (brand) for display, headline and title-large; **Roboto Flex** (plain) for body and label text.
- Photo heroes and tiles use the scoped `.md-theme-dark` scheme, so text over images stays readable in both themes.
- `src/app/(frontend)/theme/m3.css` – M3 type scale, shape, elevation, state layers, motion, and components (buttons, icon button, cards, chips, top app bar, navigation drawer, segmented button).
- `src/app/(frontend)/theme/site.css` – page layout using only `--md-sys-*` tokens.
- Theme modes: follows the OS by default, and the user can pick Light, System or Dark (header icon button, drawer, footer). The choice is saved and applied before first paint, so the page never flashes the wrong theme.

## SEO, analytics & AI visibility

Everything is configured in **Payload → Globals → Site settings**:

| Tab | What it controls |
|---|---|
| SEO defaults | Site name, title template (`%s — D3TY`), default description and share image, locale, X/Twitter handle, and **Hide site from search engines** (for staging) |
| Organization | Name, logo and email used in the Organization structured data |
| Verification | Google Search Console, Bing Webmaster (`msvalidate.01`) and Facebook domain-verification codes |
| Tracking | GA4 *or* GTM, Meta Pixel, Microsoft Advertising (Bing UET), Microsoft Clarity, and **Require cookie consent** |
| AI & LLMs | Allow AI search/answer bots, allow AI training bots, the `llms.txt` introduction and notes |

Each page, recipe and category also has an **SEO tab** (meta title, description and image). The Generate buttons fill these from the content.

**What the site outputs**
- Metadata on every route: title, description, canonical URL, Open Graph (recipes are shared as `article` with publish/updated dates), Twitter card and `max-image-preview:large`.
- JSON-LD:
  - `Organization` + `WebSite` (with site search) on the home page
  - `Recipe` on recipe pages (ingredients, `HowToStep`s, prep time, yield, category, keywords, images)
  - `CollectionPage` + `ItemList` on category and listing pages
  - `BreadcrumbList` everywhere
- `/sitemap.xml` (with recipe images), `/robots.txt`, `/manifest.webmanifest`.
- `/og?title=…&eyebrow=…`: a branded 1200×630 share image for anything without a photo.
- For AI assistants:
  - `/llms.txt` (the llmstxt.org format)
  - `/llms-full.txt` (every recipe and the guide, in Markdown)
  - `/recipes/<slug>.md` (a Markdown version of each recipe, linked from the page's `<head>` and marked `noindex`)

  `robots.txt` has explicit groups for AI search bots and AI training bots.

**Tracking behaviour**
- Nothing loads until the visitor accepts the cookie banner (when consent is required). Scripts are then injected after `window.load` and idle time, so they never affect LCP or CLS.
- Choices are remembered. "Cookie settings" in the footer re-opens the banner, and withdrawing consent reloads the page to drop trackers.
- Page views on client-side navigation: GA4 enhanced measurement and Bing UET (`enableAutoSpaTracking`) handle these themselves; the site sends Meta `PageView` and a GTM `page_view` event.
- Events, from `track()` in `src/components/analytics/track.ts`:

  | Action | GA4 / GTM | Meta | Bing UET | Clarity |
  |---|---|---|---|---|
  | Newsletter sign-up | `sign_up` | `Lead` | `sign_up` | event |
  | Recipe view | `view_item` | `ViewContent` | `view_item` | event |
  | Search | `search` | `Search` | `search` | event |

**After deploying**
1. Set `NEXT_PUBLIC_SERVER_URL` to the production domain. Canonical URLs, Open Graph, the sitemap and JSON-LD are all built from it.
2. Add the site in Google Search Console and Bing Webmaster Tools (Bing can import from Search Console), paste the verification codes in Site settings, then submit `/sitemap.xml`.
3. Test a recipe with Google's Rich Results Test, and check Pixel events in Meta Events Manager → Test events.

## Motion (GSAP)

- **Hero intros** are pure CSS keyframes, so they start instantly without JavaScript.
- **Scroll reveals and the hero parallax** use GSAP + ScrollTrigger in `src/components/Motion.tsx`. GSAP is loaded with a dynamic import when the browser is idle, so it's never part of the initial bundle, and it's never downloaded when the OS asks for reduced motion.
- Only content below the fold is hidden before its reveal, so nothing visible on first paint flickers, and LCP and CLS are unaffected. Only `transform` and `opacity` are animated.
- To animate something from a server component, add an attribute: `data-animate`, `data-animate="scale"`, `data-animate-children` (staggers the direct children) or `data-parallax`.

## Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel.
2. **Database:** create a MongoDB Atlas cluster (or use the Vercel ↔ MongoDB Atlas integration). In Atlas, allow access from `0.0.0.0/0`, because Vercel's IP addresses change.
3. **Storage:** in Vercel go to Storage → create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`, so uploads work on Vercel's read-only filesystem.
4. Environment variables:
   - `DATABASE_URL` – Atlas connection string
   - `PAYLOAD_SECRET` – a long random string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_SERVER_URL` – e.g. `https://your-domain.com`. If you leave it out, the Vercel production URL is used.
5. Deploy, then open `/admin` to create the first user. You can also run `pnpm seed` locally with the production `DATABASE_URL` to load demo content.

## Email (Resend)

Payload sends password-reset emails, and new newsletter subscribers get a welcome email with a one-click unsubscribe link (`/newsletter/unsubscribe`). Sign-ups are stored in **Subscribers** with a status of subscribed or unsubscribed.

1. Create an account at resend.com → **Domains → Add domain**, then add the DNS records it shows (SPF/DKIM) at your DNS provider.
2. **API Keys → Create** (Sending access).
3. Set these in Vercel (and in `.env` locally):
   - `RESEND_API_KEY=re_…`
   - `EMAIL_FROM_ADDRESS=hello@yourdomain.com` (must be on the verified domain)
   - `EMAIL_FROM_NAME=D3TY`
4. Redeploy.

Before your domain is verified you can only send from `onboarding@resend.dev`, and only to your own Resend account email. `EMAIL_OVERRIDE_TO` sends every email to one address, which is useful for testing. If you prefer SMTP, set `SMTP_HOST/PORT/USER/PASS` instead. With neither set, emails are only logged to the console.

Publishing or editing a recipe, category, page, header or footer revalidates the affected routes on demand, so the static pages stay fast and current.
