import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: { singular: 'Rich text', plural: 'Rich text blocks' },
  fields: [
    {
      name: 'surface',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None (page background)', value: 'none' },
        { label: 'Filled card', value: 'filled' },
        { label: 'Outlined card', value: 'outlined' },
      ],
    },
    { name: 'richText', type: 'richText', required: true },
  ],
}
