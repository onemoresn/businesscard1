import { FormEvent, useState } from 'react'
import { changePassword, setPassword, verifyPassword } from '../auth'

type Mode = 'create' | 'enter' | 'change'

interface Props {
  mode: Mode
  onSuccess: () => void
  onClose?: () => void
}

export default function PasswordModal({ mode, onSuccess, onClose }: Props) {
  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [current, setCurrent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const titles: Record<Mode, string> = {
    create: 'Create Settings Password',
    enter: 'Enter Password',
    change: 'Change Password',
  }

  const descriptions: Record<Mode, string> = {
    create: 'Create a password to protect your card settings.',
    enter: 'Enter your password to open Settings.',
    change: 'Update the password used to access Settings.',
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'create') {
        if (password.length < 4) {
          setError('Password must be at least 4 characters.')
          return
        }
        if (password !== confirm) {
          setError('Passwords do not match.')
          return
        }
        await setPassword(password)
        onSuccess()
        return
      }

      if (mode === 'enter') {
        const valid = await verifyPassword(password)
        if (!valid) {
          setError('Incorrect password.')
          return
        }
        onSuccess()
        return
      }

      if (mode === 'change') {
        if (password.length < 4) {
          setError('New password must be at least 4 characters.')
          return
        }
        if (password !== confirm) {
          setError('New passwords do not match.')
          return
        }
        const changed = await changePassword(current, password)
        if (!changed) {
          setError('Current password is incorrect.')
          return
        }
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal modal--compact"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="password-title"
        aria-modal="true"
      >
        <div className="modal__header">
          <h2 id="password-title" className="modal__title">{titles[mode]}</h2>
          {onClose && (
            <button className="modal__close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <p className="password-modal__desc">{descriptions[mode]}</p>

          {mode === 'change' && (
            <label className="field">
              <span className="field__label">Current Password</span>
              <input
                type="password"
                className="field__input"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
          )}

          <label className="field">
            <span className="field__label">
              {mode === 'change' ? 'New Password' : 'Password'}
            </span>
            <input
              type="password"
              className="field__input"
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              autoComplete={mode === 'enter' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {mode !== 'enter' && (
            <label className="field">
              <span className="field__label">Confirm Password</span>
              <input
                type="password"
                className="field__input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {error && <p className="field__error" role="alert">{error}</p>}

          <div className="settings-form__actions">
            {onClose && (
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'enter' ? 'Unlock Settings' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
