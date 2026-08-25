import { Skeleton } from 'antd'

type TableSkeletonProps = {
  /** Число строк-плейсхолдеров. */
  rows?: number
}

/** Скелетон области контента таблицы (вместо Spin overlay). */
export function TableSkeleton({ rows = 8 }: TableSkeletonProps) {
  return (
    <div className="w-full py-1">
      <Skeleton.Input active block style={{ height: 40, marginBottom: 16 }} />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton
          key={index}
          active
          title={false}
          paragraph={{ rows: 1, width: '100%' }}
          style={{ marginBottom: 12 }}
        />
      ))}
    </div>
  )
}

/** Скелетон страницы внутри MainLayout при lazy-load чанка. */
export function PageContentSkeleton() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        padding: '28px 32px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Skeleton.Input active style={{ width: 180, height: 32 }} />
        <Skeleton.Button active style={{ width: 120, height: 32 }} />
      </div>
      <TableSkeleton rows={9} />
    </div>
  )
}
