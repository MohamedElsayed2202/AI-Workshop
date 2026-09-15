# PulseBoard — architecture

Two pages (Dashboard, Users) built as independent modules behind a mocked HTTP API.
The guiding rule is that a requirement change should land in one file.

## Module map

```
src/
  app/          composition root: providers, router, shell, configuration
  mocks/        the API seam — MSW handlers + the mock database
  shared/       cross-cutting UI primitives, helpers, hooks, store factory
  auth/         login page, session store, route guard
  dashboard/    KPIs, revenue chart, accounts table, account detail
  users/        users CRUD
```

Path aliases (`@shared/*`, `@dashboard/*`, `@users/*`, `@/*`) are declared once in
`tsconfig.base.json` and mirrored in `vite.config.ts`.

A feature folder is `features/<feature>/{ui,hooks,utils.ts,schemas.ts}`: `ui/` holds
markup only, `hooks/` holds React logic, and `utils.ts` / `schemas.ts` hold pure
functions with no React import.

## The API seam

No component reads `public/data.json`. MSW serves it over HTTP:

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
- **Zustand (+ Immer)** owns UI state only — which overlay is open and what it acts on.
- Local component state owns the accounts filter and sort, behind
  `useAccountsTable()`. Moving that into the URL with nuqs is a change to that one hook.

## Configuration

| Variable | Values | Default | Effect |
| --- | --- | --- | --- |
| `VITE_USER_FORM_PRESENTATION` | `dialog`, `drawer` | `dialog` | How the create/edit user form is presented |
| `VITE_AUTH_ENABLED` | `true`, `false` | `true` | Whether the login gate is enforced |
| `VITE_API_URL` | any base URL | `/api` | Where the HTTP client points |

Read and validated in `src/app/config.ts`; anything unrecognised falls back to the
default. Individual call sites can still override — `<UserFormOverlay presentation="drawer" />`.

`OverlayPanel` is the shared primitive behind both forms: MUI supplies behaviour
(focus trap, Escape, portal, scroll lock) and Tailwind supplies every visual.

## Authentication

`RequireAuth` guards every app route; `/login` sits outside it. Credentials are checked
by `POST /api/login` in `src/mocks/handlers/auth.ts` (workshop credentials: `root` /
`root`) — the password exists only in that handler, never in a component. The returned
session lives in a module-level Zustand store and is mirrored to `localStorage`, so it
survives a reload. A guard redirect remembers the intended path, so signing in from a
deep link lands back on that page.

The gate is **on by default**: an unauthenticated visitor is redirected to `/login` from
any route, and the intended path is restored after signing in. Requests carry
`Authorization: Bearer <token>`, and a 401 from any endpoint other than `/login` clears
the session, which re-renders the guard and returns the visitor to the login page.

`tests/acceptance.spec.ts` loads `/` and expects the dashboard with no sign-in step, and
that file must not be edited — so **the acceptance suite must be run with the gate off**:

```bash
VITE_AUTH_ENABLED=false npm test     # 13/13
npm test                             # fails: the suite never signs in
```

## Theming

All colour lives in `src/index.css` as CSS custom properties, mapped into Tailwind in
`tailwind.config.ts`. The light palette sits on bare `:root`; the dark palette is applied
both for `prefers-color-scheme: dark` and for an explicit `data-theme="dark"`, so the
header toggle wins in either direction. A rebrand is a one-file change.

## Responsive

One navigation that reflows — never a second, CSS-hidden mobile copy, which would break
Playwright's strict-mode uniqueness on `nav-users` / `nav-dashboard`. KPI cards go 4-up →
2×2. Both tables sit in their own `overflow-x-auto` container so the page body never
scrolls sideways. The revenue chart measures its container and draws at 1:1, so its labels
stay legible at 375 px rather than scaling down with a fixed `viewBox`.
