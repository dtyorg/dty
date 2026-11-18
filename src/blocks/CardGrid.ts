import type { Block } from 'payload'
import { link } from '@/fields/link'

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'elevated',
      options: [
        { label: 'Elevated', value: 'elevated' },
        { label: 'Filled', value: 'filled' },
        { label: 'Outlined', value: 'outlined' },
      ],
      admin: { description: 'Material 3 card type' },
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'enableLink', type: 'checkbox' },
        link({
          appearances: ['text', 'tonal'],
          overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } },
        }),
      ],
    },
  ],
}
