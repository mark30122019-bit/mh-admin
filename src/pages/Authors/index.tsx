import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Image, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AuthorListItem } from '@/api'
import { LIST_PAGE_SIZE } from '@/api'
import { AdminPageFrame, AdminTableShell } from '@/components/Layout'
import {
  Button,
  EllipsisTooltip,
  Modal,
  Pagination,
  Space,
  Table,
  buildTableSkeletonRows,
  isTableSkeletonRow,
  message,
  notification,
  wrapColumnsWithSkeletonLoading,
} from '@/components/ui'
import type { TableSkeletonRow } from '@/components/ui'
import { useTableScrollY } from '@/hooks/useTableScrollY'
import { useTranslation } from '@/hooks/useTranslation'
import { authorsActions } from '@/modules/authors/actions'
import type { AuthorsModuleState } from '@/modules/authors/authors.module'
import {
  selectAuthorsDeletingId,
  selectAuthorsError,
  selectAuthorsItems,
  selectAuthorsLoading,
} from '@/modules/authors/selectors'
import { getAuthorInitials } from '@/utils/authorInitials'
import {
  buildTablePageLayout,
  isTablePlaceholderRow,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import {
  AUTHORS_TABLE_COLS,
  tableFillStyle,
} from '@/utils/tableColumns'
import { AuthorFormModal } from './AuthorFormModal'

type AuthorDataRow = AuthorListItem | TablePlaceholderRow
type AuthorTableRow = AuthorDataRow | TableSkeletonRow

function formatDate(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AuthorAvatar({ author }: { author: AuthorListItem }) {
  const initials = getAuthorInitials(author.name, author.lastName) ?? '?'
  const url = author.avatar?.url

  if (url) {
    return (
      <Image
        src={url}
        alt={`${author.name} ${author.lastName}`}
        width={36}
        height={36}
        style={{
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
          background: '#f5f5f5',
        }}
        preview={{
          src: url,
          maskClassName: 'posts-preview-mask',
        }}
      />
    )
  }

  return (
    <Avatar
      size={36}
      className="author-avatar-initials"
      style={{
        backgroundColor: '#e6f4ff',
        color: '#1677ff',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {initials}
    </Avatar>
  )
}

function AuthorsPageContent() {
  const dispatch = useDispatch()
  const { t, lang } = useTranslation()
  const dateLocale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const items = useSelector((state: AuthorsModuleState) =>
    selectAuthorsItems(state),
  )
  const loading = useSelector((state: AuthorsModuleState) =>
    selectAuthorsLoading(state),
  )
  const error = useSelector((state: AuthorsModuleState) =>
    selectAuthorsError(state),
  )
  const deletingId = useSelector((state: AuthorsModuleState) =>
    selectAuthorsDeletingId(state),
  )

  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)
  const tableAreaRef = useRef<HTMLDivElement>(null)

  const pageSize = LIST_PAGE_SIZE.authors
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize) || 1)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  useEffect(() => {
    if (!error) return
    notification.error({ message: t('authors.loadFailed'), description: error })
  }, [error, t])

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      message.success(t('authors.deleted'))
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId, t])

  const { rows: pageItems, fillRowCount } = useMemo(() => {
    const start = (page - 1) * pageSize
    return buildTablePageLayout(items.slice(start, start + pageSize), {
      page,
      pageSize,
    })
  }, [items, page, pageSize])

  const tableScroll = useTableScrollY(tableAreaRef, { observeKey: loading })

  const tableBodyLoading = loading
  const bodyScrollY = tableScroll.ready ? tableScroll.y : 120

  const confirmDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t('authors.deleteConfirmTitle'),
        content: t('authors.deleteConfirmContent'),
        okText: t('common.delete'),
        cancelText: t('common.cancel'),
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(authorsActions.deleteRequest(id))
        },
      })
    },
    [dispatch, t],
  )

  const columns: ColumnsType<AuthorDataRow> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: AUTHORS_TABLE_COLS.id,
        ellipsis: true,
        render: (value, record) =>
          isTablePlaceholderRow(record) ? null : value,
      },
      {
        title: t('authors.avatar'),
        key: 'avatar',
        width: AUTHORS_TABLE_COLS.avatar,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          return <AuthorAvatar author={record} />
        },
      },
      {
        title: t('authors.name'),
        dataIndex: 'name',
        width: AUTHORS_TABLE_COLS.name,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value}>{value}</EllipsisTooltip>
          ),
      },
      {
        title: t('authors.lastName'),
        dataIndex: 'lastName',
        width: AUTHORS_TABLE_COLS.lastName,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value}>{value}</EllipsisTooltip>
          ),
      },
      {
        title: t('authors.secondName'),
        dataIndex: 'secondName',
        width: AUTHORS_TABLE_COLS.secondName,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value || undefined}>{value}</EllipsisTooltip>
          ),
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'createdAt',
        width: AUTHORS_TABLE_COLS.created,
        ellipsis: true,
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : formatDate(value, dateLocale),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: AUTHORS_TABLE_COLS.actions,
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
    [confirmDelete, dateLocale, deletingId, t],
  )

  const displayColumns = useMemo(
    () => wrapColumnsWithSkeletonLoading(columns, 'authors', tableBodyLoading),
    [columns, tableBodyLoading],
  )

  const tableDataSource = useMemo(
    () =>
      tableBodyLoading ? buildTableSkeletonRows(pageSize) : pageItems,
    [tableBodyLoading, pageItems, pageSize],
  )

  const displayFillRowCount = tableBodyLoading ? pageSize : fillRowCount

  return (
    <>
      <AdminPageFrame fill>
        <div className="admin-page-toolbar mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 md:mb-5">
          <Typography.Title
            level={2}
            className="admin-page-title"
            style={{ margin: 0, fontWeight: 700 }}
          >
            {t('authors.title')}
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null)
              setModalOpen(true)
            }}
          >
            {t('authors.newAuthor')}
          </Button>
        </div>

        <AdminTableShell containerRef={tableAreaRef}>
          <Table<AuthorTableRow>
            className="admin-table-fill-rows"
            style={tableFillStyle(bodyScrollY, displayFillRowCount)}
            columns={displayColumns}
            dataSource={tableDataSource}
            pagination={false}
            scroll={{ y: bodyScrollY }}
            onRow={(record) => ({
              className: isTableSkeletonRow(record)
                ? 'table-row-skeleton'
                : isTablePlaceholderRow(record)
                  ? 'table-row-placeholder'
                  : undefined,
            })}
            locale={{
              emptyText: tableBodyLoading ? ' ' : t('authors.noAuthors'),
            }}
          />
        </AdminTableShell>

        <div className="admin-page-footer mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 pt-1">
          <Typography.Text type="secondary">
            {t('authors.count', { count: items.length })}
          </Typography.Text>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={items.length}
            onChange={setPage}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </AdminPageFrame>

      <AuthorFormModal
        open={modalOpen}
        editingId={editingId}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
          dispatch(authorsActions.detailClear())
        }}
      />
    </>
  )
}

export default function AuthorsPage() {
  return <AuthorsPageContent />
}
