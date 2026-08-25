import type { AnyAction } from 'redux'

export interface TagsState {
  items: unknown[]
}

const initialState: TagsState = {
  items: [],
}

export function tagsReducer(
  state: TagsState = initialState,
  _action: AnyAction,
): TagsState {
  return state
}
