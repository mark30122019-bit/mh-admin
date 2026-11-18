import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Layout, Menu, Typography } from 'antd';

import { EnvSwitcher } from '../components/EnvSwitcher';
import { adminEnvLabel, detectAdminEnv } from '../env';

const { Header, Sider, Content } = Layout;

export function Shell({
  email,
  onLogout,
  children,
}: {
  email: string;
  onLogout: () => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const selected = location.pathname.startsWith('/payments') ? 'payments' : 'users';
  const env = detectAdminEnv();

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider breakpoint="lg" collapsedWidth={0} theme="light" width={220}>
        <div style={{ padding: 20 }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#005BFF' }}>
            SmartPrice
          </Typography.Title>
          <Typography.Text type="secondary">Admin · read-only</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <Typography.Text
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: env === 'production' ? '#005BFF' : '#0f766e',
              }}
            >
              {adminEnvLabel(env)}
            </Typography.Text>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selected]}
          items={[
            { key: 'users', label: <Link to="/users">Пользователи</Link> },
            { key: 'payments', label: <Link to="/payments">Оплаты</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingInline: 24,
          }}
        >
          <EnvSwitcher compact />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Typography.Text type="secondary">{email}</Typography.Text>
            <Button onClick={onLogout}>Выйти</Button>
          </div>
        </Header>
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
