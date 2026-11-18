import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import QRCode from 'qrcode';

import { api } from '../api/client';
import { adminEnvLabel, detectAdminEnv } from '../env';

type Props = {
  onAuthed: (next: { email: string; csrfToken: string }) => void;
};

export function LoginPage({ onAuthed }: Props) {
  const env = detectAdminEnv();
  const [step, setStep] = useState<'password' | 'totp' | 'enroll_totp'>('password');
  const [pendingToken, setPendingToken] = useState('');
  const [email, setEmail] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!otpauthUrl) {
      setQrDataUrl('');
      return;
    }
    void QRCode.toDataURL(otpauthUrl, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    }).catch(() => {
      if (!cancelled) setQrDataUrl('');
    });
    return () => {
      cancelled = true;
    };
  }, [otpauthUrl]);

  const submitPassword = async (values: { email: string; password: string }) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.login(values.email, values.password);
      setPendingToken(res.pendingToken);
      setEmail(res.email);
      if (res.step === 'enroll_totp') {
        setOtpauthUrl(res.otpauthUrl || '');
        setTotpSecret(res.totpSecret || '');
        setStep('enroll_totp');
      } else {
        setStep('totp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setBusy(false);
    }
  };

  const submitTotp = async (values: { totp: string }) => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.totp(pendingToken, values.totp);
      onAuthed({ email: res.admin.email, csrfToken: res.csrfToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <Card
        style={{ width: 420, maxWidth: '100%' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span>SmartPrice Admin</span>
            <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
              {adminEnvLabel(env)}
            </Typography.Text>
          </div>
        }
      >
        <Typography.Paragraph type="secondary">
          Доступ только с allowlist IP. Нужны пароль и TOTP.
        </Typography.Paragraph>
        {error ? <Alert type="error" showIcon style={{ marginBottom: 16 }} message={error} /> : null}

        {step === 'password' ? (
          <Form layout="vertical" onFinish={submitPassword} requiredMark={false}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 8 }]}>
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={busy}>
              Далее
            </Button>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={submitTotp} requiredMark={false}>
            {step === 'enroll_totp' ? (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message="Включите 2FA"
                description={
                  <div>
                    <div>Отсканируйте QR в Google Authenticator / Authy:</div>
                    {qrDataUrl ? (
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                        <img
                          src={qrDataUrl}
                          alt="QR код для 2FA"
                          width={220}
                          height={220}
                          style={{ borderRadius: 8, background: '#fff' }}
                        />
                      </div>
                    ) : null}
                    {totpSecret ? (
                      <div style={{ marginTop: 4 }}>
                        Или введите ключ вручную:{' '}
                        <Typography.Text code copyable>
                          {totpSecret}
                        </Typography.Text>
                      </div>
                    ) : null}
                    <div style={{ marginTop: 8 }}>Пользователь: {email}</div>
                  </div>
                }
              />
            ) : (
              <Typography.Paragraph>Код 2FA для {email}</Typography.Paragraph>
            )}
            <Form.Item name="totp" label="Код TOTP" rules={[{ required: true, len: 6 }]}>
              <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={busy}>
              Войти
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
