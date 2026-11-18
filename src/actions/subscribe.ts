'use server'

import { getPayloadClient } from '@/utilities/queries'

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  // Honeypot: bots fill hidden fields
  if (formData.get('company')) return { status: 'success', message: 'Thanks for joining!' }
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const payload = await getPayloadClient()
  const existing = await payload.count({ collection: 'subscribers', where: { email: { equals: email } } })
  if (existing.totalDocs > 0) return { status: 'success', message: 'You’re already on the list — cheers!' }

  try {
    await payload.create({ collection: 'subscribers', data: { email, source: String(formData.get('source') ?? 'website') } })
    return { status: 'success', message: 'Thanks for joining — cheers!' }
  } catch (err) {
    payload.logger.error({ err }, 'Newsletter sign-up failed')
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
