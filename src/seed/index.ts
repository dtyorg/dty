/**
 * Demo content for the cocktail site:  `pnpm seed`
 * Safe to re-run — documents are matched by slug and updated in place.
 * Add image links in ./images.ts; they are downloaded into Media on the next run.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { type ImageKey, images } from './images'
import { bold, doc, h, ol, p, ul } from './lexical'
import { recipeNotes, recipes } from './recipes'

const ctx = { disableRevalidate: true }
const payload = await getPayload({ config })

type Slugged = 'pages' | 'recipes' | 'categories'
const upsert = async (collection: Slugged, slug: string, data: Record<string, unknown>) => {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true, context: ctx })
  if (existing.docs[0]) {
    return payload.update({ collection, id: existing.docs[0].id, data: data as never, draft: false, context: ctx })
  }
  return payload.create({ collection, data: data as never, draft: false, context: ctx })
}

// ─── Images: download each URL once into Media ────────────────────────────
const mediaIds: Partial<Record<ImageKey, string>> = {}
const extFor = (type: string) => ({ 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif' })[type] ?? 'jpg'

for (const [key, { url, alt }] of Object.entries(images) as [ImageKey, { url: string; alt: string }][]) {
  if (!url) continue
  const existing = await payload.find({ collection: 'media', where: { sourceUrl: { equals: url } }, limit: 1 })
  if (existing.docs[0]) {
    mediaIds[key] = existing.docs[0].id
    continue
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'payload-seed' } })
    const type = (res.headers.get('content-type') ?? '').split(';')[0]
    if (!res.ok || !type.startsWith('image/')) throw new Error(`HTTP ${res.status} (${type || 'unknown type'})`)
    const data = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt, sourceUrl: url },
      file: { data, mimetype: type, name: `${key}.${extFor(type)}`, size: data.length },
    })
    mediaIds[key] = doc.id
    payload.logger.info(`  ↓ ${key}`)
  } catch (err) {
    payload.logger.warn(`  ✗ Could not import image "${key}" from ${url}: ${(err as Error).message}`)
  }
}
const img = (key: ImageKey) => mediaIds[key] ?? null

// ─── Categories: sections + sub-categories ────────────────────────────────
payload.logger.info('Seeding categories…')
const sections = [
  {
    slug: 'cocktails', title: 'Cocktails', icon: 'cocktail', order: 1, image: img('cat-cocktails'),
    headline: 'Mix. Sip. Repeat.',
    description: 'From timeless classics to modern creations, discover the perfect cocktail for every occasion.',
    feature: {
      enabled: true, eyebrow: 'Cocktail guide', heading: 'Learn the art of mixology.',
      body: 'Expert tips, ingredient guides and techniques to elevate your cocktail game.',
      image: img('feature-guide'),
      link: { type: 'custom', url: '/guide', label: 'Read the Guide', appearance: 'outlined' },
    },
  },
  {
    slug: 'spirits', title: 'Spirits', icon: 'spirit', order: 2, image: img('cat-spirits'),
    headline: 'Neat, on the rocks, or reinvented.',
    description: 'Get to know the bottles behind the bar — and the simple serves that let them shine.',
  },
  {
    slug: 'wines', title: 'Wines', icon: 'wine', order: 3, image: img('cat-wines'),
    headline: 'Uncork something special.',
    description: 'Spritzes, sparkling serves and wine cocktails for long evenings and good company.',
  },
] as const
const subcategories: { slug: string; title: string; parent: string; order: number; description?: string }[] = [
  { parent: 'cocktails', slug: 'classic', title: 'Classic', order: 1, description: 'The canon — drinks every bartender knows by heart.' },
  { parent: 'cocktails', slug: 'fruity', title: 'Fruity', order: 2, description: 'Ripe, juicy and bright.' },
  { parent: 'cocktails', slug: 'sour', title: 'Sour', order: 3, description: 'Spirit, citrus and sweet in perfect balance.' },
  { parent: 'cocktails', slug: 'refreshing', title: 'Refreshing', order: 4, description: 'Long, cool and bubbly.' },
  { parent: 'cocktails', slug: 'strong', title: 'Strong', order: 5, description: 'Spirit-forward and stirred.' },
  { parent: 'cocktails', slug: 'zero-proof', title: 'Zero-proof', order: 6, description: 'All the flavour, none of the alcohol.' },
  { parent: 'spirits', slug: 'whisky', title: 'Whisky', order: 1 },
  { parent: 'spirits', slug: 'gin', title: 'Gin', order: 2 },
  { parent: 'spirits', slug: 'rum', title: 'Rum', order: 3 },
  { parent: 'spirits', slug: 'agave', title: 'Tequila & Mezcal', order: 4 },
  { parent: 'wines', slug: 'spritz', title: 'Spritz', order: 1 },
  { parent: 'wines', slug: 'sparkling', title: 'Sparkling', order: 2 },
  { parent: 'wines', slug: 'punch', title: 'Sangria & Punch', order: 3 },
]

const cat: Record<string, string> = {}
for (const s of sections) cat[s.slug] = (await upsert('categories', s.slug, { ...s })).id
for (const s of subcategories) {
  const icon = sections.find((x) => x.slug === s.parent)?.icon
  cat[s.slug] = (await upsert('categories', s.slug, { ...s, parent: cat[s.parent], icon })).id
}

// ─── Recipes ──────────────────────────────────────────────────────────────
payload.logger.info('Seeding recipes…')
const recipeId: Record<string, string> = {}
for (const [i, r] of recipes.entries()) {
  const doc = await upsert('recipes', r.slug, {
    title: r.title,
    slug: r.slug,
    description: r.description,
    featured: Boolean(r.featured),
    categories: r.categories.map((c) => cat[c]).filter(Boolean),
    details: { servings: 1, ...r.details },
    ingredients: r.ingredients.map(([amount, unit, name, note]) => ({ amount, unit, name, note })),
    steps: r.steps.map((instruction) => ({ instruction })),
    notes: recipeNotes(r),
    image: img(`recipe-${r.slug}` as ImageKey),
    _status: 'published',
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  })
  recipeId[r.slug] = doc.id
}

// ─── Pages ────────────────────────────────────────────────────────────────
payload.logger.info('Seeding pages…')
const newsletter = { blockType: 'newsletter', heading: 'A little sip of inspiration.', body: 'Discover new drinks, recipes and more.', buttonLabel: 'Join' }

const home = await upsert('pages', 'home', {
  title: 'Home',
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'immersive',
    eyebrow: 'Good drinks. Chill vibes.',
    headline: 'Discover the art of drinking well.',
    subhead: 'Explore delicious cocktails, premium spirits and exceptional wines.',
    media: img('hero-home'),
    links: [{ link: { type: 'custom', url: '/recipes', label: 'Explore Our Collection', appearance: 'outlined' } }],
  },
  layout: [
    { blockType: 'categoryGrid', heading: 'Explore our world', style: 'tiles', categories: [cat.cocktails, cat.spirits, cat.wines] },
    { blockType: 'recipeGrid', heading: 'Trending right now', style: 'strip', source: 'featured', limit: 3, showAllLink: true },
    newsletter,
  ],
})

const guide = await upsert('pages', 'guide', {
  title: 'Cocktail Guide',
  slug: 'guide',
  _status: 'published',
  hero: {
    type: 'immersive',
    eyebrow: 'Cocktail guide',
    headline: 'Learn the art of mixology.',
    subhead: 'Expert tips, ingredient guides and techniques to elevate your cocktail game.',
    media: img('hero-guide'),
  },
  layout: [
    {
      blockType: 'cardGrid',
      heading: 'The essential bar kit',
      intro: 'You can make almost anything with these six tools.',
      variant: 'outlined',
      cards: [
        { title: 'Shaker', description: 'A two-piece tin shaker seals well and chills fast.' },
        { title: 'Mixing glass', description: 'For stirred drinks that should stay silky and clear.' },
        { title: 'Jigger', description: 'Measure everything — balance is in the millilitres.' },
        { title: 'Strainers', description: 'A Hawthorne for shaken drinks, a fine strainer for ice shards.' },
        { title: 'Bar spoon', description: 'Long, weighted and twisted for smooth stirring.' },
        { title: 'Muddler', description: 'Gently press herbs and fruit — never pulverise mint.' },
      ],
    },
    {
      blockType: 'content',
      surface: 'none',
      richText: doc(
        h('h2', 'Shake or stir?'),
        p(bold('Shake'), ' anything with citrus, cream, egg or juice — it aerates, chills and dilutes quickly.'),
        p(bold('Stir'), ' spirit-only drinks like the Negroni, Martini and Old Fashioned for a silky, crystal-clear texture.'),
        h('h2', 'The golden ratio'),
        p('Most sours follow 2 : ¾ : ¾ — two parts spirit, three-quarters citrus, three-quarters sweet. Learn it once and you can riff forever.'),
        h('h2', 'Respect the ice'),
        ul(['Use plenty — a full shaker chills faster and dilutes less.', 'Large, clear cubes melt slowly in drinks served on the rocks.', 'Never reuse shaking ice in the glass.']),
        h('h2', 'Five habits of great home bartenders'),
        ol(['Squeeze citrus fresh, the same day.', 'Chill your glassware.', 'Taste every drink before serving.', 'Keep syrups in the fridge, labelled and dated.', 'Garnish with purpose — aroma is flavour.']),
      ),
    },
    {
      blockType: 'feature',
      eyebrow: 'Practice makes perfect',
      heading: 'Start with the Daiquiri.',
      body: 'Three ingredients, zero hiding places. Nail this and every sour becomes easy.',
      image: img('recipe-daiquiri'),
      imagePosition: 'end',
      enableLink: true,
      link: { type: 'reference', reference: { relationTo: 'recipes', value: recipeId.daiquiri }, label: 'Make a Daiquiri', appearance: 'outlined' },
    },
    newsletter,
  ],
})

const about = await upsert('pages', 'about', {
  title: 'About',
  slug: 'about',
  _status: 'published',
  hero: {
    type: 'immersive',
    eyebrow: 'About us',
    headline: 'Good drinks, clearly explained.',
    subhead: 'Every recipe is measured, tested and written to be made at home.',
    media: img('hero-about'),
  },
  layout: [
    {
      blockType: 'content',
      surface: 'none',
      richText: doc(
        h('h2', 'Our story'),
        p('We started D3TY because great cocktails shouldn’t need a bartending diploma. Fresh citrus, good ice and accurate measures will take you most of the way — we’ll show you the rest.'),
        h('h2', 'How we test'),
        p('Each recipe is made at least three times with ingredients you can find in a normal supermarket or liquor store, then tasted side-by-side against classic specs.'),
      ),
    },
    newsletter,
  ],
})

const faqs = await upsert('pages', 'faqs', {
  title: 'FAQs',
  slug: 'faqs',
  _status: 'published',
  hero: { type: 'standard', eyebrow: 'Help', headline: 'Frequently asked questions' },
  layout: [
    {
      blockType: 'content',
      surface: 'none',
      richText: doc(
        h('h3', 'Can I use bottled lime or lemon juice?'),
        p('You can, but fresh juice makes the single biggest difference to a cocktail. Squeeze it the same day.'),
        h('h3', 'What is simple syrup?'),
        p('Equal parts sugar and water stirred until dissolved. “Rich” simple syrup uses two parts sugar to one part water.'),
        h('h3', 'Do you have alcohol-free drinks?'),
        p('Yes — browse the Zero-proof category inside Cocktails.'),
        h('h3', 'How do I convert ml to oz?'),
        p('30 ml ≈ 1 oz. Our jigger-friendly measures round to the nearest 5 ml.'),
      ),
    },
  ],
})

const privacy = await upsert('pages', 'privacy', {
  title: 'Privacy',
  slug: 'privacy',
  _status: 'published',
  hero: { type: 'standard', eyebrow: 'Legal', headline: 'Privacy policy' },
  layout: [
    {
      blockType: 'content',
      surface: 'none',
      richText: doc(
        p('This is placeholder text. Replace it with your own privacy policy before launch.'),
        h('h3', 'Newsletter'),
        p('If you join our newsletter we store your email address only to send you recipes and updates. You can unsubscribe at any time.'),
      ),
    },
  ],
})

// ─── Globals ──────────────────────────────────────────────────────────────
payload.logger.info('Seeding globals…')
const pageLink = (id: string, label: string) => ({ link: { type: 'reference' as const, reference: { relationTo: 'pages' as const, value: id }, label } })
const catLink = (slug: string, label: string) => ({ link: { type: 'reference' as const, reference: { relationTo: 'categories' as const, value: cat[slug] }, label } })

await payload.updateGlobal({
  slug: 'header',
  context: ctx,
  data: {
    siteName: 'D3TY',
    navItems: [pageLink(home.id, 'Home'), catLink('cocktails', 'Cocktails'), catLink('spirits', 'Spirits'), catLink('wines', 'Wines'), pageLink(about.id, 'About')],
    cta: { enabled: false },
  },
})
await payload.updateGlobal({
  slug: 'footer',
  context: ctx,
  data: {
    links: [pageLink(about.id, 'About'), pageLink(guide.id, 'Guide'), pageLink(faqs.id, 'FAQs'), pageLink(privacy.id, 'Privacy')],
    socials: [
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'pinterest', url: 'https://pinterest.com' },
      { platform: 'youtube', url: 'https://youtube.com' },
    ],
    legal: 'Drink Responsibly · 18+',
    copyright: `© ${new Date().getFullYear()} D3TY. All rights reserved.`,
  },
})

const imported = Object.keys(mediaIds).length
payload.logger.info(`✓ Seed complete — ${recipes.length} recipes, ${sections.length + subcategories.length} categories, ${imported} images`)
process.exit(0)
