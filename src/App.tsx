import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';

import { api, setCsrfToken } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { Shell } from './pages/Shell';
import { UserDetailPage } from './pages/UserDetailPage';
import { UsersPage } from './pages/UsersPage';

export function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await api.me();
        if (cancelled) return;
        setCsrfToken(me.csrfToken);
        setEmail(me.admin.email);
        setAuthed(true);
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!authed) {
    return (
      <LoginPage
        onAuthed={(next) => {
          setCsrfToken(next.csrfToken);
          setEmail(next.email);
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <Shell
      email={email}
      onLogout={async () => {
        try {
          await api.logout();
        } catch {
          /* ignore */
        }
        setCsrfToken('');
        setAuthed(false);
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:uid" element={<UserDetailPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </Shell>
  );
}
