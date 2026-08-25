import { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LazyPage } from '@/components/LazyPage'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))

export function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/login">
        <LazyPage>
          <LoginPage />
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
