import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TagListItem } from '@/api'
import { LIST_PAGE_SIZE } from '@/api'
import { AdminPageFrame, AdminTableShell } from '@/components/Layout'
import {
  Button,
  EllipsisTooltip,
  Modal,
  Pagination,
  Space,
  Table,
  Tag,
  buildTableSkeletonRows,
  isTableSkeletonRow,
  message,
  notification,
  wrapColumnsWithSkeletonLoading,
} from '@/components/ui'
import type { TableSkeletonRow } from '@/components/ui'
import { useTableScrollY } from '@/hooks/useTableScrollY'
import { useTranslation } from '@/hooks/useTranslation'
import { tagsActions } from '@/modules/tags/actions'
import type { TagsModuleState } from '@/modules/tags/tags.module'
import {
  selectTagsDeletingId,
  selectTagsError,
  selectTagsItems,
  selectTagsLoading,
} from '@/modules/tags/selectors'
import {
  buildTablePageLayout,
  isTablePlaceholderRow,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import {
  TAGS_TABLE_COLS,
  tableFillStyle,
} from '@/utils/tableColumns'
import { TagFormModal } from './TagFormModal'

type TagDataRow = TagListItem | TablePlaceholderRow
type TagTableRow = TagDataRow | TableSkeletonRow

function formatDate(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function TagsPageContent() {
  const dispatch = useDispatch()
  const { t, lang } = useTranslation()
  const dateLocale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const items = useSelector((state: TagsModuleState) => selectTagsItems(state))
  const loading = useSelector((state: TagsModuleState) => selectTagsLoading(state))
  const error = useSelector((state: TagsModuleState) => selectTagsError(state))
  const deletingId = useSelector((state: TagsModuleState) =>
    selectTagsDeletingId(state),
  )

  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagListItem | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)
  const tableAreaRef = useRef<HTMLDivElement>(null)

  const pageSize = LIST_PAGE_SIZE.tags
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize) || 1)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  useEffect(() => {
    if (!error) return
    notification.error({ message: t('tags.loadFailed'), description: error })
  }, [error, t])

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      message.success(t('tags.deleted'))
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId, t])

  const { rows: pageItems, fillRowCount } = useMemo(() => {
    const start = (page - 1) * pageSize
    return buildTablePageLayout(items.slice(start, start + pageSize))
  }, [items, page, pageSize])

  const tableScroll = useTableScrollY(tableAreaRef, { observeKey: loading })

  const tableBodyLoading = loading
  const bodyScrollY = tableScroll.ready ? tableScroll.y : 120

  const confirmDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t('tags.deleteConfirmTitle'),
        content: t('tags.deleteConfirmContent'),
        okText: t('common.delete'),
        cancelText: t('common.cancel'),
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(tagsActions.deleteRequest(id))
        },
      })
    },
    [dispatch, t],
  )

  const columns: ColumnsType<TagDataRow> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: TAGS_TABLE_COLS.id,
        ellipsis: true,
        render: (value, record) =>
          isTablePlaceholderRow(record) ? null : value,
      },
      {
        title: t('tags.name'),
        dataIndex: 'name',
        width: TAGS_TABLE_COLS.name,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value}>{value}</EllipsisTooltip>
          ),
      },
      {
        title: t('tags.code'),
        dataIndex: 'code',
        width: TAGS_TABLE_COLS.code,
        ellipsis: { showTitle: false },
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : (
            <EllipsisTooltip title={value}>
              <Tag color="default" className="!m-0 max-w-full truncate">
                {value}
              </Tag>
            </EllipsisTooltip>
          ),
      },
      {
        title: t('tags.priority'),
        dataIndex: 'sort',
        width: TAGS_TABLE_COLS.priority,
        align: 'center',
        render: (value: number | null | undefined, record) =>
          isTablePlaceholderRow(record) ? null : (value ?? '—'),
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'createdAt',
        width: TAGS_TABLE_COLS.created,
        align: 'center',
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : formatDate(value, dateLocale),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: TAGS_TABLE_COLS.actions,
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
                  setEditingTag(record)
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
    () => wrapColumnsWithSkeletonLoading(columns, 'tags', tableBodyLoading),
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
            {t('tags.title')}
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTag(null)
              setModalOpen(true)
            }}
          >
            {t('tags.newTag')}
          </Button>
        </div>

        <AdminTableShell containerRef={tableAreaRef}>
          <Table<TagTableRow>
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
              emptyText: tableBodyLoading ? ' ' : t('tags.noTags'),
            }}
          />
        </AdminTableShell>

        <div className="admin-page-footer mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 pt-1">
          <Typography.Text type="secondary">
            {t('tags.count', { count: items.length })}
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

      <TagFormModal
        open={modalOpen}
        initialTag={editingTag}
        onClose={() => {
          setModalOpen(false)
          setEditingTag(null)
        }}
      />
    </>
  )
}

export default function TagsPage() {
  return <TagsPageContent />
}
