import { ImageResponse } from 'next/og'

/**
 * Branded 1200×630 social image for pages without a photo:
 *   /og?title=Negroni&eyebrow=Cocktails
 * Colors: M3 dark olive scheme (theme/tokens.css).
 */
export const runtime = 'edge'

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'D3TY').slice(0, 90)
  const eyebrow = (searchParams.get('eyebrow') || '').slice(0, 40)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(circle at 78% 35%, #3c4d0f 0%, #12140d 62%)',
          color: '#e3e3d7',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#b9cf83', fontSize: 34 }}>
          <svg fill="#b9cf83" height="44" viewBox="0 0 24 24" width="44">
            <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" />
          </svg>
          D3TY
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {eyebrow && (
            <div style={{ fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: '#c6c8b8', fontFamily: 'sans-serif' }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: title.length > 40 ? 68 : 88, lineHeight: 1.05, maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ fontSize: 22, color: '#c6c8b8', fontFamily: 'sans-serif' }}>Cocktails · Spirits · Wines</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable' },
    },
  )
}
