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

  return {
    items: Array.isArray(response.data) ? response.data : [],
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
  return data
}

export async function createPost(payload: PostFormPayload): Promise<number> {
  const { data } = await apiClient.post<number>(
    '/manage/posts/add',
    buildPostFormData(payload),
  )
  return data
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
