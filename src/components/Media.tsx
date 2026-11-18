import Image from 'next/image'
import React from 'react'
import type { Media as MediaType } from '@/payload-types'

type Props = {
  resource?: string | MediaType | null
  className?: string
  size?: 'thumbnail' | 'card' | 'hero'
  priority?: boolean
  sizes?: string
}

export const Media: React.FC<Props> = ({ resource, className, size, priority, sizes }) => {
  if (!resource || typeof resource !== 'object' || !resource.url) return null

  if (resource.mimeType?.startsWith('video/')) {
    return <video autoPlay className={className} loop muted playsInline src={resource.url} />
  }

  const variant = size ? resource.sizes?.[size] : undefined
  const src = variant?.url || resource.url
  const width = variant?.width || resource.width || 1200
  const height = variant?.height || resource.height || 800

  return (
    <Image
      alt={resource.alt || ''}
      className={className}
      height={height}
      priority={priority}
      sizes={sizes ?? '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      src={src}
      style={
        resource.focalX != null && resource.focalY != null
          ? { objectPosition: `${resource.focalX}% ${resource.focalY}%` }
          : undefined
      }
      width={width}
    />
  )
}
