import type { AuthorsModuleState } from './authors.module'

export function selectAuthorsItems(state: AuthorsModuleState) {
  return state.authors.items
}

export function selectAuthorsLoading(state: AuthorsModuleState) {
  return state.authors.loading
}

export function selectAuthorsError(state: AuthorsModuleState) {
  return state.authors.error
}

export function selectAuthorDetail(state: AuthorsModuleState) {
  return state.authors.detail
}

export function selectAuthorDetailLoading(state: AuthorsModuleState) {
  return state.authors.detailLoading
}

export function selectAuthorDetailError(state: AuthorsModuleState) {
  return state.authors.detailError
}

export function selectAuthorsSaving(state: AuthorsModuleState) {
  return state.authors.saving
}

export function selectAuthorsSaveError(state: AuthorsModuleState) {
  return state.authors.saveError
}

export function selectAuthorsSaveFieldErrors(state: AuthorsModuleState) {
  return state.authors.saveFieldErrors
}

export function selectAuthorsDeletingId(state: AuthorsModuleState) {
  return state.authors.deletingId
}

export function selectAuthorsDeleteError(state: AuthorsModuleState) {
  return state.authors.deleteError
}
