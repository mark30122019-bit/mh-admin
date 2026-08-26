import { useEffect, type ReactNode } from 'react'
import { lazy } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { LazyPage } from '@/components/LazyPage'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import { PageContentSkeleton } from '@/components/ui'
import { getAuthorsModule } from '@/modules/authors/authors.module'
import { getPostsModule } from '@/modules/posts/posts.module'
import { getTagsModule } from '@/modules/tags/tags.module'
import {
  AuthorsPage,
  PostsPage,
  TagsPage,
} from '@/routes/adminPages'
import { AuthRoute } from '@/routes/AuthRoute'
import { warmAllAdminPages } from '@/utils/prefetchAdminPage'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))

/**
 * Общий shell админки: layout и redux-модули не размонтируются.
 * Страницы — lazyWithPreload; после hover/warm рендер без кадра Suspense.
 */
function AdminShell({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    warmAllAdminPages(dispatch)
  }, [dispatch])

  return (
    <AuthRoute private>
      <DynamicModuleLoader
        modules={[getPostsModule(), getAuthorsModule(), getTagsModule()]}
        strictMode
      >
        <MainLayout>
          {/* Fallback только скелетон контента — без Spin; сайдбар/шапка уже на месте */}
          <LazyPage fallback={<PageContentSkeleton />}>{children}</LazyPage>
        </MainLayout>
      </DynamicModuleLoader>
    </AuthRoute>
  )
}

export function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/login">
        <LazyPage fallback={<PageContentSkeleton />}>
          <AuthRoute guestOnly>
            <LoginPage />
          </AuthRoute>
        </LazyPage>
      </Route>

      <Route path={['/posts', '/authors', '/tags']}>
        <AdminShell>
          <Switch>
            <Route exact path="/posts">
              <PostsPage />
            </Route>
            <Route exact path="/authors">
              <AuthorsPage />
            </Route>
            <Route exact path="/tags">
              <TagsPage />
            </Route>
          </Switch>
        </AdminShell>
      </Route>

      <Route exact path="/">
        <LazyPage fallback={<PageContentSkeleton />}>
          <HomePage />
        </LazyPage>
      </Route>
    </Switch>
  )
}
