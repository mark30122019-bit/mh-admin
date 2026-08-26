import type { Dispatch } from 'redux'
import { authorsActions } from '@/modules/authors/actions'
import { postsActions } from '@/modules/posts/actions'
import { tagsActions } from '@/modules/tags/actions'
import {
  ADMIN_PAGES,
  type AdminPagePath,
} from '@/routes/adminPages'

const dataPrefetched = new Set<string>()

function isAdminPath(path: string): path is AdminPagePath {
  return path in ADMIN_PAGES
}

export function prefetchAdminPage(path: string): Promise<unknown> | null {
  if (!isAdminPath(path)) return null

  const page = ADMIN_PAGES[path]
  if (page.isReady()) return Promise.resolve()

  return page.preload().catch(() => null)
}

/** Прогрев списка: к клику данные уже в Redux → без скелетона tbody. */
export function prefetchAdminData(path: string, dispatch: Dispatch): void {
  if (dataPrefetched.has(path)) return

  dataPrefetched.add(path)

  if (path === '/posts') {
    dispatch(postsActions.referencesRequest())
    dispatch(postsActions.fetchRequest(1))
    return
  }
  if (path === '/authors') {
    dispatch(authorsActions.fetchRequest())
    return
  }
  if (path === '/tags') {
    dispatch(tagsActions.fetchRequest())
  }
}

export function warmAdminSection(path: string, dispatch: Dispatch): void {
  void prefetchAdminPage(path)
  prefetchAdminData(path, dispatch)
}

export function warmAllAdminPages(dispatch: Dispatch): void {
  ;(Object.keys(ADMIN_PAGES) as AdminPagePath[]).forEach((path) => {
    warmAdminSection(path, dispatch)
  })
}
