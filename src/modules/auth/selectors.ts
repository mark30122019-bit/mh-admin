import type { AuthModuleState } from './auth.module'

export function selectAuthState(state: AuthModuleState) {
  return state.auth
}

export function selectIsAuthenticated(state: AuthModuleState): boolean {
  return state.auth.isAuthenticated
}

export function selectIsAuthInitialized(state: AuthModuleState): boolean {
  return state.auth.isInitialized
}

export function selectAuthLoading(state: AuthModuleState): boolean {
  return state.auth.loading
}

export function selectAuthError(state: AuthModuleState): string | null {
  return state.auth.error
}

export function selectAuthProfile(state: AuthModuleState) {
  return state.auth.profile
}

export function selectAuthDisplayName(state: AuthModuleState): string {
  const profile = state.auth.profile
  if (!profile) return 'Administrator'

  const fullName = [profile.name, profile.lastName].filter(Boolean).join(' ').trim()
  return fullName || profile.email
}

export function selectAuthInitials(state: AuthModuleState): string {
  const profile = state.auth.profile
  if (!profile) return 'AD'

  const first = profile.name?.charAt(0) ?? ''
  const last = profile.lastName?.charAt(0) ?? ''
  const initials = `${first}${last}`.trim()
  return initials ? initials.toUpperCase() : profile.email.charAt(0).toUpperCase()
}
