import React from 'react'
import type { ContentBlock as Props } from '@/payload-types'
import { RichText } from '../RichText'

export const ContentBlock: React.FC<Props> = ({ richText, surface }) => (
  <section className="section">
    <div className="container">
      <div className={surface && surface !== 'none' ? `content-surface content-surface--${surface}` : undefined} data-animate>
        <RichText data={richText} />
      </div>
    </div>
  </section>
)
