'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'd3ty-theme'

// The source of truth is <html data-theme>, set before paint by themeInitScript.
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const getSnapshot = (): ThemeMode => {
  const t = document.documentElement.getAttribute('data-theme')
  return t === 'light' || t === 'dark' ? t : 'system'
}
const getServerSnapshot = (): ThemeMode => 'system'

export const useTheme = () => {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const setMode = useCallback((m: ThemeMode) => {
    const root = document.documentElement
    if (m === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', m)
    try {
      if (m === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, m)
    } catch {}
    listeners.forEach((l) => l())
  }, [])
  return { mode, setMode }
}

/** Inline, render-blocking script: applies the saved theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`
