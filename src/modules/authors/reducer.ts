import type { AnyAction } from 'redux'
import type { ApiFieldError, AuthorDetail, AuthorListItem } from '@/api'
import type { AuthorsAction } from './actions'
import {
  AUTHORS_DELETE_FAILURE,
  AUTHORS_DELETE_REQUEST,
  AUTHORS_DELETE_SUCCESS,
  AUTHORS_DETAIL_CLEAR,
  AUTHORS_DETAIL_FAILURE,
  AUTHORS_DETAIL_REQUEST,
  AUTHORS_DETAIL_SUCCESS,
  AUTHORS_FETCH_FAILURE,
  AUTHORS_FETCH_REQUEST,
  AUTHORS_FETCH_SUCCESS,
  AUTHORS_SAVE_FAILURE,
  AUTHORS_SAVE_REQUEST,
  AUTHORS_SAVE_SUCCESS,
} from './actions'

export interface AuthorsState {
  items: AuthorListItem[]
  loading: boolean
  error: string | null
  detail: AuthorDetail | null
  detailLoading: boolean
  saving: boolean
  saveError: string | null
  saveFieldErrors: ApiFieldError[]
  deletingId: number | null
}

const initialState: AuthorsState = {
  items: [],
  loading: false,
  error: null,
  detail: null,
  detailLoading: false,
  saving: false,
  saveError: null,
  saveFieldErrors: [],
  deletingId: null,
}

export function authorsReducer(
  state: AuthorsState = initialState,
  action: AnyAction,
): AuthorsState {
  const authorsAction = action as AuthorsAction

  switch (authorsAction.type) {
    case AUTHORS_FETCH_REQUEST:
      return { ...state, loading: true, error: null }
    case AUTHORS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        items: authorsAction.payload.items,
      }
    case AUTHORS_FETCH_FAILURE:
      return { ...state, loading: false, error: authorsAction.payload.message }
    case AUTHORS_DETAIL_REQUEST:
      return { ...state, detailLoading: true, detail: null }
    case AUTHORS_DETAIL_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        detail: authorsAction.payload.detail,
      }
    case AUTHORS_DETAIL_FAILURE:
      return { ...state, detailLoading: false }
    case AUTHORS_DETAIL_CLEAR:
      return { ...state, detail: null, saveError: null, saveFieldErrors: [] }
    case AUTHORS_SAVE_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null,
        saveFieldErrors: [],
      }
    case AUTHORS_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        detail: null,
        saveError: null,
        saveFieldErrors: [],
      }
    case AUTHORS_SAVE_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: authorsAction.payload.message,
        saveFieldErrors: authorsAction.payload.fieldErrors,
      }
    case AUTHORS_DELETE_REQUEST:
      return { ...state, deletingId: authorsAction.payload.id }
    case AUTHORS_DELETE_SUCCESS:
    case AUTHORS_DELETE_FAILURE:
      return { ...state, deletingId: null }
    default:
      return state
  }
}
