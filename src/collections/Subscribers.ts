import { randomBytes } from 'node:crypto'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { authenticated } from '@/access'
import { welcomeEmail } from '@/email/templates'
import { getServerSideURL } from '@/utilities/getURL'

/** Sends the welcome email when someone (re)subscribes. Failures are logged, never block sign-up. */
const sendWelcome: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  const becameActive =
    doc.status === 'subscribed' && (operation === 'create' || previousDoc?.status !== 'subscribed')
  if (!becameActive || req.context.skipWelcomeEmail) return doc

  const siteURL = getServerSideURL()
  const { subject, html, text } = welcomeEmail({
    siteURL,
    unsubscribeURL: `${siteURL}/newsletter/unsubscribe?token=${doc.token}`,
  })
  try {
    await req.payload.sendEmail({ to: doc.email, subject, html, text })
  } catch (err) {
    req.payload.logger.error({ err }, `Welcome email to ${doc.email} failed`)
  }
  return doc
}

/** Newsletter sign-ups. Public sign-up goes through a server action, not the open API. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'status', 'source', 'createdAt'] },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: { afterChange: [sendWelcome] },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      required: true,
      index: true,
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'source', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    {
      // Secret used in the one-click unsubscribe link
      name: 'token',
      type: 'text',
      index: true,
      admin: { hidden: true },
      access: { read: ({ req: { user } }) => Boolean(user), update: () => false },
      hooks: { beforeChange: [({ value }) => value || randomBytes(24).toString('hex')] },
    },
  ],
}
