import type { ApiPagination } from './pagination.types'

const PAGINATION_HEADERS = {
  currentPage: 'x-pagination-current-page',
  pageCount: 'x-pagination-page-count',
  perPage: 'x-pagination-per-page',
  totalCount: 'x-pagination-total-count',
} as const

function normalizeResponseHeaders(headers: unknown): Record<string, string> {
  const normalized: Record<string, string> = {}

  if (!headers || typeof headers !== 'object') {
    return normalized
  }

  const headerObject = headers as Record<string, unknown> & {
    forEach?: (callback: (value: string, key: string) => void) => void
    toJSON?: () => Record<string, unknown>
  }

  if (typeof headerObject.toJSON === 'function') {
    Object.entries(headerObject.toJSON()).forEach(([key, value]) => {
      if (value != null) normalized[key.toLowerCase()] = String(value)
    })
    return normalized
  }

  if (typeof headerObject.forEach === 'function') {
    headerObject.forEach((value, key) => {
      normalized[key.toLowerCase()] = String(value)
    })
    return normalized
  }

  Object.entries(headerObject).forEach(([key, value]) => {
    if (value != null) normalized[key.toLowerCase()] = String(value)
  })

  return normalized
}

function readHeaderAsNumber(
  headers: Record<string, string>,
  key: string,
  fallback: number,
): number {
  const raw = headers[key]
  if (raw == null || raw.trim() === '') return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** Парсит X-Pagination-* headers ответа списка постов. */
export function parsePaginationHeaders(
  headers: unknown,
  requestedPage: number,
  defaultPerPage: number,
): ApiPagination {
  const normalized = normalizeResponseHeaders(headers)

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
    perPage: readHeaderAsNumber(
      normalized,
      PAGINATION_HEADERS.perPage,
      defaultPerPage,
    ),
    totalCount: readHeaderAsNumber(
      normalized,
      PAGINATION_HEADERS.totalCount,
      0,
    ),
  }
}
