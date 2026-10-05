#!/usr/bin/env python3
"""Build the GeoBrief dashboard: run consistency checks, then embed repo data into template.html.

Usage: python3 dashboard/build.py          # checks + writes dashboard/dist/index.html
       python3 dashboard/build.py --check  # checks only
Exits non-zero if any consistency check fails.
"""
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "dashboard" / "dist" / "index.html"


def rows(name):
    with open(DATA / name, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(v):
    v = (v or "").strip()
    return float(v) if v else None


def load_events():
    out = []
    pat = re.compile(r"^- (\d{4}-\d{2}-\d{2}) \| (.+?)(?:\s*\[chart: ([^\]]+)\])?\s*$")
    for line in (ROOT / "log" / "events.md").read_text(encoding="utf-8").splitlines():
        m = pat.match(line)
        if m:
            out.append({"date": m.group(1), "text": m.group(2).strip(), "chart": m.group(3)})
    return out


def check(odds, forecasts, terms, brief):
    errors = []
    sums = defaultdict(float)
    for r in odds:
        sums[(r["date"], r["horizon"])] += float(r["p"])
    for (date, horizon), s in sorted(sums.items()):
        if abs(s - 100) > 1:
            errors.append(f"odds.csv {date} {horizon} sums to {s:g}, expected 100±1")

    b = brief["blink10"]
    if b["blink"] + b["no_blink"] + b["unresolved"] != 100:
        errors.append("brief.json blink10 odds do not sum to 100")
    latest_f = {}
    for r in forecasts:
        if r["id"] not in latest_f or r["made_on"] >= latest_f[r["id"]]["made_on"]:
            latest_f[r["id"]] = r
    bl = sum(float(latest_f[k]["p"]) for k in ("blink10_blink", "blink10_noblink", "blink10_open") if k in latest_f)
    if bl and abs(bl - 100) > 0.5:
        errors.append(f"forecasts.csv Blink #10 rows sum to {bl:g}")
    for k, field in (("blink10_blink", "blink"), ("blink10_noblink", "no_blink"), ("blink10_open", "unresolved")):
        if k in latest_f and float(latest_f[k]["p"]) != b[field]:
            errors.append(f"forecasts.csv {k} ({latest_f[k]['p']}) != brief.json blink10.{field} ({b[field]})")

    ye = [r for r in odds if r["horizon"] == "ye2026"]
    if ye:
        last = max(r["date"] for r in ye)
        ye_deal = next((float(r["p"]) for r in ye if r["date"] == last and r["scenario"] == "deal"), None)
        if "deal_ye2026" in latest_f and ye_deal is not None and float(latest_f["deal_ye2026"]["p"]) != ye_deal:
            errors.append(f"YE deal mismatch: odds.csv {ye_deal:g} vs forecasts.csv {latest_f['deal_ye2026']['p']}")
        if ye_deal is not None and brief["deal_p"]["ye2026"] != ye_deal:
            errors.append(f"YE deal mismatch: odds.csv {ye_deal:g} vs brief.json {brief['deal_p']['ye2026']}")
        iaea = next((float(t["p"]) for t in terms if t["rubio"] == "1"), None)
        if "nuke_deal_2026" in latest_f and ye_deal is not None and iaea is not None:
            cap = ye_deal * iaea / 100
            if float(latest_f["nuke_deal_2026"]["p"]) > cap + 0.5:
                errors.append(f"P(nuclear deal) {latest_f['nuke_deal_2026']['p']} > P(deal) x P(IAEA term) = {cap:.1f}")

    nov = [r for r in odds if r["horizon"] == "nov3"]
    if nov and "war_nov3" in latest_f:
        last = max(r["date"] for r in nov)
        war = sum(float(r["p"]) for r in nov if r["date"] == last and r["scenario"].startswith("war_"))
        if abs(war - float(latest_f["war_nov3"]["p"])) > 0.5:
            errors.append(f"war_nov3 forecast {latest_f['war_nov3']['p']} != sum of war rows {war:g} on {last}")
    return errors


def main():
    odds = rows("odds.csv")
    forecasts = rows("forecasts.csv")
    terms = rows("deal_terms.csv")
    brief = json.loads((ROOT / "state" / "brief.json").read_text(encoding="utf-8"))

    errors = check(odds, forecasts, terms, brief)
    for e in errors:
        print("CHECK FAILED:", e, file=sys.stderr)
    if errors:
        sys.exit(1)
    print("Consistency checks passed.")
    if "--check" in sys.argv:
        return

    payload = {
        "brief": brief,
        "odds": [{**r, "p": float(r["p"])} for r in odds],
        "scenarios": rows("scenarios.csv"),
        "gas": [{k: (num(v) if k not in ("date", "source") else v) for k, v in r.items()} for r in rows("gas.csv")],
        "markets": [{k: (num(v) if k not in ("date", "source") else v) for k, v in r.items()} for r in rows("markets.csv")],
        "forecasts": [{**r, "p": float(r["p"]), "outcome": num(r["outcome"])} for r in forecasts],
        "tripwires": rows("tripwires.csv"),
        "terms": [{**t, "p": float(t["p"])} for t in terms],
        "blinks": rows("blinks.csv"),
        "events": load_events(),
    }
    blob = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = (ROOT / "dashboard" / "template.html").read_text(encoding="utf-8")
    if "__GEOBRIEF_DATA__" not in html:
        sys.exit("template.html is missing the __GEOBRIEF_DATA__ placeholder")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html.replace("__GEOBRIEF_DATA__", blob), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
