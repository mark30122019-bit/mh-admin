# Соответствие ТЗ

Источник: [Тестовое задание REACT JS](https://docs.google.com/document/d/14gBYc9NiOID9rbPv6Xt3Ihu8xRv-JHy7C9rClWdqeLY/edit)

**Легенда:** ✅ сделано · 🟡 частично · ❌ нет

## Обязательный стек

| Требование | Статус | Как у нас |
|------------|--------|-----------|
| React | ✅ | React 18.3 (`connected-react-router` не на 19) |
| TypeScript | ✅ | без `any` |
| Redux | ✅ | store + `redux-dynamic-modules` |
| Redux-Saga | ✅ | `modules/*/sagas.ts` |
| react-router-dom | ✅ | v5 |
| connected-react-router | ✅ | `ConnectedRouter`, `push()` в сагах |

## Минимальный функционал

| Требование | Статус | Где |
|------------|--------|-----|
| Авторизация, access + refresh в cookies | ✅ | Login, `api/core/cookies.ts` |
| Refresh при истечении токена | ✅ | interceptor 401 → refresh → retry |
| Список постов + пагинация из headers | ✅ | `X-Pagination-*`, `pages/Posts` |

## Максимальный функционал (по желанию в ТЗ)

| Требование | Статус | Где |
|------------|--------|-----|
| CRUD постов | ✅ | create / edit / delete, preview, Quill |
| Ошибки валидации и системные ошибки в форме поста | ✅ | `useFormApiErrors`, `parseApiError` |
| CRUD авторов | ✅ | avatar, removeAvatar |
| CRUD тегов | ✅ | optional `sort` |

## Плюсы из ТЗ

| Плюс | Статус | Комментарий |
|------|--------|-------------|
| Ant Design | ✅ | UI-обёртки + `ConfigProvider` |
| Lazy load components | ✅ | `lazyWithPreload` + один Suspense в `AdminShell`; prefetch hover/warm; без Spin на списках |
| Lazy load reducers | ✅ | `redux-dynamic-modules`: auth / posts / authors / tags не в корневом store |

## Что в ТЗ не требовалось (сделано сверху)

- i18n RU/EN
- скелетоны таблиц / форм
- desktop/tablet layout, overflow tags, focus-revalidation списков

## Архитектура (кратко)

- В корневом store: `router`, `app` (язык)
- Динамически: `auth`, `posts`, `authors`, `tags`
- API разбит по доменам: `api/core`, `auth`, `posts`, `authors`, `tags`, `shared`
- `/` — только редирект

## Тестовые данные (из ТЗ)

- Email: `test@test.ru`
- Password: `khro2ij3n2730`

## Итог

| Блок ТЗ | Оценка |
|---------|--------|
| Обязательный стек | 100% |
| Минимальный функционал | 100% |
| Максимальный функционал | 100% |
| Плюсы (Ant + lazy) | полностью |

**Вывод:** обязательное, максимальное и плюсы по ТЗ закрыты. К сдаче готово.
