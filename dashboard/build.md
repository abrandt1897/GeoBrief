# Dashboard build & update run

Live dashboard: https://claude.ai/artifact/Jsjx16BKtU824X523PA8gp (one stable link, republished every run)

## Build
```
python3 dashboard/build.py          # consistency checks, then writes dashboard/dist/index.html
python3 dashboard/build.py --check  # checks only
```
`build.py` exits non-zero when a check fails. Fix the data, never the check. `dashboard/dist/` is not committed.

## Scheduled run (6 a.m. and 6 p.m. ET, daily)
1. `git pull`. Read `state/current.md`, `state/brief.json`, the last ~10 lines of `log/events.md`, and armed rows in `data/tripwires.csv`.
2. Search news since the last event in `log/events.md`. Apply the signal rules in `skill/SKILL.md` (Trump threats weak; Iranian threats strong; supply claims contested until Kpler/Windward/PortWatch confirm).
3. **Gas (6 a.m. run only, or 6 p.m. if the day has no row):** Firecrawl scrape `https://gasprices.aaa.com/` and `https://gasprices.aaa.com/?state=NY` (maxAge 0). Append one row per date to `data/gas.csv`; never two rows for one date.
4. Append new events to `log/events.md` (`- YYYY-MM-DD | summary (source)`; add `[chart: label]` only for events that moved the odds). Append market readings to `data/markets.csv` when found.
5. Check each armed tripwire. If fired: set `status=fired`, `fired_on`, `evidence`.
6. If anything is material: re-derive odds; append a full row set per horizon to `data/odds.csv` (date = today; if today already has rows, replace them); append re-forecasts to `data/forecasts.csv` (new row, same `id`, new `made_on`; never edit a past `p`); update `state/current.md`, `state/brief.json` (headline, status, change_note, bets, blink10, deal_p, updated) and `data/tripwires.csv`.
7. Resolve forecasts whose `resolves_on` has passed (`outcome`, `resolved_on`).
8. `python3 dashboard/build.py`. Fix any failed check before continuing.
9. Commit `run: YYYY-MM-DD am|pm — <one-line summary>` and push to `main`. If nothing changed, skip the commit.
10. Republish: Artifact tool, `url` = the dashboard link above, `file_path` = `dashboard/dist/index.html` (read the artifact first if this session hasn't). Always republish so "Updated" stays current, even when only gas moved.
11. Push notification only if a tripwire fired or any Nov 3 scenario moved ≥3 points.
