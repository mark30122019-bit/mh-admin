import Cookies from 'js-cookie'
import { TOKEN_COOKIE_KEYS } from './constants'
import type { AuthTokenResponse } from './types'

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: 'strict',
  secure: window.location.protocol === 'https:',
}

function expiresFromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function getAccessToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_KEYS.accessToken)
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_KEYS.refreshToken)
}

export function setAuthTokens(tokens: AuthTokenResponse): void {
  Cookies.set(
    TOKEN_COOKIE_KEYS.accessToken,
    tokens.access_token,
    {
      ...COOKIE_OPTIONS,
      expires: expiresFromUnixTimestamp(tokens.access_expired_at),
    },
  )

  Cookies.set(
    TOKEN_COOKIE_KEYS.refreshToken,
    tokens.refresh_token,
    {
      ...COOKIE_OPTIONS,
      expires: expiresFromUnixTimestamp(tokens.refresh_expired_at),
    },
  )
}

export function clearAuthTokens(): void {
  Cookies.remove(TOKEN_COOKIE_KEYS.accessToken)
  Cookies.remove(TOKEN_COOKIE_KEYS.refreshToken)
}

export function hasAuthTokens(): boolean {
  return Boolean(getAccessToken() || getRefreshToken())
}
