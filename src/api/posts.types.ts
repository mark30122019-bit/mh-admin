import type { ApiPagination } from './pagination.types'

export type { ApiPagination } from './pagination.types'

export interface ApiPicture {
  id: number
  name: string
  url: string
}

/** Элемент списка GET /manage/posts */
export interface PostListItem {
  id: number
  title: string
  code: string
  /**
   * Может отсутствовать в ответе; нужен для детекта удалённого автора.
   * На проводе API иногда приходит строкой — нормализуем в api-слое.
   */
  authorId?: number | null
  authorName: string | null
  previewPicture: ApiPicture | null
  /** Может отсутствовать; при наличии сверяем с актуальными тегами. */
  tagIds?: number[]
  tagNames: Array<string | null>
  updatedAt: string
  createdAt: string
}

export interface PostAuthorRef {
  id: number
  fullName: string
  avatar: ApiPicture | null
}

export interface PostTagRef {
  id: number
  name: string
  code: string
}

/** GET /manage/posts/detail */
export interface PostDetail {
  id: number
  title: string
  code: string
  text: string
  previewPicture: ApiPicture | null
  /** null/undefined, если автор удалён (данные-сироты). */
  author: PostAuthorRef | null
  tags: PostTagRef[]
  updatedAt: string
  createdAt: string
}

/** Поля формы поста (без code — генерируется только при создании). */
export interface PostFormInput {
  title: string
  authorId: number
  tagIds: number[]
  text: string
  previewPicture?: File
}

/** Payload для API create/update, включая code. */
export interface PostFormPayload extends PostFormInput {
  code: string
}

export interface PostsListResponse {
  items: PostListItem[]
  pagination: ApiPagination
}

export interface FetchPostsParams {
  page?: number
}
