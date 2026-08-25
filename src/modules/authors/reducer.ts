import type { AnyAction } from 'redux'

export interface AuthorsState {
  items: unknown[]
}

const initialState: AuthorsState = {
  items: [],
}

export function authorsReducer(
  state: AuthorsState = initialState,
  _action: AnyAction,
): AuthorsState {
  return state
}
