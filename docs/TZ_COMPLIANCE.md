# Соответствие структуры проекта ТЗ

Источник: [Тестовое задание REACT JS](https://docs.google.com/document/d/14gBYc9NiOID9rbPv6Xt3Ihu8xRv-JHy7C9rClWdqeLY/edit)

## Обязательные требования ТЗ

| Требование | Статус | Комментарий |
|------------|--------|-------------|
| React | ✅ Готово | React 18.3.1 (downgrade из-за connected-react-router) |
| Redux | ✅ Готово | `store/index.ts`, redux-dynamic-modules |
| Redux-Saga | ✅ Готово | `getSagaExtension()`, заглушки sagas в `modules/` |
| react-router-dom | ✅ Готово | v5, lazy routes в `routes/index.tsx` |
| connected-react-router | ✅ Готово | `routerModule.ts`, `ConnectedRouter` в `App.tsx` |
| TypeScript | ✅ Готово | strict typing, без `any` в каркасе |
| REST API интеграция | 🟡 Каркас | `src/api/` создан, логика запросов — TODO |
| Авторизация + cookies | 🟡 Каркас | `modules/auth/`, `pages/Login/` — без реализации |
| Refresh token при 401 | ⬜ TODO | Планируется в `src/api/client.ts` + auth saga |
| Список постов + пагинация | 🟡 Каркас | `modules/posts/` — без реализации |
| UI библиотека (Ant Design) | ✅ Готово | Подключён `ConfigProvider`, компоненты доступны |
| Lazy load components | ✅ Готово | `React.lazy` + `LazyPage` |
| Lazy load reducers | ✅ Готово | `redux-dynamic-modules` + `DynamicModuleLoader` |

**Легенда:** ✅ реализовано · 🟡 структура/заглушка · ⬜ не начато

## Минимальный функционал (обязательный по смыслу ТЗ)

| Функция | Структура | Реализация |
|---------|-----------|------------|
| Login + сохранение токенов в cookies | `pages/Login`, `modules/auth` | ⬜ |
| Refresh access token | `modules/auth/sagas`, `api/client` | ⬜ |
| Список постов | `modules/posts`, будущая `pages/Posts` | ⬜ |
| Пагинация из headers | `modules/posts/sagas` | ⬜ |

## Максимальный функционал (опционально по ТЗ)

| Функция | Структура | Реализация |
|---------|-----------|------------|
| CRUD постов | `modules/posts` | ⬜ |
| CRUD авторов | `modules/authors` | ⬜ |
| CRUD тегов | `modules/tags` | ⬜ |
| Валидация форм / ошибки API | будущие form-компоненты | ⬜ |

## Насколько архитектура соответствует ТЗ

### Полное соответствие (100%)

- Обязательный стек библиотек выбран и подключён.
- React 18 вместо 19 — осознанное решение для совместимости с `connected-react-router`.
- Dynamic modules позволяют lazy-load reducers per page — это «плюс» из ТЗ.
- Разделение `pages/` (UI) и `modules/` (state/sagas) готовит проект к масштабированию под все сущности ТЗ.

### Частичное соответствие (каркас ~30% функционала)

- Папки и заглушки модулей покрывают все сущности ТЗ: auth, posts, authors, tags.
- Страницы `Home` и `Login` существуют, но без бизнес-UI.
- API-слой объявлен, но axios/интерцепторы не подключены.
- `Layout/` (MainLayout, Sidebar) — заглушки для будущей навигации по разделам.

### Не реализовано (ожидаемо на текущем этапе)

- Работа с cookies (js-cookie или аналог не установлен).
- Protected routes (guard для неавторизованных).
- Страницы Posts / Authors / Tags (не создавались по договорённости — только структура модулей).
- Обработка validation errors из REST API.

## Рекомендуемый порядок реализации

1. `api/client.ts` — axios + interceptors + типы ответов API
2. `modules/auth` — login saga, cookies, redirect через `push()`
3. `pages/Login` — форма Ant Design
4. `modules/posts` — fetch list + pagination headers
5. `pages/Posts` (новая) — таблица Ant Design + DynamicModuleLoader
6. CRUD постов → authors → tags

## Итоговая оценка

| Критерий | Оценка |
|----------|--------|
| Соответствие обязательному стеку | **100%** |
| Соответствие архитектурной структуре ТЗ/правилам | **~95%** (нет страниц Posts/Authors/Tags — только modules) |
| Готовность функционала к сдаче ТЗ | **~10%** (инфраструктура, без features) |

Структура проекта **правильно заложена** под полное выполнение ТЗ; следующий этап — реализация auth и posts как минимального обязательного функционала.
