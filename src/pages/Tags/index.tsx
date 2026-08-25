import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TagListItem } from '@/api'
import { LIST_PAGE_SIZE } from '@/api'
import {
  Button,
  Modal,
  Pagination,
  Space,
  Table,
  TableSkeleton,
  message,
  notification,
} from '@/components/ui'
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
  isTablePlaceholderRow,
  padTablePage,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import { TagFormModal } from './TagFormModal'

type TagTableRow = TagListItem | TablePlaceholderRow

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
  const [editingId, setEditingId] = useState<number | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)

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

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return padTablePage(items.slice(start, start + pageSize), pageSize)
  }, [items, page, pageSize])

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

  const columns: ColumnsType<TagTableRow> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 72,
        render: (value, record) =>
          isTablePlaceholderRow(record) ? null : value,
      },
      {
        title: t('tags.name'),
        dataIndex: 'name',
        render: (value, record) =>
          isTablePlaceholderRow(record) ? null : value,
      },
      {
        title: t('tags.code'),
        dataIndex: 'code',
        width: 160,
        render: (value, record) =>
          isTablePlaceholderRow(record) ? null : value,
      },
      {
        title: t('tags.priority'),
        dataIndex: 'sort',
        width: 120,
        render: (value: number | null | undefined, record) =>
          isTablePlaceholderRow(record) ? null : (value ?? '—'),
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'createdAt',
        width: 140,
        render: (value: string, record) =>
          isTablePlaceholderRow(record) ? null : formatDate(value, dateLocale),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null

          return (
            <Space size={4}>
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

  return (
    <>
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
          <Typography.Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            {t('tags.title')}
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null)
              setModalOpen(true)
            }}
          >
            {t('tags.newTag')}
          </Button>
        </div>

        {loading ? (
          <TableSkeleton rows={pageSize} />
        ) : (
          <Table<TagTableRow>
            columns={columns}
            dataSource={pageItems}
            pagination={false}
            onRow={(record) => ({
              className: isTablePlaceholderRow(record)
                ? 'table-row-placeholder'
                : undefined,
            })}
            locale={{ emptyText: t('tags.noTags') }}
          />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 8,
          }}
        >
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
      </div>

      <TagFormModal
        open={modalOpen}
        editingId={editingId}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
          dispatch(tagsActions.detailClear())
        }}
      />
    </>
  )
}

export default function TagsPage() {
  return <TagsPageContent />
}
