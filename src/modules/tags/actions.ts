import type {
  ApiFieldError,
  TagDetail,
  TagFormInput,
  TagListItem,
} from '@/api'

export const TAGS_FETCH_REQUEST = 'tags/FETCH_REQUEST' as const
export const TAGS_FETCH_SUCCESS = 'tags/FETCH_SUCCESS' as const
export const TAGS_FETCH_FAILURE = 'tags/FETCH_FAILURE' as const

export const TAGS_DETAIL_REQUEST = 'tags/DETAIL_REQUEST' as const
export const TAGS_DETAIL_SUCCESS = 'tags/DETAIL_SUCCESS' as const
export const TAGS_DETAIL_FAILURE = 'tags/DETAIL_FAILURE' as const
export const TAGS_DETAIL_CLEAR = 'tags/DETAIL_CLEAR' as const

export const TAGS_SAVE_REQUEST = 'tags/SAVE_REQUEST' as const
export const TAGS_SAVE_SUCCESS = 'tags/SAVE_SUCCESS' as const
export const TAGS_SAVE_FAILURE = 'tags/SAVE_FAILURE' as const

export const TAGS_DELETE_REQUEST = 'tags/DELETE_REQUEST' as const
export const TAGS_DELETE_SUCCESS = 'tags/DELETE_SUCCESS' as const
export const TAGS_DELETE_FAILURE = 'tags/DELETE_FAILURE' as const

export type TagsFetchRequestAction = { type: typeof TAGS_FETCH_REQUEST }
export type TagsFetchSuccessAction = {
  type: typeof TAGS_FETCH_SUCCESS
  payload: { items: TagListItem[] }
}
export type TagsFetchFailureAction = {
  type: typeof TAGS_FETCH_FAILURE
  payload: { message: string }
}

export type TagsDetailRequestAction = {
  type: typeof TAGS_DETAIL_REQUEST
  payload: { id: number }
}
export type TagsDetailSuccessAction = {
  type: typeof TAGS_DETAIL_SUCCESS
  payload: { detail: TagDetail }
}
export type TagsDetailFailureAction = {
  type: typeof TAGS_DETAIL_FAILURE
  payload: { message: string }
}
export type TagsDetailClearAction = { type: typeof TAGS_DETAIL_CLEAR }

export type TagsSaveRequestAction = {
  type: typeof TAGS_SAVE_REQUEST
  payload: { id?: number; values: TagFormInput }
}
export type TagsSaveSuccessAction = { type: typeof TAGS_SAVE_SUCCESS }
export type TagsSaveFailureAction = {
  type: typeof TAGS_SAVE_FAILURE
  payload: { message: string; fieldErrors: ApiFieldError[] }
}

export type TagsDeleteRequestAction = {
  type: typeof TAGS_DELETE_REQUEST
  payload: { id: number }
}
export type TagsDeleteSuccessAction = { type: typeof TAGS_DELETE_SUCCESS }
export type TagsDeleteFailureAction = {
  type: typeof TAGS_DELETE_FAILURE
  payload: { message: string }
}

export type TagsAction =
  | TagsFetchRequestAction
  | TagsFetchSuccessAction
  | TagsFetchFailureAction
  | TagsDetailRequestAction
  | TagsDetailSuccessAction
  | TagsDetailFailureAction
  | TagsDetailClearAction
  | TagsSaveRequestAction
  | TagsSaveSuccessAction
  | TagsSaveFailureAction
  | TagsDeleteRequestAction
  | TagsDeleteSuccessAction
  | TagsDeleteFailureAction

export const tagsActions = {
  fetchRequest: (): TagsFetchRequestAction => ({ type: TAGS_FETCH_REQUEST }),
  fetchSuccess: (items: TagListItem[]): TagsFetchSuccessAction => ({
    type: TAGS_FETCH_SUCCESS,
    payload: { items },
  }),
  fetchFailure: (message: string): TagsFetchFailureAction => ({
    type: TAGS_FETCH_FAILURE,
    payload: { message },
  }),
  detailRequest: (id: number): TagsDetailRequestAction => ({
    type: TAGS_DETAIL_REQUEST,
    payload: { id },
  }),
  detailSuccess: (detail: TagDetail): TagsDetailSuccessAction => ({
    type: TAGS_DETAIL_SUCCESS,
    payload: { detail },
  }),
  detailFailure: (message: string): TagsDetailFailureAction => ({
    type: TAGS_DETAIL_FAILURE,
    payload: { message },
  }),
  detailClear: (): TagsDetailClearAction => ({ type: TAGS_DETAIL_CLEAR }),
  saveRequest: (values: TagFormInput, id?: number): TagsSaveRequestAction => ({
    type: TAGS_SAVE_REQUEST,
    payload: { id, values },
  }),
  saveSuccess: (): TagsSaveSuccessAction => ({ type: TAGS_SAVE_SUCCESS }),
  saveFailure: (
    message: string,
    fieldErrors: ApiFieldError[] = [],
  ): TagsSaveFailureAction => ({
    type: TAGS_SAVE_FAILURE,
    payload: { message, fieldErrors },
  }),
  deleteRequest: (id: number): TagsDeleteRequestAction => ({
    type: TAGS_DELETE_REQUEST,
    payload: { id },
  }),
  deleteSuccess: (): TagsDeleteSuccessAction => ({ type: TAGS_DELETE_SUCCESS }),
  deleteFailure: (message: string): TagsDeleteFailureAction => ({
    type: TAGS_DELETE_FAILURE,
    payload: { message },
  }),
}
