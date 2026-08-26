import { lazyWithPreload } from '@/utils/lazyWithPreload'

/** Единые lazy-страницы админки: preload и рендер делят один кэш модуля. */
export const PostsPage = lazyWithPreload(() => import('@/pages/Posts'))
export const AuthorsPage = lazyWithPreload(() => import('@/pages/Authors'))
export const TagsPage = lazyWithPreload(() => import('@/pages/Tags'))

export const ADMIN_PAGES = {
  '/posts': PostsPage,
  '/authors': AuthorsPage,
  '/tags': TagsPage,
} as const

export type AdminPagePath = keyof typeof ADMIN_PAGES
