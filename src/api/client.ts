import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { refreshTokenRequest } from './auth'
import { API_BASE_URL, AUTH_ENDPOINTS } from './constants'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from './cookies'
import type {
  ApiBadRequestResponse,
  ApiFieldError,
  ApiValidationErrors,
  UserProfile,
} from './types'

export type ApiRequestConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean
  _retry?: boolean
}

type RefreshQueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
const refreshQueue: RefreshQueueItem[] = []

function processRefreshQueue(error: unknown, token: string | null = null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error)
      return
    }
    resolve(token)
  })
  refreshQueue.length = 0
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false
  return (
    url.includes(AUTH_ENDPOINTS.tokenGenerate) ||
    url.includes(AUTH_ENDPOINTS.tokenRefresh)
  )
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Refresh token is missing')
  }

  const tokens = await refreshTokenRequest(refreshToken)
  setAuthTokens(tokens)
  return tokens.access_token
}

function attachAccessToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
  })

  client.interceptors.request.use((config) => {
    const requestConfig = config as ApiRequestConfig
    if (requestConfig.skipAuth || isAuthEndpoint(requestConfig.url)) {
      return requestConfig
    }
    return attachAccessToken(requestConfig)
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ApiRequestConfig | undefined

      if (
        !originalRequest ||
        originalRequest.skipAuth ||
        originalRequest._retry ||
        isAuthEndpoint(originalRequest.url) ||
        error.response?.status !== 401
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return client.request(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await refreshAccessToken()
        processRefreshQueue(null, newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return client.request(originalRequest)
      } catch (refreshError) {
        processRefreshQueue(refreshError, null)
        clearAuthTokens()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )

  return client
}

export const apiClient = createApiClient()

export async function fetchProfileRequest(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/profile')
  return data
}

export function isValidationError(
  error: unknown,
): error is AxiosError<ApiValidationErrors> {
  return axios.isAxiosError(error) && error.response?.status === 422
}

export function isBadRequestError(
  error: unknown,
): error is AxiosError<ApiBadRequestResponse> {
  return axios.isAxiosError(error) && error.response?.status === 400
}

export function getValidationErrors(error: unknown): ApiFieldError[] {
  if (isValidationError(error) && Array.isArray(error.response?.data)) {
    return error.response.data
  }
  return []
}

export function getBadRequestMessage(error: unknown): string | undefined {
  if (isBadRequestError(error)) {
    return error.response?.data.message
  }
  return undefined
}
