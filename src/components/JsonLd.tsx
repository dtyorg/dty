import React from 'react'

/** Server-rendered JSON-LD. `<` is escaped so content can never close the script tag. */
export const JsonLd: React.FC<{ data: object }> = ({ data }) => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    type="application/ld+json"
  />
)
