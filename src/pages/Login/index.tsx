import { Typography } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input, notification } from '@/components/ui'
import { LanguageSwitcher } from '@/components/Layout/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { authActions } from '@/modules/auth/actions'
import type { AuthModuleState } from '@/modules/auth/auth.module'
import {
  selectAuthError,
  selectAuthLoading,
} from '@/modules/auth/selectors'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm<LoginFormValues>()
  const loading = useSelector((state: AuthModuleState) => selectAuthLoading(state))
  const error = useSelector((state: AuthModuleState) => selectAuthError(state))

  useEffect(() => {
    if (!error) return

    notification.error({
      message: t('login.failed'),
      description: error,
    })
  }, [error, t])

  const onFinish = (values: LoginFormValues) => {
    dispatch(authActions.loginRequest(values))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4">
      <div className="relative w-full max-w-[420px] rounded-lg bg-white p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="absolute right-6 top-6">
          <LanguageSwitcher />
        </div>

        <Typography.Text
          strong
          style={{ color: '#1677ff', fontSize: 15, display: 'block', marginBottom: 28 }}
        >
          machineheads
        </Typography.Text>

        <Typography.Title level={2} style={{ margin: '0 0 8px', fontWeight: 700 }}>
          {t('login.title')}
        </Typography.Title>

        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          {t('login.subtitle')}
        </Typography.Text>

        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          requiredMark
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={t('login.email')}
            name="email"
            rules={[
              { required: true, message: t('login.emailRequired') },
              { type: 'email', message: t('login.emailInvalid') },
            ]}
          >
            <Input placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label={t('login.password')}
            name="password"
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              {t('login.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
