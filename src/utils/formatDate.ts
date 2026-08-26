/** Дата для колонок таблиц (короткий locale-формат). */
export function formatTableDate(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
