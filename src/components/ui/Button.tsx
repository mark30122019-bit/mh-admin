import { Button as AntButton } from 'antd'
import type { ButtonProps } from 'antd'

export type { ButtonProps }

/** Кнопка отправки форм и действий (loading из Ant Design). */
export function Button(props: ButtonProps) {
  return <AntButton {...props} />
}
