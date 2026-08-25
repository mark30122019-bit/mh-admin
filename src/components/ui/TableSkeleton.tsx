import { Skeleton } from 'antd'
import { TABLE_ROW_HEIGHT_PX, TAGS_TABLE_ROW_HEIGHT_PX } from '@/api'

export type TableSkeletonColumn = {
  key: string
  /** Фиксированная ширина; для grow — flex-basis. */
  width: number
  /** Резиновая колонка — забирает свободное место. */
  grow?: boolean
  variant?: 'text' | 'thumb' | 'avatar' | 'actions' | 'tags' | 'id' | 'date'
}

type TableSkeletonDensity = 'small' | 'default'

type TableSkeletonProps = {
  columns: TableSkeletonColumn[]
  rows?: number
  rowHeight?: number
  /** Рамка; выкл., если уже внутри AdminTableShell. */
  bordered?: boolean
  /** Как у Ant Table: posts = small, authors/tags = default. */
  density?: TableSkeletonDensity
}

const PRESETS = {
  posts: [
    { key: 'id', width: 64, variant: 'id' },
    { key: 'preview', width: 92, variant: 'thumb' },
    { key: 'title', width: 160, grow: true, variant: 'text' },
    { key: 'author', width: 120, grow: true, variant: 'text' },
    { key: 'tags', width: 160, variant: 'tags' },
    { key: 'created', width: 120, variant: 'date' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  authors: [
    { key: 'id', width: 64, variant: 'id' },
    { key: 'avatar', width: 64, variant: 'avatar' },
    { key: 'name', width: 120, grow: true, variant: 'text' },
    { key: 'lastName', width: 120, grow: true, variant: 'text' },
    { key: 'secondName', width: 120, variant: 'text' },
    { key: 'created', width: 120, variant: 'date' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  tags: [
    { key: 'id', width: 64, variant: 'id' },
    { key: 'name', width: 160, grow: true, variant: 'text' },
    { key: 'code', width: 140, variant: 'text' },
    { key: 'priority', width: 96, variant: 'id' },
    { key: 'created', width: 120, variant: 'date' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
} as const satisfies Record<string, TableSkeletonColumn[]>

export type TableSkeletonPreset = keyof typeof PRESETS

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
  if (variant === 'date') return Math.min(92, width - 24)
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
        style={{ width: 48, height: 34, minWidth: 48, borderRadius: 4 }}
      />
    )
  }
  if (variant === 'actions') {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
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
          style={{ width: 52, height: 22, minWidth: 52, borderRadius: 4 }}
        />
        <Skeleton.Button
          active
          size="small"
          style={{ width: 44, height: 22, minWidth: 44, borderRadius: 4 }}
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
        height: 14,
      }}
    />
  )
}

/** Скелетон в габаритах реальной таблицы: шапка + ряды + колонки. */
export function TableSkeleton({
  columns,
  rows = 9,
  rowHeight,
  bordered = true,
  density = 'default',
}: TableSkeletonProps) {
  const metrics = DENSITY[density]
  const finalRowHeight = rowHeight ?? metrics.rowHeight
  const totalHeight = metrics.headerHeight + rows * finalRowHeight

  return (
    <div
      className={
        bordered
          ? 'w-full overflow-hidden rounded-lg border border-[#f0f0f0]'
          : 'w-full overflow-hidden'
      }
      style={{ height: totalHeight }}
    >
      <div
        className="flex items-center border-b border-[#f0f0f0] bg-[#fafafa]"
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

      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center border-[#f0f0f0]"
          style={{
            height: finalRowHeight,
            paddingLeft: metrics.cellPadX,
            paddingRight: metrics.cellPadX,
            borderBottom: index === rows - 1 ? 'none' : '1px solid #f0f0f0',
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="box-border flex min-w-0 items-center overflow-hidden"
              style={{
                flex: columnFlex(column),
                width: column.grow ? undefined : column.width,
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
    <div className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <Skeleton.Input active style={{ width: 120, height: 28 }} />
          <Skeleton.Button active style={{ width: 128, height: 32 }} />
        </div>
        <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2.5">
          <Skeleton.Input active style={{ width: 260, height: 32 }} />
          <Skeleton.Input active style={{ width: 180, height: 32 }} />
          <Skeleton.Button active style={{ width: 32, height: 32 }} />
        </div>
        <div className="admin-table-shell w-full overflow-hidden">
          <TableSkeleton
            columns={getTableSkeletonPreset('posts')}
            rows={9}
            rowHeight={TABLE_ROW_HEIGHT_PX}
            density="small"
            bordered={false}
          />
        </div>
      </div>
    </div>
  )
}
