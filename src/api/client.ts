import { API_BASE_URL } from './constants'

/**
 * HTTP-клиент для REST API.
 * TODO: подключить axios, интерцепторы авторизации и refresh-токена при 401.
 */
export const apiClient = {
  baseURL: API_BASE_URL,
}
