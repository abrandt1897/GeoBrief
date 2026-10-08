# Current State — canonical odds, baselines, context

_Overwritten each update. Tabular data lives in `data/*.csv`; this file holds the reasoning. Last update: 2026-10-08 (am run, no change; 2026-10-07: escalated narrowed to new steps; review fixes: weighted price bands, tripwires rebased; review follow-up: Vance condition, war_nov3, Blink #10, tripwires merged and filled in)._

## Canonical Odds (Oct 7)

**Scenario set (Adam, Oct 6; renamed Oct 7):** the same four for both horizons, each outcome in exactly one.

- **Limited war / Limbo:** no settlement; strait shut or Iran-controlled (incl. half-open), tanker/proxy hits, short infrastructure outages, US–Iran rounds (including another strike campaign on military targets like Jul 7–18), or limbo.
- **Escalated war (Adam, Oct 7):** a step the war hasn't taken yet, counted from Oct 7: US or allied ground forces operating inside Iran or seizing Iranian territory (Kharg, Larak, Qeshm, the Tunbs, Abu Musa); US or Israeli strikes aimed at Iranian civilian infrastructure (power plants, bridges, desalination, refineries, the Kharg terminal); or a confirmed hit that knocks a major Gulf export hub, power or desalination plant offline 7+ days (Abqaiq, Ras Tanura, Ras Laffan, Fujairah, the Yanbu terminal). Another strike campaign on military, nuclear or naval targets like Jul 7–18, or another East-West pipeline outage, doesn't count: both have happened.
- **MOU-style deal:** interim truce / enhanced MOU like the MOU week, or unsigned Iranian concessions; no signed comprehensive deal.
- **Comprehensive deal:** a _signed_ deal in which Iran concedes at least one of Rubio's three terms. Must stay below MOU-style.
- **Resolution (what is in force on the horizon date):** a signed deal wins (comprehensive if it concedes a Rubio term, else MOU-style); otherwise an interim truce or enhanced MOU in force that day is MOU-style, even after earlier strikes; otherwise escalated if any escalated step occurred from Oct 7; otherwise limited war / limbo. Scored as `scen_<horizon>_<scenario>` in `data/forecasts.csv`.
- **War by Nov 3 (`war_nov3`, 45%)** is a separate question: a US strike on Iran, or an official IRGC/Artesh claim of a specific attack that is independently confirmed (UKMTO, CENTCOM, vessel ID, imagery). Unnamed media tallies (Fars "13 violators") and denied, unconfirmed claims (Oct 6 helicopter) don't count. It has no fixed relation to the scenarios: escalated can come from a Houthi or militia outage with no US strike or claim, and MOU-style can follow strikes.

Oct 8 (am run): no change. IRGC adviser Naqdi says Iran will soon close the "illegal routes" (the US-escorted southern lane along Oman's coast); an undated adviser threat, not an official attack claim, so no tripwire fires, but it is the main thing to watch. Kpler: seven commodity vessels crossed on Oct 6, the fewest since July 23. Houthis claim another missile at Riyadh airport. AAA $4.36 / diesel $6.28.

Oct 7 (pm run): no change. Unclaimed, unnamed tanker hit by multiple projectiles 51 nm north of Qatar (UKMTO verified, casualties), the deepest Gulf strike this month; Houthi strikes on Abha and Riyadh airports kill 3; senior Iranian official calls enrichment a red line (not a flat refusal of Vance's condition); Iran's army claims US bases were targeted but names no attack. No tripwire fired.

Oct 7 (review follow-up): **Vance (Reuters, Oct 5–6) makes a "meaningful" cut in enrichment capacity a US condition** for any deal, a floor above Rubio's "no nuclear weapon" → year-end deal 15 → 13, by 2027 33 → 31; a signed deal more likely carries a Rubio term (IAEA/enrichment-cap term 40 → 50%), so year-end comprehensive holds at 8 and MOU-style 16 → 14 (limited 66). Nov 3 MOU-style 11 → 10 (limited 82): Iran soft-rejected the counter and calls talks "meaningless." **War by Nov 3 60 → 45** under the stricter claim rule: one official claim (Cape Dao, Sept 23) against ~8 unclaimed hits since, no US strike since Sept 10, and the WSJ says bombing resumes after the election. **Blink #10 re-derived** from the year-end odds (blink 70, no blink 30, unresolved 0). Tripwires merged, made disjoint and filled in (below).

Oct 7 (Adam, later still): **odds history before Oct 7 removed.** It was scored on earlier scenario definitions, so the chart now starts Oct 7 (marked in `data/rescores.csv`); pre-Oct 7 `scen_*` forecasts are void, and the Oct 4 seed forecasts (made before the repo's first commit) are void and re-recorded Oct 7 at the same p. Tripwire targets are now moves, not levels.

Oct 7 (Adam, afternoon): **status-quo price sub-bands recentred on the forwards.** The limited war / limbo sub-bands had the war premium priced into the status quo (gas median $4.45 vs $4.37 today and falling; Brent median $102 vs January $97.59). Recentred on RBOB-implied gas ~$4.25–4.35, diesel $6.32 and falling, ICE January Brent $97.59 and ICE December JKM $25.84 (Oct 6 settlements). Medians now gas $4.31, diesel $6.23, Brent $97.5, JKM $25.8. The Brent and LNG charts now also plot the resolving contract itself (dashed), so the line and the bands compare like for like.

Oct 7 (Adam, later): **escalated narrowed to steps the war hasn't taken yet** (ground forces in Iran, strikes on Iranian civilian infrastructure, or a major Gulf export hub, power or desalination plant out 7+ days). A July-scale campaign on military targets now counts as limited war. Nov 3 escalated 14 → 7: the sustained-campaign 7 moves to limited war / limbo (81); the 7 left is a hub/plant outage ~4, civilian-infrastructure strikes ~2, ground forces ~2, less overlap. Year-end escalated 20 → 12 (limited 64): post-election escalation gets cheaper and the TR ARG (2,000 Marines) arrives in Nov, but a July-style campaign no longer counts. Brent series now matches Trading Economics.

Oct 7 (review fixes, no new events): **escalated re-scored on the 7-day rule** — its old infra component (14) counted any hit, and Khurais was back within a day; P(export infrastructure offline 7+ days by Nov 3) ~7 + sustained campaign ~7 = 14 (was 21); the 7 moves to limited war / limbo (74). **Year-end comprehensive 6 → 8:** P(deal) 15 × P(at least one Rubio term | deal) ~50%, no longer pinned to the IAEA-only nuclear-deal forecast (6); MOU-style 18 → 16. Price lines re-derived from weighted sub-bands (below). Brent lines now resolve on the January contract, JKM on December.

Oct 6: no change. Houthi claims on Riyadh airport/Rabigh (Saudi confirms airport damage); East-West moving oil to Yanbu; tanker On Peace hit (unclaimed, 12 wounded); Qatar says talks continue; Brent <$100. No tripwire fired.

Oct 5: **UAE-third tripwire fired** (Uhud, Emirates Shipping) → infra +2, half-open −2. **Saudi-infra tripwire fired** (Khurais PS-2; flow restored, contested) → infra +3. Pezeshkian: talks "meaningless"; Ghalibaf: strait shut until 7 conditions met → deal −1, limbo −1, half-open −1. War by Nov 3 55 → 60.

### Through Midterms (Nov 3)

| Scenario            | P   | Gas (AAA reg.) | Brent (Jan.) | Key Driver                                                                                                     |
| ------------------- | --- | -------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| Limited war / Limbo | 82% | $3.95-4.70     | $82-113      | No settlement; Iran holds strait-first; claimed hits, US strike rounds, limbo                                  |
| Escalated war       | 7%  | $4.75-5.10     | $115-127     | New step: Gulf hub/plant out 7+ days (~4), strikes on Iranian civilian infrastructure (~2), ground forces (~2) |
| MOU-style deal      | 10% | $3.85-4.10     | $73-87       | Iran folds on sequencing or interim text; nothing signed in full                                               |
| Comprehensive deal  | 1%  | $3.85-4.05     | $73-85       | Signed deal conceding a Rubio term before the election                                                         |

**Weighted bands (`scenarios.csv`):** a merged scenario keeps the price mix of the paths inside it as sub-ranges weighted by their odds — limited = round 46 ($4.25-4.50) + strike campaign 7 ($4.45-4.70) + limbo 19 ($4.10-4.30) + half-open 9 ($3.95-4.15), centred on the forwards; escalated = new step 7 ($4.75-5.10); MOU = Iran folds 8 + signed non-comprehensive 3. Every Nov 3 price line = odds × bands, uniform within each sub-range; `build.py` fails if a line drifts more than 1 point. Brent bands are for the January contract (ICE settle $97.59 on Oct 6, ~$3 under December); JKM bands for December ($25.84).

**Gas baseline (AAA, Oct 8):** national regular $4.36 (wk $4.41, mo $4.15); diesel $6.28 (record $6.53 9/22). NY state $4.47 / $6.51; NYC metro $4.56 / $6.73 (≈ +20¢ / +45¢ over national; the NYC lines use the latest gap from `gas.csv`). **2026 reference (AAA):** pre-war $2.98 (Feb 26); high $4.56 (May 21); July low $3.79; Sept peak $4.48 (Sept 24).
**Gas mechanics:** rockets 2-4¢/day, feathers 1-1.5¢/day (~2.4¢ per $1/bbl); no-shock path → ~$4.10-4.25.
**Nov 3 lines (AAA national regular):** ≥$4.50 ~13% · ≥$4.75 ~7% · ≥$5.00 ~2% · <$4.00 ~9%. NYC metro ≥$4.75 ~11%, ≥$5 ~6%. Diesel ≥$6.50 ~12% · ≥$6.75 ~7% · ≥$7.00 ~6% · <$6.00 ~19%. Brent (Jan.) ≥$100 ~37% · ≥$110 ~9% · ≥$120 ~4% · <$90 ~21%. JKM (Dec.) ≥$25 ~67% · ≥$28 ~12% · ≥$31 ~5% · <$20 ~5%.
**Market cross-check:** the bands now centre on ICE January Brent ($97.59, Oct 6); Dated Brent >$120 (Oct 2 floor) says physical is tighter than futures. Futures have faded every lull; supply recovery + G7 release cap upside.

### Through Year-End 2026

| Scenario            | P   |
| ------------------- | --- |
| Limited war / Limbo | 66% |
| Escalated war       | 12% |
| MOU-style deal      | 14% |
| Comprehensive deal  | 8%  |

P(signed deal by YE) 13% sits between comprehensive (8) and MOU + comprehensive (22): 8 comprehensive + 5 signed without a Rubio term (counted in MOU-style with Iran folds 9).

### Live Tripwires

Registry and targets: `data/tripwires.csv`. Targets are moves from today's odds (`key+=n` / `key-=n`), or a level (`key=v`) for a resolution; the dashboard fills the levels in. The list below is printed by `python3 dashboard/build.py --tripwire-lines`; a test checks it matches.

- Iran formally accepts US sequencing, or round two is scheduled with text → YE deal +8, war by Nov 3 −9, MOU-style by Nov 3 +6.
- Iran's armed forces (IRGC or Artesh) officially claim a specific attack on shipping, US forces or regional targets that is independently confirmed (UKMTO, CENTCOM, vessel ID or imagery) → war by Nov 3 resolves yes, escalated by Nov 3 +3.
- Saudi shuttle ship hit outside the Fujairah/Sohar STS zone → war by Nov 3 +10, escalated by Nov 3 +3.
- B-1Bs reappear at Diego Garcia/Gulf, B-2/B-52s forward-deploy, or three carriers on station (GHWB back in the AOR after its Phuket port visit while TR arrives) → Blink #10 no-blink +10, escalated by Nov 3 +3.
- US blockade easing → MOU-style by Nov 3 +9.
- Trump–Pezeshkian meeting → MOU-style by Nov 3 +4, YE deal +3.
- CENTCOM-confirmed US deaths from an Iranian attack, or a US strike on Pickaxe → war by Nov 3 to 90, escalated by Nov 3 +6.
- East-West line or Yanbu loadings offline 3+ days, by any attacker incl. a repeat of the Sept Iraqi-militia shutdown (confirmed by Kpler, Vortexa or TankerTrackers) → escalated by Nov 3 +3, gas ≥$4.75 +10.
- Strike in the Fujairah/Sohar STS zone, including on a Saudi STS-loop ship → escalated by Nov 3 +4, war by Nov 3 +7.
- Iran ends strait tolls and permits, or declares Hormuz open to all shipping (Rubio #2) → MOU-style by Nov 3 +10, YE deal +7, YE comprehensive +4.
- Iran offers a concrete cut in enrichment capacity (Vance's condition), in text or on the record → YE deal +6, YE comprehensive +4.
- Direct Iran–Israel exchange: Iranian missiles or drones fired at Israel, or an Israeli strike inside Iran → escalated by Nov 3 +4, war by Nov 3 +15.
- Houthis declare Bab el-Mandeb closed, or hit a non-Saudi ship in the strait (confirmed by UKMTO) → Brent (Jan.) ≥$100 +18, gas ≥$4.50 +12.
- AAA national regular below $4.20 on any day before Nov. 3 → gas ≥$4.50 −8, gas <$4.00 +7.

Retired Oct 7: the Kpler monthly (lands after Nov 3) and the separate carriers tripwire (merged into bombers). Past tripwires sit in the dashboard's collapsed section.

### Structural

- Hormuz back to ~20 mb/d (all liquids, monthly) by end-2026: ~4% (needs a deal plus fast mine clearance and insurance; the end-2027 card is void)
- War-ending deal: 13% by end-2026; 31% by end-2027
- Comprehensive nuclear deal in 2026: ~6% (13% × 50%); any comprehensive (≥1 Rubio term) ~8%

## Houthis / Bab el-Mandeb

Hold Yemen's Red Sea coast; open war with Riyadh (Riyadh/Yanbu/Taif/Khamis Mushait targeted; UN displaced 230k). Iranian advisers present. US has a Saudi-only-targeting pledge. **By Nov 3:** Houthi hit (not intercepted) on Yanbu/East-West — happened (Khurais, Oct 4; forecast voided because it was made the same day); Yemeni gov't claims Bab el-Mandeb/Mokha retaken Oct 5 (disputed); non-Saudi shipping hit ~20% (tripwire `tw_bab`); US joins vs Houthis ~10%.

## US Capacity & Political Clock

- **Force posture:** GW in Arabian Sea; GHWB on R&R in Phuket Oct 4-9 after 6 months (likely rotating out). TR CSG + Makin Island ARG en route, arrive ~Nov — press calls it a 'third carrier,' but with GHWB leaving it may net to rotation; count it a surge only if GHWB returns to the AOR or bombers/air defense follow. Iraq withdrawal complete Sep 30. **Real surge** (3 carriers simultaneously on station / Diego Garcia bombers / extra air defense): ~10% before Nov 3, ~45% by YE. Tanker/P-8 traffic alone ≠ surge.
- **Losses:** 18 US servicemembers killed (Trump, Sep 30).
- **Cost:** $43.6B through Sep 3; ~$2-3B/month low intensity; money not binding. **Binding constraint = interceptors** (½–⅔ depleted, 5+ yrs to rebuild) → most plausible no-blink = short, sharp campaign then declared victory.
- **Congress:** CR to Dec 11; $87.6B supplemental → lame duck. WPR passed 3×; GOP defections 7.
- **Midterms:** generic ~D+9; House flip ~85-90%; Senate toss-up. Post-election both blink and escalation get cheaper.
- **Pre-election deal:** ~4% signed (`deal_prenov3`) — written counter exists, but Trump wants post-election and denies relief-for-nukes; pass-through only ~15-30¢ by Nov 3.

## MOU & Rubio's Terms

- **MOU:** toll-free passage via Iranian "best efforts"; unfreeze ($6B Qatar + ~$24B) never delivered (Iran's #1 grievance); HEU dilution. Never terminated; current docs = "enhanced MOU."
- **Rubio's 3:** (1) no nuclear weapon; (2) strait open without tolls; (3) HEU turned over. **0 of 3 met.** Enhanced-MOU "concrete nuclear steps" = possible movement on #1. Trump–Xi anti-fee line + Saudi cabinet no-fees demand strengthen #2.
- **Core deadlock = sequencing:** Iran = blockade lift/unfreeze first; US = strait/goodwill first. Reuters: components agreed — but sequencing _is_ the deadlock, so don't over-read.
- **Channels:** Qatar shuttle (primary), Pakistan; Witkoff/Kushner; GCC own-track; Salalah stalled.
- Paying Iranian fees is sanctionable incl. crypto. Macron-Oman demining coalition = only non-TACO path to breaking fees.
