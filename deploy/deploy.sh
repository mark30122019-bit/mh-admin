#!/usr/bin/env bash
# Deploy admin UI on VPS.
#   API_ENV=production bash deploy/deploy.sh
#   API_ENV=development bash deploy/deploy.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_NAME="${API_ENV:-production}"
if [[ "$ENV_NAME" == "development" ]]; then
  export COMPOSE_PROJECT_NAME=smartprice-admin-dev
  export API_EDGE_ALIAS=smartprice-admin-dev
  # Same-origin /v1 via Caddy → leave empty unless overriding.
  export VITE_API_BASE_URL="${VITE_API_BASE_URL:-}"
else
  export COMPOSE_PROJECT_NAME=smartprice-admin
  export API_EDGE_ALIAS=smartprice-admin
  export VITE_API_BASE_URL="${VITE_API_BASE_URL:-}"
fi

docker compose -f compose.yml build --pull
docker compose -f compose.yml up -d
docker compose -f compose.yml ps
echo "OK admin ($ENV_NAME) alias=$API_EDGE_ALIAS api=$VITE_API_BASE_URL"
