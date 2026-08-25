import { Select as AntSelect } from 'antd'
import type { SelectProps } from 'antd'

export type { SelectProps }

type AppSelectType = typeof AntSelect

/** Выпадающий список (автор, статус поста и т.п.). */
export const Select = Object.assign(
  function Select<ValueType = unknown>(props: SelectProps<ValueType>) {
    return (
      <AntSelect<ValueType>
        allowClear
        showSearch
        optionFilterProp="label"
        {...props}
      />
    )
  },
  {
    Option: AntSelect.Option,
    OptGroup: AntSelect.OptGroup,
  },
) as AppSelectType
