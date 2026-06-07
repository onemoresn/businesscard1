import { useState } from 'react'
import { hasPassword } from './auth'
import BusinessCard from './components/BusinessCard'
import PasswordModal from './components/PasswordModal'
import Settings from './components/Settings'
import SetupWizard from './components/SetupWizard'
import { CardProfile } from './types'
import { isWizardComplete, loadProfile, markWizardComplete, saveProfile } from './storage'

export default function App() {
  const [profile, setProfile] = useState<CardProfile>(loadProfile)
  const [showWizard, setShowWizard] = useState(!isWizardComplete())
  const [showPasswordCreate, setShowPasswordCreate] = useState(!hasPassword() && isWizardComplete())
  const [showPasswordEnter, setShowPasswordEnter] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleSave = (updated: CardProfile) => {
    setProfile(updated)
    saveProfile(updated)
    setSettingsOpen(false)
  }

  const handleWizardComplete = (updated: CardProfile) => {
    setProfile(updated)
    saveProfile(updated)
    markWizardComplete()
    setShowWizard(false)
  }

  const handleSettingsClick = () => {
    if (!hasPassword()) {
      setShowPasswordCreate(true)
      return
    }
    setShowPasswordEnter(true)
  }

  const openSettings = () => {
    setShowPasswordEnter(false)
    setShowPasswordCreate(false)
    setSettingsOpen(true)
  }

  return (
    <div className="app">
      <div className="phone-shell">
        <BusinessCard profile={profile} />

        <button
          className="fab-settings"
          onClick={handleSettingsClick}
          aria-label="Open settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {showWizard && (
        <SetupWizard profile={profile} onComplete={handleWizardComplete} />
      )}

      {showPasswordCreate && (
        <PasswordModal
          mode="create"
          onSuccess={openSettings}
          onClose={() => setShowPasswordCreate(false)}
        />
      )}

      {showPasswordEnter && (
        <PasswordModal
          mode="enter"
          onSuccess={openSettings}
          onClose={() => setShowPasswordEnter(false)}
        />
      )}

      {settingsOpen && (
        <Settings
          profile={profile}
          onSave={handleSave}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
