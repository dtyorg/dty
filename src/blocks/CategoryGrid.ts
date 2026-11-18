import type { Block } from 'payload'

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: { singular: 'Category grid', plural: 'Category grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Explore our world' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'tiles',
      options: [
        { label: 'Image tiles', value: 'tiles' },
        { label: 'Compact list', value: 'list' },
      ],
    },
    { name: 'intro', type: 'textarea' },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Leave empty to show all top-level sections.' },
    },
  ],
}
