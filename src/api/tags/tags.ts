import { toEntityId } from '@/utils/entityId'
import { apiClient } from '../core/client'
import { appendFormValue } from '../core/formData'
import type { TagDetail, TagFormPayload, TagListItem } from './types'

function normalizeTagListItem(raw: TagListItem): TagListItem {
  return {
    ...raw,
    id: toEntityId(raw.id) ?? Number(raw.id),
    sort:
      raw.sort === undefined || raw.sort === null
        ? raw.sort
        : (toEntityId(raw.sort) ?? raw.sort),
  }
}

function normalizeTagDetail(raw: TagDetail): TagDetail {
  return {
    ...raw,
    id: toEntityId(raw.id) ?? Number(raw.id),
    sort:
      raw.sort === undefined || raw.sort === null
        ? raw.sort
        : (toEntityId(raw.sort) ?? raw.sort),
  }
}

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
  const items = Array.isArray(data) ? data : []
  return items.map(normalizeTagListItem)
}

export async function fetchTagDetail(id: number): Promise<TagDetail> {
  const { data } = await apiClient.get<TagDetail>('/manage/tags/detail', {
    params: { id },
  })
  return normalizeTagDetail(data)
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
