# GeoBrief

Tracker for the US–Iran war: canonical odds, event log, dated forecasts, calibration, and a dashboard that republishes to one stable link twice a day. See `design.md` for the design and `dashboard/build.md` for the run procedure.

| Path                                     | What it holds                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `state/current.md`                       | Canonical odds reasoning, baselines, context (overwritten each update) |
| `state/brief.json`                       | Dashboard headline, status, bets, Blink #10 odds, P(deal)              |
| `state/deal-tracker.md`, `state/taco.md` | Reads and rules; tables live in `data/`                                |
| `log/events.md`                          | Append-only war arc, one line per event                                |
| `log/physical-supply.md`                 | Kpler/Windward/PortWatch figures with vintage                          |
| `data/odds.csv`                          | Scenario probabilities per update (`nov3`, `ye2026`)                   |
| `data/scenarios.csv`                     | Scenario labels, groups, gas and Brent bands                           |
| `data/gas.csv`, `data/markets.csv`       | AAA prices; Brent, Dated Brent, rial                                   |
| `data/forecasts.csv`                     | Every resolvable forecast and its outcome (Brier)                      |
| `data/tripwires.csv`                     | Tripwire registry                                                      |
| `data/rescores.csv`                      | Days the odds moved because a definition changed, not news (charted)   |
| `data/deal_terms.csv`, `data/blinks.csv` | P(term \| deal); TACO history                                          |
| `dashboard/`                             | `template.html` + `build.py` → `dist/index.html`                       |

Dashboard: <https://claude.ai/artifact/Jsjx16BKtU824X523PA8gp>

Public mirror (GitHub Pages): <https://abrandt1897.github.io/GeoBrief/>

## Development

```text
pip install -r requirements-dev.txt && npm ci
npm run lint          # eslint, stylelint, markdownlint, html-validate, tsc (strict checkJs), prettier --check
ruff check . && ruff format --check . && python3 -m mypy   # Python lint, format, strict types
npm run format && ruff format .                 # auto-format
python3 -m pytest                               # unit + data integrity tests
npm run test:e2e                                # Playwright tests against the built dashboard
                                                # (set CHROMIUM_PATH to use a preinstalled Chromium)
```

Manual update: edit the data, run `python3 dashboard/build.py`, commit, republish.
