import { Pagination as AntPagination } from 'antd'
import type { PaginationProps } from 'antd'

export type { PaginationProps }

/**
 * Постраничная навигация.
 * Данные (total, current, pageSize) берутся из заголовков ответа API.
 */
export function Pagination(props: PaginationProps) {
  return (
    <AntPagination
      showSizeChanger
      showTotal={(total, range) => `${range[0]}–${range[1]} из ${total}`}
      {...props}
    />
  )
}
