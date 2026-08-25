import { apiClient } from './client'
import { appendFormValue } from './formData'
import type { TagDetail, TagFormPayload, TagListItem } from './tags.types'

function buildTagFormData(payload: TagFormPayload): FormData {
  const formData = new FormData()
  appendFormValue(formData, 'code', payload.code)
  appendFormValue(formData, 'name', payload.name)
  appendFormValue(formData, 'sort', payload.sort)
  return formData
}

/** Полный список тегов (бэкенд отдаёт массив целиком). */
export async function fetchTagsList(): Promise<TagListItem[]> {
  const { data } = await apiClient.get<TagListItem[]>('/manage/tags')
  return Array.isArray(data) ? data : []
}

export async function fetchTagDetail(id: number): Promise<TagDetail> {
  const { data } = await apiClient.get<TagDetail>('/manage/tags/detail', {
    params: { id },
  })
  return data
}

export async function createTag(payload: TagFormPayload): Promise<void> {
  await apiClient.post('/manage/tags/add', buildTagFormData(payload))
}

export async function updateTag(id: number, payload: TagFormPayload): Promise<void> {
  await apiClient.post('/manage/tags/edit', buildTagFormData(payload), {
    params: { id },
  })
}

export async function deleteTag(id: number): Promise<void> {
  await apiClient.delete('/manage/tags/remove', {
    params: { id },
  })
}
