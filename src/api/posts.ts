import { apiClient } from './client'
import type {
  ApiPagination,
  FetchPostsParams,
  PostListItem,
  PostsListResponse,
} from './posts.types'

const PAGINATION_HEADERS = {
  currentPage: 'x-pagination-current-page',
  pageCount: 'x-pagination-page-count',
  perPage: 'x-pagination-per-page',
  totalCount: 'x-pagination-total-count',
} as const

function readHeaderValue(
  headers: Record<string, unknown>,
  key: string,
): string | undefined {
  const direct = headers[key]
  if (typeof direct === 'string' || typeof direct === 'number') {
    return String(direct)
  }

  // AxiosHeaders.get(...)
  const maybeGet = (headers as { get?: (name: string) => unknown }).get
  if (typeof maybeGet === 'function') {
    const value = maybeGet.call(headers, key)
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }
  }

  return undefined
}

function readHeaderAsNumber(
  headers: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const raw = readHeaderValue(headers, key)
  if (raw == null || raw.trim() === '') return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parsePaginationHeaders(
  headers: Record<string, unknown>,
  requestedPage: number,
): ApiPagination {
  const normalized: Record<string, unknown> = { ...headers }
  Object.entries(headers).forEach(([key, value]) => {
    normalized[key.toLowerCase()] = value
  })

  return {
    currentPage: readHeaderAsNumber(
      normalized,
      PAGINATION_HEADERS.currentPage,
      requestedPage,
    ),
    pageCount: readHeaderAsNumber(
      normalized,
      PAGINATION_HEADERS.pageCount,
      1,
    ),
    perPage: readHeaderAsNumber(normalized, PAGINATION_HEADERS.perPage, 20),
    totalCount: readHeaderAsNumber(
      normalized,
      PAGINATION_HEADERS.totalCount,
      0,
    ),
  }
}

/** GET /manage/posts — список постов, пагинация в headers. */
export async function fetchPostsList(
  params: FetchPostsParams = {},
): Promise<PostsListResponse> {
  const page = params.page ?? 1

  const response = await apiClient.get<PostListItem[]>('/manage/posts', {
    params: { page },
  })

  return {
    items: Array.isArray(response.data) ? response.data : [],
    pagination: parsePaginationHeaders(
      response.headers as Record<string, unknown>,
      page,
    ),
  }
}
