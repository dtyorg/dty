'use client'

import React from 'react'
import { consentStore } from './track'

/** Re-opens the consent banner (footer link). */
export const CookieSettingsButton: React.FC = () => (
  <button className="link-button md-body-medium" onClick={() => consentStore.set(null)} type="button">
    Cookie settings
  </button>
)
