import type { PostsModuleState } from './posts.module'

export function selectPostsState(state: PostsModuleState) {
  return state.posts
}

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
