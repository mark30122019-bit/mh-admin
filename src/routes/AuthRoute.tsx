import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

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
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <div className="min-h-screen bg-[#f5f5f5]" />
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
  const { isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated) {
      history.replace('/posts')
      return
    }

    history.replace('/login')
  }, [history, isAuthenticated, isInitialized])
}
