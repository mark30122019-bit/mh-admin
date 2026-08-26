export type TablePlaceholderRow = {
  id: string
  __placeholder: true
}

/** Ниже порога — паддинг пустыми до 5; от порога — высота по факту, без пустых. */
export const TABLE_FILL_MIN_ROWS = 5

export function isTablePlaceholderRow(
  record: object,
): record is TablePlaceholderRow {
  return (
    '__placeholder' in record &&
    (record as TablePlaceholderRow).__placeholder === true
  )
}

/** Дополняет страницу таблицы пустыми строками до `targetCount`. */
export function padTablePage<T extends object>(
  items: T[],
  targetCount: number,
): Array<T | TablePlaceholderRow> {
  if (items.length >= targetCount) return items

  const padded: Array<T | TablePlaceholderRow> = [...items]
  for (let i = items.length; i < targetCount; i += 1) {
    padded.push({ id: `__placeholder-${i}`, __placeholder: true })
  }
  return padded
}

export type TablePageLayout<T extends object> = {
  rows: Array<T | TablePlaceholderRow>
  /** Делитель для `--table-rows` (равномерная высота). */
  fillRowCount: number
}

export type BuildTablePageLayoutOptions = {
  /** 1-based номер страницы. С 2-й — всегда pageSize строк. */
  page?: number
  /** Размер страницы (обычно 9). Нужен для page ≥ 2. */
  pageSize?: number
}

/**
 * Страница 1 (текущий флоу):
 *   ≥ TABLE_FILL_MIN_ROWS — только реальные строки, высота = count;
 *   < TABLE_FILL_MIN_ROWS — пустые до 5, высота на 5.
 *
 * Страница ≥ 2:
 *   всегда pageSize строк (паддинг placeholder'ами), даже если элементов ≤ 5.
 */
export function buildTablePageLayout<T extends object>(
  items: T[],
  options: BuildTablePageLayoutOptions = {},
): TablePageLayout<T> {
  const page = options.page ?? 1
  const pageSize = options.pageSize

  if (page >= 2 && pageSize != null && pageSize > 0) {
    return {
      rows: padTablePage(items, pageSize),
      fillRowCount: pageSize,
    }
  }

  if (items.length >= TABLE_FILL_MIN_ROWS) {
    return {
      rows: items,
      fillRowCount: Math.max(1, items.length),
    }
  }

  return {
    rows: padTablePage(items, TABLE_FILL_MIN_ROWS),
    fillRowCount: TABLE_FILL_MIN_ROWS,
  }
}
