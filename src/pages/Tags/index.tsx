import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TagListItem } from '@/api'
import { LIST_PAGE_SIZE } from '@/api'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import {
  Button,
  Modal,
  Pagination,
  Space,
  Table,
  message,
  notification,
} from '@/components/ui'
import { tagsActions } from '@/modules/tags/actions'
import { getTagsModule } from '@/modules/tags/tags.module'
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

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function TagsPageContent() {
  const dispatch = useDispatch()
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
    notification.error({ message: 'Failed to load tags', description: error })
  }, [error])

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      message.success('Tag deleted')
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId])

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return padTablePage(items.slice(start, start + pageSize), pageSize)
  }, [items, page, pageSize])

  const confirmDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Delete this tag?',
        content: 'Это действие нельзя отменить.',
        okText: 'Удалить',
        cancelText: 'Отмена',
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(tagsActions.deleteRequest(id))
        },
      })
    },
    [dispatch],
  )

  const columns: ColumnsType<TagTableRow> = useMemo(
    () => [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 72,
      render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 160,
      render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
    },
    {
      title: 'Приоритет',
      dataIndex: 'sort',
      width: 120,
      render: (value: number | null | undefined, record) =>
        isTablePlaceholderRow(record) ? null : (value ?? '—'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 140,
      render: (value: string, record) =>
        isTablePlaceholderRow(record) ? null : formatDate(value),
    },
    {
      title: 'Actions',
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
    [confirmDelete, deletingId],
  )

  return (
    <MainLayout>
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
            Tags
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null)
              setModalOpen(true)
            }}
          >
            New tag
          </Button>
        </div>

        <Table<TagTableRow>
          columns={columns}
          dataSource={pageItems}
          loading={loading}
          pagination={false}
          onRow={(record) => ({
            className: isTablePlaceholderRow(record)
              ? 'table-row-placeholder'
              : undefined,
          })}
          locale={{ emptyText: loading ? 'Loading…' : 'No tags' }}
        />

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
            {items.length} tags
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
    </MainLayout>
  )
}

export default function TagsPage() {
  return (
    <DynamicModuleLoader modules={[getTagsModule()]} strictMode>
      <TagsPageContent />
    </DynamicModuleLoader>
  )
}
