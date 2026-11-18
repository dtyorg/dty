import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished } from '@/access'
import { layoutBlocks } from '@/blocks'
import { link } from '@/fields/link'
import { slugField } from '@/fields/slug'
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate'
import { previewURL } from '@/utilities/previewPath'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Create a page with the slug "home" to use it as the homepage.',
    livePreview: { url: ({ data }) => previewURL('pages', data?.slug) },
    preview: (data) => previewURL('pages', data?.slug as string),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateDoc('')],
    afterDelete: [revalidateDelete('')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'standard',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Standard (headline + text)', value: 'standard' },
                    { label: 'Expressive (tinted container + image)', value: 'expressive' },
                    { label: 'Immersive (full-bleed image, dark)', value: 'immersive' },
                  ],
                },
                {
                  name: 'eyebrow',
                  type: 'text',
                  admin: { condition: (_, s) => s?.type !== 'none' },
                },
                {
                  name: 'headline',
                  type: 'text',
                  admin: { condition: (_, s) => s?.type !== 'none' },
                },
                {
                  name: 'subhead',
                  type: 'textarea',
                  admin: { condition: (_, s) => s?.type !== 'none' },
                },
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { condition: (_, s) => s?.type === 'expressive' || s?.type === 'immersive' },
                },
                {
                  name: 'links',
                  type: 'array',
                  maxRows: 2,
                  admin: { condition: (_, s) => s?.type !== 'none' },
                  fields: [link()],
                },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: layoutBlocks,
            },
          ],
        },
      ],
    },
    slugField(),
  ],
}
