import React from 'react'
import type { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { RenderBlocks } from './blocks/RenderBlocks'
import { Hero } from './Hero'
import { LivePreviewListener } from './LivePreviewListener'

export const PageView: React.FC<{ page: Page; draft: boolean }> = ({ page, draft }) => (
  <article>
    {draft && <LivePreviewListener serverURL={getServerSideURL()} />}
    <Hero fallbackTitle={page.title} hero={page.hero} />
    <RenderBlocks blocks={page.layout} />
  </article>
)
