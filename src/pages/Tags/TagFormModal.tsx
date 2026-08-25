import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TagFormInput, TagListItem } from '@/api'
import { Button, Form, Input, Modal, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { useTranslation } from '@/hooks/useTranslation'
import { tagsActions } from '@/modules/tags/actions'
import type { TagsModuleState } from '@/modules/tags/tags.module'
import {
  selectTagsSaveError,
  selectTagsSaveFieldErrors,
  selectTagsSaving,
} from '@/modules/tags/selectors'
import { FIELD_MAX_LENGTH, resolveInputMaxLength } from '@/utils/fieldMaxLength'

type TagFormValues = {
  name: string
  sort?: number | string | null
}

type TagFormModalProps = {
  open: boolean
  /** Данные из таблицы — без отдельного detail-запроса. */
  initialTag: TagListItem | null
  onClose: () => void
}

export function TagFormModal({ open, initialTag, onClose }: TagFormModalProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm<TagFormValues>()
  const wasSavingRef = useRef(false)
  const editingId = initialTag?.id ?? null

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

  const watchedName = Form.useWatch('name', form)

  useEffect(() => {
    if (!open) return

    if (initialTag) {
      form.setFieldsValue({
        name: initialTag.name,
        sort: initialTag.sort ?? undefined,
      })
      return
    }

    form.setFieldsValue({ name: '', sort: undefined })
  }, [form, initialTag, open])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? t('tags.updated') : t('tags.created'))
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving, t])

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
      title={editingId ? t('tags.editTag') : t('tags.newTag')}
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
      >
        <Form.Item
          label={t('tags.name')}
          name="name"
          rules={[{ required: true, message: t('tags.enterName') }]}
        >
          <Input
            showCount
            maxLength={resolveInputMaxLength(
              FIELD_MAX_LENGTH.tagName,
              watchedName,
            )}
          />
        </Form.Item>

        <Form.Item label={t('tags.priority')} name="sort">
          <Input type="number" />
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
