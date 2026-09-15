# PulseBoard — build brief

Build a small analytics dashboard for a SaaS company from the design in `design/`
and the data in `public/data.json`. Every team gets this same brief so we can
compare *how* you worked, not just what you shipped.

You have **90 minutes**. Ship a running local preview (`npm run dev`) and a passing
acceptance test (`npm test`). Constraint cards will be announced during the sprint.

## What to build

Two pages behind a simple top navigation: **Dashboard** and **Users**. No router is
required; client-side state is fine, but changes made on the Users page must survive
navigating to the Dashboard and back.

### Dashboard — four regions, top to bottom

1. **KPI header row** — four cards, one per entry in `kpis`. Show the label, the
   formatted value, and the change versus last period with a direction indicator.
   Colour the change by whether it is good or bad (`higherIsBetter`).
2. **Revenue chart** — one chart of `revenueSeries` (12 months). Show revenue against
   target. Any charting approach is fine: a library, hand-rolled SVG, or `<canvas>`.
3. **Accounts table** — all 24 `accounts`. Columns: Account, Plan, Region, Owner, MRR,
   Seats, Status, Health. Sortable by clicking column headers. A text filter above
   the table narrows rows by account name, owner, plan, region, or status
   (case-insensitive substring). Show an empty state when nothing matches.
4. **Detail drawer** — clicking a row slides in a panel with the full account record
   (name, plan, region, owner + email, MRR, seats, status, health, signed up, last
   active, notes). Close with a button or the Escape key.

### Users — a CRUD page

A table of every entry in `users` (Name, Email, Role, Team, Status, Last login) and the
four operations:

- **Create** — a "New user" button opens a form (drawer or modal) with Name, Email, Role
  (Admin / Manager / Viewer) and Team. Saving adds the row; new users start as
  `Invited` with no last login.
- **Read** — every row shows the user's data; clicking Edit on a row opens the same form
  pre-filled.
- **Update** — saving the edit form updates the row in place.
- **Delete** — a Delete control on each row asks for confirmation inside the app (not
  `window.confirm`) and then removes the row.

Validation: Name is required, Email must look like an email, and both must be shown as an
inline error without saving. Persistence is in memory for the sprint; `localStorage` is a
bonus, not a requirement.

Formatting: currency as `$85,370` (no cents), percents as `3.2%`, deltas as `+5.5%` /
`-0.4%`. Dates may be displayed however you like.

## Acceptance contract

The test in `tests/acceptance.spec.ts` looks for these hooks. Names are exact.

| Hook | Where | Notes |
| --- | --- | --- |
| `data-testid="kpi-row"` | wrapper of the KPI cards | |
| `data-testid="kpi-card"` | each card (4) | card text includes label and formatted value |
| `data-testid="revenue-chart"` | chart wrapper | must contain an `<svg>` or `<canvas>` and have an accessible name (`aria-label` or `role="img"` + label) |
| `data-testid="table-filter"` | the filter `<input>` | |
| `data-testid="accounts-table"` | the `<table>` | rows live in `<tbody>` |
| `data-testid="account-row"` + `data-account-id="acc-001"` | each `<tbody><tr>` | |
| `data-testid="cell-mrr"` | the MRR cell in each row | |
| `data-testid="sort-mrr"` | the MRR column header control (a `<button>`) | 1st click sorts ascending, 2nd click descending |
| `data-testid="table-empty"` | empty-state element | visible only when the filter matches nothing |
| `data-testid="detail-drawer"` | the drawer | `role="dialog"`; contains account name, owner email, and notes |
| `data-testid="drawer-close"` | the close button inside the drawer | Escape must also close it |

### Users page hooks

| Hook | Where | Notes |
| --- | --- | --- |
| `data-testid="nav-users"` / `data-testid="nav-dashboard"` | top navigation links | |
| `data-testid="users-page"` | the Users page wrapper | visible only on the Users page |
| `data-testid="users-table"` | the users `<table>` | rows live in `<tbody>` |
| `data-testid="user-row"` + `data-user-id="usr-001"` | each `<tbody><tr>` | row text includes name, email and role |
| `data-testid="user-create"` | the "New user" button | |
| `data-testid="user-form"` | the create/edit form (`<form>`) | inputs named `name`, `email`, `team`; a `<select name="role">` |
| `data-testid="user-save"` | the form's submit button | |
| `data-testid="user-cancel"` | closes the form without saving | |
| `data-testid="form-error"` | inline validation message | visible only when validation fails |
| `data-testid="user-edit"` | Edit control inside each row | |
| `data-testid="user-delete"` | Delete control inside each row | |
| `data-testid="confirm-delete"` | the confirmation dialog (`role="dialog"`) | |
| `data-testid="confirm-yes"` / `data-testid="confirm-no"` | its buttons | |

Also: the page `<title>` and `<h1>` both contain "PulseBoard", and loading the page
produces no `console.error` output.

Run `npm test` for the verdict, `npm run test:ui` to debug, and `npm run screenshot`
to capture desktop and mobile screenshots into `screenshots/`.

## Judging (100 points)

| Axis | Points | What we look at |
| --- | --- | --- |
| Speed / functional MVP | 25 | acceptance test green, on time |
| Polish | 25 | fidelity to the design, responsiveness, accessibility, dark mode if drawn |
| Creative prompting | 30 | smartest prompt; use of plan mode, screenshots, Playwright MCP, subagents |
| Recovery & process | 10 | best "Claude went wrong and we saved it" story |
| Audience vote | 10 | crowd favourite from the lightning demos |

Keep your prompts. You will be asked to read your best one out loud.
