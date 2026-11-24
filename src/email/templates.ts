/**
 * Table-based, inline-styled HTML emails (what email clients actually render).
 * Colors are the M3 olive light scheme from theme/tokens.css.
 */
const c = {
  bg: '#fafaee',
  card: '#ffffff',
  text: '#1b1c15',
  muted: '#45483c',
  primary: '#536525',
  onPrimary: '#ffffff',
  container: '#d5ec9c',
  onContainer: '#3c4d0f',
  outline: '#c6c8b8',
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

type Layout = { preheader: string; heading: string; body: string; cta?: { label: string; href: string }; footer: string }

export const emailLayout = ({ preheader, heading, body, cta, footer }: Layout) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${escape(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${c.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.bg};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 8px 20px;font:600 26px/1 Georgia,'Times New Roman',serif;color:${c.primary};">🍸 D3TY</td></tr>
      <tr><td style="background:${c.card};border:1px solid ${c.outline};border-radius:28px;padding:40px 32px;">
        <h1 style="margin:0 0 16px;font:500 32px/40px Georgia,'Times New Roman',serif;color:${c.text};">${escape(heading)}</h1>
        <div style="font:400 16px/24px Roboto,Arial,sans-serif;color:${c.muted};">${body}</div>
        ${
          cta
            ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
          <td style="border-radius:999px;background:${c.primary};">
            <a href="${cta.href}" style="display:inline-block;padding:12px 28px;font:500 14px/20px Roboto,Arial,sans-serif;letter-spacing:.1px;color:${c.onPrimary};text-decoration:none;border-radius:999px;">${escape(cta.label)} &rarr;</a>
          </td></tr></table>`
            : ''
        }
      </td></tr>
      <tr><td style="padding:20px 8px;font:400 12px/18px Roboto,Arial,sans-serif;color:${c.muted};">${footer}</td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

export const welcomeEmail = ({ siteURL, unsubscribeURL }: { siteURL: string; unsubscribeURL: string }) => {
  const recipe = (slug: string, name: string, why: string) =>
    `<li style="margin:0 0 8px;"><a href="${siteURL}/recipes/${slug}" style="color:${c.primary};font-weight:500;">${name}</a> — ${why}</li>`
  return {
    subject: 'Welcome to D3TY — your first round is on us 🍸',
    html: emailLayout({
      preheader: 'Three recipes to start with, plus what to expect from us.',
      heading: 'Cheers — you’re in.',
      body: `
        <p style="margin:0 0 16px;">Thanks for joining. Every so often we’ll send you new recipes, techniques and seasonal ideas — never spam.</p>
        <p style="margin:0 0 8px;">Three to start with:</p>
        <ul style="margin:0;padding-left:20px;">
          ${recipe('daiquiri', 'Daiquiri', 'the three-ingredient benchmark for balance.')}
          ${recipe('negroni', 'Negroni', 'equal parts, endlessly elegant.')}
          ${recipe('garden-spritz', 'Garden Spritz', 'bright, herbal and alcohol-free.')}
        </ul>`,
      cta: { label: 'Explore the collection', href: `${siteURL}/recipes` },
      footer: `You’re receiving this because you signed up at ${escape(siteURL.replace(/^https?:\/\//, ''))}. Please drink responsibly · 18+<br><a href="${unsubscribeURL}" style="color:${c.muted};">Unsubscribe</a>`,
    }),
    text: `Cheers — you're in.

Thanks for joining. Three recipes to start with:
- Daiquiri: ${siteURL}/recipes/daiquiri
- Negroni: ${siteURL}/recipes/negroni
- Garden Spritz (alcohol-free): ${siteURL}/recipes/garden-spritz

Explore the collection: ${siteURL}/recipes

Unsubscribe: ${unsubscribeURL}`,
  }
}
