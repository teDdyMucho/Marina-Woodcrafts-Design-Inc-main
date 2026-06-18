'use client'

import type { ReactNode } from 'react'

/** Centered, blocking progress modal. Cannot be dismissed — waits for the
 *  in-flight GitHub commit to finish, then the parent unmounts it. */
export function ProgressModal({
  open,
  title,
  message,
}: {
  open: boolean
  title: string
  message?: string
}) {
  if (!open) return null
  return (
    <div className="admin-modal-overlay" role="alertdialog" aria-busy="true" aria-live="assertive">
      <div className="admin-modal admin-modal-progress">
        <span className="admin-spinner" aria-hidden="true" />
        <h2 className="admin-modal-title">{title}</h2>
        {message && <p className="admin-modal-msg">{message}</p>}
      </div>
    </div>
  )
}

/** Yes / No confirmation modal. */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div
      className="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={busy ? undefined : onCancel}
    >
      <div className="admin-modal admin-modal-confirm" onClick={(e) => e.stopPropagation()}>
        <h2 className="admin-modal-title">{title}</h2>
        {message && <p className="admin-modal-msg">{message}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-modal-btn admin-modal-btn-ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-modal-btn ${destructive ? 'admin-modal-btn-danger' : 'admin-modal-btn-solid'}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
