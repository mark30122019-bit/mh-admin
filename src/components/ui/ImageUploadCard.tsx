import { CameraOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { ReactNode } from 'react'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

type ImageUploadCardProps = {
  variant: 'avatar' | 'banner'
  imageUrl: string | null
  replaceLabel: string
  emptyLabel?: string
  /** Инициалы вместо иконки (аватар), когда фото ещё нет */
  initials?: string | null
  disabled?: boolean
  hasError?: boolean
  onSelect: (file: File) => void
}

/**
 * Карточка выбора изображения без списка Upload и без lightbox.
 * Локальный превью — через imageUrl; выбор файла уходит в onSelect (далее кроп).
 */
export function ImageUploadCard({
  variant,
  imageUrl,
  replaceLabel,
  emptyLabel,
  initials = null,
  disabled = false,
  hasError = false,
  onSelect,
}: ImageUploadCardProps) {
  const isAvatar = variant === 'avatar'

  const shellClass = [
    'group relative flex cursor-pointer items-center justify-center overflow-hidden',
    'border bg-[#fafafa] transition-colors',
    imageUrl ? 'border-solid border-[#d9d9d9]' : 'border-dashed',
    !disabled ? 'hover:border-[#1677ff] hover:bg-[#f0f5ff]' : '',
    hasError ? 'border-[#ff4d4f]' : 'border-[#d9d9d9]',
    disabled ? 'cursor-not-allowed opacity-60' : '',
    isAvatar
      ? 'h-[120px] w-[120px] rounded-full'
      : 'aspect-video w-[220px] rounded-lg',
  ]
    .filter(Boolean)
    .join(' ')

  const handleSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return Upload.LIST_IGNORE
    }
    onSelect(file)
    return false
  }

  let emptyContent: ReactNode
  if (isAvatar && initials) {
    emptyContent = (
      <span
        className="flex h-full w-full items-center justify-center select-none"
        style={{
          color: '#1677ff',
          fontSize: 36,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </span>
    )
  } else if (isAvatar) {
    emptyContent = (
      <UserOutlined style={{ fontSize: 36, color: 'rgba(0, 0, 0, 0.25)' }} />
    )
  } else {
    emptyContent = (
      <div className="flex flex-col items-center gap-1 px-3 text-center">
        <PlusOutlined style={{ fontSize: 22, color: 'rgba(0, 0, 0, 0.35)' }} />
        {emptyLabel ? (
          <span className="text-xs leading-tight text-black/45">{emptyLabel}</span>
        ) : null}
      </div>
    )
  }

  return (
    <Upload
      accept={IMAGE_ACCEPT}
      showUploadList={false}
      maxCount={1}
      disabled={disabled}
      className="image-upload-card"
      beforeUpload={handleSelect}
    >
      <div className={shellClass} role="button" tabIndex={-1}>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div
              className={[
                'absolute inset-0 flex flex-col items-center justify-center gap-1',
                'bg-black/0 text-white opacity-0 transition-all',
                'group-hover:bg-black/45 group-hover:opacity-100',
              ].join(' ')}
            >
              <CameraOutlined style={{ fontSize: isAvatar ? 20 : 18 }} />
              <span className="px-2 text-center text-xs font-medium leading-tight">
                {replaceLabel}
              </span>
            </div>
          </>
        ) : (
          emptyContent
        )}
      </div>
    </Upload>
  )
}
