import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateDelete, revalidateDoc } from '@/hooks/revalidate'
import { previewURL } from '@/utilities/previewPath'

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'difficulty', '_status', 'updatedAt'],
    livePreview: { url: ({ data }) => previewURL('recipes', data?.slug) },
    preview: (data) => previewURL('recipes', data?.slug as string),
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
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [revalidateDoc('/recipes')],
    afterDelete: [revalidateDelete('/recipes')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 280,
      admin: { description: 'Short intro shown on cards and in search results.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ingredients',
          fields: [
            {
              name: 'ingredients',
              type: 'array',
              required: true,
              minRows: 1,
              labels: { singular: 'Ingredient', plural: 'Ingredients' },
              admin: {
                initCollapsed: false,
                components: { RowLabel: '@/components/admin/IngredientRowLabel#IngredientRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'amount', type: 'text', admin: { width: '20%', placeholder: '1 ½' } },
                    {
                      name: 'unit',
                      type: 'select',
                      admin: { width: '20%' },
                      options: ['ml', 'cl', 'oz', 'dash', 'drop', 'barspoon', 'tsp', 'tbsp', 'cup', 'piece', 'slice', 'wedge', 'leaf', 'sprig', 'pinch', 'top up'].map(
                        (u) => ({ label: u, value: u.replace(' ', '-') }),
                      ),
                    },
                    { name: 'name', type: 'text', required: true, admin: { width: '35%', placeholder: 'London dry gin' } },
                    { name: 'note', type: 'text', admin: { width: '25%', placeholder: 'optional, chilled…' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Method',
          fields: [
            {
              name: 'steps',
              type: 'array',
              required: true,
              minRows: 1,
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [{ name: 'instruction', type: 'textarea', required: true }],
            },
            {
              name: 'notes',
              type: 'richText',
              admin: { description: 'Tips, history, variations (optional).' },
            },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Trending',
      admin: { position: 'sidebar', description: 'Show in “Trending right now”.' },
    },
    {
      name: 'details',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'difficulty',
          type: 'select',
          defaultValue: 'easy',
          options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Advanced', value: 'advanced' },
          ],
        },
        { name: 'prepMinutes', type: 'number', min: 0, label: 'Prep time (min)' },
        { name: 'servings', type: 'number', min: 1, defaultValue: 1 },
        {
          name: 'method',
          type: 'select',
          options: ['shaken', 'stirred', 'built', 'blended', 'muddled', 'layered', 'thrown'].map((m) => ({
            label: m[0].toUpperCase() + m.slice(1),
            value: m,
          })),
        },
        { name: 'glass', type: 'text', admin: { placeholder: 'Coupe, Highball…' } },
        { name: 'garnish', type: 'text' },
        { name: 'alcoholFree', type: 'checkbox', label: 'Alcohol-free' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => (siblingData._status === 'published' && !value ? new Date() : value),
        ],
      },
    },
  ],
}
