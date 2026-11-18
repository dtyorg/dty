import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('header')] },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'D3TY' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 7,
      fields: [link({ appearances: false })],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call-to-action button',
      fields: [
        { name: 'enabled', type: 'checkbox' },
        link({
          appearances: ['filled', 'tonal'],
          overrides: { admin: { condition: (_, s) => Boolean(s?.enabled) } },
        }),
      ],
    },
  ],
}
