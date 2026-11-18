import type { CollectionConfig, Where } from 'payload'
import { anyone, authenticated } from '@/access'
import { link } from '@/fields/link'
import { slugField } from '@/fields/slug'
import { revalidateCategory } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'slug', 'order'],
    description:
      'Top-level categories are site sections (Cocktails, Spirits, Wines). Give a category a parent to make it a filter inside that section (Classic, Fruity, Sour…).',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  hooks: { afterChange: [revalidateCategory] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar', description: 'Leave empty for a top-level section.' },
      filterOptions: ({ id }): Where => ({ and: [{ id: { not_equals: id } }, { parent: { exists: false } }] }),
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'cocktail',
      admin: { position: 'sidebar', description: 'Shown when there is no image.' },
      options: [
        { label: 'Cocktail glass', value: 'cocktail' },
        { label: 'Spirit tumbler', value: 'spirit' },
        { label: 'Wine glass', value: 'wine' },
      ],
    },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'headline', type: 'text', admin: { description: 'Big hero title, e.g. “Mix. Sip. Repeat.” Defaults to the title.' } },
            { name: 'description', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Feature',
          description: 'Optional promo shown under the recipe grid (e.g. a guide).',
          fields: [
            {
              name: 'feature',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox' },
                { name: 'eyebrow', type: 'text', admin: { condition: (_, s) => Boolean(s?.enabled) } },
                { name: 'heading', type: 'text', admin: { condition: (_, s) => Boolean(s?.enabled) } },
                { name: 'body', type: 'textarea', admin: { condition: (_, s) => Boolean(s?.enabled) } },
                { name: 'image', type: 'upload', relationTo: 'media', admin: { condition: (_, s) => Boolean(s?.enabled) } },
                link({ appearances: ['outlined', 'filled', 'tonal'], overrides: { admin: { condition: (_, s) => Boolean(s?.enabled) } } }),
              ],
            },
          ],
        },
        {
          label: 'Recipes',
          fields: [
            {
              name: 'recipes',
              type: 'join',
              collection: 'recipes',
              on: 'categories',
              admin: { description: 'Recipes in this category (assign categories from the recipe).' },
            },
          ],
        },
      ],
    },
  ],
}
