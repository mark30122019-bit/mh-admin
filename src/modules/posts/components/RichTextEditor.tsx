import { useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type RichTextEditorProps = {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

const TOOLBAR_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
} as const

const FORMATS = ['header', 'bold', 'italic', 'list'] as const

/**
 * WYSIWYG для текста поста — совместим с Ant Design Form.Item (`value` / `onChange`).
 * Тулбар ограничен тегами, которые обычно принимает тестовый бэкенд.
 */
export function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder,
}: RichTextEditorProps) {
  const modules = useMemo(() => ({ ...TOOLBAR_MODULES }), [])

  return (
    <div className="rich-text-editor min-h-[200px] [&_.ql-container]:min-h-[200px] [&_.ql-editor]:min-h-[200px]">
      <ReactQuill
        theme="snow"
        value={value ?? ''}
        onChange={onChange}
        readOnly={disabled}
        placeholder={placeholder}
        modules={modules}
        formats={[...FORMATS]}
      />
    </div>
  )
}

/** Пустой HTML от Quill (`<p><br></p>`) не считаем заполненным текстом. */
export function isRichTextEmpty(html?: string | null): boolean {
  if (!html) return true
  const plain = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .trim()
  return plain.length === 0
}
