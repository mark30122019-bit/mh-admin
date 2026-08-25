import { Skeleton } from 'antd'

/** Скелетон геометрии формы автора во время detailLoading. */
export function AuthorFormSkeleton() {
  return (
    <div className="py-1">
      <div className="mb-6 flex items-center gap-6">
        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 40, height: 14, marginBottom: 8 }}
            />
            <Skeleton.Input active block style={{ height: 32 }} />
          </div>
          <div>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 56, height: 14, marginBottom: 8 }}
            />
            <Skeleton.Input active block style={{ height: 32 }} />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <Skeleton.Input
            active
            size="small"
            style={{ width: 48, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Avatar active size={120} shape="circle" />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 64, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Input active block style={{ height: 32 }} />
        </div>
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 120, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Input active block style={{ height: 64 }} />
        </div>
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 72, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Input active block style={{ height: 120 }} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Skeleton.Button active style={{ width: 88, height: 32 }} />
        <Skeleton.Button active style={{ width: 96, height: 32 }} />
      </div>
    </div>
  )
}

/** Скелетон геометрии формы поста во время detailLoading. */
export function PostFormSkeleton() {
  return (
    <div className="py-1">
      <div className="mb-6 flex items-start gap-6">
        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 72, height: 14, marginBottom: 8 }}
            />
            <Skeleton.Input active block style={{ height: 32 }} />
          </div>
          <div>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 48, height: 14, marginBottom: 8 }}
            />
            <Skeleton.Input active block style={{ height: 32 }} />
          </div>
        </div>

        <div className="w-[220px] shrink-0">
          <Skeleton.Input
            active
            size="small"
            style={{ width: 56, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Image
            active
            style={{ width: 220, height: 124, borderRadius: 8 }}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 40, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Input active block style={{ height: 32 }} />
        </div>
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 40, height: 14, marginBottom: 8 }}
          />
          <Skeleton.Input active block style={{ height: 200 }} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Skeleton.Button active style={{ width: 88, height: 32 }} />
        <Skeleton.Button active style={{ width: 96, height: 32 }} />
      </div>
    </div>
  )
}
