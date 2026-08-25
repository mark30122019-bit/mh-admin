import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Spin } from '@/components/ui'
import {
  selectIsAuthenticated,
  selectIsAuthInitialized,
} from '@/modules/auth/selectors'
import type { AuthModuleState } from '@/modules/auth/auth.module'

type AuthRouteProps = {
  children: ReactNode
  /** Маршрут только для авторизованных (например /posts). */
  private?: boolean
  /** Маршрут только для гостей (например /login). */
  guestOnly?: boolean
}

export function AuthRoute({
  children,
  private: isPrivate,
  guestOnly,
}: AuthRouteProps) {
  const location = useLocation()
  const isInitialized = useSelector((state: AuthModuleState) =>
    selectIsAuthInitialized(state),
  )
  const isAuthenticated = useSelector((state: AuthModuleState) =>
    selectIsAuthenticated(state),
  )

  if (!isInitialized) {
    return <Spin fullPage />
  }

  if (isPrivate && !isAuthenticated) {
    return <Redirect to={{ pathname: '/login', state: { from: location } }} />
  }

  if (guestOnly && isAuthenticated) {
    return <Redirect to="/posts" />
  }

  return <>{children}</>
}

/**
 * Редирект с главной:
 * - авторизован → /posts
 * - не авторизован → /login
 */
export function useHomeRedirect() {
  const history = useHistory()
  const isInitialized = useSelector((state: AuthModuleState) =>
    selectIsAuthInitialized(state),
  )
  const isAuthenticated = useSelector((state: AuthModuleState) =>
    selectIsAuthenticated(state),
  )

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated) {
      history.replace('/posts')
      return
    }

    history.replace('/login')
  }, [history, isAuthenticated, isInitialized])
}
