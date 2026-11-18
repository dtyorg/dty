import type { Block } from 'payload'

export const RecipeGridBlock: Block = {
  slug: 'recipeGrid',
  interfaceName: 'RecipeGridBlock',
  labels: { singular: 'Recipe grid', plural: 'Recipe grids' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Recipe cards', value: 'cards' },
        { label: 'Image strip', value: 'strip' },
      ],
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Trending (featured) recipes', value: 'featured' },
        { label: 'Latest recipes', value: 'latest' },
        { label: 'From a category', value: 'category' },
        { label: 'Hand-picked', value: 'selection' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { condition: (_, s) => s?.source === 'category' },
    },
    {
      name: 'recipes',
      type: 'relationship',
      relationTo: 'recipes',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'selection' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 24,
      admin: { condition: (_, s) => s?.source !== 'selection' },
    },
    { name: 'showAllLink', type: 'checkbox', defaultValue: true, label: 'Show “See all” button' },
  ],
}
