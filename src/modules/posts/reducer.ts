import type { AnyAction } from 'redux'
import type {
  ApiFieldError,
  ApiPagination,
  AuthorListItem,
  PostDetail,
  PostListItem,
  TagListItem,
} from '@/api'
import { LIST_PAGE_SIZE } from '@/api'
import type { PostsAction } from './actions'
import {
  POSTS_DELETE_FAILURE,
  POSTS_DELETE_REQUEST,
  POSTS_DELETE_SUCCESS,
  POSTS_DETAIL_CLEAR,
  POSTS_DETAIL_FAILURE,
  POSTS_DETAIL_REQUEST,
  POSTS_DETAIL_SUCCESS,
  POSTS_FETCH_FAILURE,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
  POSTS_REFERENCES_FAILURE,
  POSTS_REFERENCES_REQUEST,
  POSTS_REFERENCES_SUCCESS,
  POSTS_SAVE_FAILURE,
  POSTS_SAVE_REQUEST,
  POSTS_SAVE_SUCCESS,
} from './actions'

export interface PostsState {
  items: PostListItem[]
  pagination: ApiPagination
  loading: boolean
  error: string | null
  detail: PostDetail | null
  detailLoading: boolean
  detailError: string | null
  saving: boolean
  saveError: string | null
  saveFieldErrors: ApiFieldError[]
  deletingId: number | null
  deleteError: string | null
  authorOptions: AuthorListItem[]
  tagOptions: TagListItem[]
  referencesLoading: boolean
  referencesError: string | null
}

const initialPagination: ApiPagination = {
  currentPage: 1,
  pageCount: 1,
  perPage: LIST_PAGE_SIZE.posts,
  totalCount: 0,
}

const initialState: PostsState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  detail: null,
  detailLoading: false,
  detailError: null,
  saving: false,
  saveError: null,
  saveFieldErrors: [],
  deletingId: null,
  deleteError: null,
  authorOptions: [],
  tagOptions: [],
  referencesLoading: false,
  referencesError: null,
}

export function postsReducer(
  state: PostsState = initialState,
  action: AnyAction,
): PostsState {
  const postsAction = action as PostsAction

  switch (postsAction.type) {
    case POSTS_FETCH_REQUEST: {
      const nextPage = postsAction.payload.page
      const isPageChange = state.pagination.currentPage !== nextPage
      return {
        ...state,
        // Скелетон только при первой загрузке или смене страницы — не при возврате в раздел.
        loading: state.items.length === 0 || isPageChange,
        error: null,
        pagination: {
          ...state.pagination,
          currentPage: nextPage,
        },
      }
    }
    case POSTS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: postsAction.payload.items,
        pagination: postsAction.payload.pagination,
      }
    case POSTS_FETCH_FAILURE:
      return { ...state, loading: false, error: postsAction.payload.message }
    case POSTS_DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: true,
        detail: null,
        detailError: null,
      }
    case POSTS_DETAIL_SUCCESS:
      return {
        ...state,
        detailLoading: false,
        detailError: null,
        detail: postsAction.payload.detail,
      }
    case POSTS_DETAIL_FAILURE:
      return {
        ...state,
        detailLoading: false,
        detail: null,
        detailError: postsAction.payload.message,
      }
    case POSTS_DETAIL_CLEAR:
      return {
        ...state,
        detail: null,
        detailError: null,
        saveError: null,
        saveFieldErrors: [],
        referencesError: null,
      }
    case POSTS_SAVE_REQUEST:
      return {
        ...state,
        saving: true,
        saveError: null,
        saveFieldErrors: [],
      }
    case POSTS_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        detail: null,
        saveError: null,
        saveFieldErrors: [],
      }
    case POSTS_SAVE_FAILURE:
      return {
        ...state,
        saving: false,
        saveError: postsAction.payload.message,
        saveFieldErrors: postsAction.payload.fieldErrors,
      }
    case POSTS_DELETE_REQUEST:
      return {
        ...state,
        deletingId: postsAction.payload.id,
        deleteError: null,
      }
    case POSTS_DELETE_SUCCESS:
      return { ...state, deletingId: null, deleteError: null }
    case POSTS_DELETE_FAILURE:
      return {
        ...state,
        deletingId: null,
        deleteError: postsAction.payload.message,
      }
    case POSTS_REFERENCES_REQUEST:
      return {
        ...state,
        referencesLoading: true,
        referencesError: null,
      }
    case POSTS_REFERENCES_SUCCESS:
      return {
        ...state,
        referencesLoading: false,
        referencesError: null,
        authorOptions: postsAction.payload.authors,
        tagOptions: postsAction.payload.tags,
      }
    case POSTS_REFERENCES_FAILURE:
      return {
        ...state,
        referencesLoading: false,
        referencesError: postsAction.payload.message,
      }
    default:
      return state
  }
}
