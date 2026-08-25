import type { LoginCredentials, UserProfile } from '@/api'

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST' as const
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS' as const
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE' as const
export const AUTH_LOGOUT = 'auth/LOGOUT' as const
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS' as const
export const AUTH_INIT = 'auth/INIT' as const
export const AUTH_INIT_SUCCESS = 'auth/INIT_SUCCESS' as const
export const AUTH_INIT_FAILURE = 'auth/INIT_FAILURE' as const
export const AUTH_SESSION_EXPIRED = 'auth/SESSION_EXPIRED' as const

export type AuthLoginRequestAction = {
  type: typeof AUTH_LOGIN_REQUEST
  payload: LoginCredentials
}

export type AuthLoginSuccessAction = {
  type: typeof AUTH_LOGIN_SUCCESS
  payload: { profile: UserProfile }
}

export type AuthLoginFailureAction = {
  type: typeof AUTH_LOGIN_FAILURE
  payload: { message: string }
}

export type AuthLogoutAction = { type: typeof AUTH_LOGOUT }
export type AuthLogoutSuccessAction = { type: typeof AUTH_LOGOUT_SUCCESS }
export type AuthInitAction = { type: typeof AUTH_INIT }
export type AuthInitSuccessAction = {
  type: typeof AUTH_INIT_SUCCESS
  payload: { profile: UserProfile }
}
export type AuthInitFailureAction = { type: typeof AUTH_INIT_FAILURE }
export type AuthSessionExpiredAction = { type: typeof AUTH_SESSION_EXPIRED }

export type AuthAction =
  | AuthLoginRequestAction
  | AuthLoginSuccessAction
  | AuthLoginFailureAction
  | AuthLogoutAction
  | AuthLogoutSuccessAction
  | AuthInitAction
  | AuthInitSuccessAction
  | AuthInitFailureAction
  | AuthSessionExpiredAction

export const authActions = {
  loginRequest: (payload: LoginCredentials): AuthLoginRequestAction => ({
    type: AUTH_LOGIN_REQUEST,
    payload,
  }),
  loginSuccess: (profile: UserProfile): AuthLoginSuccessAction => ({
    type: AUTH_LOGIN_SUCCESS,
    payload: { profile },
  }),
  loginFailure: (message: string): AuthLoginFailureAction => ({
    type: AUTH_LOGIN_FAILURE,
    payload: { message },
  }),
  logout: (): AuthLogoutAction => ({ type: AUTH_LOGOUT }),
  logoutSuccess: (): AuthLogoutSuccessAction => ({ type: AUTH_LOGOUT_SUCCESS }),
  init: (): AuthInitAction => ({ type: AUTH_INIT }),
  initSuccess: (profile: UserProfile): AuthInitSuccessAction => ({
    type: AUTH_INIT_SUCCESS,
    payload: { profile },
  }),
  initFailure: (): AuthInitFailureAction => ({ type: AUTH_INIT_FAILURE }),
  sessionExpired: (): AuthSessionExpiredAction => ({
    type: AUTH_SESSION_EXPIRED,
  }),
}
