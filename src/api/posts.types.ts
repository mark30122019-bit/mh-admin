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
  authorName: string
  previewPicture: ApiPicture | null
  tagNames: string[]
  updatedAt: string
  createdAt: string
}

/** Пагинация из headers ответа списка постов */
export interface ApiPagination {
  currentPage: number
  pageCount: number
  perPage: number
  totalCount: number
}

export interface PostsListResponse {
  items: PostListItem[]
  pagination: ApiPagination
}

export interface FetchPostsParams {
  page?: number
}
