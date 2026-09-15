# PulseBoard — architecture

Two pages (Dashboard, Users) behind a login, built as feature modules on top of an
in-house design system. The guiding rule is that a requirement change should land
in one file.

## Zero UI frameworks

There is no component library and no CSS framework. The dependency list is
deliberately short: React, React Router, TanStack Query, Zustand, React Hook Form,
Yup, ts-pattern, MSW, Recharts, and StyleX.

- **Styling — StyleX.** Atomic, compile-time CSS. No `className` strings, no
  utility framework, no runtime style engine.
- **Charts — Recharts.** The one visual dependency, used for the revenue chart.
- **Everything else is a native element.** Overlays are the platform `<dialog>`,
  which brings its own focus trap, Escape handling, inert background and top-layer
  stacking. Selects are real `<select>`s.

## Module map

```
src/
  app/          composition root: providers, router, templates, configuration
  mocks/        the API seam — MSW handlers + the mock database
  shared/       design tokens, the design system, helpers, hooks, store factory
  auth/         login, session, route guard
  dashboard/    KPIs, revenue chart, accounts table, account detail
  users/        users CRUD
```

Path aliases (`@shared/*`, `@dashboard/*`, `@users/*`, `@auth/*`, `@/*`) are declared
in `tsconfig.base.json` and mirrored in `vite.config.ts` — once for Vite's resolver
and once for the StyleX compiler, which resolves token imports itself.

## Atomic design, applied per module

The taxonomy describes components; the modules describe ownership. They compose
rather than compete.

| Level | Where | Examples |
| --- | --- | --- |
| **Atoms** | `shared/design-system/atoms/` | `Button`, `TextField`, `Select`, `Badge`, `Avatar`, `HealthBar`, `VisuallyHidden` |
| **Molecules** | `shared/design-system/molecules/` | `Card`, `FormField`, `Modal`, `ConfirmDialog`, `DataTable`, `SortableHeader`, `EmptyState`, `ThemeToggle` |
| **Molecules (domain)** | `<module>/features/<feature>/molecules/` | `KpiCard`, `AccountRow`, `UserRow`, `AccountStatusBadge` |
| **Organisms** | `<module>/features/<feature>/organisms/` | `KpiRow`, `RevenueChart`, `AccountsCard`, `AccountDetailDrawer`, `UsersTable`, `UserFormView`, `LoginForm` |
| **Templates** | `app/templates/` | `AppShell`, `ThemeRoot` |
| **Pages** | `<module>/pages/` | `DashboardPage`, `UsersPage`, `LoginPage` |

An atom never imports another design-system component. A domain molecule maps domain
meaning onto a generic atom — `AccountStatusBadge` decides that "At risk" is a `warn`
tone, and `Badge` knows nothing about accounts.

Logic stays out of all of them: pure functions live in `utils.ts` / `schemas.ts`, and
React logic in `hooks/`. Components read props and a hook, and compute nothing.

## Design tokens

`shared/design/tokens.stylex.ts` defines every colour, space, radius, type size and
shadow with `stylex.defineVars`. Each colour carries its own
`@media (prefers-color-scheme: dark)` value, which covers visitors who never touch the
toggle. `shared/design/themes.stylex.ts` adds explicit `lightTheme` / `darkTheme` via
`stylex.createTheme`, applied by `ThemeRoot`, so the toggle overrides the system
preference in both directions. `media.stylex.ts` holds the breakpoints as
`stylex.defineConsts` — StyleX only inlines compile-time constants from `.stylex` files.

A rebrand is a change to those three files.

## The API seam

No component reads `public/data.json`. MSW serves it over HTTP.

| Route | Purpose |
| --- | --- |
| `POST /api/login` | sign in — 401 on bad credentials |
| `GET /api/dashboard` | meta, KPIs, revenue series, accounts |
| `GET /api/users` | the user list |
| `POST /api/users` | create — the server assigns `id`, `status: "Invited"`, `lastLoginAt: null` |
| `PATCH /api/users/:id` | update in place |
| `DELETE /api/users/:id` | remove |

`src/mocks/db.ts` seeds from `data.json` once and writes users through to
`localStorage`. Swapping in a real backend means deleting `src/mocks/` and pointing
`VITE_API_URL` at the real base URL — no component changes.

## State ownership

- **TanStack Query** owns everything served over HTTP, users included. Mutations
  invalidate `['users']`, which is why edits survive navigating away and back.
- **Zustand (+ Immer)** owns UI state only — which overlay is open, the theme preference, and the session.
- Local state owns the accounts filter and sort, behind `useAccountsTable()`.

## Authentication

`RequireAuth` guards every app route; `/login` sits outside it. Credentials are checked
by `POST /api/login` in `src/mocks/handlers/auth.ts` (workshop credentials: `root` /
`root`) — the password exists only in that handler. The session lives in a module-level
Zustand store mirrored to `localStorage`, so it survives a reload, and a guard redirect
remembers the intended path. Requests carry `Authorization: Bearer <token>`; a 401 from
any other endpoint clears the session and returns the visitor to the login page.

The gate is **on by default**. `tests/acceptance.spec.ts` loads `/` and expects the
dashboard with no sign-in step, and that file must not be edited, so the suite must run
with the gate off:

```bash
VITE_AUTH_ENABLED=false npm test     # 13/13
npm test                             # fails: the suite never signs in
```

## Configuration

| Variable | Values | Default | Effect |
| --- | --- | --- | --- |
| `VITE_USER_FORM_PRESENTATION` | `dialog`, `drawer` | `dialog` | How the create/edit user form is presented |
| `VITE_AUTH_ENABLED` | `true`, `false` | `true` | Whether the login gate is enforced |
| `VITE_API_URL` | any base URL | `/api` | Where the HTTP client points |

Read and validated in `src/app/config.ts`; anything unrecognised falls back to the
default. Call sites can still override — `<UserFormOverlay presentation="drawer" />`.

## Responsive

One navigation that reflows — never a second, CSS-hidden mobile copy, which would break
Playwright's strict-mode uniqueness on `nav-users` / `nav-dashboard`. KPI cards go 4-up →
2×2. Both tables sit in a `DataTable` with its own `overflow-x-auto` container so the page
body never scrolls sideways; `VisuallyHidden` is `position: relative` for the same reason.
The revenue chart measures its container and picks a height and type size per breakpoint.

## A note on native `<dialog>`

The effect that opens a dialog returns a cleanup that closes it. The native `close`
event is deliberately **not** wired to the caller's `onClose`: under StrictMode the
effect runs mount → cleanup → mount, and that cleanup's `close()` would otherwise
dismiss the dialog the instant it opened. Escape is handled through `onCancel`, and a
backdrop click by comparing `event.target` to the dialog element.
