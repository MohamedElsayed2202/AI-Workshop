# CLAUDE.md

Keep your replies extremely concise and focus on conveying the key information.
No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST
look up the official documentation to ensure that you're working with up-to-date
information.

Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commit Message Format

Follow the Conventional Commits format: `<type>(<scope>): <description> #PROJ-XXXX`

- **Type:** `feat` | `fix` | `refactor` | `style` | `test` | `docs` | `build` | `perf` | `ci` | `chore`
- **Scope:** feature area (typically the folder name under `src/features/`)
- **Description:** present tense, lowercase, no period
- **Ticket ID:** extract from `$GIT_BRANCH_NAME`

Examples:
```
feat(analytics/outreach): add free personal outreach functionality #DBC-9931
fix(profile): resolve preview issue for opted-out users #MMP-10098
fix(dbc/profiles): resolve preview issue for opted-out users #DBC-10098
feat(apple-wallet): implement new button design #DBC-9197
fix(auth): resolve restricted domains logout issue #DBC-9804
```

The commit message can optionally include a body after a blank line for additional details.

## Build & Development Commands

```bash
# Package manager: pnpm
pnpm install                      # Install dependencies

# Development
pnpm run dev                      # Start dev server (port 3000)
pnpm run start:host               # Dev server accessible from network

# Building (two build targets: main app + webapp/Module Federation)
pnpm run build                    # TypeScript check + Vite build (main app)
pnpm run build:staging:all        # Build both main + webapp for staging
pnpm run build:production:all     # Build both for production

# Testing (Vitest with jsdom)
pnpm run test                     # Run tests in watch mode
npx vitest run path/to/file.test.ts  # Run a single test file
pnpm run coverage                 # Generate coverage report

# E2E (Cypress)
pnpm run cypress:open             # Interactive mode
pnpm run e2e                      # Headless mode

# Code Quality
pnpm run lint                     # ESLint with auto-fix
pnpm run test:lint                # ESLint check only (CI)
pnpm run format                   # Prettier formatting

# Storybook
pnpm run storybook                # Dev mode (port 6006)
```

## Architecture

React 19 + TypeScript application built with Vite. Uses MUI 7 for UI components
and Tailwind CSS 3 for utility styling.

### Module Structure

The app is organized into domain modules with TypeScript path aliases:

| Alias                   | Path                           | Description                                         |
| ----------------------- | ------------------------------ | --------------------------------------------------- |
| `@shared/*`             | `src/shared/*`                 | Cross-cutting components, hooks, helpers, providers |
| `@dbc/*`                | `src/digital-business-cards/*` | Digital business cards module                       |
| `@me/*`                 | `src/manage-events/*`          | Event management module                             |
| `@meeting-management/*` | `src/meeting-management/*`     | Meeting management module                           |
| `@scheduler/*`          | `src/scheduler/*`              | Scheduler module                                    |
| `@freemium/*`           | `src/freemium/*`               | Billing/subscription module                         |
| `@/*`                   | `src/*`                        | Catch-all for any src path                          |

Each module has its own `routes.ts`, feature folders, stores, and queries.
Routes are composed in `src/AppRoutes.tsx`.

- **Source of Truth:** All path aliases are created and updated in
  `tsconfig.base.json`.

### Two Build Targets

- **Main app** (`vite.config.ts`): Builds to `build/`, served at `/n`
- **Webapp** (`vite.config.webapp.ts`): Module Federation build to `build/ngw/`,
  served at `/n/ngw`. Exposes components (contracts, document-group) as
  federated modules.

### State Management

- **Server state**: TanStack React Query v5 — each feature has `queries.ts`
  files using `queryOptions` pattern. Always include
  `placeholderData: keepPreviousData` (imported from `@tanstack/react-query`)
  in any `useQuery` call that powers a table, to prevent layout shifts during refetches
- **Client state**: Zustand v5 with Immer — stores in module-level `stores/`
  directories, created via `src/shared/stores/createStore.ts`
- **URL state**: nuqs v2 for URL search param synchronization

### API Layer

- Axios with instance configured in `src/shared/helpers/axios.ts` (baseURL from
  `VITE_API_URL`, 30s timeout)
- Auth interceptors handle token refresh on 401/403 automatically
- MSW (Mock Service Worker) for local dev mocking — handlers in `src/mocks/`

### Authentication

Strategy-based auth system in `src/authentication/`:

- `RootAuthProvider` selects strategy based on environment (Web, Dev, ULC
  launcher)
- Tokens stored in cookies (web) or localStorage (ULC)
- Dev auth uses MSW to bypass login — configure `VITE_DEV_AUTH_*` env vars

### Styling

Tailwind classes are scoped under `.next-gen` (for Module Federation isolation).
MUI theme in `src/theme.ts` uses CSS variables for dynamic brand colors via
`BrandProvider`. Use `clsx` and `tailwind-merge` for conditional class
composition.

### Internationalization

i18next with 7 namespaces: `translation`, `mmpTranslation`, `dbcTranslation`,
`meTranslation`, `freemiumTranslation`, `eiTranslation`, `webappTranslation`.
Translations loaded via HTTP backend.

**i18n key rules (enforced across the team):**

1. **Static string literals only.** Every `t()` / `i18next.t()` / `<Trans
   i18nKey="..." />` call must receive a plain string literal. No template
   literals (`` t(`x.${y}`) ``), no variables (`t(someVar)`), no lookups
   (`t(MAP[key])`), no enum-value refs (`t(EnumName.value)`). Our tooling
   relies on regex extraction — anything dynamic is invisible.
2. **Dynamic labels → build a static map inside the component.** When a label
   depends on runtime data, define a local `Record<Key, string>` where each
   value is a static `t('...')` call, then look up by key:
   ```tsx
   const labels: Record<Category, string> = {
     target: t('accountCategories.target'),
     leads: t('accountCategories.leads'),
   }
   // usage: labels[cat]
   ```
3. **Don't store i18n keys in shared constants modules.** If multiple components
   need the same labels, each declares its own local static map. Shared
   constants can't satisfy rule 1 because lookups become dynamic.
4. **Don't use `getEnumOptions(enum, { t })` for tab labels.** It produces
   `t(enumKey)` at runtime — not regex-extractable and couples enum identifiers
   to i18n keys. Build the options array with explicit `{ label: t('x.y'),
   value: Enum.y }` entries.
5. **Naming pattern for component-scoped keys:** use camelCased component name
   as namespace, then `tabs` / `previewTabs` / etc:
   `{componentName}.tabs.{tabKey}` — e.g. `setupPage.tabs.personal`,
   `eventSessions.tabs.speakers`. Keeps keys discoverable and avoids generic
   names colliding across features.
6. **Capitalize label values.** Use Title Case for tab labels, headings, and
   buttons (e.g. `"Connections"`, not `"connections"`). The key stays camelCase;
   only the value is capitalized.

### Forms

React Hook Form v7 with Yup validation schemas and `@hookform/resolvers`.

### Component File Structure & Separation of Concerns

When creating, refactoring, or updating React components (especially forms), you
MUST strictly enforce the following file structure to ensure readability:

1. **Main Component Visibility:** The main React component MUST be the very
   first thing the developer sees in the file (after imports and types). Do not
   bury the component below massive configurations, schemas, or utilities.
2. **Dedicated Schema File:** All Yup validation schemas, custom validation
   logic, and error message helpers must be extracted into a separate
   `schemas.ts` file alongside the component.
3. **Dedicated Utils File:** All data transformation functions (e.g.,
   `apiToForm`, `formToApi`, or any `xToYTransform()` mapping) and complex
   standalone business logic must be placed in a separate `utils.ts` file.

### Naming Conventions

When writing or refactoring code, absolutely never use single-letter variables,
arguments, or loop indices (such as `n`, `c`, `v`, `e`, `i`, `j`, etc.). There
are no exceptions. Always use descriptive, self-documenting names for
everything, including loops and events (e.g., `numericValue`, `index`, `event`,
`currentIndex`, `count`).

### Key Providers (wrap order in App.tsx)

`SentryProvider` > `ReactQueryProvider` > `BrandProvider` > `MuiProvider` >
`SnackbarProvider` > `ConfirmationDialogProvider` > `NuqsAdapter` >
`AuthProvider`

### CI/CD

Bitbucket Pipelines (`bitbucket-pipelines.yml`). Pre-commit hooks via Husky +
lint-staged (ESLint on staged `.{js,jsx,ts,tsx}` files).

### Config

- ESLint: flat config (`eslint.config.js`), extends `@scr2em/config/eslint`
- Prettier: `.prettierrc.js`, extends `@scr2em/config/prettier`
- Tailwind: `tailwind.config.ts` with custom font scale (0.8x) and CSS
  variable-based colors

# MCP Servers

## Figma MCP server rules

These rules govern every Figma-driven code change. Follow them without
exception.

### 1. Token Efficiency — Query Rules

- **Always pass `excludeScreenshot: true`** on every Figma MCP call
  (`get_design_context`, etc.)
- **Always provide a specific `nodeId`** from the URL (`node-id` param, convert
  `-` → `:`). Never query whole-file payloads
- **Default depth: 1.** Only increase depth when the user explicitly asks to go
  deeper or child layers are missing critical layout data
- Before fetching node data, check if design styles or variables suffice
  (`get_file_styles` / `get_variable_defs`). Prefer style/token lookups over
  full layout fetches
- Do **not** re-fetch a node you already have data for in the same session

### 2. Asset & Image Policy

- The Figma MCP assets endpoint may return `localhost` URLs for images/SVGs —
  **use those URLs directly as `src`**; do not create placeholders
- **Never** attempt to export, decode, embed, or log raw image data, base64
  strings, or full SVG path data from Figma
- **Never** add new icon packages. All icons must come from
  `src/shared/Icons.tsx` (which re-exports from `@mui/icons-material`)
- If a Figma asset has no localhost source, use a semantically appropriate
  existing public asset from `/public/images/` via the `publicFolder` helper in
  `src/shared/constants.ts`

### 3. Visual Processing Ban

- Do **not** call screenshot or image-render tools to inspect the Figma canvas
  or browser
- Rely exclusively on text/JSON structural data: dimensions, auto-layout,
  constraints, text content, fill styles, border-radius, effects
- Derive visual layout from `layoutMode`, `itemSpacing`,
  `paddingLeft/Right/Top/Bottom`, `primaryAxisAlignItems`, and
  `counterAxisAlignItems` fields

### 4. Figma Variable → Design Token Mapping

| Figma variable type   | Project token                                                 |
| --------------------- | ------------------------------------------------------------- |
| Primary brand color   | `text-primary` / `bg-primary` (CSS var: `--ng-primary-color`) |
| Primary 10% opacity   | `text-primary/10` / `bg-primary/10`                           |
| Primary 25%           | `text-primary/25` / `bg-primary/25`                           |
| Primary 50%           | `text-primary/50` / `bg-primary/50`                           |
| Secondary brand color | `text-secondary` / `bg-secondary` (`--ng-secondary-color`)    |
| Secondary 5–75%       | `text-secondary/5` … `bg-secondary/75`                        |
| Font size — title     | `text-title` (24px, 0.8× scale)                               |
| Font size — subTitle  | `text-subTitle` (16px)                                        |
| Font size — body      | `text-body` (12.8px)                                          |
| Font size — label     | `text-label` (11.2px)                                         |
| Breakpoints           | `sm:600px` `md:900px` `lg:1280px` `xl:1536px`                 |
| Inner shadow          | `shadow-inner-lg`                                             |

- **Never hardcode hex colors.** Map to the closest Tailwind token above or a
  MUI palette value
- MUI theme defaults (fallback when no Figma token exists): primary `#ff982b`,
  secondary `#111111`, background `#f7f7f7`, text `#4A4949`, border-radius `6px`

### 5. Component Parity — Figma → Codebase

Always prefer shared components over custom HTML. Check
`src/shared/components/ui/` first.

| Figma element        | Use this component                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Button (any variant) | `src/shared/components/ui/Button.tsx`                                                                          |
| Text input / field   | `src/shared/components/ui/TextField.tsx`                                                                       |
| Select / dropdown    | `src/shared/components/ui/Select.tsx`                                                                          |
| Checkbox             | `src/shared/components/ui/Checkbox.tsx`                                                                        |
| Radio group          | `src/shared/components/ui/RadioGroup.tsx`                                                                      |
| Dialog / modal       | `src/shared/components/ui/Dialog.tsx` (+ `DialogTitle`, `DialogContent`, `DialogActions`, `DialogCloseButton`) |
| Accordion            | `src/shared/components/ui/Accordion.tsx`                                                                       |
| Tabs                 | `src/shared/components/ui/Tabs.tsx`                                                                            |
| Table / data grid    | `src/shared/components/ui/Table.tsx`                                                                           |
| Avatar               | `src/shared/components/ui/Avatar.tsx`                                                                          |
| Chip / tag           | `src/shared/components/ui/Chip.tsx`                                                                            |
| Menu / popover       | `src/shared/components/ui/Menu.tsx` or `Popover.tsx`                                                           |
| Date picker          | `src/shared/components/ui/DatePicker.tsx`                                                                      |
| Image                | `src/shared/components/ui/Image.tsx`                                                                           |
| Icon button          | `src/shared/components/ui/IconButton.tsx`                                                                      |
| Form field (RHF)     | `src/shared/components/form-fields/Controlled*.tsx`                                                            |
| Loading spinner      | `src/shared/layout/Spinner.tsx` or `CenteredSpinner.tsx`                                                       |

### 6. Styling Approach — Auto Layout → Tailwind

Translate Figma Auto Layout to Tailwind flex utilities. All classes are scoped
under `#root.next-gen` automatically.

| Figma Auto Layout                      | Tailwind                                      |
| -------------------------------------- | --------------------------------------------- |
| `layoutMode: HORIZONTAL`               | `flex flex-row`                               |
| `layoutMode: VERTICAL`                 | `flex flex-col`                               |
| `primaryAxisAlignItems: SPACE_BETWEEN` | `justify-between`                             |
| `primaryAxisAlignItems: CENTER`        | `justify-center`                              |
| `counterAxisAlignItems: CENTER`        | `items-center`                                |
| `itemSpacing: N`                       | `gap-[Npx]` (prefer Tailwind scale)           |
| `paddingLeft/Right/Top/Bottom`         | `px-*` / `py-*` or `p-*`                      |
| `cornerRadius: N`                      | `rounded-[Npx]` or `rounded-md` (6px default) |

- Use `cn()` (from `src/shared/helpers/cn.ts` — clsx + tailwind-merge) for
  conditional class composition
- Use MUI `sx` prop only for theme-aware values not expressible in Tailwind
  (e.g., `theme.spacing`)
- Use `styled()` from `@mui/system` only for reusable theme-bound sub-components

### 7. Icon Usage

- Import icons **only** from `@shared/Icons` (re-exports `@mui/icons-material`
  with project-curated names)
- If a needed icon is not already exported, add it to `src/shared/Icons.tsx` as
  a named export
- Never install new icon packages

### 8. Asset References

- Static images live in `/public/images/`. Reference via the `publicFolder`
  helper:
  ```typescript
  import { publicFolder } from '@shared/constants'
  <img src={publicFolder.images.dbc.avatar} />
  ```
- SVGs can be imported as React components:
  `import Logo from './logo.svg?react'`
- Figma-provided localhost asset URLs: use directly as `src` without
  modification

### 9. Code Quality Rules (Figma-driven changes)

- **No new i18n keys** without explicit instruction — use existing translation
  keys or plain strings for prototyping
- **No hardcoded pixel values** for colors, font sizes, or spacing — use
  Tailwind tokens
- Components must be TypeScript; use existing shared types from
  `src/shared/types.ts`
- Follow module structure: visual components go in `features/{feature}/ui/`,
  shared components in `src/shared/components/ui/`

## Jira & Bitbucket MCP Guardrails

### Jira Querying Rules

- **Pagination:** Always append `maxResults=5` to every `search_issues` / JQL
  call unless explicitly told otherwise
- **Field filtering:** Never fetch full issue payloads. Restrict every call to
  essential fields only: `summary,description,status,assignee,comments`
- **Direct lookups first:** Prefer `get_issue` with a specific Issue Key (e.g.
  `PROJ-123`) over free-text JQL searches

### Bitbucket Querying Rules

- **Diffs over full files:** When reviewing or summarising PRs, use PR diffs
  only. Do not fetch raw file contents unless the diff lacks necessary
  surrounding context
- **Blacklisted files:** Never read or analyse diffs for lockfiles
  (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`), bundled assets, or
  auto-generated build artefacts
- **Pagination limits:** When listing PRs, branches, or commits always set
  `limit=5`
- **No blind crawling:** Do not use tools to list repository files or crawl
  directory structure. Use the local project directory (Glob/Grep) instead

---

**The Golden Rules of Local Delegation:**

1. **Zero-Context Prompts:** Local models choke on large repo structures. Pass
   _only_ the specific requirements for the single file they are generating.
2. **Standardized Execution:** Use the bash tool to execute the model and pipe
   the output directly to the destination file. _Format:_
   `ollama run <target_model> "Your highly specific prompt. Output ONLY valid, raw code. Do not use markdown code blocks or conversational text." > path/to/target/file.ts`
3. **Mandatory Review:** Local models occasionally hallucinate imports or wrap
   code in markdown backticks (`ts ... `). The Orchestrator _must_ immediately
   read the generated file, strip any markdown formatting or conversational
   filler, and verify syntax before proceeding to the next step.



# Project conventions

Keep your replies extremely concise and focus on conveying the key information.
No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST
look up the official documentation to ensure that you're working with up-to-date
information.

Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commit Message Format

Follow the Conventional Commits format:
`<type>(<scope>): <description> #PROJ-XXXX`

- **Type:** `feat` | `fix` | `refactor` | `style` | `test` | `docs` | `build` |
  `perf` | `ci` | `chore`
- **Scope:** feature area (typically the folder name under `src/features/`)
- **Description:** present tense, lowercase, no period
- **Ticket ID:** extract from `$GIT_BRANCH_NAME`

Examples:

```
feat(analytics/outreach): add free personal outreach functionality #DBC-9931
fix(profile): resolve preview issue for opted-out users #MMP-10098
fix(dbc/profiles): resolve preview issue for opted-out users #DBC-10098
feat(apple-wallet): implement new button design #DBC-9197
fix(auth): resolve restricted domains logout issue #DBC-9804
```

The commit message can optionally include a body after a blank line for
additional details.

## Build & Development Commands

```bash
# Package manager: pnpm
pnpm install                      # Install dependencies

# Development
pnpm run dev                      # Start dev server (port 3000)
pnpm run start:host               # Dev server accessible from network

# Building (two build targets: main app + webapp/Module Federation)
pnpm run build                    # TypeScript check + Vite build (main app)
pnpm run build:staging:all        # Build both main + webapp for staging
pnpm run build:production:all     # Build both for production

# Testing (Vitest with jsdom)
pnpm run test                     # Run tests in watch mode
npx vitest run path/to/file.test.ts  # Run a single test file
pnpm run coverage                 # Generate coverage report

# E2E (Cypress)
pnpm run cypress:open             # Interactive mode
pnpm run e2e                      # Headless mode

# Code Quality
pnpm run lint                     # Oxlint with auto-fix
pnpm run test:lint                # Oxlint check only (CI)
pnpm run format                   # Oxfmt formatting

# Storybook
pnpm run storybook                # Dev mode (port 6006)
```

## Architecture

React 19 + TypeScript application built with Vite. Uses MUI 7 for UI components
and Tailwind CSS 3 for utility styling.

### Module Structure

The app is organized into domain modules with TypeScript path aliases:

| Alias                   | Path                           | Description                                         |
| ----------------------- | ------------------------------ | --------------------------------------------------- |
| `@shared/*`             | `src/shared/*`                 | Cross-cutting components, hooks, helpers, providers |
| `@dbc/*`                | `src/digital-business-cards/*` | Digital business cards module                       |
| `@me/*`                 | `src/manage-events/*`          | Event management module                             |
| `@meeting-management/*` | `src/meeting-management/*`     | Meeting management module                           |
| `@scheduler/*`          | `src/scheduler/*`              | Scheduler module                                    |
| `@freemium/*`           | `src/freemium/*`               | Billing/subscription module                         |
| `@/*`                   | `src/*`                        | Catch-all for any src path                          |

Each module has its own `routes.ts`, feature folders, stores, and queries.
Routes are composed in `src/AppRoutes.tsx`.

- **Source of Truth:** All path aliases are created and updated in
  `tsconfig.base.json`.

### Two Build Targets

- **Main app** (`vite.config.ts`): Builds to `build/`, served at `/n`
- **Webapp** (`vite.config.webapp.ts`): Module Federation build to `build/ngw/`,
  served at `/n/ngw`. Exposes components (contracts, document-group) as
  federated modules.

### State Management

- **Server state**: TanStack React Query v5 — each feature has `queries.ts`
  files using `queryOptions` pattern. Always include
  `placeholderData: keepPreviousData` (imported from `@tanstack/react-query`) in
  any `useQuery` call that powers a table, to prevent layout shifts during
  refetches
- **Client state**: Zustand v5 with Immer — stores in module-level `stores/`
  directories, created via `src/shared/stores/createStore.ts`
- **URL state**: nuqs v2 for URL search param synchronization

### API Layer

- Axios with instance configured in `src/shared/helpers/axios.ts` (baseURL from
  `VITE_API_URL`, 30s timeout)
- Auth interceptors handle token refresh on 401/403 automatically
- MSW (Mock Service Worker) for local dev mocking — handlers in `src/mocks/`

### Authentication

Strategy-based auth system in `src/authentication/`:

- `RootAuthProvider` selects strategy based on environment (Web, Dev, ULC
  launcher)
- Tokens stored in cookies (web) or localStorage (ULC)
- Dev auth uses MSW to bypass login — configure `VITE_DEV_AUTH_*` env vars

### Styling

Tailwind classes are scoped under `.next-gen` (for Module Federation isolation).
MUI theme in `src/theme.ts` uses CSS variables for dynamic brand colors via
`BrandProvider`. Use `clsx` and `tailwind-merge` for conditional class
composition.

### Internationalization

i18next with 7 namespaces: `translation`, `mmpTranslation`, `dbcTranslation`,
`meTranslation`, `freemiumTranslation`, `eiTranslation`, `webappTranslation`.
Translations loaded via HTTP backend.

**i18n key rules (enforced across the team):**

1. **Static string literals only.** Every `t()` / `i18next.t()` /
   `<Trans i18nKey="..." />` call must receive a plain string literal. No
   template literals (``t(`x.${y}`)``), no variables (`t(someVar)`), no lookups
   (`t(MAP[key])`), no enum-value refs (`t(EnumName.value)`). Our tooling relies
   on regex extraction — anything dynamic is invisible.
2. **Dynamic labels → build a static map inside the component.** When a label
   depends on runtime data, define a local `Record<Key, string>` where each
   value is a static `t('...')` call, then look up by key:
   ```tsx
   const labels: Record<Category, string> = {
   	target: t('accountCategories.target'),
   	leads: t('accountCategories.leads'),
   }
   // usage: labels[cat]
   ```
3. **Don't store i18n keys in shared constants modules.** If multiple components
   need the same labels, each declares its own local static map. Shared
   constants can't satisfy rule 1 because lookups become dynamic.
4. **Don't use `getEnumOptions(enum, { t })` for tab labels.** It produces
   `t(enumKey)` at runtime — not regex-extractable and couples enum identifiers
   to i18n keys. Build the options array with explicit
   `{ label: t('x.y'), value: Enum.y }` entries.
5. **Naming pattern for component-scoped keys:** use camelCased component name
   as namespace, then `tabs` / `previewTabs` / etc:
   `{componentName}.tabs.{tabKey}` — e.g. `setupPage.tabs.personal`,
   `eventSessions.tabs.speakers`. Keeps keys discoverable and avoids generic
   names colliding across features.
6. **Capitalize label values.** Use Title Case for tab labels, headings, and
   buttons (e.g. `"Connections"`, not `"connections"`). The key stays camelCase;
   only the value is capitalized.

### Forms

React Hook Form v7 with Yup validation schemas and `@hookform/resolvers`.

### Component File Structure & Separation of Concerns

When creating, refactoring, or updating React components (especially forms), you
MUST strictly enforce the following file structure to ensure readability:

1. **Main Component Visibility:** The main React component MUST be the very
   first thing the developer sees in the file (after imports and types). Do not
   bury the component below massive configurations, schemas, or utilities.
2. **Dedicated Schema File:** All Yup validation schemas, custom validation
   logic, and error message helpers must be extracted into a separate
   `schemas.ts` file alongside the component.
3. **Dedicated Utils File:** All data transformation functions (e.g.,
   `apiToForm`, `formToApi`, or any `xToYTransform()` mapping) and complex
   standalone business logic must be placed in a separate `utils.ts` file.

### Naming Conventions

When writing or refactoring code, absolutely never use single-letter variables,
arguments, or loop indices (such as `n`, `c`, `v`, `e`, `i`, `j`, etc.). There
are no exceptions. Always use descriptive, self-documenting names for
everything, including loops and events (e.g., `numericValue`, `index`, `event`,
`currentIndex`, `count`).

### Key Providers (wrap order in App.tsx)

`SentryProvider` > `ReactQueryProvider` > `BrandProvider` > `MuiProvider` >
`SnackbarProvider` > `ConfirmationDialogProvider` > `NuqsAdapter` >
`AuthProvider`

### CI/CD

Bitbucket Pipelines (`bitbucket-pipelines.yml`). Pre-commit hooks via Husky +
lint-staged (Oxlint on staged `.{js,jsx,ts,tsx}` files).

### Config

- Oxlint: `.oxlintrc.json` (type-aware via `oxlint-tsgolint`, migrated from
  ESLint + `@scr2em/config/eslint`). Test-file rules run
  `eslint-plugin-testing-library` and `eslint-plugin-jest-dom` through oxlint's
  `jsPlugins`
- Oxfmt: `.oxfmtrc.json` (Prettier-compatible, migrated from
  `@scr2em/config/prettier`)
- Tailwind: `tailwind.config.ts` with custom font scale (0.8x) and CSS
  variable-based colors

# MCP Servers

## Figma MCP server rules

These rules govern every Figma-driven code change. Follow them without
exception.

### 1. Token Efficiency — Query Rules

- **Always pass `excludeScreenshot: true`** on every Figma MCP call
  (`get_design_context`, etc.)
- **Always provide a specific `nodeId`** from the URL (`node-id` param, convert
  `-` → `:`). Never query whole-file payloads
- **Default depth: 1.** Only increase depth when the user explicitly asks to go
  deeper or child layers are missing critical layout data
- Before fetching node data, check if design styles or variables suffice
  (`get_file_styles` / `get_variable_defs`). Prefer style/token lookups over
  full layout fetches
- Do **not** re-fetch a node you already have data for in the same session

### 2. Asset & Image Policy

- The Figma MCP assets endpoint may return `localhost` URLs for images/SVGs —
  **use those URLs directly as `src`**; do not create placeholders
- **Never** attempt to export, decode, embed, or log raw image data, base64
  strings, or full SVG path data from Figma
- **Never** add new icon packages. All icons must come from
  `src/shared/Icons.tsx` (which re-exports from `@mui/icons-material`)
- If a Figma asset has no localhost source, use a semantically appropriate
  existing public asset from `/public/images/` via the `publicFolder` helper in
  `src/shared/constants.ts`

### 3. Visual Processing Ban

- Do **not** call screenshot or image-render tools to inspect the Figma canvas
  or browser
- Rely exclusively on text/JSON structural data: dimensions, auto-layout,
  constraints, text content, fill styles, border-radius, effects
- Derive visual layout from `layoutMode`, `itemSpacing`,
  `paddingLeft/Right/Top/Bottom`, `primaryAxisAlignItems`, and
  `counterAxisAlignItems` fields

### 4. Figma Variable → Design Token Mapping

| Figma variable type   | Project token                                                 |
| --------------------- | ------------------------------------------------------------- |
| Primary brand color   | `text-primary` / `bg-primary` (CSS var: `--ng-primary-color`) |
| Primary 10% opacity   | `text-primary/10` / `bg-primary/10`                           |
| Primary 25%           | `text-primary/25` / `bg-primary/25`                           |
| Primary 50%           | `text-primary/50` / `bg-primary/50`                           |
| Secondary brand color | `text-secondary` / `bg-secondary` (`--ng-secondary-color`)    |
| Secondary 5–75%       | `text-secondary/5` … `bg-secondary/75`                        |
| Font size — title     | `text-title` (24px, 0.8× scale)                               |
| Font size — subTitle  | `text-subTitle` (16px)                                        |
| Font size — body      | `text-body` (12.8px)                                          |
| Font size — label     | `text-label` (11.2px)                                         |
| Breakpoints           | `sm:600px` `md:900px` `lg:1280px` `xl:1536px`                 |
| Inner shadow          | `shadow-inner-lg`                                             |

- **Never hardcode hex colors.** Map to the closest Tailwind token above or a
  MUI palette value
- MUI theme defaults (fallback when no Figma token exists): primary `#ff982b`,
  secondary `#111111`, background `#f7f7f7`, text `#4A4949`, border-radius `6px`

### 5. Component Parity — Figma → Codebase

Always prefer shared components over custom HTML. Check
`src/shared/components/ui/` first.

| Figma element        | Use this component                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Button (any variant) | `src/shared/components/ui/Button.tsx`                                                                          |
| Text input / field   | `src/shared/components/ui/TextField.tsx`                                                                       |
| Select / dropdown    | `src/shared/components/ui/Select.tsx`                                                                          |
| Checkbox             | `src/shared/components/ui/Checkbox.tsx`                                                                        |
| Radio group          | `src/shared/components/ui/RadioGroup.tsx`                                                                      |
| Dialog / modal       | `src/shared/components/ui/Dialog.tsx` (+ `DialogTitle`, `DialogContent`, `DialogActions`, `DialogCloseButton`) |
| Accordion            | `src/shared/components/ui/Accordion.tsx`                                                                       |
| Tabs                 | `src/shared/components/ui/Tabs.tsx`                                                                            |
| Table / data grid    | `src/shared/components/ui/Table.tsx`                                                                           |
| Avatar               | `src/shared/components/ui/Avatar.tsx`                                                                          |
| Chip / tag           | `src/shared/components/ui/Chip.tsx`                                                                            |
| Menu / popover       | `src/shared/components/ui/Menu.tsx` or `Popover.tsx`                                                           |
| Date picker          | `src/shared/components/ui/DatePicker.tsx`                                                                      |
| Image                | `src/shared/components/ui/Image.tsx`                                                                           |
| Icon button          | `src/shared/components/ui/IconButton.tsx`                                                                      |
| Form field (RHF)     | `src/shared/components/form-fields/Controlled*.tsx`                                                            |
| Loading spinner      | `src/shared/layout/Spinner.tsx` or `CenteredSpinner.tsx`                                                       |

### 6. Styling Approach — Auto Layout → Tailwind

Translate Figma Auto Layout to Tailwind flex utilities. All classes are scoped
under `#root.next-gen` automatically.

| Figma Auto Layout                      | Tailwind                                      |
| -------------------------------------- | --------------------------------------------- |
| `layoutMode: HORIZONTAL`               | `flex flex-row`                               |
| `layoutMode: VERTICAL`                 | `flex flex-col`                               |
| `primaryAxisAlignItems: SPACE_BETWEEN` | `justify-between`                             |
| `primaryAxisAlignItems: CENTER`        | `justify-center`                              |
| `counterAxisAlignItems: CENTER`        | `items-center`                                |
| `itemSpacing: N`                       | `gap-[Npx]` (prefer Tailwind scale)           |
| `paddingLeft/Right/Top/Bottom`         | `px-*` / `py-*` or `p-*`                      |
| `cornerRadius: N`                      | `rounded-[Npx]` or `rounded-md` (6px default) |

- Use `cn()` (from `src/shared/helpers/cn.ts` — clsx + tailwind-merge) for
  conditional class composition
- Use MUI `sx` prop only for theme-aware values not expressible in Tailwind
  (e.g., `theme.spacing`)
- Use `styled()` from `@mui/system` only for reusable theme-bound sub-components

### 7. Icon Usage

- Import icons **only** from `@shared/Icons` (re-exports `@mui/icons-material`
  with project-curated names)
- If a needed icon is not already exported, add it to `src/shared/Icons.tsx` as
  a named export
- Never install new icon packages

### 8. Asset References

- Static images live in `/public/images/`. Reference via the `publicFolder`
  helper:
  ```typescript
  import { publicFolder } from '@shared/constants'
  <img src={publicFolder.images.dbc.avatar} />
  ```
- SVGs can be imported as React components:
  `import Logo from './logo.svg?react'`
- Figma-provided localhost asset URLs: use directly as `src` without
  modification

### 9. Code Quality Rules (Figma-driven changes)

- **No new i18n keys** without explicit instruction — use existing translation
  keys or plain strings for prototyping
- **No hardcoded pixel values** for colors, font sizes, or spacing — use
  Tailwind tokens
- Components must be TypeScript; use existing shared types from
  `src/shared/types.ts`
- Follow module structure: visual components go in `features/{feature}/ui/`,
  shared components in `src/shared/components/ui/`

## Jira & Bitbucket MCP Guardrails

### Jira Querying Rules

- **Pagination:** Always append `maxResults=5` to every `search_issues` / JQL
  call unless explicitly told otherwise
- **Field filtering:** Never fetch full issue payloads. Restrict every call to
  essential fields only: `summary,description,status,assignee,comments`
- **Direct lookups first:** Prefer `get_issue` with a specific Issue Key (e.g.
  `PROJ-123`) over free-text JQL searches

### Bitbucket Querying Rules

- **Diffs over full files:** When reviewing or summarising PRs, use PR diffs
  only. Do not fetch raw file contents unless the diff lacks necessary
  surrounding context
- **Blacklisted files:** Never read or analyse diffs for lockfiles
  (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`), bundled assets, or
  auto-generated build artefacts
- **Pagination limits:** When listing PRs, branches, or commits always set
  `limit=5`
- **No blind crawling:** Do not use tools to list repository files or crawl
  directory structure. Use the local project directory (Glob/Grep) instead

---

**The Golden Rules of Local Delegation:**

1. **Zero-Context Prompts:** Local models choke on large repo structures. Pass
   _only_ the specific requirements for the single file they are generating.
2. **Standardized Execution:** Use the bash tool to execute the model and pipe
   the output directly to the destination file. _Format:_
   `ollama run <target_model> "Your highly specific prompt. Output ONLY valid, raw code. Do not use markdown code blocks or conversational text." > path/to/target/file.ts`
3. **Mandatory Review:** Local models occasionally hallucinate imports or wrap
   code in markdown backticks (`ts ... `). The Orchestrator _must_ immediately
   read the generated file, strip any markdown formatting or conversational
   filler, and verify syntax before proceeding to the next step.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with
project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial
tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes,
simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it
work") require constant clarification.

---

## Pattern matching

Use `ts-pattern` (`match(...).with(...)`) instead of `switch`/`if-else` chains
or keyed lookup objects when branching on a value — especially discriminated
unions and enums.

- Prefer `.exhaustive()` over `.otherwise()` so adding a new case becomes a
  compile error rather than a silent fallthrough.
- Reach for `.otherwise()` only when a genuine default is intended.

```ts
const title = match(action)
	.with(LayoutDesignDialogAction.add, () => t('layoutForm.header.addNewLayout'))
	.with(LayoutDesignDialogAction.clone, () =>
		t('layoutForm.header.cloneLayout'),
	)
	.with(LayoutDesignDialogAction.edit, () => t('layoutForm.header.editLayout'))
	.exhaustive()
```

---

## Architecture Decision Records

Significant decisions are recorded in `docs/adr/` (see its README and the
template `0000-adr-template.md`). ADRs are immutable: never edit a merged ADR
except to change its status or add a "Superseded by" link. To change a decision,
write a new ADR that supersedes the old one.

## Modals (`@shared/components/ui/Dialog`)

Decision records: [ADR-0001](docs/adr/0001-modal-dialog-behavior.md) (rules),
[ADR-0002](docs/adr/0002-explicit-form-dialog.md) (API),
[ADR-0003](docs/adr/0003-mount-dialogs-only-while-open.md) (lifecycle).

- **Mount a dialog only while it is open.** The owner of the flag renders
  `{isOpen && <XxxDialog onClose={close} />}`; dialog components take no
  `isOpen` / `open` prop and always pass `open={true}` to the shared dialog.
  Unmounting is what clears form values, selections and step state, so never add
  a reset-on-close effect, `isOpen` in a dependency array, or a `key` tied to
  the flag instead.

- **Pick the component by content.** `FormDialog` for anything with a form or
  editable fields (including pickers and wizards); `Dialog` for everything else.
  Never reintroduce a close icon, backdrop guard, or dirty check in the caller.
- **`FormDialog`** requires `isDirty: boolean` and `onClose`. It renders the X
  button, which behaves exactly like `DialogCancelButton` (confirm when dirty).
  Backdrop clicks and Escape are ignored. Pass `hideCloseButton` only when the
  dialog has no Cancel button.
- **Split form dialogs into a query container and a form view.** The exported
  container owns queries, mutations and side effects and renders the view with
  plain props (`data`, `isLoading`, `isSaving`, `onSubmit`, `onClose`). The view
  (`XxxDialogView`) owns `useForm` and the `FormDialog` and contains no data
  hooks.
- **The component that calls `useForm` renders the `FormDialog`.** Read
  `isDirty` from `formState` during render; never sync it into a `useState` with
  a `useEffect` + `onDirtyChange` callback. Pass `control` down to
  presentational field components (`useWatch` / `useFormState` with `control`).
  When defaults come from a query, keep the spinner inside the dialog and feed
  the data through react-hook-form's `values` option so the dirty baseline
  resets when it arrives. Reference:
  `src/freemium/features/plans-management/ui/PlanFormDialog.tsx`.
- **Multi-step wizards** use `<WizardFormDialog onClose={...}>`, which takes no
  `isDirty` prop, and each step renders `<WizardStepForm control={control}>` in
  place of its `<form>`. The dialog counts the mounted steps' dirty state
  itself, so there is nothing to thread through and nothing to reset.
- **`Dialog`** has no X; it closes on backdrop click and Escape through
  `onClose`. Always pass `onClose` unless the dialog is intentionally blocking.
- **Footer buttons are standard buttons, never link/text style.** Cancel is
  `<DialogCancelButton />` (muted). The acknowledge button of an informational
  dialog is `<DialogDoneButton />` (contained, "Done"). Other actions use the
  default `Button` variant.
