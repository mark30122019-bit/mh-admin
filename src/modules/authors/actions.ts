import type {
  ApiFieldError,
  AuthorDetail,
  AuthorFormPayload,
  AuthorListItem,
} from '@/api'

export const AUTHORS_FETCH_REQUEST = 'authors/FETCH_REQUEST' as const
export const AUTHORS_FETCH_SUCCESS = 'authors/FETCH_SUCCESS' as const
export const AUTHORS_FETCH_FAILURE = 'authors/FETCH_FAILURE' as const

export const AUTHORS_DETAIL_REQUEST = 'authors/DETAIL_REQUEST' as const
export const AUTHORS_DETAIL_SUCCESS = 'authors/DETAIL_SUCCESS' as const
export const AUTHORS_DETAIL_FAILURE = 'authors/DETAIL_FAILURE' as const
export const AUTHORS_DETAIL_CLEAR = 'authors/DETAIL_CLEAR' as const

export const AUTHORS_SAVE_REQUEST = 'authors/SAVE_REQUEST' as const
export const AUTHORS_SAVE_SUCCESS = 'authors/SAVE_SUCCESS' as const
export const AUTHORS_SAVE_FAILURE = 'authors/SAVE_FAILURE' as const

export const AUTHORS_DELETE_REQUEST = 'authors/DELETE_REQUEST' as const
export const AUTHORS_DELETE_SUCCESS = 'authors/DELETE_SUCCESS' as const
export const AUTHORS_DELETE_FAILURE = 'authors/DELETE_FAILURE' as const

export type AuthorsFetchRequestAction = { type: typeof AUTHORS_FETCH_REQUEST }
export type AuthorsFetchSuccessAction = {
  type: typeof AUTHORS_FETCH_SUCCESS
  payload: { items: AuthorListItem[] }
}
export type AuthorsFetchFailureAction = {
  type: typeof AUTHORS_FETCH_FAILURE
  payload: { message: string }
}

export type AuthorsDetailRequestAction = {
  type: typeof AUTHORS_DETAIL_REQUEST
  payload: { id: number }
}
export type AuthorsDetailSuccessAction = {
  type: typeof AUTHORS_DETAIL_SUCCESS
  payload: { detail: AuthorDetail }
}
export type AuthorsDetailFailureAction = {
  type: typeof AUTHORS_DETAIL_FAILURE
  payload: { message: string }
}
export type AuthorsDetailClearAction = { type: typeof AUTHORS_DETAIL_CLEAR }

export type AuthorsSaveRequestAction = {
  type: typeof AUTHORS_SAVE_REQUEST
  payload: { id?: number; values: AuthorFormPayload }
}
export type AuthorsSaveSuccessAction = { type: typeof AUTHORS_SAVE_SUCCESS }
export type AuthorsSaveFailureAction = {
  type: typeof AUTHORS_SAVE_FAILURE
  payload: { message: string; fieldErrors: ApiFieldError[] }
}

export type AuthorsDeleteRequestAction = {
  type: typeof AUTHORS_DELETE_REQUEST
  payload: { id: number }
}
export type AuthorsDeleteSuccessAction = { type: typeof AUTHORS_DELETE_SUCCESS }
export type AuthorsDeleteFailureAction = {
  type: typeof AUTHORS_DELETE_FAILURE
  payload: { message: string }
}

export type AuthorsAction =
  | AuthorsFetchRequestAction
  | AuthorsFetchSuccessAction
  | AuthorsFetchFailureAction
  | AuthorsDetailRequestAction
  | AuthorsDetailSuccessAction
  | AuthorsDetailFailureAction
  | AuthorsDetailClearAction
  | AuthorsSaveRequestAction
  | AuthorsSaveSuccessAction
  | AuthorsSaveFailureAction
  | AuthorsDeleteRequestAction
  | AuthorsDeleteSuccessAction
  | AuthorsDeleteFailureAction

export const authorsActions = {
  fetchRequest: (): AuthorsFetchRequestAction => ({ type: AUTHORS_FETCH_REQUEST }),
  fetchSuccess: (items: AuthorListItem[]): AuthorsFetchSuccessAction => ({
    type: AUTHORS_FETCH_SUCCESS,
    payload: { items },
  }),
  fetchFailure: (message: string): AuthorsFetchFailureAction => ({
    type: AUTHORS_FETCH_FAILURE,
    payload: { message },
  }),
  detailRequest: (id: number): AuthorsDetailRequestAction => ({
    type: AUTHORS_DETAIL_REQUEST,
    payload: { id },
  }),
  detailSuccess: (detail: AuthorDetail): AuthorsDetailSuccessAction => ({
    type: AUTHORS_DETAIL_SUCCESS,
    payload: { detail },
  }),
  detailFailure: (message: string): AuthorsDetailFailureAction => ({
    type: AUTHORS_DETAIL_FAILURE,
    payload: { message },
  }),
  detailClear: (): AuthorsDetailClearAction => ({ type: AUTHORS_DETAIL_CLEAR }),
  saveRequest: (
    values: AuthorFormPayload,
    id?: number,
  ): AuthorsSaveRequestAction => ({
    type: AUTHORS_SAVE_REQUEST,
    payload: { id, values },
  }),
  saveSuccess: (): AuthorsSaveSuccessAction => ({ type: AUTHORS_SAVE_SUCCESS }),
  saveFailure: (
    message: string,
    fieldErrors: ApiFieldError[] = [],
  ): AuthorsSaveFailureAction => ({
    type: AUTHORS_SAVE_FAILURE,
    payload: { message, fieldErrors },
  }),
  deleteRequest: (id: number): AuthorsDeleteRequestAction => ({
    type: AUTHORS_DELETE_REQUEST,
    payload: { id },
  }),
  deleteSuccess: (): AuthorsDeleteSuccessAction => ({ type: AUTHORS_DELETE_SUCCESS }),
  deleteFailure: (message: string): AuthorsDeleteFailureAction => ({
    type: AUTHORS_DELETE_FAILURE,
    payload: { message },
  }),
}
