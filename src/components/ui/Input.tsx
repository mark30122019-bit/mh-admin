import { Input as AntInput } from 'antd'
import type { InputProps, InputRef } from 'antd'
import type { PasswordProps } from 'antd/es/input'

export type { InputProps, InputRef, PasswordProps }

type AppInputType = typeof AntInput

/** Текстовое поле + Input.Password для пароля. */
export const Input = Object.assign(
  function Input(props: InputProps) {
    return <AntInput {...props} />
  },
  {
    Password: AntInput.Password,
    TextArea: AntInput.TextArea,
    Search: AntInput.Search,
    OTP: AntInput.OTP,
  },
) as AppInputType
