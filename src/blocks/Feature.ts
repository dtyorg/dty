import type { Block } from 'payload'
import { link } from '@/fields/link'

export const FeatureBlock: Block = {
  slug: 'feature',
  interfaceName: 'FeatureBlock',
  labels: { singular: 'Feature (image + text)', plural: 'Features' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'start',
      options: [
        { label: 'Image first', value: 'start' },
        { label: 'Image last', value: 'end' },
      ],
    },
    { name: 'enableLink', type: 'checkbox', defaultValue: true },
    link({ appearances: ['outlined', 'filled', 'tonal'], overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } } }),
  ],
}
