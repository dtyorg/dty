import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import type { EmailAdapter } from 'payload'

/**
 * Picks the email transport from environment variables:
 *   1. RESEND_API_KEY            → Resend (recommended on Vercel)
 *   2. SMTP_HOST (+ PORT/USER/PASS) → any SMTP server (Gmail, Brevo, Mailgun, …)
 *   3. neither                   → undefined: Payload logs emails to the console (dev)
 */
export const getEmailAdapter = (): Promise<EmailAdapter> | EmailAdapter | undefined => {
  const defaultFromAddress = process.env.EMAIL_FROM_ADDRESS || 'hello@example.com'
  const defaultFromName = process.env.EMAIL_FROM_NAME || 'D3TY'
  const overrideRecipientAddress = process.env.EMAIL_OVERRIDE_TO || undefined

  if (process.env.RESEND_API_KEY) {
    return resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress,
      defaultFromName,
      overrideRecipientAddress,
    })
  }

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587)
    return nodemailerAdapter({
      defaultFromAddress,
      defaultFromName,
      overrideRecipientAddress,
      skipVerify: true, // don't open an SMTP connection on every cold start
      transportOptions: {
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
    })
  }

  return undefined
}
