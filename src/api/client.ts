const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

let csrfToken = '';

export function setCsrfToken(token: string) {
  csrfToken = token || '';
}

export function getCsrfToken() {
  return csrfToken;
}

type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: string; message?: string };

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (csrfToken && init.method && init.method !== 'GET') {
    headers.set('X-CSRF-Token', csrfToken);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  const json = (await res.json().catch(() => ({}))) as ApiOk<T> | ApiErr;
  if (!res.ok || !('ok' in json) || json.ok === false) {
    const err = json as ApiErr;
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return (json as ApiOk<T>).data;
}

export const api = {
  login: (email: string, password: string) =>
    request<{
      step: 'totp' | 'enroll_totp';
      pendingToken: string;
      email: string;
      totpSecret?: string;
      otpauthUrl?: string;
    }>('/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  totp: (pendingToken: string, totp: string) =>
    request<{
      admin: { id: string; email: string };
      csrfToken: string;
      expiresAt: string;
    }>('/v1/admin/auth/totp', {
      method: 'POST',
      body: JSON.stringify({ pendingToken, totp }),
    }),
  logout: () =>
    request<{ loggedOut: boolean }>('/v1/admin/auth/logout', { method: 'POST', body: '{}' }),
  me: () =>
    request<{ admin: { id: string; email: string }; csrfToken: string }>('/v1/admin/me'),
  users: (q = '') =>
    request<{ users: AdminUser[] }>(`/v1/admin/users?q=${encodeURIComponent(q)}`),
  user: (uid: string) =>
    request<{ user: AdminUserDetail }>(`/v1/admin/users/${encodeURIComponent(uid)}`),
  payments: (q = '') =>
    request<{
      invoices: AdminInvoice[];
      orders: AdminOrder[];
    }>(`/v1/admin/payments?q=${encodeURIComponent(q)}`),
};

export type AdminUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  username: string | null;
  status: string;
  createdAt: string;
  billing: null | {
    planId: string;
    status: string;
    paidUntil: string | null;
  };
};

export type AdminUserDetail = AdminUser & {
  subscriptions: Array<{
    id: string;
    planId: string;
    status: string;
    startedAt: string;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
  }>;
};

export type AdminInvoice = {
  paymentId: string;
  uid: string | null;
  email: string | null;
  planId: string;
  amountRub: number;
  status: string;
  provider: string;
  receiptUrl: string | null;
  createdAt: string;
};

export type AdminOrder = {
  orderId: string;
  uid: string;
  email: string | null;
  planId: string;
  amountRub: number;
  status: string;
  provider: string;
  paymentId: string | null;
  paidAt: string | null;
  createdAt: string;
};
