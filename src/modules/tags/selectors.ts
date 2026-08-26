import type { TagsModuleState } from './tags.module'

export function selectTagsItems(state: TagsModuleState) {
  return state.tags.items
}

export function selectTagsLoading(state: TagsModuleState) {
  return state.tags.loading
}

export function selectTagsError(state: TagsModuleState) {
  return state.tags.error
}

export function selectTagDetail(state: TagsModuleState) {
  return state.tags.detail
}

export function selectTagDetailLoading(state: TagsModuleState) {
  return state.tags.detailLoading
}

export function selectTagsSaving(state: TagsModuleState) {
  return state.tags.saving
}

export function selectTagsSaveError(state: TagsModuleState) {
  return state.tags.saveError
}

export function selectTagsSaveFieldErrors(state: TagsModuleState) {
  return state.tags.saveFieldErrors
}

export function selectTagsDeletingId(state: TagsModuleState) {
  return state.tags.deletingId
}

export function selectTagsDeleteError(state: TagsModuleState) {
  return state.tags.deleteError
}
