import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Card, Descriptions, Spin, Table, Tag } from 'antd';

import { api, type AdminUserDetail } from '../api/client';

export function UserDetailPage() {
  const { uid = '' } = useParams();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.user(uid);
        if (!cancelled) setUser(res.user);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Ошибка');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (error) return <Alert type="error" showIcon message={error} />;
  if (!user) return <Spin />;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Link to="/users">← К списку</Link>
      <Card title={user.email || user.uid}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="UID">{user.uid}</Descriptions.Item>
          <Descriptions.Item label="Status"><Tag>{user.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Email verified">{user.emailVerified ? 'yes' : 'no'}</Descriptions.Item>
          <Descriptions.Item label="Plan">{user.billing?.planId || '—'}</Descriptions.Item>
          <Descriptions.Item label="Billing status">{user.billing?.status || '—'}</Descriptions.Item>
          <Descriptions.Item label="Paid until">{user.billing?.paidUntil || '—'}</Descriptions.Item>
          <Descriptions.Item label="Created">{user.createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Subscriptions">
        <Table
          rowKey="id"
          pagination={false}
          dataSource={user.subscriptions}
          columns={[
            { title: 'Plan', dataIndex: 'planId' },
            { title: 'Status', dataIndex: 'status' },
            { title: 'Started', dataIndex: 'startedAt' },
            { title: 'Period end', dataIndex: 'currentPeriodEnd' },
          ]}
        />
      </Card>
    </div>
  );
}
