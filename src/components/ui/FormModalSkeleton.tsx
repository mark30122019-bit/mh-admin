import { UserOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'

/** Высота шапки Quill (`.ql-toolbar`) в теме snow. */
export const RICH_TEXT_TOOLBAR_HEIGHT_PX = 42

/** Скелетон однострочного инпута / Select (высота Ant Input ≈ 32). */
export function FormInputSkeleton({ height = 32 }: { height?: number }) {
  return <Skeleton.Input active block style={{ height, minWidth: 0 }} />
}

/** Скелетон аватара: 120×120 + UserOutlined, как пустая ImageUploadCard. */
export function FormAvatarSkeleton() {
  return (
    <span className="form-upload-skeleton form-upload-skeleton--avatar">
      <Skeleton.Node
        active
        style={{ width: 120, height: 120, borderRadius: '50%' }}
      >
        <UserOutlined style={{ fontSize: 36, color: 'rgba(0, 0, 0, 0.25)' }} />
      </Skeleton.Node>
    </span>
  )
}

/** Скелетон баннера превью поста (220×124, как ImageUploadCard banner) + SVG. */
export function FormBannerSkeleton() {
  return (
    <span className="form-upload-skeleton form-upload-skeleton--banner">
      <Skeleton.Image active />
    </span>
  )
}

/** Скелетон многострочного текста. */
export function FormTextAreaSkeleton({ height }: { height: number }) {
  return <Skeleton.Input active block style={{ height, minWidth: 0 }} />
}

/**
 * Скелетон RichTextEditor: шапка тулбара (42px) + тело редактора.
 * `editorHeight` — высота `.ql-editor` / `.ql-container` (обычно 200).
 */
export function FormRichTextSkeleton({
  editorHeight = 200,
}: {
  editorHeight?: number
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[#d9d9d9]">
      <div
        className="flex items-center border-b border-[#d9d9d9] bg-[#fafafa] px-3"
        style={{ height: RICH_TEXT_TOOLBAR_HEIGHT_PX }}
      >
        <Skeleton.Button
          active
          size="small"
          style={{ width: 72, height: 24, minWidth: 72 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 28, height: 24, minWidth: 28, marginLeft: 8 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 28, height: 24, minWidth: 28, marginLeft: 4 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 28, height: 24, minWidth: 28, marginLeft: 8 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 28, height: 24, minWidth: 28, marginLeft: 4 }}
        />
      </div>
      <Skeleton.Input
        active
        block
        style={{ height: editorHeight, minWidth: 0, borderRadius: 0 }}
      />
    </div>
  )
}
