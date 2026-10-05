# GeoBrief — Design

Private repo for tracking the US–Iran war: current state, event history, dated forecasts, calibration, and a daily dashboard. Claude reads and writes it; the `geo-brief` skill holds only the method.

## Goals
1. **Single source of truth** for odds, tripwires, and baselines — versioned, diffable.
2. **Forecast history** so every probability is dated and later scored (Brier).
3. **Daily monitoring** without being asked; notify only on material change.
4. **Dashboard** that is always current at one stable link.

## Non-goals
- Not a news archive (events are one-line summaries with source, not articles).
- No hand-maintained HTML; the dashboard is generated.

## Repo layout
```
GeoBrief/
├── design.md              # this file
├── README.md              # how the pieces fit, how to run a manual update
├── state/
│   ├── current.md         # canonical odds, tripwires, baselines (overwritten each update)
│   ├── deal-tracker.md    # P(term | deal) table
│   └── taco.md            # blinks, unscored items, Blink #10 definition + odds
├── log/
│   ├── events.md          # append-only war arc, one line per event, newest last
│   └── physical-supply.md # Kpler/Windward/PortWatch figures with vintage + source
├── data/
│   ├── odds.csv           # time series of scenario probabilities
│   ├── gas.csv            # daily AAA prices
│   ├── forecasts.csv      # every resolvable forecast + outcome
│   └── tripwires.csv      # tripwire registry and status
├── dashboard/
│   ├── template.html      # static page; data injected at build
│   └── build.md           # build steps Claude follows
└── skill/
    └── SKILL.md           # slim geo-brief skill (method only), mirrored here for versioning
```

## Data schemas

**odds.csv** — one row per scenario per update
`date, horizon (nov3|ye2026|ye2027), scenario, p, note`
- Invariant: per date+horizon, p sums to 100 (±1).

**gas.csv** — one row per day
`date, nat_regular, nat_diesel, ny_regular, ny_diesel, nyc_regular, nyc_diesel, source`

**forecasts.csv** — one row per resolvable claim
`id, made_on, question, p, resolves_on, resolution_rule, outcome (1|0|blank), resolved_on, notes`
- Same question re-forecast → new row, same `question`, new `made_on`. Never edit a past `p`.
- Brier = mean((p − outcome)²) over resolved rows; also bucketed for a reliability plot.

**tripwires.csv**
`id, condition, effect, status (armed|fired|expired), set_on, fired_on, evidence`

## Consistency rules (checked on every update)
- Scenario table sums to ~100%.
- P(nuclear deal) ≤ P(deal) × P(nuclear terms | deal).
- YE "deal" in odds.csv = P(deal by end-2026) in deal-tracker.md.
- Nov 3 gas lines in forecasts.csv derive from scenario rows × gas bands.
- Blink #10 odds sum to 100%.

## Workflows

**Manual brief (Adam asks):** skill → read `state/current.md` → search → answer in skill format → if odds change, update state + append odds.csv + forecasts.csv + events.md → one commit.

**Daily scheduled run (weekdays):**
1. Search news since last run; pull AAA (national + NY) via Firecrawl.
2. Append `gas.csv`; append new events to `log/events.md`.
3. Check each armed tripwire; mark fired with evidence.
4. If anything material: re-derive odds, run consistency checks, update state + CSVs.
5. Resolve any forecasts whose `resolves_on` has passed.
6. Commit (`daily: YYYY-MM-DD — <summary>`); rebuild + republish dashboard.
7. Push notification only if a tripwire fired or any Nov 3 scenario moved ≥3 pts.

## Dashboard
Single HTML artifact, republished to the same URL each run, data embedded at build.
- Stacked area: Nov 3 scenario odds over time, with event markers.
- Gas: AAA national + NYC daily vs forecast bands.
- Tripwire board: armed / fired / expired.
- Calibration: reliability plot + running Brier (meaningful after Nov 3).
- TACO strip: blinks vs non-blinks; Blink #10 live odds.

## Skill split
`geo-brief` SKILL.md keeps: style, format, sourcing and signal-weighting rules, consistency rules, and "read state from GeoBrief repo first, commit after." Everything dated moves to the repo.

## Migration (from current SKILL.md, Oct 4 state)
1. War arc → `log/events.md`; physical supply → `log/physical-supply.md`.
2. Canonical odds, gas baseline, tripwires → `state/current.md`, `tripwires.csv`.
3. Seed `odds.csv` with Oct 4 rows; seed `forecasts.csv` with Nov 3 gas lines, Blink #10, YE and structural odds.
4. Seed `gas.csv` with Oct 4 AAA.
5. Write slim skill; propose via skill-creator.

## Open decisions
- Notification threshold (default: tripwire fired or ≥3-pt move).
- Daily run time (default: 7:45am ET weekdays).
- Whether to port to GitHub Actions + Pages later.
