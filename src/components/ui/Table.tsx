import { Table as AntTable } from 'antd'
import type { TableProps } from 'antd'

export type { TableProps }

type AppTableType = typeof AntTable

function mergeClassName(
  ...parts: Array<string | undefined>
): string | undefined {
  const value = parts.filter(Boolean).join(' ').trim()
  return value || undefined
}

/**
 * Таблица списков (посты, авторы, теги).
 * Пагинация по умолчанию отключена — управляется снаружи.
 * tableLayout=fixed + admin-data-table: длинный текст не раздувает колонки.
 */
export const Table = Object.assign(
  function Table<RecordType extends object = Record<string, unknown>>(
    props: TableProps<RecordType>,
  ) {
    const { className, tableLayout, ...rest } = props
    return (
      <AntTable<RecordType>
        rowKey="id"
        pagination={false}
        tableLayout={tableLayout ?? 'fixed'}
        className={mergeClassName('admin-data-table', className)}
        {...rest}
      />
    )
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
