# machineheads-admin

Панель администратора для управления постами, авторами и тегами на базе REST API [rest-test.machineheads.ru](https://rest-test.machineheads.ru).

## Стек

| Категория | Технологии |
|-----------|------------|
| Сборка | Vite 8, TypeScript |
| UI | React 18, Ant Design, Tailwind CSS 4 |
| Состояние | Redux, Redux-Saga, redux-dynamic-modules |
| Роутинг | react-router-dom v5, connected-react-router, history v4 |
| API | REST — слой `src/api/` (Axios, cookies, refresh на 401) |

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка
npm run preview  # просмотр build
```

## Структура проекта

```text
src/
├── api/                       # HTTP-клиент, типы, нормализация ответов
├── hooks/                     # Переиспользуемые хуки
├── routes/
│   └── index.tsx              # Маршруты + React.lazy()
├── store/
│   ├── index.ts               # Store + saga extension
│   ├── history.ts             # Единый инстанс history
│   └── modules/
│       └── routerModule.ts    # connected-react-router
├── components/
│   ├── LazyPage.tsx           # Suspense + Ant Design Spin
│   ├── DynamicModuleLoader.tsx
│   ├── Layout/                # MainLayout, Sidebar
│   └── ui/                    # Обёртки над Ant Design
├── pages/                     # Представления (UI)
│   ├── Home/
│   ├── Login/
│   ├── Posts/
│   ├── Authors/
│   └── Tags/
├── modules/                   # Бизнес-логика (reducer + saga + module)
│   ├── auth/
│   ├── posts/
│   ├── authors/
│   └── tags/
├── utils/                     # orphanLabels, entityId, пагинация таблиц
├── App.tsx
└── main.tsx
```

## Архитектурные правила

1. **Разделение UI и логики** — компоненты в `pages/`, reducers/sagas в `modules/`.
2. **Dynamic modules** — бизнес-редьюсеры не регистрируются в глобальном store; подключаются через `DynamicModuleLoader` на странице.
3. **Роутинг в сагах** — навигация через `push('/route')` из `connected-react-router`.
4. **Авторизация** — токены в cookies; при 401 — refresh и повтор запроса.
5. **Стилизация** — Ant Design для UI-компонентов, Tailwind для layout/отступов.
6. **Типизация** — `any` запрещён; все API-ответы и state описываются через `interface` / `type`.

Подробные правила для AI-агента: [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc).

## Консистентность данных (orphan entities)

Поскольку тестовый REST API позволяет удалить автора, который привязан к существующим постам, на фронтенде реализована защита от неконсистентных данных. При обнаружении поста с удалённым автором интерфейс не падает (Safe Rendering), а выводит аккуратную метку `ID: X (Удален)` (или `ФИО (Удален)`, если в ответе есть только имя). В форме редактирования поста предусмотрена возможность переназначить автора на актуального.

Дополнительно учтены типичные нюансы тестового API:

- **string vs number** — ID с бэкенда могут приходить строкой (`"1"`) или числом (`1`). Сравнение идёт через нормализацию (`Number`), иначе живые авторы/теги ошибочно помечаются как удалённые.
- **Формат ФИО** — в списке постов `authorName` приходит как `Last name Name Second name`. Тот же порядок используется при сопоставлении с каталогом авторов и в UI.
- **Теги** — в таблице отсутствующие теги помечаются как удалённые; в `Select mode="multiple"` «голые» ID можно снять крестиком перед сохранением.
- **Приоритет тега (`sort`)** — поле необязательное: часть тегов на бэкенде его не содержит, форма и таблица это допускают (`—` в списке, пустое значение не уходит в FormData).

## Маршруты

| Путь | Страница | Статус |
|------|----------|--------|
| `/` | Home | редирект / дашборд |
| `/login` | Login | готово |
| `/posts` | Posts | CRUD + серверная пагинация |
| `/authors` | Authors | CRUD + клиентская пагинация |
| `/tags` | Tags | CRUD + клиентская пагинация |

## Модули

| Модуль | Назначение | Файлы |
|--------|------------|-------|
| `auth` | Сессия, токены, login/logout | `auth.module.ts`, `reducer.ts`, `sagas.ts` |
| `posts` | Список постов, CRUD, пагинация, справочники | `posts.module.ts`, `reducer.ts`, `sagas.ts` |
| `authors` | CRUD авторов | `authors.module.ts`, `reducer.ts`, `sagas.ts` |
| `tags` | CRUD тегов | `tags.module.ts`, `reducer.ts`, `sagas.ts` |

## Соответствие ТЗ

Подробный разбор — в разделе [docs/TZ_COMPLIANCE.md](docs/TZ_COMPLIANCE.md).

## Тестовые данные (из ТЗ)

- Email: `admin@machineheads.ru`
- Password: `khro2ij3n2730`

## Текущий статус

- [x] Vite + React 18 + TypeScript
- [x] Redux + Saga + redux-dynamic-modules
- [x] connected-react-router
- [x] Ant Design + Tailwind
- [x] Lazy load страниц
- [x] HTTP-клиент с интерцепторами (cookies + refresh)
- [x] CRUD постов / авторов / тегов
- [x] Защита от данных-сирот (Safe Render, Select, нормализация ID)
- [x] Опциональный `sort` у тегов
- [x] ФИО автора в формате API (`Last name Name Second name`)
