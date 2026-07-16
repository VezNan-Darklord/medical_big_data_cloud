type RoleCode = 'admin' | 'doctor' | 'elderly'
export const CUSTOM_ROUTES = new Set([
  '/elderly-profiles',
  '/health-warnings',
  '/devices',
  '/key-populations',
  '/assessment-reports',
  '/report-statistics',
  '/elderly-accounts',
])

const ROLE_ALLOWED_PATHS: Record<Exclude<RoleCode, 'admin'>, ReadonlySet<string>> = {
  elderly: new Set([
    '/elderly-profiles',
    '/health-warnings',
    '/assessment-reports',
    '/profile',
  ]),
  doctor: new Set([
    '/',
    '/decision-analysis',
    '/elderly-profiles',
    '/health-warnings',
    '/devices',
    '/key-populations',
    '/assessment-reports',
    '/elderly-accounts',
    '/profile',
  ]),
}

export function canAccessPath(role: string, path: string): boolean {
  if (role === 'admin') {
    return true
  }
  return ROLE_ALLOWED_PATHS[role as Exclude<RoleCode, 'admin'>]?.has(path) ?? false
}

export function isElderly(role: string): boolean {
  return role === 'elderly'
}
