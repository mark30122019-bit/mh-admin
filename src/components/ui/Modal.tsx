import { Modal as AntModal } from 'antd'
import type { ModalFuncProps, ModalProps } from 'antd'
import type { CSSProperties } from 'react'

export type { ModalFuncProps, ModalProps }

type AppModalType = typeof AntModal

type ModalStylesObject = {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  mask?: CSSProperties
  wrapper?: CSSProperties
  content?: CSSProperties
  close?: CSSProperties
}

/**
 * Модальное окно для форм добавления/редактирования сущностей.
 * По умолчанию по центру экрана; тело скроллится, если не влезает по высоте.
 */
export const Modal = Object.assign(
  function Modal({ styles, ...props }: ModalProps) {
    const styleObject: ModalStylesObject =
      styles && typeof styles === 'object' ? (styles as ModalStylesObject) : {}

    return (
      <AntModal
        centered
        destroyOnHidden
        maskClosable={false}
        styles={{
          ...styleObject,
          body: {
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
            ...styleObject.body,
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
