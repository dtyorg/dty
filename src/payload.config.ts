import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Recipes } from './collections/Recipes'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getServerSideURL(),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' — D3TY' },
    livePreview: {
      breakpoints: [
        { label: 'Compact', name: 'compact', width: 412, height: 915 },
        { label: 'Medium', name: 'medium', width: 840, height: 1024 },
        { label: 'Expanded', name: 'expanded', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Recipes, Categories, Pages, Media, Subscribers, Users],
  globals: [Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [getServerSideURL()].filter(Boolean),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.DATABASE_URL || '' }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'recipes'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} — D3TY` : 'D3TY'),
      generateURL: ({ doc, collectionSlug }) =>
        `${getServerSideURL()}${collectionSlug === 'recipes' ? '/recipes' : ''}/${doc?.slug === 'home' ? '' : (doc?.slug ?? '')}`,
    }),
    // Vercel's filesystem is read-only — store uploads in Vercel Blob when a token is present.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
