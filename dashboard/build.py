#!/usr/bin/env python3
"""Build the GeoBrief dashboard: run consistency checks, then embed repo data into the template.

Usage:
    python3 dashboard/build.py          # checks, then writes dashboard/dist/
    python3 dashboard/build.py --check  # checks only

Outputs:
    dist/artifact.html  page body for the claude.ai artifact (the host adds the document skeleton)
    dist/index.html     full HTML document for GitHub Pages

Exits non-zero if any consistency check fails.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import TypedDict, cast

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
DASH = ROOT / "dashboard"
DIST = DASH / "dist"

Row = dict[str, str]


class Blink10(TypedDict):
    blink: int
    no_blink: int
    unresolved: int
    rubio_met: int


class DealP(TypedDict):
    ye2026: float
    ye2027: float


class Brief(TypedDict):
    updated: str
    headline: str
    status: str
    change_note: str
    bets: list[dict[str, str]]
    blink10: Blink10
    deal_p: DealP
    election_day: str


class Event(TypedDict):
    date: str
    text: str
    chart: str | None


def rows(name: str) -> list[Row]:
    with (DATA / name).open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(v: str | None) -> float | None:
    v = (v or "").strip()
    return float(v) if v else None


def numeric(rs: list[Row], text_cols: tuple[str, ...] = ("date", "source")) -> list[dict[str, str | float | None]]:
    return [{k: (v if k in text_cols else num(v)) for k, v in r.items()} for r in rs]


def load_events() -> list[Event]:
    out: list[Event] = []
    pat = re.compile(r"^- (\d{4}-\d{2}-\d{2}) \| (.+?)(?:\s*\[chart: ([^\]]+)\])?\s*$")
    for line in (ROOT / "log" / "events.md").read_text(encoding="utf-8").splitlines():
        m = pat.match(line)
        if m:
            out.append({"date": m.group(1), "text": m.group(2).strip(), "chart": m.group(3)})
    return out


def latest_forecasts(forecasts: list[Row]) -> dict[str, Row]:
    latest: dict[str, Row] = {}
    for r in forecasts:
        if r["id"] not in latest or r["made_on"] >= latest[r["id"]]["made_on"]:
            latest[r["id"]] = r
    return latest


def check_sums(odds: list[Row]) -> list[str]:
    sums: defaultdict[tuple[str, str], float] = defaultdict(float)
    for r in odds:
        sums[(r["date"], r["horizon"])] += float(r["p"])
    return [
        f"odds.csv {date} {horizon} sums to {s:g}, expected 100±1"
        for (date, horizon), s in sorted(sums.items())
        if abs(s - 100) > 1
    ]


def check_blink10(latest_f: dict[str, Row], brief: Brief) -> list[str]:
    errors: list[str] = []
    b = brief["blink10"]
    if b["blink"] + b["no_blink"] + b["unresolved"] != 100:
        errors.append("brief.json blink10 odds do not sum to 100")
    want: dict[str, int] = {
        "blink10_blink": b["blink"],
        "blink10_noblink": b["no_blink"],
        "blink10_open": b["unresolved"],
    }
    total = sum(float(latest_f[k]["p"]) for k in want if k in latest_f)
    if total and abs(total - 100) > 0.5:
        errors.append(f"forecasts.csv Blink #10 rows sum to {total:g}")
    errors += [
        f"forecasts.csv {k} ({latest_f[k]['p']}) != brief.json blink10 ({w})"
        for k, w in want.items()
        if k in latest_f and float(latest_f[k]["p"]) != w
    ]
    return errors


def check_deal(odds: list[Row], latest_f: dict[str, Row], terms: list[Row], brief: Brief) -> list[str]:
    ye = [r for r in odds if r["horizon"] == "ye2026"]
    if not ye:
        return []
    last = max(r["date"] for r in ye)
    ye_deal = next((float(r["p"]) for r in ye if r["date"] == last and r["scenario"] == "deal"), None)
    if ye_deal is None:
        return []
    errors: list[str] = []
    if "deal_ye2026" in latest_f and float(latest_f["deal_ye2026"]["p"]) != ye_deal:
        errors.append(f"YE deal mismatch: odds.csv {ye_deal:g} vs forecasts.csv {latest_f['deal_ye2026']['p']}")
    if brief["deal_p"]["ye2026"] != ye_deal:
        errors.append(f"YE deal mismatch: odds.csv {ye_deal:g} vs brief.json {brief['deal_p']['ye2026']}")
    iaea = next((float(t["p"]) for t in terms if t["rubio"] == "1"), None)
    if "nuke_deal_2026" in latest_f and iaea is not None:
        cap = ye_deal * iaea / 100
        if float(latest_f["nuke_deal_2026"]["p"]) > cap + 0.5:
            errors.append(f"P(nuclear deal) {latest_f['nuke_deal_2026']['p']} > P(deal) x P(IAEA term) = {cap:.1f}")
    return errors


def check_war(odds: list[Row], latest_f: dict[str, Row]) -> list[str]:
    nov = [r for r in odds if r["horizon"] == "nov3"]
    if not nov or "war_nov3" not in latest_f:
        return []
    last = max(r["date"] for r in nov)
    war = sum(float(r["p"]) for r in nov if r["date"] == last and r["scenario"].startswith("war_"))
    if abs(war - float(latest_f["war_nov3"]["p"])) > 0.5:
        return [f"war_nov3 forecast {latest_f['war_nov3']['p']} != sum of war rows {war:g} on {last}"]
    return []


def check(odds: list[Row], forecasts: list[Row], terms: list[Row], brief: Brief) -> list[str]:
    latest_f = latest_forecasts(forecasts)
    return (
        check_sums(odds)
        + check_blink10(latest_f, brief)
        + check_deal(odds, latest_f, terms, brief)
        + check_war(odds, latest_f)
    )


def render(brief: Brief, odds: list[Row], forecasts: list[Row], terms: list[Row]) -> str:
    payload = {
        "brief": brief,
        "odds": [{**r, "p": float(r["p"])} for r in odds],
        "scenarios": rows("scenarios.csv"),
        "gas": numeric(rows("gas.csv")),
        "markets": numeric(rows("markets.csv")),
        "forecasts": [{**r, "p": float(r["p"]), "outcome": num(r["outcome"])} for r in forecasts],
        "tripwires": rows("tripwires.csv"),
        "terms": [{**t, "p": float(t["p"])} for t in terms],
        "blinks": rows("blinks.csv"),
        "events": load_events(),
    }
    blob = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = (DASH / "template.html").read_text(encoding="utf-8")
    parts = {
        "/*__STYLES__*/": (DASH / "styles.css").read_text(encoding="utf-8"),
        "/*__APP__*/": (DASH / "app.js").read_text(encoding="utf-8").replace("</", "<\\/"),
        "__GEOBRIEF_DATA__": blob,
    }
    for marker, content in parts.items():
        if marker not in html:
            sys.exit(f"template.html is missing the {marker} placeholder")
        html = html.replace(marker, content)
    return html


def full_document(page: str) -> str:
    """Wrap the artifact page in a standalone document; everything above `<!-- body -->` goes in <head>."""
    head, sep, body = page.partition("<!-- body -->")
    if not sep:
        sys.exit("template.html is missing the <!-- body --> marker")
    return (
        '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f"{head.strip()}\n<style>body{{margin:0}}[hidden]{{display:none!important}}</style>\n"
        f"</head>\n<body>\n{body.strip()}\n</body>\n</html>\n"
    )


def main() -> None:
    odds = rows("odds.csv")
    forecasts = rows("forecasts.csv")
    terms = rows("deal_terms.csv")
    brief = cast(Brief, json.loads((ROOT / "state" / "brief.json").read_text(encoding="utf-8")))

    errors = check(odds, forecasts, terms, brief)
    for e in errors:
        print("CHECK FAILED:", e, file=sys.stderr)
    if errors:
        sys.exit(1)
    print("Consistency checks passed.")
    if "--check" in sys.argv:
        return

    body = render(brief, odds, forecasts, terms)
    DIST.mkdir(parents=True, exist_ok=True)
    (DIST / "artifact.html").write_text(body, encoding="utf-8")
    (DIST / "index.html").write_text(full_document(body), encoding="utf-8")
    print(f"Wrote dashboard/dist/artifact.html and index.html ({len(body) // 1024} KB)")


if __name__ == "__main__":
    main()
