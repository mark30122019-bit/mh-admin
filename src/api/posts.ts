import { toEntityId } from '@/utils/entityId'
import { apiClient } from './client'
import { appendFormNumberArray, appendFormValue } from './formData'
import { LIST_PAGE_SIZE } from './listPageSize'
import { parsePaginationHeaders } from './pagination'
import type {
  FetchPostsParams,
  PostDetail,
  PostFormPayload,
  PostListItem,
  PostsListResponse,
} from './posts.types'

function normalizePicture(
  picture: PostListItem['previewPicture'],
): PostListItem['previewPicture'] {
  if (!picture) return null
  return {
    ...picture,
    id: toEntityId(picture.id) ?? picture.id,
  }
}

function normalizePostListItem(raw: PostListItem): PostListItem {
  const rawExtra = raw as PostListItem & {
    author_id?: number | string | null
    author?: { id?: number | string } | null
    tags?: Array<{ id?: number | string }>
  }

  const authorId = toEntityId(
    raw.authorId ?? rawExtra.author_id ?? rawExtra.author?.id,
  )

  const tagIdsFromField = raw.tagIds
    ?.map((id) => toEntityId(id))
    .filter((id): id is number => id != null)

  const tagIdsFromNested = rawExtra.tags
    ?.map((tag) => toEntityId(tag.id))
    .filter((id): id is number => id != null)

  return {
    ...raw,
    id: toEntityId(raw.id) ?? Number(raw.id),
    authorId: authorId === null && raw.authorId === undefined && rawExtra.author_id === undefined && rawExtra.author?.id === undefined
      ? undefined
      : authorId,
    previewPicture: normalizePicture(raw.previewPicture),
    tagIds: tagIdsFromField?.length ? tagIdsFromField : tagIdsFromNested,
  }
}

function normalizePostDetail(raw: PostDetail): PostDetail {
  return {
    ...raw,
    id: toEntityId(raw.id) ?? Number(raw.id),
    previewPicture: normalizePicture(raw.previewPicture),
    author: raw.author
      ? {
          ...raw.author,
          id: toEntityId(raw.author.id) ?? Number(raw.author.id),
          avatar: normalizePicture(raw.author.avatar),
        }
      : null,
    tags: (raw.tags ?? []).map((tag) => ({
      ...tag,
      id: toEntityId(tag.id) ?? Number(tag.id),
    })),
  }
}

function buildPostFormData(payload: PostFormPayload): FormData {
  const formData = new FormData()
  appendFormValue(formData, 'code', payload.code)
  appendFormValue(formData, 'title', payload.title)
  appendFormValue(formData, 'authorId', payload.authorId)
  appendFormValue(formData, 'text', payload.text)
  appendFormNumberArray(formData, 'tagIds', payload.tagIds)
  appendFormValue(formData, 'previewPicture', payload.previewPicture)
  return formData
}

export async function fetchPostsList(
  params: FetchPostsParams = {},
): Promise<PostsListResponse> {
  const page = params.page ?? 1

  const response = await apiClient.get<PostListItem[]>('/manage/posts', {
    params: { page },
  })

  const rawItems = Array.isArray(response.data) ? response.data : []

  return {
    items: rawItems.map(normalizePostListItem),
    pagination: parsePaginationHeaders(
      response.headers,
      page,
      LIST_PAGE_SIZE.posts,
    ),
  }
}

export async function fetchPostDetail(id: number): Promise<PostDetail> {
  const { data } = await apiClient.get<PostDetail>('/manage/posts/detail', {
    params: { id },
  })
  return normalizePostDetail(data)
}

export async function createPost(payload: PostFormPayload): Promise<number> {
  const { data } = await apiClient.post<number>(
    '/manage/posts/add',
    buildPostFormData(payload),
  )
  return toEntityId(data) ?? Number(data)
}

export async function updatePost(
  id: number,
  payload: PostFormPayload,
): Promise<void> {
  await apiClient.post('/manage/posts/edit', buildPostFormData(payload), {
    params: { id },
  })
}

export async function deletePost(id: number): Promise<void> {
  await apiClient.delete('/manage/posts/remove', {
    params: { id },
  })
}
