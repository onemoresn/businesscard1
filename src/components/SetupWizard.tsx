import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { setPassword } from '../auth'
import { CardProfile } from '../types'

interface Props {
  profile: CardProfile
  onComplete: (profile: CardProfile) => void
}

const STEPS = [
  { title: 'Welcome', subtitle: 'Let\'s set up your digital business card in a few quick steps.' },
  { title: 'Secure Settings', subtitle: 'Create a password to protect your card settings.' },
  { title: 'Your Info', subtitle: 'Add your name, title, and company.' },
  { title: 'Contact Details', subtitle: 'How should people reach you?' },
  { title: 'Profile Photo', subtitle: 'Upload a photo or logo for your card.' },
  { title: 'About You', subtitle: 'Write a short introduction.' },
  { title: 'All Set!', subtitle: 'Your digital business card is ready to share.' },
]

export default function SetupWizard({ profile, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CardProfile>({ ...profile })
  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: keyof CardProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update('logoUrl', reader.result)
        setError('')
      }
    }
    reader.readAsDataURL(file)
  }

  const next = async () => {
    setError('')

    if (step === 1) {
      if (password.length < 4) {
        setError('Password must be at least 4 characters.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
      await setPassword(password)
    }

    if (step === STEPS.length - 1) {
      onComplete(form)
      return
    }

    setStep((s) => s + 1)
  }

  const back = () => {
    setError('')
    if (step > 0) setStep((s) => s - 1)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    next()
  }

  return (
    <div className="wizard-overlay">
      <div className="wizard" role="dialog" aria-labelledby="wizard-title" aria-modal="true">
        <div className="wizard__progress">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`wizard__dot${i <= step ? ' wizard__dot--active' : ''}${i < step ? ' wizard__dot--done' : ''}`}
            />
          ))}
        </div>

        <p className="wizard__step-label">Step {step + 1} of {STEPS.length}</p>
        <h2 id="wizard-title" className="wizard__title">{STEPS[step].title}</h2>
        <p className="wizard__subtitle">{STEPS[step].subtitle}</p>

        <form className="wizard__body" onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="wizard__welcome">
              <div className="wizard__welcome-icon" aria-hidden="true">◆</div>
              <p>Use the setup wizard to personalize your card. You can always edit details later in Settings.</p>
            </div>
          )}

          {step === 1 && (
            <>
              <label className="field">
                <span className="field__label">Password</span>
                <input
                  type="password"
                  className="field__input"
                  value={password}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
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
            </>
          )}

          {step === 2 && (
            <>
              <label className="field">
                <span className="field__label">Full Name</span>
                <input
                  type="text"
                  className="field__input"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Your Name"
                />
              </label>
              <label className="field">
                <span className="field__label">Job Title</span>
                <input
                  type="text"
                  className="field__input"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="Your Title"
                />
              </label>
              <label className="field">
                <span className="field__label">Company</span>
                <input
                  type="text"
                  className="field__input"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Your Company"
                />
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  type="email"
                  className="field__input"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@company.com"
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
            </>
          )}

          {step === 4 && (
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
                  <span>Optional photo</span>
                </div>
              )}
              <div className="logo-upload__actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="logo-upload__input"
                  id="wizard-logo"
                />
                <label htmlFor="wizard-logo" className="btn btn--secondary">
                  {form.logoUrl ? 'Change Photo' : 'Upload Photo'}
                </label>
              </div>
              <p className="logo-upload__hint">PNG, JPG, or SVG · Max 2 MB · Optional</p>
            </div>
          )}

          {step === 5 && (
            <label className="field">
              <span className="field__label">About Me</span>
              <textarea
                className="field__input field__textarea"
                value={form.aboutMe}
                onChange={(e) => update('aboutMe', e.target.value)}
                placeholder="Tell people a little about yourself..."
                rows={4}
              />
            </label>
          )}

          {step === 6 && (
            <div className="wizard__done">
              <div className="wizard__done-icon" aria-hidden="true">✓</div>
              <p>Tap <strong>Finish</strong> to view your card. Use the gear icon and your password anytime to update Settings.</p>
            </div>
          )}

          {error && <p className="field__error" role="alert">{error}</p>}

          <div className="wizard__actions">
            {step > 0 && step < STEPS.length - 1 && (
              <button type="button" className="btn btn--ghost" onClick={back}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn--primary">
              {step === STEPS.length - 1 ? 'Finish' : step === 0 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </form>

        <p className="wizard__copyright">© {new Date().getFullYear()} N-Finit Development</p>
      </div>
    </div>
  )
}
