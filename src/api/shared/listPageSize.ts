/**
 * Размер страницы списков.
 * posts — дефолт до прихода X-Pagination-Per-Page с бэка (бэк не принимает per-page).
 * authors/tags — клиентская пагинация.
 */
export const LIST_PAGE_SIZE = {
  posts: 9,
  authors: 9,
  tags: 9,
} as const

/** Высота одной строки таблицы (для min-height первой страницы постов). */
export const TABLE_ROW_HEIGHT_PX = 65

/**
 * На первой странице постов при числе записей < pageSize
 * пустые строки не рисуем — держим min-height под столько рядов.
 */
export const POSTS_FIRST_PAGE_MIN_ROWS = 7

export function getPostsFirstPageMinHeight(): number {
  return POSTS_FIRST_PAGE_MIN_ROWS * TABLE_ROW_HEIGHT_PX
}
