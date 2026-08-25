import { Tag as AntTag } from 'antd'
import type { TagProps } from 'antd'

export type { TagProps }

type AppTagType = typeof AntTag

/** Цветные метки статусов постов и связанных тегов. */
export const Tag = Object.assign(
  function Tag(props: TagProps) {
    return <AntTag {...props} />
  },
  {
    CheckableTag: AntTag.CheckableTag,
  },
) as AppTagType
