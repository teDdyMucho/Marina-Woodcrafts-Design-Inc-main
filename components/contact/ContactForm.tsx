'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      message: fd.get('message') as string,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success">
        <p>Thank you — we&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <p role="alert" className="contact-error">{errorMsg}</p>
      )}

      <div className="form-group">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>

      <div className="form-group">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="form-group">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} required />
      </div>

      <button
        type="submit"
        className="btn btn-solid"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
