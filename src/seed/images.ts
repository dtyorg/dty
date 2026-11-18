/**
 * ─── Paste your image links here ───────────────────────────────────────────────
 * `pnpm seed` downloads each URL into the Media collection and attaches it.
 * Leave a url empty ('') to keep the olive placeholder. Re-running the seed only
 * downloads URLs it hasn't imported yet, so you can fill these in gradually.
 *
 * Tips: use direct image links (ending in .jpg/.png/.webp, or an Unsplash/
 * Pexels "download" URL). Landscape ≥ 1600px wide works best for heroes.
 */
export type SeedImage = { url: string; alt: string }

export const images = {
  // Page heroes
  'hero-home': { url: '', alt: 'A dirty martini garnished with olives on a dark marble bar' },
  'hero-guide': { url: '', alt: 'Bar tools — shaker, jigger and strainer — on a bar top' },
  'hero-about': { url: '', alt: 'A softly lit cocktail bar with plants' },
  'feature-guide': { url: '', alt: 'Cocktail shaker, mixing glass, limes and fresh herbs' },

  // Section categories (also used on the “Explore our world” tiles)
  'cat-cocktails': { url: '', alt: 'A coupe cocktail with a cherry garnish' },
  'cat-spirits': { url: '', alt: 'Whisky in a crystal tumbler over ice' },
  'cat-wines': { url: '', alt: 'A glass of red wine among green leaves' },

  // Recipes (one per recipe slug)
  'recipe-dirty-martini': { url: '', alt: 'Dirty martini with three green olives' },
  'recipe-negroni': { url: '', alt: 'Negroni over a large ice cube with an orange peel' },
  'recipe-margarita': { url: '', alt: 'Margarita with a salted rim and lime wheel' },
  'recipe-espresso-martini': { url: '', alt: 'Espresso martini with a creamy crema and coffee beans' },
  'recipe-old-fashioned': { url: '', alt: 'Old fashioned with orange peel in a rocks glass' },
  'recipe-whiskey-sour': { url: '', alt: 'Whiskey sour with a foamy top and bitters' },
  'recipe-daiquiri': { url: '', alt: 'Classic daiquiri in a chilled coupe' },
  'recipe-mojito': { url: '', alt: 'Mojito with fresh mint and crushed ice' },
  'recipe-passion-fruit-martini': { url: '', alt: 'Passion fruit martini with half a passion fruit' },
  'recipe-paloma': { url: '', alt: 'Paloma highball with grapefruit wedge' },
  'recipe-garden-spritz': { url: '', alt: 'Alcohol-free cucumber elderflower spritz' },
  'recipe-berry-shrub-soda': { url: '', alt: 'Berry shrub soda with fresh raspberries' },
  'recipe-whisky-highball': { url: '', alt: 'Whisky highball with a lemon twist' },
  'recipe-gin-and-tonic': { url: '', alt: 'Gin and tonic in a copa glass with botanicals' },
  'recipe-spiced-rum-buck': { url: '', alt: 'Dark rum and ginger beer with lime' },
  'recipe-sipping-mezcal': { url: '', alt: 'Mezcal in a copita with orange slices' },
  'recipe-aperol-spritz': { url: '', alt: 'Bright orange spritz in a wine glass' },
  'recipe-hugo-spritz': { url: '', alt: 'Hugo spritz with mint and lime' },
  'recipe-french-75': { url: '', alt: 'French 75 in a flute with lemon twist' },
  'recipe-kir-royale': { url: '', alt: 'Kir royale — sparkling wine blushed with cassis' },
  'recipe-red-sangria': { url: '', alt: 'Pitcher of red sangria with sliced fruit' },
} satisfies Record<string, SeedImage>

export type ImageKey = keyof typeof images
