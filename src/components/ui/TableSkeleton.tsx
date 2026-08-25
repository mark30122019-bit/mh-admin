import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Skeleton, Space } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import { TABLE_ROW_HEIGHT_PX, TAGS_TABLE_ROW_HEIGHT_PX } from '@/api'
import {
  POSTS_TABLE_COLS,
  POSTS_TABLE_PREVIEW,
  TABLE_SKELETON_TEXT_HEIGHT_PX,
} from '@/utils/tableColumns'
import { Button } from './Button'

export type TableSkeletonColumn = {
  key: string
  width: number
  grow?: boolean
  variant?: 'text' | 'thumb' | 'avatar' | 'actions' | 'tags' | 'id' | 'date'
}

type TableSkeletonDensity = 'small' | 'default'

type TableSkeletonProps = {
  columns: TableSkeletonColumn[]
  rows?: number
  /** @deprecated Высота ряда; при fill игнорируется. */
  rowHeight?: number
  bordered?: boolean
  density?: TableSkeletonDensity
  /**
   * Как живая таблица: на всю высоту shell, ряды делят пространство поровну (flex-1).
   */
  fill?: boolean
}

const PRESETS = {
  posts: [
    { key: 'id', width: 56, variant: 'id' },
    { key: 'preview', width: POSTS_TABLE_COLS.preview, variant: 'thumb' },
    { key: 'title', width: 180, variant: 'text' },
    { key: 'author', width: 140, variant: 'text' },
    { key: 'tags', width: 168, variant: 'tags' },
    { key: 'created', width: 112, variant: 'date' },
    { key: 'actions', width: 88, variant: 'actions' },
  ],
  authors: [
    { key: 'id', width: 56, variant: 'id' },
    { key: 'avatar', width: 72, variant: 'avatar' },
    { key: 'name', width: 120, variant: 'text' },
    { key: 'lastName', width: 120, variant: 'text' },
    { key: 'secondName', width: 100, variant: 'text' },
    { key: 'created', width: 112, variant: 'date' },
    { key: 'actions', width: 88, variant: 'actions' },
  ],
  tags: [
    { key: 'id', width: 56, variant: 'id' },
    { key: 'name', width: 200, variant: 'text' },
    { key: 'code', width: 148, variant: 'text' },
    { key: 'priority', width: 80, variant: 'id' },
    { key: 'created', width: 112, variant: 'date' },
    { key: 'actions', width: 88, variant: 'actions' },
  ],
} as const satisfies Record<string, TableSkeletonColumn[]>

export type TableSkeletonPreset = keyof typeof PRESETS

export type TableSkeletonRow = {
  id: string
  __skeleton: true
}

export function isTableSkeletonRow(record: object): record is TableSkeletonRow {
  return (
    '__skeleton' in record &&
    (record as TableSkeletonRow).__skeleton === true
  )
}

/** Строки-заглушки для tbody, пока грузятся данные. */
export function buildTableSkeletonRows(count: number): TableSkeletonRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `__skeleton-${index}`,
    __skeleton: true as const,
  }))
}

function resolveColumnSkeletonKey(column: ColumnType<unknown>): string {
  if (column.key === 'actions' || column.key === 'avatar') {
    return String(column.key)
  }

  const dataIndex = column.dataIndex
  if (dataIndex === 'previewPicture') return 'preview'
  if (dataIndex === 'authorName') return 'author'
  if (dataIndex === 'tagNames') return 'tags'
  if (dataIndex === 'createdAt') return 'created'
  if (dataIndex === 'sort') return 'priority'
  if (typeof dataIndex === 'string') return dataIndex
  if (column.key != null) return String(column.key)
  return 'text'
}

/** Edit/Delete в колонке действий — видимы, но недоступны во время загрузки tbody. */
export function DisabledTableRowActions() {
  return (
    <Space size="middle">
      <Button type="text" disabled icon={<EditOutlined />} />
      <Button type="text" disabled icon={<DeleteOutlined />} />
    </Space>
  )
}

/**
 * Оборачивает колонки: при loading рендерит CellSkeleton только в tbody,
 * заголовки столбцов остаются реальными.
 */
export function wrapColumnsWithSkeletonLoading<T extends object>(
  columns: ColumnsType<T>,
  preset: TableSkeletonPreset,
  loading: boolean,
): ColumnsType<T | TableSkeletonRow> {
  if (!loading) {
    return columns as ColumnsType<T | TableSkeletonRow>
  }

  const skeletonByKey = new Map(
    getTableSkeletonPreset(preset).map((col) => [col.key, col]),
  )

  return columns.map((column) => {
    const col = column as ColumnType<T>
    const skeletonKey = resolveColumnSkeletonKey(col as ColumnType<unknown>)
    const skeletonCol = skeletonByKey.get(skeletonKey)
    const originalRender = col.render

    return {
      ...col,
      render: (value, record, index) => {
        if (isTableSkeletonRow(record)) {
          if (skeletonKey === 'actions') {
            return <DisabledTableRowActions />
          }
          if (!skeletonCol) return null
          return (
            <span className="admin-table-skeleton-cell">
              <CellSkeleton
                variant={skeletonCol.variant}
                width={skeletonCol.width}
                grow={skeletonCol.grow}
                rowIndex={index}
              />
            </span>
          )
        }

        if (originalRender) {
          return originalRender(value, record as T, index) as ReactNode
        }

        return value as ReactNode
      },
    }
  }) as ColumnsType<T | TableSkeletonRow>
}

const DENSITY = {
  small: {
    headerHeight: 39,
    rowHeight: TABLE_ROW_HEIGHT_PX,
    cellPadX: 14,
  },
  default: {
    headerHeight: 47,
    rowHeight: TAGS_TABLE_ROW_HEIGHT_PX,
    cellPadX: 16,
  },
} as const

function columnFlex(column: TableSkeletonColumn): string {
  return column.grow ? `1 1 ${column.width}px` : `0 0 ${column.width}px`
}

function textBarWidth(
  variant: TableSkeletonColumn['variant'],
  width: number,
  grow: boolean | undefined,
  rowIndex: number,
): number | string {
  const wave = [0.72, 0.58, 0.85, 0.64, 0.78, 0.55, 0.9, 0.68, 0.6][rowIndex % 9]

  if (variant === 'id') return Math.min(36, width - 24)
  if (variant === 'date') return Math.min(120, width - 28)
  if (grow) return `${Math.round(wave * 100)}%`
  return Math.max(40, Math.round((width - 28) * wave))
}

function CellSkeleton({
  variant = 'text',
  width,
  grow,
  rowIndex,
}: {
  variant?: TableSkeletonColumn['variant']
  width: number
  grow?: boolean
  rowIndex: number
}) {
  if (variant === 'avatar') {
    return <Skeleton.Avatar active size={36} shape="circle" />
  }
  if (variant === 'thumb') {
    return (
      <Skeleton.Button
        active
        size="small"
        style={{
          width: POSTS_TABLE_PREVIEW.width,
          height: POSTS_TABLE_PREVIEW.height,
          minWidth: POSTS_TABLE_PREVIEW.width,
          borderRadius: 4,
        }}
      />
    )
  }
  if (variant === 'actions') {
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Skeleton.Avatar active size={18} shape="square" />
        <Skeleton.Avatar active size={18} shape="square" />
      </div>
    )
  }
  if (variant === 'tags') {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Skeleton.Button
          active
          size="small"
          style={{ width: 52, height: 24, minWidth: 52, borderRadius: 4 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 44, height: 24, minWidth: 44, borderRadius: 4 }}
        />
      </div>
    )
  }

  return (
    <Skeleton.Input
      active
      size="small"
      style={{
        width: textBarWidth(variant, width, grow, rowIndex),
        maxWidth: grow ? '92%' : width - 24,
        minWidth: 28,
        height: TABLE_SKELETON_TEXT_HEIGHT_PX,
      }}
    />
  )
}

/** Скелетон в габаритах реальной таблицы: шапка + ряды как у данных. */
export function TableSkeleton({
  columns,
  rows = 9,
  rowHeight,
  bordered = true,
  density = 'default',
  fill = false,
}: TableSkeletonProps) {
  const metrics = DENSITY[density]
  const finalRowHeight = rowHeight ?? metrics.rowHeight

  return (
    <div
      className={[
        'flex w-full flex-col overflow-hidden',
        fill ? 'h-full min-h-0' : '',
        bordered ? 'rounded-lg border border-[#f0f0f0]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={fill ? undefined : { height: metrics.headerHeight + rows * finalRowHeight }}
    >
      <div
        className="flex shrink-0 items-center border-b border-[#f0f0f0] bg-[#fafafa]"
        style={{
          height: metrics.headerHeight,
          paddingLeft: metrics.cellPadX,
          paddingRight: metrics.cellPadX,
        }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="box-border min-w-0"
            style={{
              flex: columnFlex(column),
              width: column.grow ? undefined : column.width,
            }}
          >
            <Skeleton.Input
              active
              size="small"
              style={{
                width: Math.min(column.width - 20, column.grow ? 88 : 64),
                height: 12,
                minWidth: 28,
              }}
            />
          </div>
        ))}
      </div>

      <div className={fill ? 'flex min-h-0 flex-1 flex-col' : undefined}>
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className={[
              'flex items-center border-[#f0f0f0]',
              fill ? 'min-h-0 flex-1' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              height: fill ? undefined : finalRowHeight,
              paddingLeft: metrics.cellPadX,
              paddingRight: metrics.cellPadX,
              borderBottom: index === rows - 1 ? 'none' : '1px solid #f0f0f0',
            }}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="box-border flex min-h-0 min-w-0 items-center overflow-hidden"
                style={{
                  flex: columnFlex(column),
                  width: column.grow ? undefined : column.width,
                  height: 0,
                }}
              >
                <CellSkeleton
                  variant={column.variant}
                  width={column.width}
                  grow={column.grow}
                  rowIndex={index}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function getTableSkeletonPreset(
  preset: TableSkeletonPreset,
): TableSkeletonColumn[] {
  return [...PRESETS[preset]]
}

/** Скелетон страницы внутри MainLayout при lazy-load чанка. */
export function PageContentSkeleton() {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
      <div className="admin-page-frame-card flex min-h-0 flex-1 flex-col rounded-lg bg-white p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="admin-page-toolbar mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <Skeleton.Input active style={{ width: 120, height: 28 }} />
          <Skeleton.Button active style={{ width: 128, height: 32 }} />
        </div>
        <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2.5">
          <Skeleton.Input active style={{ width: 260, height: 32 }} />
          <Skeleton.Input active style={{ width: 180, height: 32 }} />
          <Skeleton.Button active style={{ width: 32, height: 32 }} />
        </div>
        <div className="admin-table-shell min-h-0 w-full flex-1 overflow-hidden">
          <TableSkeleton
            columns={getTableSkeletonPreset('posts')}
            rows={9}
            density="small"
            bordered={false}
            fill
          />
        </div>
      </div>
    </div>
  )
}
