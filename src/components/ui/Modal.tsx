import { Modal as AntModal } from 'antd'
import type { ModalFuncProps, ModalProps } from 'antd'

export type { ModalFuncProps, ModalProps }

type AppModalType = typeof AntModal

/**
 * Модальное окно для форм добавления/редактирования сущностей.
 * По умолчанию по центру экрана; тело скроллится, если не влезает по высоте.
 */
export const Modal = Object.assign(
  function Modal({ styles, ...props }: ModalProps) {
    return (
      <AntModal
        centered
        destroyOnHidden
        maskClosable={false}
        styles={{
          ...styles,
          body: {
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
            ...styles?.body,
          },
        }}
        {...props}
      />
    )
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
