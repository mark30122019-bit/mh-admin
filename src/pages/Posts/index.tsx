import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LIST_PAGE_SIZE, getPostsFirstPageMinHeight } from '@/api'
import type { PostListItem } from '@/api/posts.types'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import {
  Button,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  message,
  notification,
} from '@/components/ui'
import { postsActions } from '@/modules/posts/actions'
import { getPostsModule } from '@/modules/posts/posts.module'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostsAuthorOptions,
  selectPostsDeletingId,
  selectPostsError,
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
  selectPostsTagOptions,
} from '@/modules/posts/selectors'
import {
  resolvePostAuthorLabel,
  resolvePostTagLabels,
} from '@/utils/orphanLabels'
import {
  isTablePlaceholderRow,
  padTablePage,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import { PostFormModal } from './PostFormModal'

type PostTableRow = PostListItem | TablePlaceholderRow

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function PostsPageContent() {
  const dispatch = useDispatch()
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
  const authorCatalog = useSelector((state: PostsModuleState) =>
    selectPostsAuthorOptions(state),
  )
  const tagCatalog = useSelector((state: PostsModuleState) =>
    selectPostsTagOptions(state),
  )

  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!error) return
    notification.error({ message: 'Failed to load posts', description: error })
  }, [error])

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      message.success('Post deleted')
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId])

  const authorOptions = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(
        items
          .map((item) => resolvePostAuthorLabel(item, authorCatalog))
          .filter(Boolean),
      ),
    ).sort()

    return [
      { value: 'all', label: 'All authors' },
      ...uniqueAuthors.map((author) => ({ value: author, label: author })),
    ]
  }, [authorCatalog, items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const authorLabel = resolvePostAuthorLabel(item, authorCatalog)
      const matchesAuthor =
        authorFilter === 'all' || authorLabel === authorFilter
      return matchesSearch && matchesAuthor
    })
  }, [authorCatalog, authorFilter, items, search])

  const pageSize = pagination.perPage || LIST_PAGE_SIZE.posts
  const isFirstPage = pagination.currentPage === 1
  const skipPlaceholdersOnFirstPage =
    isFirstPage && filteredItems.length < pageSize

  const tableRows = useMemo(() => {
    if (skipPlaceholdersOnFirstPage) return filteredItems
    return padTablePage(filteredItems, pageSize)
  }, [filteredItems, pageSize, skipPlaceholdersOnFirstPage])

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
        title: 'Delete this post?',
        content: 'Это действие нельзя отменить.',
        okText: 'Удалить',
        cancelText: 'Отмена',
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(postsActions.deleteRequest(id, pagination.currentPage))
        },
      })
    },
    [dispatch, pagination.currentPage],
  )

  const columns: ColumnsType<PostTableRow> = useMemo(
    () => [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 72,
      render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
    },
    {
      title: 'Preview',
      dataIndex: 'previewPicture',
      width: 88,
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
          <img
            src={url}
            alt={record.title}
            width={56}
            height={40}
            style={{
              objectFit: 'cover',
              borderRadius: 6,
              display: 'block',
              background: '#f5f5f5',
            }}
          />
        )
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      width: 180,
      render: (_, record) => {
        if (isTablePlaceholderRow(record)) return null
        const label = resolvePostAuthorLabel(record, authorCatalog)
        const isOrphan = label.includes('(Удален)')
        return (
          <span style={isOrphan ? { color: '#cf1322' } : undefined}>
            {label}
          </span>
        )
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tagNames',
      width: 200,
      render: (_, record) => {
        if (isTablePlaceholderRow(record)) return null
        const resolvedTags = resolvePostTagLabels(record, tagCatalog)
        if (resolvedTags.length === 0) {
          return <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>—</span>
        }
        return (
          <Space wrap size={[4, 4]}>
            {resolvedTags.map((tag) => (
              <Tag
                key={tag.key}
                color={tag.orphan ? 'error' : undefined}
              >
                {tag.label}
              </Tag>
            ))}
          </Space>
        )
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 140,
      render: (value: string, record) =>
        isTablePlaceholderRow(record) ? null : formatCreatedAt(value),
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
    [authorCatalog, confirmDelete, deletingId, tagCatalog],
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
            Posts
          </Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            New post
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          <Input.Search
            placeholder="Search by title"
            allowClear
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 280 }}
          />
          <Select
            value={authorFilter}
            options={authorOptions}
            onChange={setAuthorFilter}
            style={{ width: 180 }}
          />
          <Button icon={<SortAscendingOutlined />} disabled />
        </div>

        <div
          style={
            skipPlaceholdersOnFirstPage
              ? { minHeight: getPostsFirstPageMinHeight() }
              : undefined
          }
        >
          <Table<PostTableRow>
            columns={columns}
            dataSource={tableRows}
            loading={loading}
            pagination={false}
            onRow={(record) => ({
              className: isTablePlaceholderRow(record)
                ? 'table-row-placeholder'
                : undefined,
            })}
            locale={{ emptyText: loading ? 'Loading…' : 'No posts' }}
          />
        </div>

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
            {pagination.totalCount} posts
          </Typography.Text>
          <Pagination
            current={pagination.currentPage}
            pageSize={pageSize}
            total={pagination.totalCount}
            onChange={(nextPage) => dispatch(postsActions.fetchRequest(nextPage))}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </div>

      <PostFormModal
        open={modalOpen}
        editingId={editingId}
        page={pagination.currentPage}
        onClose={closeModal}
      />
    </MainLayout>
  )
}

export default function PostsPage() {
  return (
    <DynamicModuleLoader modules={[getPostsModule()]} strictMode>
      <PostsPageContent />
    </DynamicModuleLoader>
  )
}
