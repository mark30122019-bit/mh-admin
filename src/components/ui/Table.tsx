import { Table as AntTable } from 'antd'
import type { TableProps } from 'antd'

export type { TableProps }

type AppTableType = typeof AntTable

/**
 * Таблица списков (посты, авторы, теги).
 * Пагинацию по умолчанию отключаем — управляем через Pagination + headers API.
 */
export const Table = Object.assign(
  function Table<RecordType extends object = Record<string, unknown>>(
    props: TableProps<RecordType>,
  ) {
    return <AntTable<RecordType> rowKey="id" pagination={false} {...props} />
  },
  {
    Summary: AntTable.Summary,
    EXPAND_COLUMN: AntTable.EXPAND_COLUMN,
    SELECTION_COLUMN: AntTable.SELECTION_COLUMN,
    SELECTION_ALL: AntTable.SELECTION_ALL,
    SELECTION_INVERT: AntTable.SELECTION_INVERT,
    SELECTION_NONE: AntTable.SELECTION_NONE,
    Column: AntTable.Column,
    ColumnGroup: AntTable.ColumnGroup,
  },
) as AppTableType
