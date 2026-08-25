export interface AuthTokenResponse {
  access_token: string
  refresh_token: string
  access_expired_at: number
  refresh_expired_at: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface UserProfile {
  id: number
  phone: string
  email: string
  name: string
  lastName: string
  secondName: string
  roles: Array<{ role: string; name: string }>
  status: { code: number; name: string }
  isActive: boolean
  updatedAt: string
  createdAt: string
}

export interface ApiFieldError {
  field: string
  message: string
}

export interface ApiBadRequestResponse {
  name: string
  message: string
  code: number
  status: number
  type: string
}

export type ApiValidationErrors = ApiFieldError[]
