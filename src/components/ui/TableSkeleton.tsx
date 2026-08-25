import { Skeleton } from 'antd'

export type TableSkeletonColumn = {
  key: string
  /** Фиксированная ширина; для grow — min-width / flex-basis. */
  width: number
  /** Резиновая колонка — забирает свободное место. */
  grow?: boolean
  variant?: 'text' | 'thumb' | 'avatar' | 'actions'
}

type TableSkeletonProps = {
  columns: TableSkeletonColumn[]
  rows?: number
  rowHeight?: number
  /** Рамка; выкл., если уже внутри AdminTableShell. */
  bordered?: boolean
}

const PRESETS = {
  posts: [
    { key: 'id', width: 64, variant: 'text' },
    { key: 'preview', width: 72, variant: 'thumb' },
    { key: 'title', width: 160, grow: true, variant: 'text' },
    { key: 'author', width: 120, grow: true, variant: 'text' },
    { key: 'tags', width: 160, variant: 'text' },
    { key: 'created', width: 120, variant: 'text' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  authors: [
    { key: 'id', width: 64, variant: 'text' },
    { key: 'avatar', width: 64, variant: 'avatar' },
    { key: 'name', width: 120, grow: true, variant: 'text' },
    { key: 'lastName', width: 120, grow: true, variant: 'text' },
    { key: 'secondName', width: 120, variant: 'text' },
    { key: 'created', width: 120, variant: 'text' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  tags: [
    { key: 'id', width: 64, variant: 'text' },
    { key: 'name', width: 160, grow: true, variant: 'text' },
    { key: 'code', width: 140, variant: 'text' },
    { key: 'priority', width: 96, variant: 'text' },
    { key: 'created', width: 120, variant: 'text' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
} as const satisfies Record<string, TableSkeletonColumn[]>

export type TableSkeletonPreset = keyof typeof PRESETS

function columnFlex(column: TableSkeletonColumn): string {
  return column.grow ? `1 1 ${column.width}px` : `0 0 ${column.width}px`
}

function CellSkeleton({
  variant = 'text',
  width,
  grow,
}: {
  variant?: TableSkeletonColumn['variant']
  width: number
  grow?: boolean
}) {
  if (variant === 'avatar') {
    return <Skeleton.Avatar active size={32} shape="circle" />
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
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton.Avatar active size={22} shape="square" />
        <Skeleton.Avatar active size={22} shape="square" />
      </div>
    )
  }
  return (
    <Skeleton.Input
      active
      size="small"
      style={{
        width: grow ? '70%' : Math.min(width - 16, 140),
        maxWidth: grow ? 220 : undefined,
        minWidth: 40,
        height: 16,
      }}
    />
  )
}

/** Скелетон в виде настоящей таблицы: шапка + колонки как у данных. */
export function TableSkeleton({
  columns,
  rows = 9,
  rowHeight = 48,
  bordered = true,
}: TableSkeletonProps) {
  return (
    <div
      className={
        bordered
          ? 'h-full w-full overflow-hidden rounded-lg border border-[#f0f0f0]'
          : 'h-full w-full overflow-hidden'
      }
    >
      <div className="flex items-center gap-3 border-b border-[#f0f0f0] bg-[#fafafa] px-3 py-2.5">
        {columns.map((column) => (
          <div
            key={column.key}
            className="min-w-0"
            style={{
              flex: columnFlex(column),
              width: column.grow ? undefined : column.width,
            }}
          >
            <Skeleton.Input
              active
              size="small"
              style={{
                width: Math.min(column.width - 8, 72),
                height: 12,
                minWidth: 32,
              }}
            />
          </div>
        ))}
      </div>

      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-[#f0f0f0] px-3"
          style={{
            height: rowHeight,
            borderBottom: index === rows - 1 ? 'none' : '1px solid #f0f0f0',
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex min-w-0 items-center overflow-hidden"
              style={{
                flex: columnFlex(column),
                width: column.grow ? undefined : column.width,
              }}
            >
              <CellSkeleton
                variant={column.variant}
                width={column.width}
                grow={column.grow}
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
          <Skeleton.Input active style={{ width: 160, height: 28 }} />
          <Skeleton.Button active style={{ width: 120, height: 32 }} />
        </div>
        <div className="admin-table-shell min-h-0 flex-1">
          <TableSkeleton
            columns={getTableSkeletonPreset('posts')}
            rows={9}
            bordered={false}
          />
        </div>
      </div>
    </div>
  )
}
