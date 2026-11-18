import React from 'react'
import type { Page } from '@/payload-types'
import { CallToActionBlock } from './CallToActionBlock'
import { CardGridBlock } from './CardGridBlock'
import { CategoryGridBlock } from './CategoryGridBlock'
import { RecipeGridBlock } from './RecipeGridBlock'
import { ContentBlock } from './ContentBlock'
import { FeatureBlock } from './FeatureBlock'
import { NewsletterBlock } from './NewsletterBlock'
import { MediaBlock } from './MediaBlock'

export const RenderBlocks: React.FC<{ blocks: Page['layout'] }> = ({ blocks }) => {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? i
        switch (block.blockType) {
          case 'recipeGrid':
            return <RecipeGridBlock key={key} {...block} />
          case 'categoryGrid':
            return <CategoryGridBlock key={key} {...block} />
          case 'feature':
            return <FeatureBlock key={key} {...block} />
          case 'newsletter':
            return <NewsletterBlock key={key} {...block} />
          case 'content':
            return <ContentBlock key={key} {...block} />
          case 'cardGrid':
            return <CardGridBlock key={key} {...block} />
          case 'cta':
            return <CallToActionBlock key={key} {...block} />
          case 'mediaBlock':
            return <MediaBlock key={key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
