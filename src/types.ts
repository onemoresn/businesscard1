export interface CardProfile {
  fullName: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  logoUrl: string
  aboutMe: string
}

export const DEFAULT_PROFILE: CardProfile = {
  fullName: 'Your Name',
  title: 'Your Title',
  company: 'Your Company',
  email: '',
  phone: '',
  website: '',
  logoUrl: '',
  aboutMe: '',
}
