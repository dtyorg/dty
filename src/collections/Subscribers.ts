import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access'

/** Newsletter sign-ups. Public sign-up goes through a server action, not the open API. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'source', 'createdAt'] },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'source', type: 'text', admin: { readOnly: true } },
  ],
}
