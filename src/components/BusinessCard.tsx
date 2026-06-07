import { CardProfile } from '../types'
import CardQRCode from './CardQRCode'

interface Props {
  profile: CardProfile
}

function websiteHref(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`
}

export default function BusinessCard({ profile }: Props) {
  const { fullName, title, company, email, phone, website, logoUrl, aboutMe } = profile
  const phoneDigits = phone.replace(/\D/g, '')

  const actions = [
    {
      key: 'phone',
      label: 'Call',
      href: phoneDigits ? `tel:${phoneDigits}` : undefined,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      href: email ? `mailto:${email}` : undefined,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      key: 'sms',
      label: 'Message',
      href: phoneDigits ? `sms:${phoneDigits}` : undefined,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      key: 'website',
      label: 'Website',
      href: website ? websiteHref(website) : undefined,
      external: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
  ]

  return (
    <article className="business-card">
      <section className="business-card__hero">
        <div className="business-card__avatar-ring" aria-hidden="true">
          <div className="business-card__avatar-ring-inner" />
        </div>

        <div className="business-card__avatar">
          {logoUrl ? (
            <img src={logoUrl} alt={`${fullName} photo`} className="business-card__avatar-img" />
          ) : (
            <div className="business-card__avatar-placeholder" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>
      </section>

      <section className="business-card__identity">
        <h1 className="business-card__name">{fullName}</h1>
        <div className="business-card__divider" aria-hidden="true" />
        {title && <p className="business-card__title">{title}</p>}
        {company && <p className="business-card__company">{company}</p>}
      </section>

      <nav className="business-card__actions" aria-label="Contact actions">
        {actions.map((action) =>
          action.href ? (
            <a
              key={action.key}
              href={action.href}
              className="action-btn"
              aria-label={action.label}
              {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {action.icon}
            </a>
          ) : (
            <span key={action.key} className="action-btn action-btn--disabled" aria-label={`${action.label} not set`}>
              {action.icon}
            </span>
          ),
        )}
      </nav>

      <section className="business-card__about">
        <h2 className="business-card__about-title">About Me</h2>
        <p className="business-card__about-text">
          {aboutMe || 'Add a short bio in Settings to introduce yourself.'}
        </p>
        <CardQRCode />
      </section>
    </article>
  )
}
