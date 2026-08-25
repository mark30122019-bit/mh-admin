import { UploadOutlined } from '@ant-design/icons'
import { Image, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { PostFormInput } from '@/api'
import { Button, Form, Input, Modal, Select, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { postsActions } from '@/modules/posts/actions'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostDetail,
  selectPostDetailLoading,
  selectPostsAuthorOptions,
  selectPostsReferencesLoading,
  selectPostsSaveError,
  selectPostsSaveFieldErrors,
  selectPostsSaving,
  selectPostsTagOptions,
} from '@/modules/posts/selectors'

type PostFormValues = {
  title: string
  authorId: number
  tagIds: number[]
  text: string
}

type PostFormModalProps = {
  open: boolean
  editingId: number | null
  page: number
  onClose: () => void
}

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export function PostFormModal({
  open,
  editingId,
  page,
  onClose,
}: PostFormModalProps) {
  const dispatch = useDispatch()
  const [form] = Form.useForm<PostFormValues>()
  const [previewFile, setPreviewFile] = useState<File | undefined>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [existingPreviewUrl, setExistingPreviewUrl] = useState<string | null>(
    null,
  )
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const wasSavingRef = useRef(false)

  const detail = useSelector((state: PostsModuleState) => selectPostDetail(state))
  const detailLoading = useSelector((state: PostsModuleState) =>
    selectPostDetailLoading(state),
  )
  const saving = useSelector((state: PostsModuleState) => selectPostsSaving(state))
  const saveError = useSelector((state: PostsModuleState) =>
    selectPostsSaveError(state),
  )
  const saveFieldErrors = useSelector((state: PostsModuleState) =>
    selectPostsSaveFieldErrors(state),
  )
  const formFieldErrors = saveFieldErrors.map((error) =>
    error.field === 'code' ? { ...error, field: 'title' } : error,
  )
  const authorOptions = useSelector((state: PostsModuleState) =>
    selectPostsAuthorOptions(state),
  )
  const tagOptions = useSelector((state: PostsModuleState) =>
    selectPostsTagOptions(state),
  )
  const referencesLoading = useSelector((state: PostsModuleState) =>
    selectPostsReferencesLoading(state),
  )

  const previewUrl = localPreviewUrl ?? existingPreviewUrl
  const hasPreview = Boolean(previewFile || existingPreviewUrl)

  useFormApiErrors(form, formFieldErrors, saveError, 'Post')

  useEffect(() => {
    if (!previewFile) {
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }

    const url = URL.createObjectURL(previewFile)
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [previewFile])

  useEffect(() => {
    if (!open) return
    dispatch(postsActions.referencesRequest())
  }, [dispatch, open])

  useEffect(() => {
    if (!open) return

    if (editingId) {
      dispatch(postsActions.detailRequest(editingId))
      return
    }

    dispatch(postsActions.detailClear())
    form.resetFields()
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(null)
    setPreviewError(null)
  }, [dispatch, editingId, form, open])

  useEffect(() => {
    if (!open || !editingId || !detail) return

    form.setFieldsValue({
      title: detail.title,
      authorId: detail.author.id,
      tagIds: detail.tags.map((tag) => tag.id),
      text: detail.text,
    })
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(detail.previewPicture?.url ?? null)
    setPreviewError(
      detail.previewPicture?.url ? null : 'Загрузите превью поста',
    )
  }, [detail, editingId, form, open])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? 'Post updated' : 'Post created')
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving])

  const clearPreview = () => {
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(null)
    setPreviewError('Загрузите превью поста')
  }

  const handleSubmit = (values: PostFormValues) => {
    if (!hasPreview) {
      setPreviewError('Загрузите превью поста')
      return
    }

    const payload: PostFormInput = {
      title: values.title,
      authorId: values.authorId,
      tagIds: values.tagIds ?? [],
      text: values.text,
      previewPicture: previewFile,
    }

    dispatch(postsActions.saveRequest(payload, page, editingId ?? undefined))
  }

  return (
    <Modal
      title={editingId ? 'Edit post' : 'New post'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
    >
      <Form<PostFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={detailLoading || referencesLoading}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Enter title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Author"
          name="authorId"
          rules={[{ required: true, message: 'Select author' }]}
        >
          <Select
            loading={referencesLoading}
            options={authorOptions.map((author) => ({
              value: author.id,
              label: `${author.name} ${author.lastName}`.trim(),
            }))}
          />
        </Form.Item>

        <Form.Item label="Tags" name="tagIds">
          <Select
            mode="multiple"
            loading={referencesLoading}
            options={tagOptions.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Text"
          name="text"
          rules={[{ required: true, message: 'Enter text' }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item
          label="Preview picture"
          required
          validateStatus={previewError ? 'error' : undefined}
          help={previewError ?? undefined}
        >
          <Upload
            accept={IMAGE_ACCEPT}
            beforeUpload={(file) => {
              if (!file.type.startsWith('image/')) {
                setPreviewError('Выберите изображение')
                return Upload.LIST_IGNORE
              }

              setPreviewFile(file)
              setExistingPreviewUrl(null)
              setPreviewError(null)
              setFileList([
                {
                  uid: `-preview-${Date.now()}`,
                  name: file.name,
                  status: 'done',
                  originFileObj: file,
                },
              ])
              return false
            }}
            onRemove={() => {
              clearPreview()
              return true
            }}
            fileList={fileList}
            maxCount={1}
            listType="picture"
            showUploadList={{ showPreviewIcon: false }}
          >
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>

          {previewUrl ? (
            <div style={{ marginTop: 12 }}>
              <Image
                src={previewUrl}
                alt="Post preview"
                width={240}
                style={{
                  borderRadius: 8,
                  objectFit: 'cover',
                  maxHeight: 160,
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Button
                  type="link"
                  danger
                  onClick={clearPreview}
                  style={{ padding: 0 }}
                >
                  Remove preview
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: 13 }}
            >
              Обязательное поле. JPG, PNG, WEBP или GIF.
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            disabled={!hasPreview || detailLoading || referencesLoading}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
