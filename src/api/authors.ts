import { apiClient } from './client'
import { appendFormValue } from './formData'
import type {
  AuthorDetail,
  AuthorFormPayload,
  AuthorListItem,
} from './authors.types'

function buildAuthorFormData(payload: AuthorFormPayload): FormData {
  const formData = new FormData()
  appendFormValue(formData, 'name', payload.name)
  appendFormValue(formData, 'lastName', payload.lastName)
  appendFormValue(formData, 'secondName', payload.secondName)
  appendFormValue(formData, 'shortDescription', payload.shortDescription)
  appendFormValue(formData, 'description', payload.description)
  appendFormValue(formData, 'avatar', payload.avatar)
  if (payload.removeAvatar) {
    appendFormValue(formData, 'removeAvatar', true)
  }
  return formData
}

/** Полный список авторов (бэкенд отдаёт массив целиком). */
export async function fetchAuthorsList(): Promise<AuthorListItem[]> {
  const { data } = await apiClient.get<AuthorListItem[]>('/manage/authors')
  return Array.isArray(data) ? data : []
}

export async function fetchAuthorDetail(id: number): Promise<AuthorDetail> {
  const { data } = await apiClient.get<AuthorDetail>('/manage/authors/detail', {
    params: { id },
  })
  return data
}

export async function createAuthor(payload: AuthorFormPayload): Promise<void> {
  await apiClient.post('/manage/authors/add', buildAuthorFormData(payload))
}

export async function updateAuthor(
  id: number,
  payload: AuthorFormPayload,
): Promise<void> {
  await apiClient.post('/manage/authors/edit', buildAuthorFormData(payload), {
    params: { id },
  })
}

export async function deleteAuthor(id: number): Promise<void> {
  await apiClient.delete('/manage/authors/remove', {
    params: { id },
  })
}
