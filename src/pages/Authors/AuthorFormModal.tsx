import { UploadOutlined } from '@ant-design/icons'
import { Image, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AuthorFormPayload } from '@/api'
import { Button, Form, Input, Modal, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { useTranslation } from '@/hooks/useTranslation'
import { authorsActions } from '@/modules/authors/actions'
import type { AuthorsModuleState } from '@/modules/authors/authors.module'
import {
  selectAuthorDetail,
  selectAuthorDetailLoading,
  selectAuthorsSaveError,
  selectAuthorsSaveFieldErrors,
  selectAuthorsSaving,
} from '@/modules/authors/selectors'

type AuthorFormValues = {
  name: string
  lastName: string
  secondName?: string
  shortDescription?: string
  description?: string
}

type AuthorFormModalProps = {
  open: boolean
  editingId: number | null
  onClose: () => void
}

export function AuthorFormModal({
  open,
  editingId,
  onClose,
}: AuthorFormModalProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm<AuthorFormValues>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const wasSavingRef = useRef(false)

  const detail = useSelector((state: AuthorsModuleState) =>
    selectAuthorDetail(state),
  )
  const detailLoading = useSelector((state: AuthorsModuleState) =>
    selectAuthorDetailLoading(state),
  )
  const saving = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaving(state),
  )
  const saveError = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaveError(state),
  )
  const saveFieldErrors = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaveFieldErrors(state),
  )

  useFormApiErrors(form, saveFieldErrors, saveError, 'Author')

  useEffect(() => {
    if (!open) return

    if (editingId) {
      dispatch(authorsActions.detailRequest(editingId))
      return
    }

    dispatch(authorsActions.detailClear())
    form.resetFields()
    setAvatarFile(undefined)
    setFileList([])
    setExistingAvatarUrl(null)
    setRemoveAvatar(false)
  }, [dispatch, editingId, form, open])

  useEffect(() => {
    if (!open || !editingId || !detail) return

    form.setFieldsValue({
      name: detail.name,
      lastName: detail.lastName,
      secondName: detail.secondName,
      shortDescription: detail.shortDescription,
      description: detail.description,
    })
    setAvatarFile(undefined)
    setFileList([])
    setExistingAvatarUrl(detail.avatar?.url ?? null)
    setRemoveAvatar(false)
  }, [detail, editingId, form, open])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? t('authors.updated') : t('authors.created'))
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving, t])

  const clearAvatar = () => {
    setAvatarFile(undefined)
    setFileList([])
    if (existingAvatarUrl) {
      setRemoveAvatar(true)
      setExistingAvatarUrl(null)
    }
  }

  const handleSubmit = (values: AuthorFormValues) => {
    const payload: AuthorFormPayload = {
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: avatarFile,
      removeAvatar: removeAvatar && !avatarFile,
    }

    dispatch(authorsActions.saveRequest(payload, editingId ?? undefined))
  }

  const previewUrl = avatarFile
    ? undefined
    : existingAvatarUrl && !removeAvatar
      ? existingAvatarUrl
      : null

  return (
    <Modal
      title={editingId ? t('authors.editAuthor') : t('authors.newAuthor')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnHidden
    >
      <Form<AuthorFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={detailLoading}
      >
        <Form.Item
          label={t('authors.name')}
          name="name"
          rules={[{ required: true, message: t('authors.enterName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('authors.lastName')}
          name="lastName"
          rules={[{ required: true, message: t('authors.enterLastName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={t('authors.secondName')} name="secondName">
          <Input />
        </Form.Item>

        <Form.Item label={t('authors.shortDescription')} name="shortDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label={t('authors.description')} name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label={t('authors.avatar')}>
          <Upload
            beforeUpload={(file) => {
              setAvatarFile(file)
              setRemoveAvatar(false)
              setExistingAvatarUrl(null)
              setFileList([
                {
                  uid: `-avatar-${Date.now()}`,
                  name: file.name,
                  status: 'done',
                  originFileObj: file,
                },
              ])
              return false
            }}
            onRemove={() => {
              clearAvatar()
              return true
            }}
            fileList={fileList}
            maxCount={1}
            listType="picture"
            showUploadList={{ showPreviewIcon: false }}
          >
            <Button icon={<UploadOutlined />}>{t('posts.selectFile')}</Button>
          </Upload>

          {previewUrl ? (
            <div style={{ marginTop: 12 }}>
              <Image
                src={previewUrl}
                alt="Author avatar"
                width={96}
                style={{ borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ marginTop: 8 }}>
                <Button
                  type="link"
                  danger
                  onClick={clearAvatar}
                  style={{ padding: 0 }}
                >
                  {t('authors.removeAvatar')}
                </Button>
              </div>
            </div>
          ) : null}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {t('common.save')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
