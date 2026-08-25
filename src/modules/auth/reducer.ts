import type { AnyAction } from 'redux'

export interface AuthState {
  isAuthenticated: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
}

export function authReducer(
  state: AuthState = initialState,
  _action: AnyAction,
): AuthState {
  return state
}
