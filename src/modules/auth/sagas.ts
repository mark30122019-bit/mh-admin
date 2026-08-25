import axios from 'axios'
import { push } from 'connected-react-router'
import type { SagaIterator } from 'redux-saga'
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import {
  clearAuthTokens,
  fetchProfileRequest,
  getAccessToken,
  getBadRequestMessage,
  getRefreshToken,
  getValidationErrors,
  hasAuthTokens,
  loginRequest,
  refreshTokenRequest,
  setAuthTokens,
} from '@/api'
import {
  AUTH_INIT,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT,
  AUTH_SESSION_EXPIRED,
  authActions,
} from './actions'
import type { AuthLoginRequestAction } from './actions'

function* loginWorker(action: AuthLoginRequestAction): SagaIterator {
  try {
    const tokens = yield call(loginRequest, action.payload)
    setAuthTokens(tokens)

    const profile = yield call(fetchProfileRequest)
    yield put(authActions.loginSuccess(profile))
    yield put(push('/posts'))
  } catch (error) {
    clearAuthTokens()

    const validationErrors = getValidationErrors(error)
    if (validationErrors.length > 0) {
      yield put(
        authActions.loginFailure(
          validationErrors.map(({ message }) => message).join(', '),
        ),
      )
      return
    }

    const badRequestMessage = getBadRequestMessage(error)
    if (badRequestMessage) {
      yield put(authActions.loginFailure(badRequestMessage))
      return
    }

    if (axios.isAxiosError(error)) {
      yield put(
        authActions.loginFailure(
          error.response?.data?.message ?? error.message ?? 'Login failed',
        ),
      )
      return
    }

    yield put(authActions.loginFailure('Login failed'))
  }
}

function* restoreSessionWorker(): SagaIterator {
  if (!hasAuthTokens()) {
    yield put(authActions.initFailure())
    return
  }

  try {
    if (!getAccessToken() && getRefreshToken()) {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        yield put(authActions.initFailure())
        return
      }

      const tokens = yield call(refreshTokenRequest, refreshToken)
      setAuthTokens(tokens)
    }

    const profile = yield call(fetchProfileRequest)
    yield put(authActions.initSuccess(profile))
  } catch {
    clearAuthTokens()
    yield put(authActions.initFailure())
  }
}

function* logoutWorker(): SagaIterator {
  clearAuthTokens()
  yield put(authActions.logoutSuccess())
  yield put(push('/login'))
}

/** Провал refresh в Axios → SESSION_EXPIRED → сброс стейта + /login. */
function* sessionExpiredWorker(): SagaIterator {
  clearAuthTokens()
  yield put(push('/login'))
}

export function* authSaga(): SagaIterator {
  yield takeLatest(AUTH_LOGIN_REQUEST, loginWorker)
  yield takeLeading(AUTH_INIT, restoreSessionWorker)
  yield takeLatest(AUTH_LOGOUT, logoutWorker)
  yield takeLatest(AUTH_SESSION_EXPIRED, sessionExpiredWorker)
}
