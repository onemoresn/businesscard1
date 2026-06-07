import { CardProfile, DEFAULT_PROFILE } from './types'

const STORAGE_KEY = 'digital-business-card-profile'

export function loadProfile(): CardProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

export function saveProfile(profile: CardProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}
