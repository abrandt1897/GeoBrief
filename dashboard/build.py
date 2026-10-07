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


def outcome(v: str) -> float | str | None:
    """Forecast outcome: 1, 0, "void" (not scored) or None (open)."""
    v = v.strip()
    if v not in ("", "0", "1", "void"):
        sys.exit(f"forecasts.csv outcome {v!r} must be blank, 0, 1 or void")
    return v if v == "void" else num(v)


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


def md_inline(s: str) -> str:
    """Escape text, then render **bold** spans."""
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)


def latest_supply_note() -> dict[str, str] | None:
    """Last `## ` section of log/physical-supply.md as {title, lead, more}: paragraphs and one level of bullets."""
    text = (ROOT / "log" / "physical-supply.md").read_text(encoding="utf-8")
    sections = re.split(r"^## ", text, flags=re.M)[1:]
    if not sections:
        return None
    title, _, body = sections[-1].partition("\n")
    html: list[str] = []
    in_list = False
    for raw in body.splitlines():
        line = raw.strip()
        if line.startswith("- "):
            if not in_list:
                html.append("<ul>")
                in_list = True
            html.append(f"<li>{md_inline(line[2:])}</li>")
            continue
        if in_list:
            html.append("</ul>")
            in_list = False
        if line:
            html.append(f"<p>{md_inline(line)}</p>")
    if in_list:
        html.append("</ul>")
    # The first paragraph is the bottom line; the dashboard folds the rest behind "Full note".
    lead = html[0] if html and html[0].startswith("<p>") else ""
    return {"title": title.strip(), "lead": lead, "more": "".join(html[1:] if lead else html)}


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


def latest_odds(odds: list[Row], horizon: str) -> dict[str, float]:
    rs = [r for r in odds if r["horizon"] == horizon]
    if not rs:
        return {}
    last = max(r["date"] for r in rs)
    return {r["scenario"]: float(r["p"]) for r in rs if r["date"] == last}


def check_deal(odds: list[Row], latest_f: dict[str, Row], terms: list[Row], brief: Brief) -> list[str]:
    """Year-end: comprehensive <= P(signed deal) <= MOU-style + comprehensive; nuclear deal fits inside both."""
    ye = latest_odds(odds, "ye2026")
    if "comprehensive_deal" not in ye or "mou_deal" not in ye:
        return []
    comp, mou = ye["comprehensive_deal"], ye["mou_deal"]
    deal = float(brief["deal_p"]["ye2026"])
    errors: list[str] = []
    if "deal_ye2026" in latest_f and float(latest_f["deal_ye2026"]["p"]) != deal:
        errors.append(f"YE deal mismatch: forecasts.csv {latest_f['deal_ye2026']['p']} vs brief.json {deal:g}")
    if not comp - 0.5 <= deal <= comp + mou + 0.5:
        errors.append(f"P(signed deal by YE) {deal:g} outside comprehensive {comp:g} .. MOU + comp. {comp + mou:g}")
    if "nuke_deal_2026" in latest_f:
        nuke = float(latest_f["nuke_deal_2026"]["p"])
        if nuke > comp + 0.5:
            errors.append(f"P(nuclear deal) {nuke:g} > YE comprehensive deal {comp:g}")
        iaea = next((float(t["p"]) for t in terms if t["rubio"] == "1"), None)
        if iaea is not None and nuke > deal * iaea / 100 + 0.5:
            errors.append(f"P(nuclear deal) {nuke:g} > P(deal) x P(IAEA term) = {deal * iaea / 100:.1f}")
    return errors


def check_blink10_scenarios(odds: list[Row], brief: Brief) -> list[str]:
    """Blink #10 against the year-end odds.

    Dec 31 always resolves it (neither a deal nor a Jul-scale campaign is a blink), so "unresolved" stays near 0.
    No blink needs a Rubio-term deal or a Jul-scale campaign, so it is at least the comprehensive deal odds.
    """
    ye = latest_odds(odds, "ye2026")
    b = brief["blink10"]
    errors: list[str] = []
    if b["unresolved"] > 2:
        errors.append(f"Blink #10 unresolved {b['unresolved']} > 2, but Dec 31 always resolves it")
    if "comprehensive_deal" in ye and b["no_blink"] < ye["comprehensive_deal"] - 0.5:
        errors.append(f"Blink #10 no blink {b['no_blink']} < YE comprehensive deal {ye['comprehensive_deal']:g}")
    return errors


def band_segments(band: str) -> list[tuple[float, float, float]]:
    """Parse a price band into (lo, hi, weight) segments with weights summing to 1.

    A band is either "lo-hi" or weighted sub-ranges "lo-hi:w|lo-hi:w" (w = relative weight, e.g. the
    pre-merge scenario odds), so a merged scenario keeps the price mix of the paths inside it.
    """
    band = band.strip()
    if not band:
        return []
    segs: list[tuple[float, float, float]] = []
    for part in band.split("|"):
        rng, _, w = part.partition(":")
        lo, _, hi = rng.partition("-")
        segs.append((float(lo), float(hi), float(w) if w else 1.0))
    total = sum(w for _, _, w in segs)
    return [(lo, hi, w / total) for lo, hi, w in segs]


def p_at_least(segs: list[tuple[float, float, float]], x: float) -> float:
    """P(price >= x) for one scenario, uniform within each segment."""
    p = 0.0
    for lo, hi, w in segs:
        if x <= lo:
            p += w
        elif x < hi:
            p += w * (hi - x) / (hi - lo)
    return p


# Forecast id -> (scenarios.csv band column, ">=" or "<", threshold).
# NYC metro lines use the national gas band plus the NYC premium (see nyc_premium).
PRICE_LINES: dict[str, tuple[str, str, float]] = {
    "gas_nat_lt400": ("gas_band", "<", 4.00),
    "gas_nat_450": ("gas_band", ">=", 4.50),
    "gas_nat_475": ("gas_band", ">=", 4.75),
    "gas_nat_500": ("gas_band", ">=", 5.00),
    "gas_nyc_475": ("gas_band", ">=", 4.75),
    "gas_nyc_500": ("gas_band", ">=", 5.00),
    "gas_diesel_lt600": ("diesel_band", "<", 6.00),
    "gas_diesel_650": ("diesel_band", ">=", 6.50),
    "gas_diesel_675": ("diesel_band", ">=", 6.75),
    "gas_diesel_700": ("diesel_band", ">=", 7.00),
    "brent_lt90": ("brent_band", "<", 90),
    "brent_100": ("brent_band", ">=", 100),
    "brent_110": ("brent_band", ">=", 110),
    "brent_120": ("brent_band", ">=", 120),
    "lng_jkm_lt20": ("lng_band", "<", 20),
    "lng_jkm_25": ("lng_band", ">=", 25),
    "lng_jkm_28": ("lng_band", ">=", 28),
    "lng_jkm_31": ("lng_band", ">=", 31),
}


def nyc_premium(gas: list[Row]) -> float:
    """NYC metro regular minus national regular on the latest gas.csv row that has both, to the cent."""
    both = [r for r in gas if r["nat_regular"] and r["nyc_regular"]]
    last = max(both, key=lambda r: r["date"])
    return round(float(last["nyc_regular"]) - float(last["nat_regular"]), 2)


def implied_price_line(odds: list[Row], scenarios: list[Row], fid: str, premium: float = 0.0) -> float | None:
    """A Nov. 3 price line implied by the latest scenario odds and their bands, in percent.

    `premium` is the NYC-over-national gap; NYC lines test the national band at the threshold minus it.
    """
    col, op, x = PRICE_LINES[fid]
    if fid.startswith("gas_nyc_"):
        x -= premium
    nov = latest_odds(odds, "nov3")
    bands = {s["scenario"]: s[col] for s in scenarios if s["horizon"] == "nov3"}
    total = 0.0
    for k, p in nov.items():
        segs = band_segments(bands.get(k, ""))
        if not segs:
            return None
        ge = p_at_least(segs, x)
        total += p * (ge if op == ">=" else 1 - ge)
    return total


def check_price_lines(
    odds: list[Row], scenarios: list[Row], latest_f: dict[str, Row], premium: float = 0.0
) -> list[str]:
    """Every Nov. 3 price forecast equals scenario odds x bands (rounded), so the bars and ranges agree."""
    errors: list[str] = []
    for fid in PRICE_LINES:
        if fid not in latest_f:
            continue
        want = implied_price_line(odds, scenarios, fid, premium)
        if want is None:
            errors.append(f"{fid}: a current nov3 scenario has no band for it")
            continue
        got = float(latest_f[fid]["p"])
        if abs(got - want) > 1:
            errors.append(f"forecasts.csv {fid} = {got:g}, but scenario odds x bands give {want:.1f}")
    return errors


def check_scenario_forecasts(odds: list[Row], latest_f: dict[str, Row]) -> list[str]:
    """The scored scenario forecasts (scen_<horizon>_<scenario>) match the latest odds."""
    errors: list[str] = []
    for horizon in ("nov3", "ye2026"):
        for k, p in latest_odds(odds, horizon).items():
            fid = f"scen_{horizon}_{k}"
            if fid not in latest_f:
                errors.append(f"forecasts.csv has no {fid} row for the latest {horizon} odds")
            elif float(latest_f[fid]["p"]) != p:
                errors.append(f"forecasts.csv {fid} = {latest_f[fid]['p']} but odds.csv says {p:g}")
    return errors


def current_value(odds: list[Row], latest_f: dict[str, Row], key: str) -> float | None:
    """A tripwire target's current value: a forecast id, or horizon:scenario from odds.csv."""
    if ":" in key:
        horizon, scen = key.split(":", 1)
        return latest_odds(odds, horizon).get(scen)
    return float(latest_f[key]["p"]) if key in latest_f else None


def check_tripwires(odds: list[Row], latest_f: dict[str, Row], trips: list[Row]) -> list[str]:
    """Armed tripwires must name targets that exist and would move them at least 2 points."""
    errors: list[str] = []
    for t in trips:
        if t["status"] != "armed":
            continue
        if not t["targets"]:
            errors.append(f"tripwires.csv {t['id']}: armed tripwire has no targets")
            continue
        for part in t["targets"].split(";"):
            key, _, val = part.strip().partition("=")
            cur = current_value(odds, latest_f, key)
            if cur is None:
                errors.append(f"tripwires.csv {t['id']}: unknown target {key}")
            elif abs(float(val) - cur) < 2:
                errors.append(f"tripwires.csv {t['id']}: target {key}={val} is within 2 of the current {cur:g}")
    return errors


def check(odds: list[Row], forecasts: list[Row], terms: list[Row], brief: Brief) -> list[str]:
    latest_f = latest_forecasts(forecasts)
    return (
        check_sums(odds)
        + check_blink10(latest_f, brief)
        + check_deal(odds, latest_f, terms, brief)
        + check_blink10_scenarios(odds, brief)
    )


def check_derived(odds: list[Row], forecasts: list[Row], scenarios: list[Row], trips: list[Row]) -> list[str]:
    """Checks on numbers derived from the odds: price lines, scored scenarios and tripwire targets."""
    latest_f = latest_forecasts(forecasts)
    return (
        check_price_lines(odds, scenarios, latest_f, nyc_premium(rows("gas.csv")))
        + check_scenario_forecasts(odds, latest_f)
        + check_tripwires(odds, latest_f, trips)
    )


def render(brief: Brief, odds: list[Row], forecasts: list[Row], terms: list[Row]) -> str:
    payload = {
        "brief": brief,
        "odds": [{**r, "p": float(r["p"])} for r in odds],
        "scenarios": rows("scenarios.csv"),
        "gas": numeric(rows("gas.csv")),
        "markets": numeric(rows("markets.csv")),
        "energy": numeric(rows("energy.csv")),
        "forecasts": [{**r, "p": float(r["p"]), "outcome": outcome(r["outcome"])} for r in forecasts],
        "tripwires": rows("tripwires.csv"),
        "terms": [{**t, "p": float(t["p"])} for t in terms],
        "blinks": rows("blinks.csv"),
        "events": load_events(),
        "supply": numeric(rows("supply.csv"), ("date", "series", "kind", "source", "note")),
        "supply_events": rows("supply_events.csv"),
        "supply_note": latest_supply_note(),
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

    errors = check(odds, forecasts, terms, brief) + check_derived(
        odds, forecasts, rows("scenarios.csv"), rows("tripwires.csv")
    )
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
