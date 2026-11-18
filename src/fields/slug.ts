import type { Field, FieldHook } from 'payload'

export const slugify = (val: string): string =>
  val
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallbackData = data?.[fallback] ?? originalDoc?.[fallback]
    if (typeof fallbackData === 'string') return slugify(fallbackData)
    return value
  }

export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Leave empty to generate from the ${fieldToUse}.`,
  },
  hooks: {
    beforeValidate: [formatSlug(fieldToUse)],
  },
})
