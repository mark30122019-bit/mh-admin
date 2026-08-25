import { useSelector } from 'react-redux'
import type { AuthModuleState } from '@/modules/auth/auth.module'
import {
  selectIsAuthenticated,
  selectIsAuthInitialized,
} from '@/modules/auth/selectors'

export function useAuth() {
  const isAuthenticated = useSelector((state: AuthModuleState) =>
    selectIsAuthenticated(state),
  )
  const isInitialized = useSelector((state: AuthModuleState) =>
    selectIsAuthInitialized(state),
  )

  return {
    isAuthenticated,
    isInitialized,
  }
}
