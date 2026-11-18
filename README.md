# SmartPrice Admin

Read-only admin panel: users, subscriptions, successful payments.

- Host: `admin.smart-price-mira.ru` (allowlist on edge Caddy)
- API: `https://api.smart-price-mira.ru/v1/admin/*`
- Auth: email + password hash + TOTP (no localStorage tokens)

## Local

```bash
npm ci
npm run dev
```

Set `VITE_API_PROXY` to your API. Login requires allowlist IP on deployed edge;
locally call API directly if CORS allows `http://localhost:5174`.

## Deploy (VPS)

```bash
cd /opt/smartprice/admin
API_ENV=production bash deploy/deploy.sh
```

See [docs/ops/admin-panel.md](../docs/ops/admin-panel.md) in the main monorepo.
