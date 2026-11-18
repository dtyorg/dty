import { doc, p } from './lexical'

type Ing = [amount: string, unit: string | null, name: string, note?: string]

export type SeedRecipe = {
  slug: string
  title: string
  description: string
  /** Category slugs: a section (cocktails/spirits/wines) plus any sub-categories. */
  categories: string[]
  featured?: boolean
  details: {
    difficulty: 'easy' | 'medium' | 'advanced'
    prepMinutes: number
    servings?: number
    method?: 'shaken' | 'stirred' | 'built' | 'blended' | 'muddled' | 'layered' | 'thrown'
    glass?: string
    garnish?: string
    alcoholFree?: boolean
  }
  ingredients: Ing[]
  steps: string[]
  notes?: string
}

export const recipes: SeedRecipe[] = [
  // ─── Cocktails ────────────────────────────────────────────────
  {
    slug: 'dirty-martini',
    title: 'Dirty Martini',
    description: 'A bold classic with a savoury twist.',
    categories: ['cocktails', 'classic', 'strong', 'spirits', 'gin'],
    details: { difficulty: 'easy', prepMinutes: 5, method: 'stirred', glass: 'Martini or Nick & Nora', garnish: 'Three green olives on a pick' },
    ingredients: [['60', 'ml', 'Gin or vodka', 'from the freezer'], ['10', 'ml', 'Dry vermouth'], ['15', 'ml', 'Olive brine'], ['3', 'piece', 'Green olives']],
    steps: [
      'Chill your glass with ice and water while you mix.',
      'Add gin, vermouth and olive brine to a mixing glass with plenty of ice.',
      'Stir for 25–30 seconds until very cold.',
      'Discard the ice from your glass and strain the drink in.',
      'Garnish with olives on a pick.',
    ],
    notes: 'Like it “filthy”? Push the brine to 20 ml. Prefer it cleaner? Drop to 5 ml and add a lemon twist.',
  },
  {
    slug: 'negroni',
    title: 'Negroni',
    description: 'Bitter, smooth, and sophisticated.',
    categories: ['cocktails', 'classic', 'strong', 'spirits', 'gin'],
    featured: true,
    details: { difficulty: 'easy', prepMinutes: 5, method: 'stirred', glass: 'Rocks', garnish: 'Orange peel' },
    ingredients: [['30', 'ml', 'London dry gin'], ['30', 'ml', 'Campari'], ['30', 'ml', 'Sweet vermouth']],
    steps: [
      'Add all ingredients to a mixing glass filled with ice.',
      'Stir for 20–30 seconds until well chilled.',
      'Strain over a large ice cube in a rocks glass.',
      'Express an orange peel over the drink and drop it in.',
    ],
    notes: 'Swap gin for bourbon for a Boulevardier, or for prosecco for a Negroni Sbagliato.',
  },
  {
    slug: 'margarita',
    title: 'Margarita',
    description: 'Zesty, refreshing and timeless.',
    categories: ['cocktails', 'sour', 'refreshing', 'spirits', 'agave'],
    featured: true,
    details: { difficulty: 'easy', prepMinutes: 5, method: 'shaken', glass: 'Coupe or rocks', garnish: 'Salt rim & lime wheel' },
    ingredients: [['50', 'ml', 'Blanco tequila'], ['25', 'ml', 'Fresh lime juice'], ['20', 'ml', 'Orange liqueur', 'Cointreau or triple sec'], ['5', 'ml', 'Agave syrup', 'optional'], ['1', 'pinch', 'Flaky salt', 'for the rim']],
    steps: [
      'Run a lime wedge around half the rim of your glass and dip it in salt.',
      'Shake tequila, lime, orange liqueur and agave hard with ice.',
      'Strain into the glass (over fresh ice if using a rocks glass).',
      'Garnish with a lime wheel.',
    ],
  },
  {
    slug: 'espresso-martini',
    title: 'Espresso Martini',
    description: 'Rich coffee, a silky crema and a little kick.',
    categories: ['cocktails', 'classic', 'strong'],
    featured: true,
    details: { difficulty: 'medium', prepMinutes: 6, method: 'shaken', glass: 'Coupe', garnish: 'Three coffee beans' },
    ingredients: [['50', 'ml', 'Vodka'], ['30', 'ml', 'Fresh espresso', 'hot is fine'], ['20', 'ml', 'Coffee liqueur'], ['10', 'ml', 'Simple syrup']],
    steps: [
      'Pull a fresh shot of espresso.',
      'Add everything to a shaker with plenty of ice.',
      'Shake as hard as you can for 15 seconds — this builds the crema.',
      'Double-strain into a chilled coupe and float three coffee beans.',
    ],
  },
  {
    slug: 'old-fashioned',
    title: 'Old Fashioned',
    description: 'Whiskey, sugar, bitters, ice. The original cocktail.',
    categories: ['cocktails', 'classic', 'strong', 'spirits', 'whisky'],
    details: { difficulty: 'easy', prepMinutes: 4, method: 'stirred', glass: 'Rocks', garnish: 'Orange peel & cherry' },
    ingredients: [['60', 'ml', 'Bourbon or rye'], ['1', 'barspoon', 'Rich simple syrup', '2:1'], ['2', 'dash', 'Angostura bitters'], ['1', 'dash', 'Orange bitters']],
    steps: ['Combine syrup and bitters in a mixing glass.', 'Add whiskey and ice; stir for 30 seconds.', 'Strain over a large cube and garnish.'],
  },
  {
    slug: 'whiskey-sour',
    title: 'Whiskey Sour',
    description: 'Silky, tart and balanced, with a frothy crown.',
    categories: ['cocktails', 'sour', 'classic', 'spirits', 'whisky'],
    details: { difficulty: 'medium', prepMinutes: 5, method: 'shaken', glass: 'Rocks', garnish: 'Angostura drops' },
    ingredients: [['50', 'ml', 'Bourbon'], ['25', 'ml', 'Fresh lemon juice'], ['20', 'ml', 'Simple syrup'], ['1', 'piece', 'Egg white', 'or 20 ml aquafaba']],
    steps: ['Dry-shake everything without ice for 10 seconds.', 'Add ice and shake hard for 12 seconds more.', 'Double-strain over fresh ice.', 'Dot the foam with bitters.'],
  },
  {
    slug: 'daiquiri',
    title: 'Daiquiri',
    description: 'Rum, lime and sugar — the bartender’s benchmark.',
    categories: ['cocktails', 'sour', 'classic', 'spirits', 'rum'],
    details: { difficulty: 'easy', prepMinutes: 3, method: 'shaken', glass: 'Coupe', garnish: 'Lime wheel' },
    ingredients: [['60', 'ml', 'White rum'], ['25', 'ml', 'Fresh lime juice'], ['15', 'ml', 'Simple syrup']],
    steps: ['Shake everything hard with ice.', 'Double-strain into a chilled coupe.'],
    notes: 'Taste and adjust: this 60/25/15 balance is the template for almost every sour.',
  },
  {
    slug: 'mojito',
    title: 'Mojito',
    description: 'Mint, lime and rum lengthened with soda.',
    categories: ['cocktails', 'refreshing', 'spirits', 'rum'],
    details: { difficulty: 'medium', prepMinutes: 5, method: 'muddled', glass: 'Highball', garnish: 'Mint sprig' },
    ingredients: [['8', 'leaf', 'Fresh mint'], ['25', 'ml', 'Fresh lime juice'], ['20', 'ml', 'Simple syrup'], ['50', 'ml', 'White rum'], ['', 'top-up', 'Soda water']],
    steps: ['Gently press mint with syrup and lime in the glass.', 'Add rum and fill with crushed ice.', 'Churn with a bar spoon, then top with soda.', 'Crown with more ice and a slapped mint sprig.'],
  },
  {
    slug: 'passion-fruit-martini',
    title: 'Passion Fruit Martini',
    description: 'Tropical, vanilla-kissed and made for celebrating.',
    categories: ['cocktails', 'fruity'],
    details: { difficulty: 'medium', prepMinutes: 6, method: 'shaken', glass: 'Coupe', garnish: 'Half a passion fruit' },
    ingredients: [['45', 'ml', 'Vanilla vodka'], ['15', 'ml', 'Passion fruit liqueur'], ['2', 'piece', 'Passion fruit', 'pulp only'], ['15', 'ml', 'Fresh lime juice'], ['10', 'ml', 'Vanilla syrup']],
    steps: ['Scoop the passion fruit pulp into a shaker.', 'Add the rest with ice and shake hard.', 'Double-strain into a chilled coupe.', 'Float half a passion fruit on top.'],
  },
  {
    slug: 'paloma',
    title: 'Paloma',
    description: 'Tequila and grapefruit — Mexico’s favourite highball.',
    categories: ['cocktails', 'refreshing', 'fruity', 'spirits', 'agave'],
    details: { difficulty: 'easy', prepMinutes: 3, method: 'built', glass: 'Highball', garnish: 'Grapefruit wedge & salt' },
    ingredients: [['50', 'ml', 'Blanco tequila'], ['15', 'ml', 'Fresh lime juice'], ['1', 'pinch', 'Salt'], ['120', 'ml', 'Grapefruit soda']],
    steps: ['Fill a salt-rimmed highball with ice.', 'Add tequila, lime and a pinch of salt.', 'Top with grapefruit soda and stir gently.'],
  },
  {
    slug: 'garden-spritz',
    title: 'Garden Spritz',
    description: 'Bright, herbal and completely alcohol-free.',
    categories: ['cocktails', 'refreshing', 'zero-proof'],
    details: { difficulty: 'easy', prepMinutes: 3, method: 'built', glass: 'Wine glass', garnish: 'Cucumber ribbon', alcoholFree: true },
    ingredients: [['20', 'ml', 'Elderflower cordial'], ['15', 'ml', 'Fresh lime juice'], ['3', 'slice', 'Cucumber'], ['120', 'ml', 'Soda water']],
    steps: ['Add cordial, lime and cucumber to a wine glass full of ice.', 'Top with soda and stir gently.', 'Garnish with a cucumber ribbon.'],
  },
  {
    slug: 'berry-shrub-soda',
    title: 'Berry Shrub Soda',
    description: 'Tangy, fruity and grown-up — no alcohol needed.',
    categories: ['cocktails', 'fruity', 'zero-proof'],
    details: { difficulty: 'easy', prepMinutes: 4, method: 'built', glass: 'Highball', garnish: 'Raspberries & thyme', alcoholFree: true },
    ingredients: [['30', 'ml', 'Raspberry shrub', 'or 20 ml raspberry syrup + 10 ml cider vinegar'], ['10', 'ml', 'Fresh lemon juice'], ['150', 'ml', 'Sparkling water'], ['1', 'sprig', 'Thyme']],
    steps: ['Add shrub and lemon to an ice-filled highball.', 'Top with sparkling water.', 'Garnish with berries and thyme.'],
  },

  // ─── Spirits ─────────────────────────────────────────────────
  {
    slug: 'whisky-highball',
    title: 'Whisky Highball',
    description: 'Crisp, effervescent and quietly perfect.',
    categories: ['spirits', 'whisky', 'cocktails', 'refreshing'],
    details: { difficulty: 'easy', prepMinutes: 2, method: 'built', glass: 'Tall highball', garnish: 'Lemon twist' },
    ingredients: [['45', 'ml', 'Blended or Japanese whisky'], ['135', 'ml', 'Very cold soda water']],
    steps: ['Fill a chilled highball with clear ice and stir to chill the glass.', 'Add whisky and stir 10 times.', 'Top up with soda poured down a bar spoon; stir once.', 'Express a lemon twist over the top.'],
  },
  {
    slug: 'gin-and-tonic',
    title: 'Gin & Tonic',
    description: 'Aromatic, bitter-sweet and endlessly customisable.',
    categories: ['spirits', 'gin', 'cocktails', 'refreshing'],
    details: { difficulty: 'easy', prepMinutes: 2, method: 'built', glass: 'Copa', garnish: 'Lime wedge or cucumber' },
    ingredients: [['50', 'ml', 'Gin'], ['150', 'ml', 'Tonic water', 'well chilled']],
    steps: ['Fill a glass to the top with ice.', 'Pour in the gin, then top with tonic down a bar spoon.', 'Garnish to match your gin’s botanicals.'],
  },
  {
    slug: 'spiced-rum-buck',
    title: 'Spiced Rum Buck',
    description: 'Dark rum, fiery ginger and a squeeze of lime.',
    categories: ['spirits', 'rum', 'cocktails', 'refreshing'],
    details: { difficulty: 'easy', prepMinutes: 3, method: 'built', glass: 'Highball', garnish: 'Lime wedge' },
    ingredients: [['50', 'ml', 'Dark or spiced rum'], ['15', 'ml', 'Fresh lime juice'], ['120', 'ml', 'Ginger beer']],
    steps: ['Fill a highball with ice.', 'Add lime and ginger beer.', 'Float the rum on top and serve with a stirrer.'],
  },
  {
    slug: 'sipping-mezcal',
    title: 'Sipping Mezcal',
    description: 'How to taste agave spirits the traditional way.',
    categories: ['spirits', 'agave'],
    details: { difficulty: 'easy', prepMinutes: 2, method: 'built', glass: 'Copita or small tumbler', garnish: 'Orange slices & chilli salt' },
    ingredients: [['45', 'ml', 'Mezcal', 'room temperature'], ['3', 'slice', 'Orange'], ['1', 'pinch', 'Chilli salt']],
    steps: ['Pour the mezcal neat into a copita.', 'Arrange orange slices dusted with chilli salt alongside.', 'Sip slowly — “kiss” the mezcal rather than shooting it — and nibble the orange between sips.'],
  },

  // ─── Wines ───────────────────────────────────────────────────
  {
    slug: 'aperol-spritz',
    title: 'Aperol Spritz',
    description: 'The bittersweet taste of an Italian aperitivo hour.',
    categories: ['wines', 'spritz', 'cocktails', 'refreshing'],
    details: { difficulty: 'easy', prepMinutes: 2, method: 'built', glass: 'Large wine glass', garnish: 'Orange slice' },
    ingredients: [['90', 'ml', 'Prosecco'], ['60', 'ml', 'Aperol'], ['30', 'ml', 'Soda water']],
    steps: ['Fill a wine glass with ice.', 'Add prosecco, then Aperol, then a splash of soda.', 'Stir gently and garnish with an orange slice.'],
  },
  {
    slug: 'hugo-spritz',
    title: 'Hugo Spritz',
    description: 'Elderflower, mint and bubbles — an alpine favourite.',
    categories: ['wines', 'spritz'],
    details: { difficulty: 'easy', prepMinutes: 3, method: 'built', glass: 'Wine glass', garnish: 'Mint & lime' },
    ingredients: [['20', 'ml', 'Elderflower liqueur'], ['6', 'leaf', 'Fresh mint'], ['100', 'ml', 'Prosecco'], ['30', 'ml', 'Soda water'], ['1', 'wedge', 'Lime']],
    steps: ['Clap the mint and add it to a wine glass with the elderflower.', 'Fill with ice, add prosecco and soda.', 'Squeeze in the lime and stir gently.'],
  },
  {
    slug: 'french-75',
    title: 'French 75',
    description: 'Gin, lemon and champagne — elegant and lively.',
    categories: ['wines', 'sparkling', 'cocktails', 'classic'],
    details: { difficulty: 'medium', prepMinutes: 4, method: 'shaken', glass: 'Flute', garnish: 'Lemon twist' },
    ingredients: [['30', 'ml', 'Gin'], ['15', 'ml', 'Fresh lemon juice'], ['10', 'ml', 'Simple syrup'], ['90', 'ml', 'Champagne or dry sparkling wine']],
    steps: ['Shake gin, lemon and syrup with ice.', 'Strain into a chilled flute.', 'Top slowly with champagne and add a lemon twist.'],
  },
  {
    slug: 'kir-royale',
    title: 'Kir Royale',
    description: 'Sparkling wine blushed with blackcurrant.',
    categories: ['wines', 'sparkling'],
    details: { difficulty: 'easy', prepMinutes: 1, method: 'built', glass: 'Flute', garnish: 'A single blackberry' },
    ingredients: [['10', 'ml', 'Crème de cassis'], ['120', 'ml', 'Champagne or crémant']],
    steps: ['Pour the cassis into a chilled flute.', 'Top gently with sparkling wine.'],
  },
  {
    slug: 'red-sangria',
    title: 'Red Sangria',
    description: 'A generous pitcher of wine, fruit and spice.',
    categories: ['wines', 'punch', 'cocktails', 'fruity'],
    details: { difficulty: 'easy', prepMinutes: 15, servings: 6, method: 'built', glass: 'Wine glasses or tumblers', garnish: 'Sliced fruit' },
    ingredients: [['750', 'ml', 'Fruity red wine', 'Spanish garnacha or tempranillo'], ['60', 'ml', 'Brandy'], ['60', 'ml', 'Orange liqueur'], ['30', 'ml', 'Simple syrup'], ['2', 'piece', 'Oranges', 'sliced'], ['1', 'piece', 'Apple', 'diced'], ['250', 'ml', 'Soda water', 'to serve']],
    steps: ['Combine everything except soda in a pitcher.', 'Refrigerate for at least 2 hours so the fruit infuses.', 'Serve over ice, topping each glass with a splash of soda.'],
  },
]

export const recipeNotes = (r: SeedRecipe) => (r.notes ? doc(p(r.notes)) : undefined)
