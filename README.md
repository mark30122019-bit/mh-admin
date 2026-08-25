# machineheads-admin

Панель администратора для управления постами на базе REST API [machineheads.ru](http://machineheads.ru).

## Стек

| Категория | Технологии |
|-----------|------------|
| Сборка | Vite 8, TypeScript 6 |
| UI | React 18, Ant Design, Tailwind CSS 4 |
| Состояние | Redux, Redux-Saga, redux-dynamic-modules |
| Роутинг | react-router-dom v5, connected-react-router, history v4 |
| API | REST (`http://machineheads.ru`) — слой `src/api/` |

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
├── api/                       # HTTP-клиент, константы, интерцепторы (TODO)
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
│   └── Layout/                # MainLayout, Sidebar
├── pages/                     # Представления (UI)
│   ├── Home/                  # Дашборд
│   └── Login/                 # Авторизация
├── modules/                   # Бизнес-логика (reducer + saga + module)
│   ├── auth/
│   ├── posts/
│   ├── authors/
│   └── tags/
├── App.tsx
└── main.tsx
```

## Архитектурные правила

1. **Разделение UI и логики** — компоненты в `pages/`, reducers/sagas в `modules/`.
2. **Dynamic modules** — бизнес-редьюсеры не регистрируются в глобальном store; подключаются через `DynamicModuleLoader` на странице.
3. **Роутинг в сагах** — навигация через `push('/route')` из `connected-react-router`.
4. **Авторизация** — токены в cookies; refresh при 401 (TODO в `src/api/`).
5. **Стилизация** — Ant Design для UI-компонентов, Tailwind для layout/отступов.
6. **Типизация** — `any` запрещён; все API-ответы и state описываются через `interface` / `type`.

Подробные правила для AI-агента: [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc).

## Маршруты

| Путь | Страница | Статус |
|------|----------|--------|
| `/` | Home (дашборд) | заглушка |
| `/login` | Login | заглушка |

## Модули

| Модуль | Назначение | Файлы |
|--------|------------|-------|
| `auth` | Сессия, токены, login/logout | `auth.module.ts`, `reducer.ts`, `sagas.ts` |
| `posts` | Список постов, CRUD, пагинация | `posts.module.ts`, `reducer.ts`, `sagas.ts` |
| `authors` | CRUD авторов | `authors.module.ts`, `reducer.ts`, `sagas.ts` |
| `tags` | CRUD тегов | `tags.module.ts`, `reducer.ts`, `sagas.ts` |

## Соответствие ТЗ

Подробный разбор — в разделе [docs/TZ_COMPLIANCE.md](docs/TZ_COMPLIANCE.md).

**Кратко:** инфраструктура и архитектура соответствуют обязательным требованиям ТЗ; бизнес-функционал (авторизация, посты, CRUD) — в стадии заглушек и предстоит реализация.

## Тестовые данные (из ТЗ)

- Email: `admin@machineheads.ru`
- Password: `khro2ij3n2730`

## Текущий статус

- [x] Vite + React 18 + TypeScript
- [x] Redux + Saga + redux-dynamic-modules
- [x] connected-react-router
- [x] Ant Design + Tailwind
- [x] Lazy load страниц
- [x] Файловая структура по архитектурному эталону
- [ ] HTTP-клиент с интерцепторами
- [ ] Авторизация (cookies + refresh)
- [ ] Список постов с пагинацией
- [ ] CRUD постов / авторов / тегов
