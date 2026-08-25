export type TablePlaceholderRow = {
  id: string
  __placeholder: true
}

export function isTablePlaceholderRow(
  record: object,
): record is TablePlaceholderRow {
  return (
    '__placeholder' in record &&
    (record as TablePlaceholderRow).__placeholder === true
  )
}

/** Дополняет страницу таблицы пустыми строками до pageSize — высота не сжимается. */
export function padTablePage<T extends object>(
  items: T[],
  pageSize: number,
): Array<T | TablePlaceholderRow> {
  if (items.length >= pageSize) return items

  const padded: Array<T | TablePlaceholderRow> = [...items]
  for (let i = items.length; i < pageSize; i += 1) {
    padded.push({ id: `__placeholder-${i}`, __placeholder: true })
  }
  return padded
}
