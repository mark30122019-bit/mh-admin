export {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  TOKEN_COOKIE_KEYS,
  apiClient,
  fetchProfileRequest,
  getBadRequestMessage,
  getValidationErrors,
  isBadRequestError,
  isValidationError,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  hasAuthTokens,
  setAuthTokens,
  parseApiError,
  mapFieldErrorsToFormFields,
  setSessionExpiredHandler,
  notifySessionExpired,
} from './core'
export type { ParsedApiError } from './core'
export type {
  ApiBadRequestResponse,
  ApiFieldError,
  ApiValidationErrors,
  AuthTokenResponse,
  LoginCredentials,
  UserProfile,
} from './core'

export { loginRequest, refreshTokenRequest } from './auth'

export {
  createPost,
  deletePost,
  fetchPostDetail,
  fetchPostsList,
  updatePost,
} from './posts'
export type {
  FetchPostsParams,
  PostDetail,
  PostFormInput,
  PostFormPayload,
  PostListItem,
  PostsListResponse,
} from './posts'

export {
  createAuthor,
  deleteAuthor,
  fetchAuthorDetail,
  fetchAuthorsList,
  updateAuthor,
} from './authors'
export type {
  AuthorDetail,
  AuthorFormPayload,
  AuthorListItem,
} from './authors'

export {
  createTag,
  deleteTag,
  fetchTagDetail,
  fetchTagsList,
  updateTag,
} from './tags'
export type {
  TagDetail,
  TagFormInput,
  TagFormPayload,
  TagListItem,
} from './tags'

export {
  LIST_PAGE_SIZE,
  TABLE_ROW_HEIGHT_PX,
  POSTS_FIRST_PAGE_MIN_ROWS,
  getPostsFirstPageMinHeight,
  parsePaginationHeaders,
} from './shared'
export type { ApiPagination, PaginatedListResponse } from './shared'
