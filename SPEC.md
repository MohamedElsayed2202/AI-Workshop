# PulseBoard — build brief

Build a small analytics dashboard for a SaaS company from the design in `design/`
and the data in `public/data.json`. Every team gets this same brief so we can
compare *how* you worked, not just what you shipped.

You have **90 minutes**. Ship a running local preview (`npm run dev`) and a passing
acceptance test (`npm test`). Constraint cards will be announced during the sprint.

## What to build

One page, four regions, top to bottom:

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
