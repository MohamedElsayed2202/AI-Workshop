# PulseBoard starter

Starter repo for the Claude Code build workshop. Read **`SPEC.md`** for the brief,
look at **`design/`** for the target UI, and use **`public/data.json`** as the data.

## Before the workshop (do this the day before)

```bash
node --version                 # 20 or newer
npm install
npm run playwright:install     # downloads Chromium (~150 MB)
npm run dev                    # open http://localhost:5173 — you should see the shell
npm test                       # expected: tests FAIL. That is your to-do list.
```

Then confirm Claude Code and the Playwright MCP server:

```bash
claude --version
claude mcp add playwright npx '@playwright/mcp@latest'
claude                         # inside Claude: /mcp should list "playwright"
```

## During the workshop

| Command | Purpose |
| --- | --- |
| `npm run dev` | local preview |
| `npm test` | acceptance test — the definition of done |
| `npm run test:ui` | step through failing tests |
| `npm run screenshot` | capture desktop/tablet/mobile PNGs into `screenshots/` |
| `npm run typecheck` | TypeScript check |

`CLAUDE.md` is deliberately near-empty. Growing it well is part of the exercise.

## Layout

```
public/data.json      the dataset (KPIs, 12-month revenue series, 24 accounts)
src/types.ts          TypeScript types for the dataset
src/App.tsx           the (empty) app shell — start here
design/               reference design at 1280×800 and 375×812
tests/acceptance.spec.ts   acceptance test (do not edit; judges run it as-is)
tests/screenshot.spec.ts   screenshot helper
```
