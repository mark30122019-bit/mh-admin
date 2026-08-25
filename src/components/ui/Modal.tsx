import { Modal as AntModal } from 'antd'
import type { ModalFuncProps, ModalProps } from 'antd'

export type { ModalFuncProps, ModalProps }

type AppModalType = typeof AntModal

/** Модальное окно для форм добавления/редактирования сущностей. */
export const Modal = Object.assign(
  function Modal(props: ModalProps) {
    return <AntModal destroyOnHidden maskClosable={false} {...props} />
  },
  {
    info: AntModal.info,
    success: AntModal.success,
    error: AntModal.error,
    warning: AntModal.warning,
    confirm: AntModal.confirm,
    useModal: AntModal.useModal,
    destroyAll: AntModal.destroyAll,
  },
) as AppModalType
