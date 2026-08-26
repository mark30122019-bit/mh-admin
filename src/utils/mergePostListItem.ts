import type { AuthorListItem, PostFormInput, PostListItem, TagListItem } from '@/api'
import { idsEqual, toEntityId } from '@/utils/entityId'
import { formatAuthorDisplayName } from '@/utils/orphanLabels'

/**
 * После save список с API иногда ещё отдаёт старого автора/теги.
 * Подмешиваем значения формы + актуальный справочник, чтобы UI сразу стал корректным.
 */
export function mergePostListItemWithForm(
  item: PostListItem,
  values: PostFormInput,
  authors: AuthorListItem[],
  tags: TagListItem[],
): PostListItem {
  const authorId = toEntityId(values.authorId)
  const author =
    authorId != null
      ? authors.find((entry) => idsEqual(entry.id, authorId))
      : undefined

  const tagIds = (values.tagIds ?? [])
    .map((id) => toEntityId(id))
    .filter((id): id is number => id != null)

  const tagNames = tagIds.map((id) => {
    const found = tags.find((tag) => idsEqual(tag.id, id))
    return found?.name ?? null
  })

  return {
    ...item,
    title: values.title,
    authorId,
    authorName: author
      ? formatAuthorDisplayName(author)
      : item.authorName,
    tagIds,
    tagNames,
  }
}
