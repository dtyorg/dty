import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/utilities/queries'

export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get('path') || '/'
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid path', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('You must be logged in to preview drafts', { status: 403 })

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
