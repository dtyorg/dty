import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal('footer')] },
  fields: [
    { name: 'links', type: 'array', maxRows: 8, fields: [link({ appearances: false })] },
    {
      name: 'socials',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              admin: { width: '30%' },
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'Pinterest', value: 'pinterest' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'X', value: 'x' },
              ],
            },
            { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
    { name: 'legal', type: 'text', defaultValue: 'Drink Responsibly · 18+' },
    { name: 'copyright', type: 'text', defaultValue: '© D3TY. All rights reserved.' },
  ],
}
