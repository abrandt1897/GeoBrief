"""Unit tests for dashboard/build.py: parsing helpers, consistency checks and rendering."""

from __future__ import annotations

import json
import re
from pathlib import Path

import build
import pytest

Row = dict[str, str]


def brief(**over: object) -> build.Brief:
    base: build.Brief = {
        "updated": "2026-10-04",
        "headline": "H",
        "status": "S",
        "change_note": "C",
        "bets": [],
        "blink10": {"blink": 38, "no_blink": 38, "unresolved": 24, "rubio_met": 0},
        "deal_p": {"ye2026": 16, "ye2027": 34},
        "election_day": "2026-11-03",
    }
    base.update(over)  # type: ignore[typeddict-item]
    return base


def odds_row(date: str, horizon: str, scenario: str, p: float) -> Row:
    return {"date": date, "horizon": horizon, "scenario": scenario, "p": str(p), "note": ""}


def forecast(fid: str, p: float, made_on: str = "2026-10-04") -> Row:
    return {"id": fid, "made_on": made_on, "p": str(p), "question": "", "resolves_on": "", "outcome": ""}


GOOD_ODDS = [
    odds_row("2026-10-04", "nov3", "war_limited", 39),
    odds_row("2026-10-04", "nov3", "war_infra", 9),
    odds_row("2026-10-04", "nov3", "war_sustained", 7),
    odds_row("2026-10-04", "nov3", "limbo", 20),
    odds_row("2026-10-04", "nov3", "half_open", 12),
    odds_row("2026-10-04", "nov3", "iran_folds", 8),
    odds_row("2026-10-04", "nov3", "deal", 5),
    odds_row("2026-10-04", "ye2026", "war_resumed", 48),
    odds_row("2026-10-04", "ye2026", "half_open", 18),
    odds_row("2026-10-04", "ye2026", "deal", 16),
    odds_row("2026-10-04", "ye2026", "limbo", 9),
    odds_row("2026-10-04", "ye2026", "iran_folds", 9),
]
TERMS: list[Row] = [{"term": "IAEA", "p": "40", "rubio": "1"}, {"term": "Other", "p": "90", "rubio": ""}]


# ---------- helpers ----------


@pytest.mark.parametrize(("raw", "want"), [("4.37", 4.37), ("", None), ("  ", None), (None, None), ("120", 120.0)])
def test_num(raw: str | None, want: float | None) -> None:
    assert build.num(raw) == want


def test_numeric_keeps_text_columns() -> None:
    out = build.numeric([{"date": "2026-10-04", "source": "AAA", "nat_regular": "4.37", "nat_diesel": ""}])
    assert out == [{"date": "2026-10-04", "source": "AAA", "nat_regular": 4.37, "nat_diesel": None}]


def test_latest_forecasts_picks_newest_made_on() -> None:
    rows = [forecast("x", 30, "2026-10-01"), forecast("x", 40, "2026-10-04"), forecast("x", 35, "2026-10-02")]
    assert build.latest_forecasts(rows)["x"]["p"] == "40"


def test_load_events_parses_chart_tags() -> None:
    events = build.load_events()
    assert events, "log/events.md should contain events"
    tagged = [e for e in events if e["chart"]]
    assert tagged
    for e in events:
        assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", e["date"])
        assert "[chart:" not in e["text"]


# ---------- consistency checks ----------


def test_md_inline_escapes_html_and_renders_bold() -> None:
    assert build.md_inline("**a** <b>&") == "<b>a</b> &lt;b&gt;&amp;"


def test_latest_supply_note_renders_last_section(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    (tmp_path / "log").mkdir()
    (tmp_path / "log" / "physical-supply.md").write_text(
        "# Log\n\n## Old\n\n- old\n\n## New status\n\n**Bottom:** x\n\n- one\n- <two>\n\ntail\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(build, "ROOT", tmp_path)
    note = build.latest_supply_note()
    assert note == {
        "title": "New status",
        "lead": "<p><b>Bottom:</b> x</p>",
        "more": "<ul><li>one</li><li>&lt;two&gt;</li></ul><p>tail</p>",
    }


def test_good_data_passes() -> None:
    fc = [forecast("war_nov3", 55), forecast("deal_ye2026", 16), forecast("nuke_deal_2026", 6)]
    assert build.check(GOOD_ODDS, fc, TERMS, brief()) == []


def test_sums_flags_scenarios_not_summing_to_100() -> None:
    bad = [*GOOD_ODDS, odds_row("2026-10-04", "nov3", "deal", 5)]
    errs = build.check_sums(bad)
    assert len(errs) == 1
    assert "nov3 sums to 105" in errs[0]


def test_sums_tolerates_rounding() -> None:
    rows = [odds_row("2026-10-05", "nov3", "a", 33.3), odds_row("2026-10-05", "nov3", "b", 66.2)]
    assert build.check_sums(rows) == []


def test_blink10_must_sum_to_100() -> None:
    errs = build.check_blink10({}, brief(blink10={"blink": 40, "no_blink": 40, "unresolved": 30, "rubio_met": 0}))
    assert any("do not sum to 100" in e for e in errs)


def test_blink10_forecasts_must_match_brief() -> None:
    fc = {"blink10_blink": forecast("blink10_blink", 50)}
    errs = build.check_blink10(fc, brief())
    assert any("blink10_blink" in e for e in errs)


def test_ye_deal_must_match_forecast_and_brief() -> None:
    fc = build.latest_forecasts([forecast("deal_ye2026", 20)])
    errs = build.check_deal(GOOD_ODDS, fc, TERMS, brief(deal_p={"ye2026": 12, "ye2027": 34}))
    assert any("forecasts.csv 20" in e for e in errs)
    assert any("brief.json 12" in e for e in errs)


def test_nuclear_deal_capped_by_deal_times_iaea_term() -> None:
    # 16% deal x 40% IAEA = 6.4% cap
    ok = build.latest_forecasts([forecast("nuke_deal_2026", 6)])
    bad = build.latest_forecasts([forecast("nuke_deal_2026", 8)])
    assert build.check_deal(GOOD_ODDS, ok, TERMS, brief()) == []
    assert any("P(nuclear deal)" in e for e in build.check_deal(GOOD_ODDS, bad, TERMS, brief()))


def test_war_forecast_must_equal_sum_of_war_rows() -> None:
    assert build.check_war(GOOD_ODDS, build.latest_forecasts([forecast("war_nov3", 55)])) == []
    errs = build.check_war(GOOD_ODDS, build.latest_forecasts([forecast("war_nov3", 50)]))
    assert errs
    assert "sum of war rows 55" in errs[0]


def test_checks_use_latest_date_only() -> None:
    older = [odds_row("2026-09-30", "nov3", "war_total", 53), odds_row("2026-09-30", "nov3", "limbo", 47)]
    assert build.check_war(older + GOOD_ODDS, build.latest_forecasts([forecast("war_nov3", 55)])) == []


# ---------- rendering ----------


def test_render_fills_every_placeholder() -> None:
    page = build.render(brief(), GOOD_ODDS, [forecast("war_nov3", 55)], TERMS)
    for marker in ("/*__STYLES__*/", "/*__APP__*/", "__GEOBRIEF_DATA__"):
        assert marker not in page
    assert page.lstrip().startswith("<title>")


def test_render_embeds_parseable_json_without_script_breakouts() -> None:
    b = brief(status="Watch </script><script>alert(1)</script>")
    page = build.render(b, GOOD_ODDS, [], TERMS)
    m = re.search(r'<script id="geobrief-data" type="application/json">(.*?)</script>', page, re.S)
    assert m, "data script tag missing or broken out of"
    data = json.loads(m.group(1))
    assert data["brief"]["status"] == b["status"]
    assert {"odds", "scenarios", "gas", "markets", "forecasts", "tripwires", "terms", "blinks", "events"} <= set(data)


def test_full_document_moves_head_content() -> None:
    doc = build.full_document("<title>T</title>\n<style>a{}</style>\n<!-- body -->\n<main>x</main>\n")
    head, body = doc.split("<body>")
    assert doc.startswith("<!DOCTYPE html>")
    assert "<title>T</title>" in head
    assert "<main>x</main>" in body
    assert "<title>" not in body


def test_full_document_requires_body_marker() -> None:
    with pytest.raises(SystemExit):
        build.full_document("<title>T</title><main></main>")


def test_main_writes_both_outputs(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(build, "DIST", tmp_path)
    monkeypatch.setattr("sys.argv", ["build.py"])
    build.main()
    artifact = (tmp_path / "artifact.html").read_text(encoding="utf-8")
    index = (tmp_path / "index.html").read_text(encoding="utf-8")
    assert "<!DOCTYPE" not in artifact
    assert index.startswith("<!DOCTYPE html>")
    assert "Iran War Tracker" in index


def test_main_check_only_writes_nothing(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(build, "DIST", tmp_path / "dist")
    monkeypatch.setattr("sys.argv", ["build.py", "--check"])
    build.main()
    assert not (tmp_path / "dist").exists()
