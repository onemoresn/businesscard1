import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { CardProfile } from '../types'

interface Props {
  profile: CardProfile
  onSave: (profile: CardProfile) => void
  onClose: () => void
}

export default function Settings({ profile, onSave, onClose }: Props) {
  const [form, setForm] = useState<CardProfile>({ ...profile })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof CardProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update('logoUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    update('logoUrl', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true"
      >
        <div className="modal__header">
          <h2 id="settings-title" className="modal__title">Settings</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <fieldset className="settings-section">
            <legend className="settings-section__title">Profile</legend>

            <label className="field">
              <span className="field__label">Full Name</span>
              <input
                type="text"
                className="field__input"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Kevin Johnson"
              />
            </label>

            <label className="field">
              <span className="field__label">Job Title</span>
              <input
                type="text"
                className="field__input"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Founder and CEO"
              />
            </label>

            <label className="field">
              <span className="field__label">Company</span>
              <input
                type="text"
                className="field__input"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="InnoTechCJ"
              />
            </label>

            <label className="field">
              <span className="field__label">About Me</span>
              <textarea
                className="field__input field__textarea"
                value={form.aboutMe}
                onChange={(e) => update('aboutMe', e.target.value)}
                placeholder="Working to make tech a better place..."
                rows={3}
              />
            </label>
          </fieldset>

          <fieldset className="settings-section">
            <legend className="settings-section__title">Contact</legend>

            <label className="field">
              <span className="field__label">Email</span>
              <input
                type="email"
                className="field__input"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="kevin@innotechcj.com"
              />
            </label>

            <label className="field">
              <span className="field__label">Phone</span>
              <input
                type="tel"
                className="field__input"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </label>

            <label className="field">
              <span className="field__label">Website</span>
              <input
                type="url"
                className="field__input"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="www.yourcompany.com"
              />
            </label>
          </fieldset>

          <fieldset className="settings-section">
            <legend className="settings-section__title">Profile Photo / Logo</legend>

            <div className="logo-upload">
              {form.logoUrl ? (
                <div className="logo-upload__preview logo-upload__preview--round">
                  <img src={form.logoUrl} alt="Profile preview" />
                </div>
              ) : (
                <div className="logo-upload__placeholder logo-upload__placeholder--round">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>No photo uploaded</span>
                </div>
              )}

              <div className="logo-upload__actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="logo-upload__input"
                  id="logo-file"
                />
                <label htmlFor="logo-file" className="btn btn--secondary">
                  {form.logoUrl ? 'Change Photo' : 'Upload Photo'}
                </label>
                {form.logoUrl && (
                  <button type="button" className="btn btn--ghost" onClick={removeLogo}>
                    Remove
                  </button>
                )}
              </div>
              <p className="logo-upload__hint">PNG, JPG, or SVG · Max 2 MB</p>
            </div>
          </fieldset>

          <div className="settings-form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
