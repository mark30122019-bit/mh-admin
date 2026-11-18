/** Admin UI is same-origin with its API (Strict cookies). Env = hostname. */

export type AdminEnv = 'production' | 'development';

export const ADMIN_HOSTS: Record<AdminEnv, string> = {
  production: 'admin.smart-price-mira.ru',
  development: 'admin-dev.smart-price-mira.ru',
};

export function detectAdminEnv(hostname = window.location.hostname): AdminEnv {
  const host = hostname.toLowerCase();
  if (
    host === ADMIN_HOSTS.development
    || host.startsWith('admin-dev.')
    || host === 'localhost'
    || host === '127.0.0.1'
  ) {
    // Local Vite defaults to dev API proxy (see vite.config.ts).
    if (host === 'localhost' || host === '127.0.0.1') {
      const forced = new URLSearchParams(window.location.search).get('env');
      if (forced === 'production' || forced === 'prod') return 'production';
      return 'development';
    }
    return 'development';
  }
  return 'production';
}

export function adminEnvLabel(env: AdminEnv): string {
  return env === 'development' ? 'Тестовое окружение' : 'Продуктовое окружение';
}

export function adminEnvUrl(env: AdminEnv, path = '/'): string {
  const host = ADMIN_HOSTS[env];
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `https://${host}${normalized}`;
}

/** Navigate to the other admin host (separate cookies + DB). */
export function switchAdminEnv(next: AdminEnv): void {
  const current = detectAdminEnv();
  if (next === current && !isLocalHost()) {
    return;
  }
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}` || '/';
  window.location.assign(adminEnvUrl(next, path));
}

export function isLocalHost(hostname = window.location.hostname): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}
