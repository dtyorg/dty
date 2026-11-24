'use client'

import { useEffect } from 'react'
import { track, type TrackEventName } from './track'

/** Fire-and-forget analytics event from a server component. Renders nothing. */
export function TrackEvent({ event, params }: { event: TrackEventName; params?: Record<string, string | number | boolean> }) {
  const key = JSON.stringify([event, params])
  useEffect(() => {
    track(event, params)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per distinct event
  }, [key])
  return null
}
