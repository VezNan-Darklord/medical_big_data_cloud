export const ELDERLY_ALLOWED = new Set(['/elderly-profiles', '/health-warnings', '/profile'])

export const DOCTOR_SIDEBAR_EXCLUDED = new Set(['doctor-accounts', 'users'])

export function isElderly(role: string): boolean {
  return role === 'elderly'
}

export function isDoctor(role: string): boolean {
  return role === 'doctor'
}
