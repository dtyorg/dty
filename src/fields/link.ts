import type { Field, GroupField } from 'payload'

export type LinkAppearance = 'filled' | 'tonal' | 'outlined' | 'text'

export const linkAppearanceOptions: { label: string; value: LinkAppearance }[] = [
  { label: 'Filled button', value: 'filled' },
  { label: 'Tonal button', value: 'tonal' },
  { label: 'Outlined button', value: 'outlined' },
  { label: 'Text button', value: 'text' },
]

type LinkOptions = {
  name?: string
  appearances?: LinkAppearance[] | false
  overrides?: Partial<GroupField>
}

export const link = ({ name = 'link', appearances, overrides = {} }: LinkOptions = {}): Field => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'reference',
          admin: { layout: 'horizontal', width: '50%' },
          options: [
            { label: 'Internal link', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'recipes', 'categories'],
          required: true,
          maxDepth: 1,
          admin: { condition: (_, s) => s?.type === 'reference', width: '50%' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Custom URL',
          required: true,
          admin: { condition: (_, s) => s?.type === 'custom', width: '50%' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
  ]

  if (appearances !== false) {
    const options = appearances
      ? linkAppearanceOptions.filter((o) => appearances.includes(o.value))
      : linkAppearanceOptions
    fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: options[0].value,
      options,
      admin: { description: 'Material 3 button style' },
    })
  }

  return {
    name,
    type: 'group',
    admin: { hideGutter: true },
    fields,
    ...overrides,
  } as GroupField
}
