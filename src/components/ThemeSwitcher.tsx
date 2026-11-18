'use client'

import React from 'react'
import { Icon, type IconName } from './Icon'
import { type ThemeMode, useTheme } from '@/providers/Theme'

const options: { mode: ThemeMode; label: string; icon: IconName }[] = [
  { mode: 'light', label: 'Light', icon: 'lightMode' },
  { mode: 'system', label: 'System', icon: 'systemMode' },
  { mode: 'dark', label: 'Dark', icon: 'darkMode' },
]

/** M3 icon button that cycles light → dark → system. */
export const ThemeToggleButton: React.FC = () => {
  const { mode, setMode } = useTheme()
  const current = options.find((o) => o.mode === mode) ?? options[1]
  const next: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'
  return (
    <button
      aria-label={`Theme: ${current.label}. Switch to ${next}`}
      className="md-icon-button md-state"
      onClick={() => setMode(next)}
      title={`Theme: ${current.label}`}
      type="button"
    >
      <Icon name={current.icon} />
    </button>
  )
}

/** M3 segmented button for picking light / system / dark. */
export const ThemeSegmented: React.FC<{ showLabels?: boolean }> = ({ showLabels = false }) => {
  const { mode, setMode } = useTheme()
  return (
    <div aria-label="Color theme" className="md-segmented" role="group">
      {options.map((o) => (
        <button
          aria-label={showLabels ? undefined : `${o.label} theme`}
          aria-pressed={mode === o.mode}
          className="md-segmented__btn md-state"
          key={o.mode}
          onClick={() => setMode(o.mode)}
          title={`${o.label} theme`}
          type="button"
        >
          <Icon name={o.icon} />
          {showLabels && o.label}
        </button>
      ))}
    </div>
  )
}
