import type { ReactNode } from 'react'

type AuthRouteProps = {
  children: ReactNode
  /** true — маршрут только для авторизованных (например /posts) */
  private?: boolean
  /** true — маршрут только для гостей (например /login) */
  guestOnly?: boolean
}

/**
 * Обёртка маршрута с проверкой авторизации.
 * Логика редиректов будет включена после реализации auth-модуля.
 */
export function AuthRoute({ children }: AuthRouteProps) {
  // TODO(auth): подключить селектор isAuthenticated из modules/auth
  // const isAuthenticated = useSelector(selectIsAuthenticated)
  // const location = useLocation()

  // if (private && !isAuthenticated) {
  //   return <Redirect to={{ pathname: '/login', state: { from: location } }} />
  // }

  // if (guestOnly && isAuthenticated) {
  //   return <Redirect to="/posts" />
  // }

  return <>{children}</>
}

/**
 * Редирект с главной страницы:
 * - авторизован → /posts
 * - не авторизован → /login
 */
export function useHomeRedirect() {
  // TODO(auth): раскомментировать после реализации auth
  // const history = useHistory()
  // const isAuthenticated = useSelector(selectIsAuthenticated)
  //
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     history.replace('/posts')
  //   } else {
  //     history.replace('/login')
  //   }
  // }, [history, isAuthenticated])
}
