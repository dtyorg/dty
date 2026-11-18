import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: { singular: 'Newsletter sign-up', plural: 'Newsletter sign-ups' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'A little sip of inspiration.' },
    { name: 'body', type: 'text', defaultValue: 'Discover new drinks, recipes and more.' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Join' },
  ],
}
