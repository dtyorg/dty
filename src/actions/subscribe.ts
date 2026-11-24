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
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1 })
  const current = existing.docs[0]
  if (current?.status === 'subscribed') return { status: 'success', message: 'You’re already on the list — cheers!' }
  if (current) {
    // Previously unsubscribed: re-activate (sends the welcome email again)
    await payload.update({ collection: 'subscribers', id: current.id, data: { status: 'subscribed' } })
    return { status: 'success', message: 'Welcome back — check your inbox!' }
  }

  try {
    await payload.create({ collection: 'subscribers', data: { email, status: 'subscribed', source: String(formData.get('source') ?? 'website') } })
    return { status: 'success', message: 'Thanks for joining — check your inbox!' }
  } catch (err) {
    payload.logger.error({ err }, 'Newsletter sign-up failed')
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
