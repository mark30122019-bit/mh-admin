import type { PostsModuleState } from './posts.module'

export function selectPostsItems(state: PostsModuleState) {
  return state.posts.items
}

export function selectPostsPagination(state: PostsModuleState) {
  return state.posts.pagination
}

export function selectPostsLoading(state: PostsModuleState) {
  return state.posts.loading
}

export function selectPostsError(state: PostsModuleState) {
  return state.posts.error
}

export function selectPostDetail(state: PostsModuleState) {
  return state.posts.detail
}

export function selectPostDetailLoading(state: PostsModuleState) {
  return state.posts.detailLoading
}

export function selectPostsSaving(state: PostsModuleState) {
  return state.posts.saving
}

export function selectPostsSaveError(state: PostsModuleState) {
  return state.posts.saveError
}

export function selectPostsSaveFieldErrors(state: PostsModuleState) {
  return state.posts.saveFieldErrors
}

export function selectPostsDeletingId(state: PostsModuleState) {
  return state.posts.deletingId
}

export function selectPostsAuthorOptions(state: PostsModuleState) {
  return state.posts.authorOptions
}

export function selectPostsTagOptions(state: PostsModuleState) {
  return state.posts.tagOptions
}

export function selectPostsReferencesLoading(state: PostsModuleState) {
  return state.posts.referencesLoading
}
