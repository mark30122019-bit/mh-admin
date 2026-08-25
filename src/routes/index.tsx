import { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LazyPage } from '@/components/LazyPage'
import { AuthRoute } from '@/routes/AuthRoute'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))
const PostsPage = lazy(() => import('@/pages/Posts'))

export function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/login">
        <LazyPage>
          <AuthRoute guestOnly>
            <LoginPage />
          </AuthRoute>
        </LazyPage>
      </Route>

      <Route exact path="/posts">
        <LazyPage>
          <AuthRoute private>
            <PostsPage />
          </AuthRoute>
        </LazyPage>
      </Route>

      <Route exact path="/">
        <LazyPage>
          <HomePage />
        </LazyPage>
      </Route>
    </Switch>
  )
}
