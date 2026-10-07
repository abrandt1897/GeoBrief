# Dashboard build & update run

Live dashboard: <https://claude.ai/artifact/Jsjx16BKtU824X523PA8gp> (one stable link, republished every run)

## Build

```text
python3 dashboard/build.py          # consistency checks, then writes dashboard/dist/index.html
python3 dashboard/build.py --check  # checks only
```

`build.py` exits non-zero when a check fails. Fix the data, never the check. `dashboard/dist/` is not committed. `artifact.html` is the page published to the claude.ai artifact; `index.html` is the standalone document GitHub Pages serves at <https://abrandt1897.github.io/GeoBrief/> (deployed by `.github/workflows/pages.yml` after CI passes on `main`).

## Scheduled run (6 a.m. and 6 p.m. ET, daily)

Fetching rule: use WebFetch first for any page; if it fails or returns the wrong content, retry with Firecrawl (scrape for a known URL, search for discovery). For GitHub, use plain `git` for pull/commit/push; use the GitHub connector only for Actions/CI status.

1. `git pull`. Read `state/current.md`, `state/brief.json`, the last ~10 lines of `log/events.md`, and armed rows in `data/tripwires.csv`.
2. Search news since the last event in `log/events.md`. Apply the signal rules in `skill/SKILL.md` (Trump threats weak; Iranian threats strong; supply claims contested until Kpler/Windward/PortWatch confirm).
3. **Gas (6 a.m. run only, or 6 p.m. if the day has no row):** WebFetch `https://gasprices.aaa.com/` and `https://gasprices.aaa.com/?state=NY`; check that the NY page really shows New York. If WebFetch fails, errors, or returns the wrong state, fall back to Firecrawl scrape (maxAge 0, query prompt). Record regular and diesel for each (`nat_regular`, `nat_diesel`, `ny_*`, `nyc_*`); the gas chart's Diesel view needs `nat_diesel` on every row. Append one row per date to `data/gas.csv`; never two rows for one date.
4. Append new events to `log/events.md` (`- YYYY-MM-DD | summary (source)`). Append market readings to `data/markets.csv` when found, and a row to `data/energy.csv` for each new trading day (ICE Brent front-month settle, EIA Brent spot when FRED has it, JKM front month from Investing.com JKMc1).
5. Check each armed tripwire. If fired: set `status=fired`, `fired_on`, `evidence`.
6. If anything is material: re-derive odds; append a full row set per horizon to `data/odds.csv` (the four scenarios `limited_war`, `escalated_war`, `mou_deal`, `comprehensive_deal`, defined in `state/current.md`) (date = today; if today already has rows, replace them); append re-forecasts to `data/forecasts.csv` (new row, same `id`, new `made_on`; never edit a past `p`); the `gas_nat_*` and `gas_diesel_*` lines are scenario odds × `gas_band` / `diesel_band` in `data/scenarios.csv`; update `state/current.md`, `state/brief.json` (headline, status, change_note, bets, blink10, deal_p, updated); in `change_note` and `bets`, "war by Nov 3" means limited + escalated war and "deal by year-end" means MOU-style + comprehensive (the ticker computes the same from `odds.csv`); tripwire targets in `bets`, `data/tripwires.csv` and `state/current.md` must move the odds in the direction their trigger implies from today's values and `data/tripwires.csv`.
7. Resolve forecasts whose `resolves_on` has passed (`outcome`, `resolved_on`).
8. `python3 dashboard/build.py`. Fix any failed check before continuing. Run `python3 -m pytest tests/test_data.py` (data schema and integrity) and fix the data until it passes. Then `npm ci` (first time) and `npx prettier --write state log` so CI's format check stays green.
9. Commit `run: YYYY-MM-DD am|pm — <one-line summary>` and push to `main`. If nothing changed, skip the commit.
10. Republish: Artifact tool, `url` = the dashboard link above, `file_path` = `dashboard/dist/artifact.html` (read the artifact first if this session hasn't). Always republish so "Updated" stays current, even when only gas moved.
11. Push notification only if a tripwire fired or any Nov 3 scenario moved ≥3 points.
