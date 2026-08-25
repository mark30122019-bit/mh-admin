/** REST API (test environment). */
export const API_BASE_URL = 'https://rest-test.machineheads.ru'

export const AUTH_ENDPOINTS = {
  tokenGenerate: '/auth/token-generate',
  tokenRefresh: '/auth/token-refresh',
} as const

export const TOKEN_COOKIE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const
