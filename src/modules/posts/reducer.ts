import type { AnyAction } from 'redux'

export interface PostsState {
  items: unknown[]
  total: number
}

const initialState: PostsState = {
  items: [],
  total: 0,
}

export function postsReducer(
  state: PostsState = initialState,
  _action: AnyAction,
): PostsState {
  return state
}
