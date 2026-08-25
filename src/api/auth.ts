import axios from 'axios'
import type { AuthTokenResponse, LoginCredentials } from './types'
import { API_BASE_URL, AUTH_ENDPOINTS } from './constants'

const authHttp = axios.create({
  baseURL: API_BASE_URL,
})

function createLoginFormData(credentials: LoginCredentials): FormData {
  const formData = new FormData()
  formData.append('email', credentials.email)
  formData.append('password', credentials.password)
  return formData
}

function createRefreshFormData(refreshToken: string): FormData {
  const formData = new FormData()
  formData.append('refresh_token', refreshToken)
  return formData
}

/** POST /auth/token-generate (multipart/form-data). */
export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthTokenResponse> {
  const { data } = await authHttp.post<AuthTokenResponse>(
    AUTH_ENDPOINTS.tokenGenerate,
    createLoginFormData(credentials),
  )
  return data
}

/** POST /auth/token-refresh (multipart/form-data). */
export async function refreshTokenRequest(
  refreshToken: string,
): Promise<AuthTokenResponse> {
  const { data } = await authHttp.post<AuthTokenResponse>(
    AUTH_ENDPOINTS.tokenRefresh,
    createRefreshFormData(refreshToken),
  )
  return data
}
