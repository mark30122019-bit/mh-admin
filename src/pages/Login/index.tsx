import { Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input, notification } from '@/components/ui'
import { authActions } from '@/modules/auth/actions'
import type { AuthModuleState } from '@/modules/auth/auth.module'
import {
  selectAuthError,
  selectAuthLoading,
} from '@/modules/auth/selectors'
import { useEffect } from 'react'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const [form] = Form.useForm<LoginFormValues>()
  const loading = useSelector((state: AuthModuleState) => selectAuthLoading(state))
  const error = useSelector((state: AuthModuleState) => selectAuthError(state))

  useEffect(() => {
    if (!error) return

    notification.error({
      message: 'Sign in failed',
      description: error,
    })
  }, [error])

  const onFinish = (values: LoginFormValues) => {
    dispatch(authActions.loginRequest(values))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-[420px] rounded-lg bg-white p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        <Typography.Text
          strong
          style={{ color: '#1677ff', fontSize: 15, display: 'block', marginBottom: 28 }}
        >
          machineheads
        </Typography.Text>

        <Typography.Title level={2} style={{ margin: '0 0 8px', fontWeight: 700 }}>
          Sign in
        </Typography.Title>

        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          Enter your credentials to continue.
        </Typography.Text>

        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          requiredMark
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Enter your email' },
              { type: 'email', message: 'Invalid email address' },
            ]}
          >
            <Input placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
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
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
