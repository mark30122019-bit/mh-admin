# Соответствие структуры проекта ТЗ

Источник: [Тестовое задание REACT JS](https://docs.google.com/document/d/14gBYc9NiOID9rbPv6Xt3Ihu8xRv-JHy7C9rClWdqeLY/edit)

**Легенда:** ✅ реализовано · 🟡 частично · ⬜ не начато

## Обязательный стек

| Требование | Статус | Комментарий |
|------------|--------|-------------|
| React | ✅ | React 18.3 (совместимость с `connected-react-router`) |
| TypeScript | ✅ | Strict typing, без `any` |
| Redux | ✅ | `redux-dynamic-modules`, бизнес-модули не в корневом store |
| Redux-Saga | ✅ | Саги в `modules/*/sagas.ts` |
| react-router-dom | ✅ | v5, lazy routes |
| connected-react-router | ✅ | `ConnectedRouter`, навигация через `push()` в сагах |

## Минимальный функционал

| Функция | Статус | Где |
|---------|--------|-----|
| Авторизация + токены в cookies | ✅ | `pages/Login`, `api/core/cookies.ts` |
| Refresh access token при 401 | ✅ | `api/core/client.ts` interceptor + retry |
| Session expired → logout/redirect | ✅ | `authSession` bridge → `SESSION_EXPIRED` → `/login` |
| Список постов | ✅ | `pages/Posts`, `modules/posts` |
| Пагинация из headers | ✅ | `X-Pagination-*` → `parsePaginationHeaders` |

## Максимальный функционал

| Функция | Статус | Где |
|---------|--------|-----|
| CRUD постов | ✅ | `PostFormModal`, preview upload, Quill WYSIWYG |
| Ошибки валидации API в формах | ✅ | `useFormApiErrors`, `parseApiError` |
| CRUD авторов | ✅ | `pages/Authors`, avatar upload / removeAvatar |
| CRUD тегов | ✅ | `pages/Tags`, optional `sort` |

## Плюсы из ТЗ и усиления

| Функция | Статус | Комментарий |
|---------|--------|-------------|
| Ant Design | ✅ | `ConfigProvider` + UI-обёртки |
| Lazy load components | ✅ | `React.lazy` + `LazyPage` |
| Lazy load reducers | ✅ | `DynamicModuleLoader` |
| i18n RU/EN | ✅ | Redux `app` + localStorage + AntD locale |
| Orphan authors/tags | ✅ | Safe Render, Select orphan option |
| Domain-split API | ✅ | `api/core`, `auth`, `posts`, `authors`, `tags`, `shared` |

## Архитектура

- `pages/` — UI, `modules/` — state/sagas
- Глобально в store: `router`, `app` (язык)
- Динамически: `auth`, `posts`, `authors`, `tags`
- Protected routes: `AuthRoute` (`private` / `guestOnly`)
- `/` — только редирект на `/posts` или `/login`

## Тестовые данные (из ТЗ)

- Email: `test@test.ru`
- Password: `khro2ij3n2730`

## Итоговая оценка

| Критерий | Оценка |
|----------|--------|
| Обязательный стек | **100%** |
| Минимальный функционал | **100%** |
| Максимальный функционал | **100%** |
| Готовность к сдаче | **~95%+** (полировка сверх ТЗ) |

Статус актуален относительно кода в `src/` и README.
