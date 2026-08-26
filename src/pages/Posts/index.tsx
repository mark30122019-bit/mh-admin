import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LIST_PAGE_SIZE } from '@/api'
import type { PostListItem } from '@/api'
import { AdminPageFrame, AdminTableShell } from '@/components/Layout'
import {
  Button,
  EllipsisTooltip,
  Modal,
  OverflowTags,
  Pagination,
  Space,
  Table,
  TableMediaImage,
  buildTableSkeletonRows,
  isTableSkeletonRow,
  message,
  notification,
  wrapColumnsWithSkeletonLoading,
} from '@/components/ui'
import { useDataRevalidation } from '@/hooks/useDataRevalidation'
import { useTableScrollY } from '@/hooks/useTableScrollY'
import { useTranslation } from '@/hooks/useTranslation'
import { postsActions } from '@/modules/posts/actions'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostsDeleteError,
  selectPostsDeletingId,
  selectPostsError,
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
} from '@/modules/posts/selectors'
import {
  resolvePostAuthorLabel,
  resolvePostTagLabels,
} from '@/utils/orphanLabels'
import {
  buildTablePageLayout,
  isTablePlaceholderRow,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import type { TableSkeletonRow } from '@/components/ui'
import {
  POSTS_TABLE_COLS,
  POSTS_TABLE_PREVIEW,
  tableFillStyle,
} from '@/utils/tableColumns'
import { formatTableDate } from '@/utils/formatDate'
import { PostFormModal } from './PostFormModal'

type PostDataRow = PostListItem | TablePlaceholderRow
type PostTableRow = PostDataRow | TableSkeletonRow

function PostsPageContent() {
  const dispatch = useDispatch()
  const { t, lang } = useTranslation()
  const dateLocale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const items = useSelector((state: PostsModuleState) => selectPostsItems(state))
  const pagination = useSelector((state: PostsModuleState) =>
    selectPostsPagination(state),
  )
  const loading = useSelector((state: PostsModuleState) =>
    selectPostsLoading(state),
  )
  const error = useSelector((state: PostsModuleState) => selectPostsError(state))
  const deletingId = useSelector((state: PostsModuleState) =>
    selectPostsDeletingId(state),
  )
  const deleteError = useSelector((state: PostsModuleState) =>
    selectPostsDeleteError(state),
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)
  const pageRef = useRef(pagination.currentPage)
  pageRef.current = pagination.currentPage
  const tableAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!error) return
    notification.error({ message: t('posts.loadFailed'), description: error })
  }, [error, t])

  // После удаления автора/тега модуль posts может остаться со старым справочником —
  // при каждом заходе на страницу обновляем references и список.
  useEffect(() => {
    dispatch(postsActions.referencesRequest())
    dispatch(postsActions.fetchRequest(pageRef.current))
  }, [dispatch])

  const revalidatePosts = useCallback(() => {
    dispatch(postsActions.fetchRequest(pageRef.current))
    dispatch(postsActions.referencesRequest())
  }, [dispatch])
  useDataRevalidation(revalidatePosts)

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      if (deleteError) {
        notification.error({
          message: t('posts.deleteFailed'),
          description: deleteError,
        })
      } else {
        message.success(t('posts.deleted'))
      }
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId, deleteError, t])

  const pageSize = pagination.perPage || LIST_PAGE_SIZE.posts

  const { rows: tableRows, fillRowCount } = useMemo(
    () =>
      buildTablePageLayout(items, {
        page: pagination.currentPage,
        pageSize,
      }),
    [items, pageSize, pagination.currentPage],
  )

  const tableScroll = useTableScrollY(tableAreaRef, {
    headerRowHeight: 39,
    observeKey: loading,
  })

  const tableBodyLoading = loading
  const bodyScrollY = tableScroll.ready ? tableScroll.y : 120

  const openCreateModal = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    dispatch(postsActions.detailClear())
  }

  const confirmDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t('posts.deleteConfirmTitle'),
        content: t('posts.deleteConfirmContent'),
        okText: t('common.delete'),
        cancelText: t('common.cancel'),
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(postsActions.deleteRequest(id, pagination.currentPage))
        },
      })
    },
    [dispatch, pagination.currentPage, t],
  )

  const columns: ColumnsType<PostDataRow> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: POSTS_TABLE_COLS.id,
        ellipsis: true,
        render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
      },
      {
        title: t('posts.preview'),
        dataIndex: 'previewPicture',
        width: POSTS_TABLE_COLS.preview,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const url = record.previewPicture?.url
          if (!url) {
            return (
              <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: 12 }}>
                —
              </span>
            )
          }
          return (
            <TableMediaImage
              src={url}
              alt={record.title}
              width={POSTS_TABLE_PREVIEW.width}
              height={POSTS_TABLE_PREVIEW.height}
              shape="rect"
              preview={{
                src: url,
                maskClassName: 'posts-preview-mask',
              }}
            />
          )
        },
      },
      {
        title: t('posts.postTitle'),
        dataIndex: 'title',
        width: POSTS_TABLE_COLS.title,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value}>{value}</EllipsisTooltip>
          ),
      },
      {
        title: t('posts.author'),
        dataIndex: 'authorName',
        width: POSTS_TABLE_COLS.author,
        ellipsis: { showTitle: false },
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const label = resolvePostAuthorLabel(record)
          if (!label) {
            return <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>—</span>
          }
          return <EllipsisTooltip title={label}>{label}</EllipsisTooltip>
        },
      },
      {
        title: t('posts.tags'),
        dataIndex: 'tagNames',
        width: POSTS_TABLE_COLS.tags,
        ellipsis: true,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const resolvedTags = resolvePostTagLabels(record)
          if (resolvedTags.length === 0) {
            return <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>—</span>
          }
          return <OverflowTags tags={resolvedTags} />
        },
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'createdAt',
        width: POSTS_TABLE_COLS.created,
        ellipsis: true,
        render: (value: string, record) =>
          isTablePlaceholderRow(record)
            ? null
            : formatTableDate(value, dateLocale),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: POSTS_TABLE_COLS.actions,
        className: 'admin-table-cell-actions',
        onCell: () => ({ className: 'admin-table-cell-actions' }),
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null

          return (
            <Space size="middle">
              <Button
                type="text"
                icon={<EditOutlined style={{ color: '#595959' }} />}
                onClick={() => {
                  setEditingId(record.id)
                  setModalOpen(true)
                }}
              />
              <Button
                type="text"
                loading={deletingId === record.id}
                icon={<DeleteOutlined style={{ color: '#ff7875' }} />}
                onClick={() => confirmDelete(record.id)}
              />
            </Space>
          )
        },
      },
    ],
    [confirmDelete, dateLocale, deletingId, lang, t],
  )

  const displayColumns = useMemo(
    () => wrapColumnsWithSkeletonLoading(columns, 'posts', tableBodyLoading),
    [columns, tableBodyLoading],
  )

  const tableDataSource = useMemo(
    () =>
      tableBodyLoading ? buildTableSkeletonRows(pageSize) : tableRows,
    [tableBodyLoading, pageSize, tableRows],
  )

  const displayFillRowCount = tableBodyLoading ? pageSize : fillRowCount

  return (
    <>
      <AdminPageFrame fill>
        <div className="admin-page-toolbar mb-4 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography.Title
              level={2}
              className="admin-page-title"
              style={{ margin: 0, fontWeight: 700 }}
            >
              {t('posts.title')}
            </Typography.Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              {t('posts.newPost')}
            </Button>
          </div>
        </div>

        <AdminTableShell containerRef={tableAreaRef}>
          <Table<PostTableRow>
            className="posts-table admin-table-fill-rows"
            style={tableFillStyle(bodyScrollY, displayFillRowCount)}
            columns={displayColumns}
            dataSource={tableDataSource}
            pagination={false}
            size="small"
            scroll={{ y: bodyScrollY }}
            onRow={(record) => ({
              className: isTableSkeletonRow(record)
                ? 'table-row-skeleton'
                : isTablePlaceholderRow(record)
                  ? 'table-row-placeholder'
                  : undefined,
            })}
            locale={{
              emptyText: tableBodyLoading ? ' ' : t('posts.noPosts'),
            }}
          />
        </AdminTableShell>

        <div className="admin-page-footer mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 pt-1">
          <Typography.Text type="secondary">
            {t('posts.count', { count: pagination.totalCount })}
          </Typography.Text>
          <Pagination
            size="small"
            current={pagination.currentPage}
            pageSize={pageSize}
            total={pagination.totalCount}
            onChange={(nextPage) => dispatch(postsActions.fetchRequest(nextPage))}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </AdminPageFrame>

      <PostFormModal
        open={modalOpen}
        editingId={editingId}
        page={pagination.currentPage}
        onClose={closeModal}
      />
    </>
  )
}

export default function PostsPage() {
  return <PostsPageContent />
}
