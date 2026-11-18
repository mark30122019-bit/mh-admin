import { useEffect, useState } from 'react';
import { Alert, Card, Input, Table, Tabs } from 'antd';

import { api, type AdminInvoice, type AdminOrder } from '../api/client';

export function PaymentsPage() {
  const [q, setQ] = useState('');
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.payments(q);
        if (!cancelled) {
          setInvoices(res.invoices);
          setOrders(res.orders);
        }
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
    <Card title="Успешные оплаты">
      <Input.Search
        placeholder="email / uid / payment id"
        allowClear
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 420, marginBottom: 16 }}
      />
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}
      <Tabs
        items={[
          {
            key: 'invoices',
            label: `Invoices (${invoices.length})`,
            children: (
              <Table
                rowKey="paymentId"
                loading={loading}
                dataSource={invoices}
                pagination={false}
                columns={[
                  { title: 'Payment', dataIndex: 'paymentId', ellipsis: true },
                  { title: 'Email', dataIndex: 'email' },
                  { title: 'Plan', dataIndex: 'planId' },
                  {
                    title: 'Amount',
                    dataIndex: 'amountRub',
                    render: (v: number) => `${v} ₽`,
                  },
                  { title: 'Status', dataIndex: 'status' },
                  { title: 'Created', dataIndex: 'createdAt' },
                ]}
              />
            ),
          },
          {
            key: 'orders',
            label: `Orders paid (${orders.length})`,
            children: (
              <Table
                rowKey="orderId"
                loading={loading}
                dataSource={orders}
                pagination={false}
                columns={[
                  { title: 'Order', dataIndex: 'orderId', ellipsis: true },
                  { title: 'Email', dataIndex: 'email' },
                  { title: 'Plan', dataIndex: 'planId' },
                  {
                    title: 'Amount',
                    dataIndex: 'amountRub',
                    render: (v: number) => `${v} ₽`,
                  },
                  { title: 'Paid at', dataIndex: 'paidAt' },
                ]}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
