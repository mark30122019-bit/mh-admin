import { Popconfirm as AntPopconfirm } from 'antd'
import type { PopconfirmProps } from 'antd'

export type { PopconfirmProps }

/** Подтверждение опасных действий (удаление). */
export function Popconfirm(props: PopconfirmProps) {
  return (
    <AntPopconfirm
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{ danger: true }}
      {...props}
    />
  )
}
