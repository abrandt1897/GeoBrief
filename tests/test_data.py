"""Schema and integrity tests for the repo's data files. These guard the scheduled runs' edits."""

from __future__ import annotations

import csv
import json
import re
from datetime import date
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ISO = re.compile(r"^\d{4}-\d{2}-\d{2}$")

SCHEMAS: dict[str, list[str]] = {
    "odds.csv": ["date", "horizon", "scenario", "p", "note"],
    "scenarios.csv": [
        "horizon",
        "scenario",
        "label",
        "group",
        "gas_band",
        "diesel_band",
        "brent_band",
        "lng_band",
        "driver",
    ],
    "gas.csv": ["date", "nat_regular", "nat_diesel", "ny_regular", "ny_diesel", "nyc_regular", "nyc_diesel", "source"],
    "markets.csv": ["date", "brent_ice_front", "dated_brent", "dated_floor", "rial_per_usd", "source"],
    "energy.csv": ["date", "brent_front", "brent_spot", "jkm_front", "source"],
    "forecasts.csv": [
        "id",
        "made_on",
        "question",
        "p",
        "resolves_on",
        "resolution_rule",
        "outcome",
        "resolved_on",
        "notes",
    ],
    "tripwires.csv": ["id", "condition", "effect", "status", "set_on", "fired_on", "evidence", "targets"],
    "deal_terms.csv": ["term", "p", "rubio"],
    "blinks.csv": ["date", "end_date", "label", "detail", "type"],
    "supply.csv": ["date", "series", "mbd", "kind", "source", "note"],
    "supply_events.csv": ["date", "label"],
}


def load(name: str) -> list[dict[str, str]]:
    with (DATA / name).open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def is_date(s: str) -> bool:
    if not ISO.match(s):
        return False
    try:
        date.fromisoformat(s)
    except ValueError:
        return False
    return True


@pytest.mark.parametrize("name", sorted(SCHEMAS))
def test_headers_match_schema(name: str) -> None:
    with (DATA / name).open(newline="", encoding="utf-8") as f:
        header = next(csv.reader(f))
    assert header == SCHEMAS[name]


@pytest.mark.parametrize("name", sorted(SCHEMAS))
def test_no_ragged_rows(name: str) -> None:
    with (DATA / name).open(newline="", encoding="utf-8") as f:
        lines = list(csv.reader(f))
    width = len(lines[0])
    bad = [i + 1 for i, line in enumerate(lines) if len(line) != width]
    assert not bad, f"{name}: rows with wrong column count at lines {bad}"


@pytest.mark.parametrize(
    ("name", "cols"),
    [
        ("odds.csv", ["date"]),
        ("gas.csv", ["date"]),
        ("markets.csv", ["date"]),
        ("energy.csv", ["date"]),
        ("forecasts.csv", ["made_on", "resolves_on"]),
        ("tripwires.csv", ["set_on"]),
        ("blinks.csv", ["date"]),
        ("supply.csv", ["date"]),
        ("supply_events.csv", ["date"]),
    ],
)
def test_dates_are_valid(name: str, cols: list[str]) -> None:
    for r in load(name):
        for c in cols:
            assert is_date(r[c]), f"{name}: bad {c} {r[c]!r}"


def test_odds_reference_known_scenarios_and_valid_p() -> None:
    known = {(s["horizon"], s["scenario"]) for s in load("scenarios.csv")}
    for r in load("odds.csv"):
        assert (r["horizon"], r["scenario"]) in known, f"unknown scenario {r['horizon']}:{r['scenario']}"
        assert 0 <= float(r["p"]) <= 100


def test_odds_have_no_duplicate_scenarios_per_update() -> None:
    seen: set[tuple[str, str, str]] = set()
    for r in load("odds.csv"):
        key = (r["date"], r["horizon"], r["scenario"])
        assert key not in seen, f"duplicate odds row {key}"
        seen.add(key)


BAND_SEG = re.compile(r"^\d+(\.\d+)?-\d+(\.\d+)?(:\d+(\.\d+)?)?$")


def test_scenarios_have_valid_groups_and_bands() -> None:
    limits = {"gas_band": (2, 8), "diesel_band": (2, 10), "brent_band": (30, 250), "lng_band": (3, 80)}
    for s in load("scenarios.csv"):
        assert s["group"] in {"limited_war", "escalated_war", "mou_deal", "comprehensive_deal", ""}
        for col, (floor, ceil) in limits.items():
            if not s[col]:
                continue
            for seg in s[col].split("|"):
                assert BAND_SEG.match(seg), f"{s['scenario']} {col}: malformed segment {seg!r}"
                lo, hi = (float(x) for x in seg.split(":")[0].split("-"))
                assert floor < lo < hi < ceil, f"implausible {col} {s[col]}"


def test_gas_one_row_per_date_and_plausible_prices() -> None:
    rows = load("gas.csv")
    dates = [r["date"] for r in rows]
    assert len(dates) == len(set(dates)), "gas.csv has two rows for one date"
    assert dates == sorted(dates), "gas.csv must be in date order"
    for r in rows:
        for col in ("nat_regular", "ny_regular", "nyc_regular"):
            if r[col]:
                assert 2 < float(r[col]) < 8, f"{r['date']} {col}={r[col]}"
        for col in ("nat_diesel", "ny_diesel", "nyc_diesel"):
            if r[col]:
                assert 2 < float(r[col]) < 10, f"{r['date']} {col}={r[col]}"


def test_energy_one_row_per_date_and_plausible_prices() -> None:
    rows = load("energy.csv")
    dates = [r["date"] for r in rows]
    assert len(dates) == len(set(dates)), "energy.csv has two rows for one date"
    assert dates == sorted(dates), "energy.csv must be in date order"
    for r in rows:
        assert r["source"], f"{r['date']}: energy row without a source"
        for col, lo, hi in (("brent_front", 30, 250), ("brent_spot", 30, 250), ("jkm_front", 3, 80)):
            if r[col]:
                assert lo < float(r[col]) < hi, f"{r['date']} {col}={r[col]}"


def test_forecasts_valid_p_outcome_and_unique_versions() -> None:
    seen: set[tuple[str, str]] = set()
    for r in load("forecasts.csv"):
        assert 0 <= float(r["p"]) <= 100
        assert r["outcome"] in {"", "0", "1", "void"}, f"{r['id']}: outcome must be 0, 1, void or blank"
        if r["outcome"]:
            assert is_date(r["resolved_on"]), f"{r['id']}: resolved forecast needs resolved_on"
        key = (r["id"], r["made_on"])
        assert key not in seen, f"duplicate forecast {key}"
        seen.add(key)


def test_tripwire_status_rules() -> None:
    ids = [t["id"] for t in load("tripwires.csv")]
    assert len(ids) == len(set(ids))
    for t in load("tripwires.csv"):
        assert t["status"] in {"armed", "fired", "expired"}
        if t["status"] == "fired":
            assert is_date(t["fired_on"]), f"{t['id']}: fired tripwire needs fired_on"
            assert t["evidence"], f"{t['id']}: fired tripwire needs evidence"
        if t["status"] == "armed":
            assert not t["fired_on"], f"{t['id']}: armed tripwire can't have fired_on"
            assert t["targets"], f"{t['id']}: armed tripwire needs targets (id=p;horizon:scenario=p)"


def test_deal_terms() -> None:
    terms = load("deal_terms.csv")
    for t in terms:
        assert 0 <= float(t["p"]) <= 100
        assert t["rubio"] in {"", "1", "2", "3"}
    assert sorted(t["rubio"] for t in terms if t["rubio"]) == ["1", "2", "3"]


def test_blinks() -> None:
    for b in load("blinks.csv"):
        assert b["type"] in {"blink", "non_blink", "pending", "unscored"}
        assert 1 <= len(b["label"].split()) <= 3, f"chart caption should be 1-3 words: {b['label']!r}"
        assert b["detail"], f"{b['date']}: blink needs a detail line for the list"
        if b["end_date"]:
            assert is_date(b["end_date"])
            assert b["end_date"] >= b["date"]


def test_events_log_is_chronological_and_well_formed() -> None:
    pat = re.compile(r"^- (\d{4}-\d{2}-\d{2}) \| .+")
    lines = [ln for ln in (ROOT / "log" / "events.md").read_text(encoding="utf-8").splitlines() if ln.startswith("- ")]
    dates: list[str] = []
    for ln in lines:
        m = pat.match(ln)
        assert m, f"malformed event line: {ln!r}"
        assert is_date(m.group(1))
        dates.append(m.group(1))
    assert dates == sorted(dates), "log/events.md must stay in date order (newest last)"


def test_brief_json_shape() -> None:
    b = json.loads((ROOT / "state" / "brief.json").read_text(encoding="utf-8"))
    for key in ("updated", "headline", "status", "change_note", "bets", "blink10", "deal_p", "election_day"):
        assert key in b, f"brief.json missing {key}"
    assert is_date(b["updated"])
    assert is_date(b["election_day"])
    assert len(b["bets"]) >= 1
    assert all({"cond", "effect"} <= set(x) for x in b["bets"])
    latest_odds = max(r["date"] for r in load("odds.csv"))
    assert b["updated"] >= latest_odds, "brief.json 'updated' is older than the latest odds row"


def test_supply_series_are_sourced_plausible_and_unique() -> None:
    rows = load("supply.csv")
    assert rows, "supply.csv is empty"
    dates = [r["date"] for r in rows]
    assert dates == sorted(dates), "supply.csv must be in date order"
    series = {"gulf_iea", "gulf_kpler", "hormuz_iea", "hormuz_kpler", "eastwest"}
    seen: set[tuple[str, str]] = set()
    for r in rows:
        assert r["series"] in series, f"unknown series {r['series']!r}"
        assert r["kind"] in {"baseline", "monthly", "daily", "7d", "estimate", "unconfirmed"}, f"bad kind {r['kind']!r}"
        assert 0 <= float(r["mbd"]) <= 25, f"{r['date']} {r['series']}: implausible {r['mbd']} mb/d"
        assert r["source"], f"{r['date']} {r['series']}: every reading needs a source"
        key = (r["date"], r["series"])
        assert key not in seen, f"two readings for {key}; keep the latest vintage and note the revision"
        seen.add(key)


def test_supply_events_have_short_captions() -> None:
    rows = load("supply_events.csv")
    assert [r["date"] for r in rows] == sorted(r["date"] for r in rows)
    for r in rows:
        assert 1 <= len(r["label"].split()) <= 3, f"chart caption should be 1-3 words: {r['label']!r}"


def test_current_md_tables_match_latest_odds() -> None:
    """The scenario tables in state/current.md quote the latest odds.csv rows (prose drifts otherwise)."""
    text = (ROOT / "state" / "current.md").read_text(encoding="utf-8")
    odds = load("odds.csv")
    labels = {
        "limited_war": "Limited war / Limbo",
        "escalated_war": "Escalated war",
        "mou_deal": "MOU-style deal",
        "comprehensive_deal": "Comprehensive deal",
    }
    sections = {"nov3": "### Through Midterms", "ye2026": "### Through Year-End"}
    for horizon, head in sections.items():
        body = text.split(head, 1)[1].split("\n### ", 1)[0]
        last = max(r["date"] for r in odds if r["horizon"] == horizon)
        for r in odds:
            if r["horizon"] == horizon and r["date"] == last:
                m = re.search(rf"^\| {re.escape(labels[r['scenario']])} +\| (\d+)% ", body, re.M)
                assert m, f"current.md {horizon}: no table row for {r['scenario']}"
                got = m.group(1)
                assert float(got) == float(r["p"]), f"current.md {horizon} {r['scenario']} {got}% != odds.csv {r['p']}"


def test_prose_quotes_canonical_deal_and_blink_odds() -> None:
    brief = json.loads((ROOT / "state" / "brief.json").read_text(encoding="utf-8"))
    deal, b10 = brief["deal_p"], brief["blink10"]
    for name in ("state/deal-tracker.md", "skill/SKILL.md"):
        text = (ROOT / name).read_text(encoding="utf-8")
        want = f"P(deal) ≈ {deal['ye2026']}% by end-2026, {deal['ye2027']}% by end-2027"
        assert want in text, f"{name}: expected {want!r}"
    for name in ("state/taco.md", "skill/SKILL.md"):
        text = (ROOT / name).read_text(encoding="utf-8")
        want = f"blink ~{b10['blink']}% · no blink ~{b10['no_blink']}% · unresolved ~{b10['unresolved']}%"
        assert want in text, f"{name}: expected {want!r}"
