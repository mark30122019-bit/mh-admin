/** Инициалы из имени и фамилии; оба поля должны быть непустыми. */
export function getAuthorInitials(
  name?: string | null,
  lastName?: string | null,
): string | null {
  const first = name?.trim().charAt(0)
  const last = lastName?.trim().charAt(0)
  if (!first || !last) return null
  return `${first}${last}`.toUpperCase()
}
