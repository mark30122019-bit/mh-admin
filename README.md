# machineheads-admin

Панель администратора для управления постами, авторами и тегами. REST API: [rest-test.machineheads.ru](https://rest-test.machineheads.ru).

## Стек

| Категория | Технологии |
|-----------|------------|
| Сборка | Vite 8, TypeScript |
| UI | React 18, Ant Design, Tailwind CSS 4 |
| Состояние | Redux, Redux-Saga, redux-dynamic-modules |
| Роутинг | react-router-dom v5, connected-react-router, history v4 |
| API | Axios, cookies, refresh на 401 (`src/api/`) |

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Тестовые креды (из ТЗ): `test@test.ru` / `khro2ij3n2730`.

## Структура

```text
src/
├── api/                 # REST по доменам (core, auth, posts, authors, tags, shared)
├── hooks/
├── i18n/
├── routes/index.tsx     # маршруты; AdminShell + AuthRoute
├── store/               # корневой store: router + app (язык)
├── components/          # Layout, AuthProvider, DynamicModuleLoader, ui/
├── pages/               # UI (Posts, Authors, Tags, Login, Home)
├── modules/             # reducer + saga: auth, posts, authors, tags, app
├── utils/
├── App.tsx
└── main.tsx
```

## Архитектура

1. **UI / логика** — `pages/` и `modules/` разделены.
2. **Dynamic modules** — бизнес-редьюсеры не в корневом store: `auth` через `AuthProvider`, `posts` + `authors` + `tags` один раз в `AdminShell` (layout не мигает при смене раздела).
3. **Роутинг в сагах** — `push()` из `connected-react-router`.
4. **Авторизация** — токены в cookies; на 401 — refresh и повтор запроса.
5. **Lazy** — `React.lazy` для Login/Home; страницы админки — обычный импорт (стабильный shell).
6. **Стили** — Ant Design + Tailwind для layout.

Правила для агента: [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc).

## UX

- Фокус на desktop / tablet (B2B CMS); полноценный mobile не делали намеренно.
- В таблице постов `authorName` / `tagNames` показываются как в ответе API; пустое значение — прочерк. Назначить автора или теги снова можно через обычный Edit.
- У тега поле `sort` необязательное (`—` в списке, пустое не уходит в FormData).

## i18n

Redux `app.language` + `localStorage.app_lang` + Ant Design `ConfigProvider` locale + `useTranslation()`.

## Маршруты

| Путь | Страница |
|------|----------|
| `/` | редирект на `/posts` или `/login` |
| `/login` | Login |
| `/posts` | CRUD + серверная пагинация |
| `/authors` | CRUD + клиентская пагинация |
| `/tags` | CRUD + клиентская пагинация |

## Соответствие ТЗ

Разбор: [docs/TZ_COMPLIANCE.md](docs/TZ_COMPLIANCE.md).
