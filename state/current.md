# Current State — canonical odds, baselines, context

_Overwritten each update. Tabular data lives in `data/*.csv`; this file holds the reasoning. Last update: 2026-10-07 (escalated narrowed to new steps; review fixes: weighted price bands, tripwires rebased)._

## Canonical Odds (Oct 7)

**Scenario set (Adam, Oct 6; renamed Oct 7):** the same four for both horizons, each outcome in exactly one.

- **Limited war / Limbo:** no settlement; strait shut or Iran-controlled (incl. half-open), tanker/proxy hits, short infrastructure outages, US–Iran rounds (including another strike campaign on military targets like Jul 7–18), or limbo.
- **Escalated war (Adam, Oct 7):** a step the war hasn't taken yet, counted from Oct 7: US or allied ground forces operating inside Iran or seizing Iranian territory (Kharg, Larak, Qeshm, the Tunbs, Abu Musa); US or Israeli strikes aimed at Iranian civilian infrastructure (power plants, bridges, desalination, refineries, the Kharg terminal); or a confirmed hit that knocks a major Gulf export hub, power or desalination plant offline 7+ days (Abqaiq, Ras Tanura, Ras Laffan, Fujairah, the Yanbu terminal). Another strike campaign on military, nuclear or naval targets like Jul 7–18, or another East-West pipeline outage, doesn't count: both have happened.
- **MOU-style deal:** interim truce / enhanced MOU like the MOU week, or unsigned Iranian concessions; no signed comprehensive deal.
- **Comprehensive deal:** a _signed_ deal in which Iran concedes at least one of Rubio's three terms. Must stay below MOU-style.
- **Resolution (what is in force on the horizon date):** a signed deal wins (comprehensive if it concedes a Rubio term, else MOU-style); otherwise an interim truce or enhanced MOU in force that day is MOU-style, even after earlier strikes; otherwise escalated if any escalated step occurred from Oct 7; otherwise limited war / limbo. Scored as `scen_<horizon>_<scenario>` in `data/forecasts.csv`.
- **War by Nov 3 (`war_nov3`, 60%)** is a separate question: a US strike on Iran, or an official IRGC/Artesh claim of a specific attack that is independently confirmed (UKMTO, CENTCOM, vessel ID, imagery). Unnamed media tallies (Fars "13 violators") and denied, unconfirmed claims (Oct 6 helicopter) don't count. It sits between escalated (7) and limited + escalated (88).

Oct 7 (Adam, later): **escalated narrowed to steps the war hasn't taken yet** (ground forces in Iran, strikes on Iranian civilian infrastructure, or a major Gulf export hub, power or desalination plant out 7+ days). A July-scale campaign on military targets now counts as limited war. Nov 3 escalated 14 → 7: the sustained-campaign 7 moves to limited war / limbo (81); the 7 left is a hub/plant outage ~4, civilian-infrastructure strikes ~2, ground forces ~2, less overlap. Year-end escalated 20 → 12 (limited 64): post-election escalation gets cheaper and the TR ARG (2,000 Marines) arrives in Nov, but a July-style campaign no longer counts. Brent series now matches Trading Economics.

Oct 7 (review fixes, no new events): **escalated re-scored on the 7-day rule** — its old infra component (14) counted any hit, and Khurais was back within a day; P(export infrastructure offline 7+ days by Nov 3) ~7 + sustained campaign ~7 = 14 (was 21); the 7 moves to limited war / limbo (74). **Year-end comprehensive 6 → 8:** P(deal) 15 × P(at least one Rubio term | deal) ~50%, no longer pinned to the IAEA-only nuclear-deal forecast (6); MOU-style 18 → 16. Price lines re-derived from weighted sub-bands (below). Brent lines now resolve on the January contract, JKM on December.

Oct 6: no change. Houthi claims on Riyadh airport/Rabigh (Saudi confirms airport damage); East-West moving oil to Yanbu; tanker On Peace hit (unclaimed, 12 wounded); Qatar says talks continue; Brent <$100. No tripwire fired.

Oct 5: **UAE-third tripwire fired** (Uhud, Emirates Shipping) → infra +2, half-open −2. **Saudi-infra tripwire fired** (Khurais PS-2; flow restored, contested) → infra +3. Pezeshkian: talks "meaningless"; Ghalibaf: strait shut until 7 conditions met → deal −1, limbo −1, half-open −1. War by Nov 3 55 → 60.

### Through Midterms (Nov 3)

| Scenario            | P   | Gas (AAA reg.) | Brent (Jan.) | Key Driver                                                                                                     |
| ------------------- | --- | -------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| Limited war / Limbo | 81% | $4.00-4.75     | $83-115      | No settlement; Iran holds strait-first; claimed hits, US strike rounds, limbo                                  |
| Escalated war       | 7%  | $4.75-5.10     | $115-127     | New step: Gulf hub/plant out 7+ days (~4), strikes on Iranian civilian infrastructure (~2), ground forces (~2) |
| MOU-style deal      | 11% | $3.85-4.10     | $73-87       | Iran folds on sequencing or interim text; nothing signed in full                                               |
| Comprehensive deal  | 1%  | $3.85-4.05     | $73-85       | Signed deal conceding a Rubio term before the election                                                         |

**Weighted bands (`scenarios.csv`):** a merged scenario keeps the price mix of the paths inside it as sub-ranges weighted by their odds — limited = round 46 ($4.40-4.60) + strike campaign 7 ($4.55-4.75) + limbo 19 ($4.20-4.40) + half-open 9 ($4.00-4.25); escalated = new step 7 ($4.75-5.10); MOU = Iran folds 8 + signed non-comprehensive 3. Every Nov 3 price line = odds × bands, uniform within each sub-range; `build.py` fails if a line drifts more than 1 point. Brent bands sit ~$3 under December futures for backwardation into the January contract (Nov/Dec was ~$5 at the Sept 30 expiry, halved for expiry-day distortion).

**Gas baseline (AAA, Oct 6):** national regular $4.37 (wk $4.48, mo $4.15); diesel $6.32 (record $6.53 9/22). NY state $4.47 / $6.52; NYC metro $4.55 / $6.73 (≈ +19¢ / +41¢ over national). **2026 reference (AAA):** pre-war $2.98 (Feb 26); high $4.56 (May 21); July low $3.79; Sept peak $4.48 (Sept 24).
**Gas mechanics:** rockets 2-4¢/day, feathers 1-1.5¢/day (~2.4¢ per $1/bbl); no-shock path → ~$4.10-4.25.
**Nov 3 lines (AAA national regular):** ≥$4.50 ~37% · ≥$4.75 ~7% · ≥$5.00 ~2% · <$4.00 ~7%. NYC metro ≥$4.75 ~23%, ≥$5 ~6%. Diesel ≥$6.50 ~37% · ≥$6.75 ~10% · ≥$7.00 ~6% · <$6.00 ~18%. Brent (Jan.) ≥$100 ~64% · ≥$110 ~11% · ≥$120 ~4% · <$90 ~18%. JKM (Dec.) ≥$25 ~73% · ≥$28 ~29% · ≥$31 ~5% · <$20 ~5%.
**Market cross-check:** ICE Brent ~$100.6 (Oct 6) prices less war than 60%; Dated Brent >$120 (Oct 2 floor) says physical is tighter than futures. Futures have faded every lull; supply recovery + G7 release cap upside.

### Through Year-End 2026

| Scenario            | P   |
| ------------------- | --- |
| Limited war / Limbo | 64% |
| Escalated war       | 12% |
| MOU-style deal      | 16% |
| Comprehensive deal  | 8%  |

P(signed deal by YE) 15% sits between comprehensive (8) and MOU + comprehensive (24): 8 comprehensive + 7 signed without a Rubio term (counted in MOU-style with Iran folds 9).

### Live Tripwires

Registry and targets: `data/tripwires.csv` (`targets` = the numbers each would move to; `build.py` fails if a target is within 2 of the current value).

- IRGC officially claims a confirmed hit, lays mines, or strikes infrastructure → war by Nov 3 resolves yes; escalated ~10%.
- Iran formally accepts US sequencing / round 2 scheduled with text → YE deal ~23%, war by Nov 3 ~51%, MOU-style ~16%.
- East-West line or Yanbu offline 3+ days (loadings-confirmed) → escalated ~10% (a pipeline outage alone doesn't count; a Yanbu terminal hit out 7+ days does); gas ≥$4.75 ~17%.
- Strike in the Fujairah/Sohar STS zone → escalated ~11%, war by Nov 3 ~66%.
- Saudi shuttle or STS-loop ship hit → war by Nov 3 ~72%, escalated ~10%.
- Kpler monthly Hormuz crude >12 Mbd in Oct → gas ≥$4.50 ~32%, MOU-style ~14%.
- B-1Bs reappear at Diego Garcia/Gulf, or B-2/B-52s forward-deploy; or GHWB returns to the AOR while TR arrives → Blink #10 no-blink ~48%, escalated ~10%.
- US blockade easing → MOU-style ~19%; before signing = blink #10.
- Trump–Pezeshkian meeting → MOU-style ~14%, YE deal ~18%.
- CENTCOM-confirmed US deaths from an Iranian attack, or US strike on Pickaxe → war by Nov 3 ~90%, escalated ~13%.

### Structural

- Hormuz back to ~20 mb/d (all liquids, monthly) by end-2026: ~4% (needs a deal plus fast mine clearance and insurance; the end-2027 card is void)
- War-ending deal: 15% by end-2026; 33% by end-2027
- Comprehensive nuclear deal in 2026: ~6% (15% × 40%); any comprehensive (≥1 Rubio term) ~8%

## Houthis / Bab el-Mandeb

Hold Yemen's Red Sea coast; open war with Riyadh (Riyadh/Yanbu/Taif/Khamis Mushait targeted; UN displaced 230k). Iranian advisers present. US has a Saudi-only-targeting pledge. **By Nov 3:** Houthi hit (not intercepted) on Yanbu/East-West — happened (Khurais, Oct 4; forecast voided because it was made the same day); Yemeni gov't claims Bab el-Mandeb/Mokha retaken Oct 5 (disputed); non-Saudi shipping hit ~20%; US joins vs Houthis ~10%.

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
