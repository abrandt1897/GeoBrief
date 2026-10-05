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
    "scenarios.csv": ["horizon", "scenario", "label", "group", "gas_band", "brent_band", "driver"],
    "gas.csv": ["date", "nat_regular", "nat_diesel", "ny_regular", "ny_diesel", "nyc_regular", "nyc_diesel", "source"],
    "markets.csv": ["date", "brent_ice_front", "dated_brent", "rial_per_usd", "source"],
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
    "tripwires.csv": ["id", "condition", "effect", "status", "set_on", "fired_on", "evidence"],
    "deal_terms.csv": ["term", "p", "rubio"],
    "blinks.csv": ["date", "end_date", "label", "type"],
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
        ("forecasts.csv", ["made_on", "resolves_on"]),
        ("tripwires.csv", ["set_on"]),
        ("blinks.csv", ["date"]),
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


def test_scenarios_have_valid_groups_and_gas_bands() -> None:
    for s in load("scenarios.csv"):
        assert s["group"] in {"war", "limbo", "calm"}
        if s["gas_band"]:
            lo, hi = (float(x) for x in s["gas_band"].split("-"))
            assert 2 < lo < hi < 8, f"implausible gas band {s['gas_band']}"


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


def test_forecasts_valid_p_outcome_and_unique_versions() -> None:
    seen: set[tuple[str, str]] = set()
    for r in load("forecasts.csv"):
        assert 0 <= float(r["p"]) <= 100
        assert r["outcome"] in {"", "0", "1"}, f"{r['id']}: outcome must be 0, 1 or blank"
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


def test_deal_terms() -> None:
    terms = load("deal_terms.csv")
    for t in terms:
        assert 0 <= float(t["p"]) <= 100
        assert t["rubio"] in {"", "1", "2", "3"}
    assert sorted(t["rubio"] for t in terms if t["rubio"]) == ["1", "2", "3"]


def test_blinks() -> None:
    for b in load("blinks.csv"):
        assert b["type"] in {"blink", "non_blink", "pending", "unscored"}
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
