const PASSWORD_HASH_KEY = 'digital-business-card-password-hash'

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function hasPassword(): boolean {
  return !!localStorage.getItem(PASSWORD_HASH_KEY)
}

export async function setPassword(password: string): Promise<void> {
  const hash = await hashPassword(password)
  localStorage.setItem(PASSWORD_HASH_KEY, hash)
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = localStorage.getItem(PASSWORD_HASH_KEY)
  if (!stored) return false
  const hash = await hashPassword(password)
  return hash === stored
}

export async function changePassword(current: string, next: string): Promise<boolean> {
  const valid = await verifyPassword(current)
  if (!valid) return false
  await setPassword(next)
  return true
}
