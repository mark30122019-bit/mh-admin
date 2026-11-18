import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Card, Input, Table, Tag } from 'antd';

import { api, type AdminUser } from '../api/client';

export function UsersPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.users(q);
        if (!cancelled) setRows(res.users);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <Card title="Пользователи">
      <Input.Search
        placeholder="email / uid / username"
        allowClear
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 16 }}
      />
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}
      <Table
        rowKey="uid"
        loading={loading}
        dataSource={rows}
        pagination={false}
        columns={[
          {
            title: 'Email',
            dataIndex: 'email',
            render: (email: string | null, row) => (
              <Link to={`/users/${encodeURIComponent(row.uid)}`}>{email || row.uid}</Link>
            ),
          },
          { title: 'UID', dataIndex: 'uid', ellipsis: true },
          {
            title: 'Статус',
            dataIndex: 'status',
            render: (status: string) => <Tag>{status}</Tag>,
          },
          {
            title: 'План',
            render: (_, row) => row.billing?.planId || '—',
          },
          {
            title: 'Подписка',
            render: (_, row) => row.billing?.status || '—',
          },
          {
            title: 'Paid until',
            render: (_, row) => row.billing?.paidUntil?.slice(0, 10) || '—',
          },
        ]}
      />
    </Card>
  );
}
