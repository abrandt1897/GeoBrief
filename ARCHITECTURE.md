# Architecture

GeoBrief is a flat-file repo. Text and CSV files are the database, one Python script turns them into a single static HTML page, and that page is published two ways. There is no server and no runtime data fetching. Design goals and rationale are in `design.md`; setup and commands are in `CLAUDE.md`.

## Data flow

```text
 news, AAA, Kpler…                      (gathered by Claude each run, see dashboard/build.md)
        │
        ▼
 ┌──────────────── sources of truth (committed) ─────────────────┐
 │ state/brief.json        headline, status, bets, Blink #10      │
 │ state/current.md, taco.md, deal-tracker.md  (prose; not built) │
 │ log/events.md           append-only war arc                    │
 │ log/physical-supply.md  supply notes (last section is shown)   │
 │ data/*.csv              odds, forecasts, gas, markets, …       │
 └───────────────────────────────┬────────────────────────────────┘
                                 ▼
                    dashboard/build.py
                    1. consistency checks (exit 1 on failure)
                    2. load + normalise into one JSON payload
                    3. inline styles.css, app.js and payload into template.html
                                 │
                 ┌───────────────┴────────────────┐
                 ▼                                ▼
     dist/artifact.html                  dist/index.html
     page body only                      full document (head/body wrapped)
                 │                                │
                 ▼                                ▼
     claude.ai artifact                  GitHub Pages
     (Claude republishes to one          (.github/workflows/pages.yml,
      stable URL each run)                after CI passes on main)
```

## Sources of truth

| File                                             | Read by build? | Role                                                                                                                                         |
| ------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `state/brief.json`                               | yes            | Top-of-page text and headline numbers; typed as `Brief` in `build.py`                                                                        |
| `data/odds.csv`                                  | yes            | Scenario probabilities per update date and horizon (`nov3`, `ye2026`)                                                                        |
| `data/scenarios.csv`                             | yes            | Scenario labels, groups and price bands (`lo-hi`, or weighted sub-ranges `lo-hi:w\|lo-hi:w`); `group` maps pre-Oct 6 scenarios onto the four |
| `data/forecasts.csv`                             | yes            | Every resolvable forecast; latest row per `id` wins; outcomes feed calibration                                                               |
| `data/deal_terms.csv`                            | yes            | P(term \| deal), with Rubio-term flags                                                                                                       |
| `data/gas.csv`, `data/markets.csv`               | yes            | AAA prices; Brent, Dated Brent, rial                                                                                                         |
| `data/energy.csv`                                | yes            | Daily ICE Brent front month, EIA Brent spot and JKM LNG front month for the Brent and LNG charts                                             |
| `data/supply.csv`, `supply_events.csv`           | yes            | Physical supply series and chart markers                                                                                                     |
| `data/tripwires.csv`, `data/blinks.csv`          | yes            | Tripwire board; TACO history                                                                                                                 |
| `log/events.md`                                  | yes            | Parsed as `- YYYY-MM-DD \| text [chart: label]`; older `[chart:]` tags are parsed but no longer drawn                                        |
| `log/physical-supply.md`                         | yes            | Only the last level-2 section, rendered to HTML as the supply note                                                                           |
| `state/current.md`, `taco.md`, `deal-tracker.md` | no             | Reasoning for humans and Claude; must agree with the CSVs but aren't parsed                                                                  |
| `skill/SKILL.md`                                 | no             | Mirror of the `geo-brief` skill (method only), kept here for versioning                                                                      |

## Build (`dashboard/build.py`)

1. **Checks.** `check()` returns a list of errors; any error aborts the build. It enforces that each date+horizon in `odds.csv` sums to ~100, Blink #10 odds sum to 100 and match the latest forecasts, year-end P(signed deal) agrees between `forecasts.csv` and `brief.json` and sits between the comprehensive-deal odds and MOU-style + comprehensive, P(nuclear deal) stays at or below both the comprehensive-deal odds and P(deal) × P(IAEA term) from `deal_terms.csv`, the `war_nov3` forecast sits between escalated war and limited + escalated war, every Nov. 3 price forecast equals scenario odds × the weighted bands in `scenarios.csv` (±1), the `scen_<horizon>_<scenario>` forecasts match the latest odds, and every armed tripwire names `targets` that exist and would move by at least 2 points.
2. **Payload.** `render()` reads every input above into one dict (numbers parsed, events and supply note pre-parsed) and serialises it as JSON, escaping `</` so it can sit inside a `<script>` tag.
3. **Template.** `template.html` has three placeholders: `/*__STYLES__*/` (replaced with `styles.css`), `__GEOBRIEF_DATA__` (the JSON, inside `<script id="geobrief-data" type="application/json">`) and `/*__APP__*/` (`app.js`). Everything above the `<!-- body -->` marker is head content.
4. **Outputs.** `artifact.html` is the filled template as-is, because the claude.ai artifact host supplies the document skeleton. `full_document()` wraps it into a standalone `index.html` for Pages.

## Front end (`dashboard/app.js`, `styles.css`)

Plain JavaScript, no framework or bundler. On load it parses the embedded JSON (`#geobrief-data`) and renders every section (scenario odds and year-end charts, gas, physical supply, tripwires, calibration, TACO strip, ticker) client-side. It is type-checked with `tsc` (strict `checkJs`) via JSDoc annotations.

## Publishing

- **Artifact:** not automated by CI. Each scheduled or manual run ends with Claude republishing `dist/artifact.html` to the same artifact URL, so the link never changes.
- **GitHub Pages:** `pages.yml` triggers when the CI workflow completes successfully for a push to `main`, rebuilds from that commit and deploys `dashboard/dist`. A failed check or test keeps the last good version live.

## Quality gates

`ci.yml` runs on every push and PR:

- **lint job:** ruff, mypy (strict), then `npm run lint` (ESLint, Stylelint, markdownlint, html-validate on the built page, `tsc`, Prettier).
- **test job:** `pytest` (`tests/test_build.py` for build logic, `tests/test_data.py` for CSV schemas and integrity), then Playwright (`tests/e2e/`) against the built `index.html`.

## Update cycle

Data only ever changes through a run (scheduled twice daily, or manual): gather news, append to the logs and CSVs, fire tripwires, re-derive odds when material, build, test, commit to `main`, republish. The step-by-step procedure is `dashboard/build.md`.
