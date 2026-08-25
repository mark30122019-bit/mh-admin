import { message as antMessage, notification as antNotification } from 'antd'
import type { ArgsProps as MessageArgsProps } from 'antd/es/message'
import type { ArgsProps as NotificationArgsProps } from 'antd/es/notification'

export type { MessageArgsProps, NotificationArgsProps }

/** Короткие уведомления сверху (успех/ошибка операций). */
export const message = {
  success: (content: string, duration?: number) =>
    antMessage.success(content, duration),
  error: (content: string, duration?: number) =>
    antMessage.error(content, duration),
  warning: (content: string, duration?: number) =>
    antMessage.warning(content, duration),
  info: (content: string, duration?: number) =>
    antMessage.info(content, duration),
  loading: (content: string, duration?: number) =>
    antMessage.loading(content, duration),
  open: (config: MessageArgsProps) => antMessage.open(config),
  destroy: antMessage.destroy,
}

/** Детальные уведомления сбоку (системные и validation-ошибки API). */
export const notification = {
  success: (config: NotificationArgsProps) => antNotification.success(config),
  error: (config: NotificationArgsProps) => antNotification.error(config),
  warning: (config: NotificationArgsProps) => antNotification.warning(config),
  info: (config: NotificationArgsProps) => antNotification.info(config),
  open: (config: NotificationArgsProps) => antNotification.open(config),
  destroy: antNotification.destroy,
}

/** Показать список ошибок валидации API в notification. */
export function notifyApiErrors(
  title: string,
  errors: string[] | Record<string, string[] | string>,
) {
  const lines = Array.isArray(errors)
    ? errors
    : Object.entries(errors).flatMap(([field, value]) => {
        const messages = Array.isArray(value) ? value : [value]
        return messages.map((msg) => `${field}: ${msg}`)
      })

  notification.error({
    message: title,
    description: (
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    ),
    duration: 6,
  })
}
