import { CardProfile, DEFAULT_PROFILE } from './types'

const PROFILE_KEY = 'digital-business-card-profile'
const WIZARD_KEY = 'digital-business-card-wizard-complete'

export function loadProfile(): CardProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

export function saveProfile(profile: CardProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function isWizardComplete(): boolean {
  return localStorage.getItem(WIZARD_KEY) === 'true'
}

export function markWizardComplete(): void {
  localStorage.setItem(WIZARD_KEY, 'true')
}
