import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

const internalDocToHref = ({ linkNode }: { linkNode: { fields: { doc?: unknown } } }) => {
  const doc = linkNode.fields.doc as { relationTo?: string; value?: { slug?: string } } | undefined
  const slug = doc?.value && typeof doc.value === 'object' ? doc.value.slug : undefined
  if (!slug) return '/'
  if (doc?.relationTo === 'recipes') return `/recipes/${slug}`
  if (doc?.relationTo === 'categories') return `/categories/${slug}`
  return slug === 'home' ? '/' : `/${slug}`
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

type RichTextData = React.ComponentProps<typeof LexicalRichText>['data']

export const RichText: React.FC<{ data?: RichTextData | null; className?: string }> = ({
  data,
  className,
}) => {
  if (!data) return null
  return (
    <LexicalRichText
      className={['prose', className].filter(Boolean).join(' ')}
      converters={converters}
      data={data}
    />
  )
}
