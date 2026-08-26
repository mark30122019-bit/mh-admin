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
├── api/                       # REST-слой по доменам
│   ├── core/                  # client, cookies, errors, constants
│   ├── auth/
│   ├── posts/
│   ├── authors/
│   ├── tags/
│   └── shared/                # pagination, page size
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

## UX и адаптив

- **Интерфейсный фокус (Desktop & Tablet First):** В соответствии со спецификой B2B/CMS систем, интерфейс панели администратора оптимизирован под экраны мониторов, ноутбуков и планшетов. Полноценный мобильный адаптив (под смартфоны) умышленно опущен как избыточный (оверинжиниринг), смещающий фокус с ключевой бизнес-логики и контракта REST API.

## Нет автора или тега у поста

Если у поста нет автора (в том числе после удаления автора в другом разделе) — в колонке обычный прочерк. Админ открывает редактирование и выбирает автора в Select, как при создании.

Удалённый тег из колонки просто пропадает; если тегов не осталось — тоже прочерк. Добавить снова можно через обычное редактирование поста.

**Приоритет тега (`sort`).** Поле необязательное: часть тегов на бэкенде его не содержит, форма и таблица это допускают (`—` в списке, пустое значение не уходит в FormData).

## Интернационализация (i18n)

Гибридная схема **Redux + localStorage**, синхронизированная с Ant Design:

- Глобальный модуль `modules/app` хранит `language: 'ru' | 'en'` (старт из `localStorage.app_lang`, фолбек `ru`).
- Экшен `changeLanguage` обновляет Redux и сразу пишет язык в `localStorage`.
- `AppConfigProvider` читает язык и передаёт `locale={ruRU | enUS}` в Ant Design `ConfigProvider`.
- Кастомные строки — через хук `useTranslation()` и словари `src/i18n/dictionaries.ts`.
- Переключатель RU/EN — в шапке (`LanguageSwitcher`) и на экране логина.

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

- Email: `test@test.ru`
- Password: `khro2ij3n2730`

## Текущий статус

- [x] Vite + React 18 + TypeScript
- [x] Redux + Saga + redux-dynamic-modules
- [x] connected-react-router
- [x] Ant Design + Tailwind
- [x] Lazy load страниц
- [x] HTTP-клиент с интерцепторами (cookies + refresh)
- [x] CRUD постов / авторов / тегов
- [x] Нет автора/тега у поста: прочерк в таблице, правка обычным редактированием
- [x] Опциональный `sort` у тегов
- [x] ФИО автора в формате API (`Last name Name Second name`)
- [x] i18n (Redux + localStorage + Ant Design locale)
