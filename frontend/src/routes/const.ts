export const ELDERLY_ALLOWED = new Set(['/elderly-profiles', '/health-warnings', '/profile'])

export function isElderly(role: string): boolean {
    return role === 'elderly';
}