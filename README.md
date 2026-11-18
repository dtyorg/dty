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

## Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel.
2. **Database:** create a MongoDB Atlas cluster (or use the Vercel ↔ MongoDB Atlas integration). In Atlas, allow access from `0.0.0.0/0`, because Vercel's IP addresses change.
3. **Storage:** in Vercel go to Storage → create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`, so uploads work on Vercel's read-only filesystem.
4. Environment variables:
   - `DATABASE_URL` – Atlas connection string
   - `PAYLOAD_SECRET` – a long random string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_SERVER_URL` – e.g. `https://your-domain.com`. If you leave it out, the Vercel production URL is used.
5. Deploy, then open `/admin` to create the first user. You can also run `pnpm seed` locally with the production `DATABASE_URL` to load demo content.

Publishing or editing a recipe, category, page, header or footer revalidates the affected routes on demand, so the static pages stay fast and current.
