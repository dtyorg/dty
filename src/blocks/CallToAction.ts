import type { Block } from 'payload'
import { link } from '@/fields/link'

export const CallToActionBlock: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      fields: [link()],
    },
  ],
}
