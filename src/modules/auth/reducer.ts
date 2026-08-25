import type { AnyAction } from 'redux'
import type { UserProfile } from '@/api'
import type { AuthAction } from './actions'
import {
  AUTH_INIT,
  AUTH_INIT_FAILURE,
  AUTH_INIT_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  AUTH_SESSION_EXPIRED,
} from './actions'

export interface AuthState {
  isAuthenticated: boolean
  isInitialized: boolean
  loading: boolean
  error: string | null
  profile: UserProfile | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  profile: null,
}

export function authReducer(
  state: AuthState = initialState,
  action: AnyAction,
): AuthState {
  const authAction = action as AuthAction

  switch (authAction.type) {
    case AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: null }
    case AUTH_LOGIN_SUCCESS:
    case AUTH_INIT_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isInitialized: true,
        loading: false,
        error: null,
        profile: authAction.payload.profile,
      }
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        loading: false,
        error: authAction.payload.message,
        profile: null,
      }
    case AUTH_INIT:
      return { ...state, loading: true }
    case AUTH_INIT_FAILURE:
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_SESSION_EXPIRED:
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        loading: false,
        error: null,
        profile: null,
      }
    case AUTH_LOGOUT:
      return { ...state, loading: true }
    default:
      return state
  }
}
