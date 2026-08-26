type AuthorNameParts = {
  name?: string | null
  lastName?: string | null
  secondName?: string | null
}

/**
 * Формат ФИО как в API списка постов: «Last name Name Second name».
 */
export function formatAuthorDisplayName(author: AuthorNameParts): string {
  return [author.lastName, author.name, author.secondName]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ')
}

/** Имя автора из ответа списка постов; пусто → в UI прочерк. */
export function resolvePostAuthorLabel(
  post: { authorName?: string | null },
): string | null {
  const name = post.authorName?.trim()
  return name || null
}

export type ResolvedPostTag = {
  key: string
  label: string
}

/** Теги из ответа списка постов (`tagNames`); пустые пропускаем. */
export function resolvePostTagLabels(post: {
  tagNames?: Array<string | null> | null
}): ResolvedPostTag[] {
  return (post.tagNames ?? []).flatMap((name, index) => {
    const trimmed = name?.trim() ?? ''
    if (!trimmed) return []
    return [{ key: `tag-${index}-${trimmed}`, label: trimmed }]
  })
}
