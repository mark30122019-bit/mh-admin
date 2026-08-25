import { UploadOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AuthorFormPayload } from '@/api'
import { Button, Form, Input, Modal, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
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
  const [form] = Form.useForm<AuthorFormValues>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
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
  }, [detail, editingId, form, open])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? 'Author updated' : 'Author created')
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving])

  const handleSubmit = (values: AuthorFormValues) => {
    const payload: AuthorFormPayload = {
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: avatarFile,
    }

    dispatch(authorsActions.saveRequest(payload, editingId ?? undefined))
  }

  return (
    <Modal
      title={editingId ? 'Edit author' : 'New author'}
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
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Enter name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: 'Enter last name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Second name" name="secondName">
          <Input />
        </Form.Item>

        <Form.Item label="Short description" name="shortDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Avatar">
          <Upload
            beforeUpload={(file) => {
              setAvatarFile(file)
              setFileList([file as UploadFile])
              return false
            }}
            onRemove={() => {
              setAvatarFile(undefined)
              setFileList([])
            }}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
