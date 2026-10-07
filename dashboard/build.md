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
4. Append new events to `log/events.md` (`- YYYY-MM-DD | summary (source)`). Each event is a dispatch on the dashboard, so write it as a short prose summary: two to four full sentences that say what happened and why it matters, not a telegraphic list of fragments joined by semicolons or arrows. Append market readings to `data/markets.csv` when found, and a row to `data/energy.csv` for each new trading day (Brent daily close from Trading Economics <https://tradingeconomics.com/commodity/brent-crude-oil>, which the dashboard matches; EIA Brent spot when FRED has it; JKM front month from Investing.com JKMc1; `brent_nov3` and `jkm_nov3` = the settlement of the contract that is front month on Nov. 3, Brent January and JKM December, from ICE <https://www.ice.com/products/219/Brent-Crude-Futures/data?marketId=5474737&span=2> and <https://www.ice.com/products/6753280/JKM-LNG-PLATTS-Future/data?marketId=6241399&span=2>; the pages show last price and % change, so during trading the prior settlement = last ÷ (1 + change/100)).
5. Check each armed tripwire. If fired: set `status=fired`, `fired_on`, `evidence`.
6. If anything is material: re-derive odds; append a full row set per horizon to `data/odds.csv` (the four scenarios `limited_war`, `escalated_war`, `mou_deal`, `comprehensive_deal`, defined in `state/current.md`) (date = today; if today already has rows, replace them); append re-forecasts to `data/forecasts.csv` (new row, same `id`, new `made_on`; never edit a past `p`; a same-day revision replaces that day's row), with `made_on` = the date (UTC) of the commit that adds the row, since a forecast counts from when it was recorded, not when it was thought of; including the eight `scen_<horizon>_<scenario>` rows, which must equal the new odds; every Nov 3 price line (`gas_*`, `brent_*`, `lng_*`) is scenario odds × the weighted bands in `data/scenarios.csv` (`build.py` computes the expected value in its error message); re-base each armed tripwire's `effect` and `targets` so it still moves the odds; update `state/current.md`, `state/brief.json` (headline, status, change_note, bets, blink10, deal_p, updated; Blink #10 comes from the year-end odds: no blink ≥ comprehensive, unresolved ~0) and `data/tripwires.csv`.
7. Resolve forecasts whose `resolves_on` has passed (`outcome`, `resolved_on`).
8. `python3 dashboard/build.py`. Fix any failed check before continuing. Run `python3 -m pytest tests/test_data.py` (data schema and integrity) and fix the data until it passes. Then `npm ci` (first time) and `npx prettier --write state log` so CI's format check stays green.
9. Commit `run: YYYY-MM-DD am|pm — <one-line summary>` and push to `main`. If nothing changed, skip the commit.
10. Republish: Artifact tool, `url` = the dashboard link above, `file_path` = `dashboard/dist/artifact.html` (read the artifact first if this session hasn't). Always republish so "Updated" stays current, even when only gas moved.
11. Push notification only if a tripwire fired or any Nov 3 scenario moved ≥3 points.
