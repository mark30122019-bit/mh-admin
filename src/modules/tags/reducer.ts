import type { AnyAction } from 'redux'
import type { ApiFieldError, TagDetail, TagListItem } from '@/api'
import type { TagsAction } from './actions'
import {
  TAGS_DELETE_FAILURE,
  TAGS_DELETE_REQUEST,
  TAGS_DELETE_SUCCESS,
  TAGS_DETAIL_CLEAR,
  TAGS_DETAIL_FAILURE,
  TAGS_DETAIL_REQUEST,
  TAGS_DETAIL_SUCCESS,
  TAGS_FETCH_FAILURE,
  TAGS_FETCH_REQUEST,
  TAGS_FETCH_SUCCESS,
  TAGS_SAVE_FAILURE,
  TAGS_SAVE_REQUEST,
  TAGS_SAVE_SUCCESS,
} from './actions'

export interface TagsState {
  items: TagListItem[]
  loading: boolean
  error: string | null
  detail: TagDetail | null
  detailLoading: boolean
  saving: boolean
  saveError: string | null
  saveFieldErrors: ApiFieldError[]
  deletingId: number | null
}

const initialState: TagsState = {
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

export function tagsReducer(
  state: TagsState = initialState,
  action: AnyAction,
): TagsState {
  const tagsAction = action as TagsAction

  switch (tagsAction.type) {
    case TAGS_FETCH_REQUEST:
      return {
        ...state,
        loading: state.items.length === 0,
        error: null,
      }
    case TAGS_FETCH_SUCCESS:
      return { ...state, loading: false, items: tagsAction.payload.items }
    case TAGS_FETCH_FAILURE:
      return { ...state, loading: false, error: tagsAction.payload.message }
    case TAGS_DETAIL_REQUEST:
      return { ...state, detailLoading: true, detail: null }
    case TAGS_DETAIL_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        detail: tagsAction.payload.detail,
      }
    case TAGS_DETAIL_FAILURE:
      return { ...state, detailLoading: false }
    case TAGS_DETAIL_CLEAR:
      return { ...state, detail: null, saveError: null, saveFieldErrors: [] }
    case TAGS_SAVE_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null,
        saveFieldErrors: [],
      }
    case TAGS_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        detail: null,
        saveError: null,
        saveFieldErrors: [],
      }
    case TAGS_SAVE_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: tagsAction.payload.message,
        saveFieldErrors: tagsAction.payload.fieldErrors,
      }
    case TAGS_DELETE_REQUEST:
      return { ...state, deletingId: tagsAction.payload.id }
    case TAGS_DELETE_SUCCESS:
    case TAGS_DELETE_FAILURE:
      return { ...state, deletingId: null }
    default:
      return state
  }
}
