# CLAUDE.md

GeoBrief tracks the US–Iran war: canonical odds, an event log, dated forecasts and a dashboard republished twice a day. This file covers setup and how to run things. How the pieces fit is in `ARCHITECTURE.md`.

## Read first

- `dashboard/build.md`: the build and the full scheduled-run procedure (6 a.m. and 6 p.m. ET). Follow it step by step for any update run.
- `skill/SKILL.md`: the `geo-brief` method (style, sourcing and signal-weighting rules). Read before quoting or changing any number.
- `state/current.md`: current canonical odds and their reasoning.

## Setup

Python 3.11+ and Node 22.

```text
pip install -r requirements-dev.txt
npm ci
```

`build.py` itself uses only the standard library, so a build needs no install. The dev deps are for linting and tests.

## Commands

```text
python3 dashboard/build.py            # consistency checks, then writes dashboard/dist/{artifact,index}.html
python3 dashboard/build.py --check    # checks only
python3 -m pytest                     # unit tests (build.py) + data integrity tests (data/*.csv)
npm run test:e2e                      # builds, then Playwright tests against dist/index.html
npm run lint                          # eslint, stylelint, markdownlint, html-validate, tsc, prettier --check
ruff check . && ruff format --check . && python3 -m mypy
npm run format && ruff format .       # auto-format
```

In a cloud session, Chromium is preinstalled: run e2e with `CHROMIUM_PATH=/opt/pw-browsers/chromium npm run test:e2e` (or let Playwright find it via `PLAYWRIGHT_BROWSERS_PATH`); don't `npx playwright install`.

## Rules

- When a `build.py` check fails, fix the data, never the check.
- Append-only: `log/events.md`, `data/odds.csv`, `data/forecasts.csv`. Never edit a past forecast `p`; re-forecast with a new row (same `id`, new `made_on`).
- `dashboard/dist/` is generated and not committed.
- `data/` is excluded from Prettier; run `npx prettier --write state log` after editing Markdown there so CI's format check passes.
- Commit straight to `main` (`run: YYYY-MM-DD am|pm — <summary>` for scheduled runs). CI runs on every push; Pages deploys only after CI passes.
- After a build, republish `dashboard/dist/artifact.html` to the dashboard artifact (link in `README.md`).
