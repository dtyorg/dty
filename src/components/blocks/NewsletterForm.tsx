'use client'

import React, { useActionState } from 'react'
import { subscribe, type SubscribeState } from '@/actions/subscribe'
import { Icon } from '../Icon'

export const NewsletterForm: React.FC<{ buttonLabel: string; source: string }> = ({ buttonLabel, source }) => {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: 'idle', message: '' })
  const done = state.status === 'success'

  return (
    <form action={action} className="newsletter__form" noValidate>
      <input name="source" type="hidden" value={source} />
      <input aria-hidden="true" autoComplete="off" className="md-visually-hidden" name="company" tabIndex={-1} />
      <div className="md-field">
        <label className="md-visually-hidden" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          aria-describedby="newsletter-msg"
          aria-invalid={state.status === 'error'}
          autoComplete="email"
          disabled={done}
          id="newsletter-email"
          inputMode="email"
          name="email"
          placeholder="Your email address"
          required
          type="email"
        />
        <button className="md-button md-button--tonal md-state" disabled={pending || done} type="submit">
          {done ? <Icon name="check" /> : null}
          {done ? 'Joined' : pending ? 'Joining…' : buttonLabel}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`newsletter__msg md-body-small${state.status === 'error' ? ' newsletter__msg--error' : ''}`}
        id="newsletter-msg"
      >
        {state.message}
      </p>
    </form>
  )
}
