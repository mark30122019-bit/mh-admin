import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TagFormInput } from '@/api'
import { Button, Form, Input, Modal, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { tagsActions } from '@/modules/tags/actions'
import type { TagsModuleState } from '@/modules/tags/tags.module'
import {
  selectTagDetail,
  selectTagDetailLoading,
  selectTagsSaveError,
  selectTagsSaveFieldErrors,
  selectTagsSaving,
} from '@/modules/tags/selectors'

type TagFormValues = {
  name: string
  sort?: number | string | null
}

type TagFormModalProps = {
  open: boolean
  editingId: number | null
  onClose: () => void
}

export function TagFormModal({ open, editingId, onClose }: TagFormModalProps) {
  const dispatch = useDispatch()
  const [form] = Form.useForm<TagFormValues>()
  const wasSavingRef = useRef(false)

  const detail = useSelector((state: TagsModuleState) => selectTagDetail(state))
  const detailLoading = useSelector((state: TagsModuleState) =>
    selectTagDetailLoading(state),
  )
  const saving = useSelector((state: TagsModuleState) => selectTagsSaving(state))
  const saveError = useSelector((state: TagsModuleState) =>
    selectTagsSaveError(state),
  )
  const saveFieldErrors = useSelector((state: TagsModuleState) =>
    selectTagsSaveFieldErrors(state),
  )
  const formFieldErrors = saveFieldErrors.map((error) =>
    error.field === 'code' ? { ...error, field: 'name' } : error,
  )

  useFormApiErrors(form, formFieldErrors, saveError, 'Tag')

  useEffect(() => {
    if (!open) return

    if (editingId) {
      dispatch(tagsActions.detailRequest(editingId))
      return
    }

    dispatch(tagsActions.detailClear())
    form.setFieldsValue({ name: '', sort: undefined })
  }, [dispatch, editingId, form, open])

  useEffect(() => {
    if (!open || !editingId || !detail) return

    form.setFieldsValue({
      name: detail.name,
      sort: detail.sort ?? undefined,
    })
  }, [detail, editingId, form, open])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? 'Tag updated' : 'Tag created')
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving])

  const handleSubmit = (values: TagFormValues) => {
    const rawSort = values.sort
    const hasSort =
      rawSort !== undefined && rawSort !== null && String(rawSort).trim() !== ''

    const payload: TagFormInput = {
      name: values.name,
      ...(hasSort ? { sort: Number(rawSort) } : {}),
    }

    dispatch(tagsActions.saveRequest(payload, editingId ?? undefined))
  }

  return (
    <Modal
      title={editingId ? 'Edit tag' : 'New tag'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnHidden
    >
      <Form<TagFormValues>
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

        <Form.Item label="Приоритет" name="sort">
          <Input type="number" placeholder="Необязательно" />
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
