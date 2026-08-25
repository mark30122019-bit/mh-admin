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

/** Высота одной строки компактной таблицы постов. */
export const TABLE_ROW_HEIGHT_PX = 48

/** Строка авторов (аватар 36 + padding ячеек). */
export const AUTHORS_TABLE_ROW_HEIGHT_PX = 58

/** Строка тегов (default Ant Table). */
export const TAGS_TABLE_ROW_HEIGHT_PX = 55


/**
 * На первой странице постов при числе записей < pageSize
 * пустые строки не рисуем — держим min-height под столько рядов.
 */
export const POSTS_FIRST_PAGE_MIN_ROWS = 7

export function getPostsFirstPageMinHeight(): number {
  return POSTS_FIRST_PAGE_MIN_ROWS * TABLE_ROW_HEIGHT_PX
}
