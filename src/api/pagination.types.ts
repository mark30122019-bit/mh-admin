export interface ApiPagination {
  currentPage: number
  pageCount: number
  perPage: number
  totalCount: number
}

export interface PaginatedListResponse<T> {
  items: T[]
  pagination: ApiPagination
}
