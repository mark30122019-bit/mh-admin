import type { AuthorListItem, TagListItem } from '@/api'
import { translate } from '@/i18n'
import type { AppLanguage } from '@/modules/app/types'
import { idsEqual, toEntityId } from '@/utils/entityId'

/** Метка удалённой сущности для Safe Render / Select. */
export function formatDeletedEntityLabel(
  id?: number | string | null,
  lang: AppLanguage = 'ru',
): string {
  const parsed = toEntityId(id)
  if (parsed != null) {
    return translate(lang, 'orphan.deletedWithId', { id: parsed })
  }
  return translate(lang, 'orphan.deleted')
}

type PostAuthorFields = {
  authorId?: number | string | null
  authorName?: string | null
}

type PostTagFields = {
  tagIds?: Array<number | string> | null
  tagNames?: Array<string | null> | null
}

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

function authorNameMatches(author: AuthorListItem, label: string): boolean {
  const normalized = label.trim()
  if (!normalized) return false

  const variants = new Set(
    [
      formatAuthorDisplayName(author),
      [author.name, author.lastName, author.secondName]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(' '),
      `${author.lastName} ${author.name}`.trim(),
      `${author.name} ${author.lastName}`.trim(),
      author.name?.trim(),
      author.lastName?.trim(),
    ].filter((value): value is string => Boolean(value)),
  )

  return variants.has(normalized)
}

export type ResolvedPostAuthor = {
  label: string
  orphan: boolean
}

export type ResolvedPostTag = {
  key: string
  label: string
  orphan: boolean
}

/**
 * Безопасный вывод автора поста относительно актуального списка авторов.
 * Не обращается к полям удалённого объекта напрямую.
 * ID сравниваются через Number — бэкенд часто отдаёт строку вместо числа.
 */
export function resolvePostAuthorLabel(
  post: PostAuthorFields,
  authors: AuthorListItem[],
  lang: AppLanguage = 'ru',
): ResolvedPostAuthor {
  const authorId = toEntityId(post.authorId)

  if (authorId != null) {
    const found = authors.find((author) => idsEqual(author.id, authorId))
    if (found) {
      const label = formatAuthorDisplayName(found)
      if (label) {
        return { label, orphan: false }
      }
      return { label: formatDeletedEntityLabel(authorId, lang), orphan: true }
    }

    const fallbackName = post.authorName?.trim()
    if (fallbackName) {
      return {
        label: translate(lang, 'orphan.deletedWithName', { name: fallbackName }),
        orphan: true,
      }
    }
    return { label: formatDeletedEntityLabel(authorId, lang), orphan: true }
  }

  const name = post.authorName?.trim()
  if (!name) {
    return { label: formatDeletedEntityLabel(null, lang), orphan: true }
  }

  if (authors.length === 0) {
    return { label: name, orphan: false }
  }

  const found = authors.find((author) => authorNameMatches(author, name))
  if (found) {
    return {
      label: formatAuthorDisplayName(found) || name,
      orphan: false,
    }
  }

  return {
    label: translate(lang, 'orphan.deletedWithName', { name }),
    orphan: true,
  }
}

/**
 * Безопасный вывод тегов поста: сверяем с актуальным списком в сторе.
 * ID сравниваются через Number (string vs number с API).
 */
export function resolvePostTagLabels(
  post: PostTagFields,
  tags: TagListItem[],
  lang: AppLanguage = 'ru',
): ResolvedPostTag[] {
  const tagIds = post.tagIds ?? []
  const tagNames = post.tagNames ?? []

  if (tagIds.length > 0) {
    return tagIds.map((id, index) => {
      const parsedId = toEntityId(id)
      const found = tags.find((tag) => idsEqual(tag.id, id))
      if (found) {
        return {
          key: `tag-${parsedId ?? id}`,
          label: found.name,
          orphan: false,
        }
      }
      const fallbackName = tagNames[index]?.trim()
      return {
        key: `tag-orphan-${parsedId ?? id}`,
        label: fallbackName
          ? translate(lang, 'orphan.deletedWithName', { name: fallbackName })
          : formatDeletedEntityLabel(parsedId, lang),
        orphan: true,
      }
    })
  }

  return tagNames.map((name, index) => {
    const trimmed = name?.trim() ?? ''
    if (!trimmed) {
      return {
        key: `tag-empty-${index}`,
        label: formatDeletedEntityLabel(null, lang),
        orphan: true,
      }
    }

    if (tags.length === 0) {
      return { key: `tag-name-${index}-${trimmed}`, label: trimmed, orphan: false }
    }

    const found = tags.some((tag) => tag.name === trimmed)
    return {
      key: `tag-name-${index}-${trimmed}`,
      label: found
        ? trimmed
        : translate(lang, 'orphan.deletedWithName', { name: trimmed }),
      orphan: !found,
    }
  })
}
