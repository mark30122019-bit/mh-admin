import { lazy, type ReactNode } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LazyPage } from '@/components/LazyPage'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import { PageContentSkeleton } from '@/components/ui/TableSkeleton'
import { getAuthorsModule } from '@/modules/authors/authors.module'
import { getPostsModule } from '@/modules/posts/posts.module'
import { getTagsModule } from '@/modules/tags/tags.module'
import { AuthRoute } from '@/routes/AuthRoute'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))
const PostsPage = lazy(() => import('@/pages/Posts'))
const AuthorsPage = lazy(() => import('@/pages/Authors'))
const TagsPage = lazy(() => import('@/pages/Tags'))

/**
 * Общий shell админки: layout и redux-модули не размонтируются
 * при переключении Posts / Authors / Tags — без белой вспышки.
 */
function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthRoute private>
      <DynamicModuleLoader
        modules={[getPostsModule(), getAuthorsModule(), getTagsModule()]}
        strictMode
      >
        <MainLayout>
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
        <LazyPage>
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
        <LazyPage>
          <HomePage />
        </LazyPage>
      </Route>
    </Switch>
  )
}
