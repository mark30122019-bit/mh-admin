import { Space as AntSpace } from 'antd'
import type { SpaceProps } from 'antd'

export type { SpaceProps }

type AppSpaceType = typeof AntSpace

/** Отступы и выравнивание между кнопками действий в таблице. */
export const Space = Object.assign(
  function Space(props: SpaceProps) {
    return <AntSpace {...props} />
  },
  {
    Compact: AntSpace.Compact,
  },
) as AppSpaceType
