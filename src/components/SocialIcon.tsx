import React from 'react'

// Simple outline glyphs (24×24, stroke-based) — no brand assets bundled.
const glyphs: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect height="18" rx="5" width="18" x="3" y="3" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" stroke="none" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 20.5 12.3 13M10 13.5c-.6-3 1-5.5 3.4-5.5 2 0 3.1 1.4 3.1 3.2 0 2.4-1.4 4.3-3.3 4.3-1 0-1.7-.7-1.5-1.6" />
    </>
  ),
  youtube: (
    <>
      <rect height="14" rx="4" width="20" x="2" y="5" />
      <path d="m10 9 5 3-5 3z" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.3 4 5 4" />,
  facebook: <path d="M14 21v-8h3l.5-3.5H14V7.6c0-1 .3-1.6 1.7-1.6H18V3h-2.8C12.4 3 11 4.6 11 7.3v2.2H8V13h3v8" />,
  x: <path d="M4 4l16 16M20 4 4 20" />,
}

export const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
    width="20"
  >
    {glyphs[platform] ?? <circle cx="12" cy="12" r="9" />}
  </svg>
)
