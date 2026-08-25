/**
 * Мост между Axios-интерцептором и Redux-auth:
 * клиент не импортирует store напрямую (избегаем циклов).
 */
type SessionExpiredHandler = () => void

let sessionExpiredHandler: SessionExpiredHandler | null = null

export function setSessionExpiredHandler(
  handler: SessionExpiredHandler | null,
): void {
  sessionExpiredHandler = handler
}

export function notifySessionExpired(): void {
  sessionExpiredHandler?.()
}
