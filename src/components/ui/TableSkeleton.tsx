import { Skeleton } from 'antd'
import { TABLE_ROW_HEIGHT_PX, TAGS_TABLE_ROW_HEIGHT_PX } from '@/api'

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
    { key: 'id', width: 64, variant: 'id' },
    { key: 'preview', width: 92, variant: 'thumb' },
    { key: 'title', width: 280, variant: 'text' },
    { key: 'author', width: 200, variant: 'text' },
    { key: 'tags', width: 320, variant: 'tags' },
    { key: 'created', width: 168, variant: 'date' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  authors: [
    { key: 'id', width: 64, variant: 'id' },
    { key: 'avatar', width: 96, variant: 'avatar' },
    { key: 'name', width: 180, variant: 'text' },
    { key: 'lastName', width: 180, variant: 'text' },
    { key: 'secondName', width: 140, variant: 'text' },
    { key: 'created', width: 168, variant: 'date' },
    { key: 'actions', width: 96, variant: 'actions' },
  ],
  tags: [
    { key: 'id', width: 64, variant: 'id' },
    { key: 'name', width: 320, variant: 'text' },
    { key: 'code', width: 220, variant: 'text' },
    { key: 'priority', width: 96, variant: 'id' },
    { key: 'created', width: 168, variant: 'date' },
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
        style={{ width: 48, height: 34, minWidth: 48, borderRadius: 4 }}
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
