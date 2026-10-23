# Current State — canonical odds, baselines, context

_Overwritten each update. Tabular data lives in `data/*.csv`; this file holds the reasoning. Last update: 2026-10-23 (am run, no change); 2026-10-22 (pm run, no change; am run, no change); 2026-10-21 (pm run, no change; am run, no change); 2026-10-20 (pm run, no change; am run, no change); 2026-10-19 (pm run, no change; am run, no change); 2026-10-18 (pm run, no change; am run, no change); 2026-10-17 (pm run, no change; am run, no change); 2026-10-16 (pm run, no change; am run, no change); 2026-10-15 (pm run, no change; am run, no change); 2026-10-14 (pm run, tw_irgc_claim fired: Nov 3 escalated 7 → 10, MOU-style 10 → 8; am run, no change); 2026-10-13 (pm run, no change; am run, no change); 2026-10-12 (pm run, no change; am run, no change); 2026-10-11 (pm run, no change; STS tripwire narrowed to Saudi relay ships; am run, no change); 2026-10-10 (pm run, no change; am run, no change); 2026-10-09 (pm run, no change; am run, no change); 2026-10-08 (pm run, no change; am run, no change; 2026-10-07: escalated narrowed to new steps; review fixes: weighted price bands, tripwires rebased; review follow-up: Vance condition, Blink #10, tripwires merged and filled in)._

## Canonical Odds (Oct 14)

**Scenario set (Adam, Oct 6; renamed Oct 7):** the same four for both horizons, each outcome in exactly one.

- **Limited war / Limbo:** no settlement; strait shut or Iran-controlled (incl. half-open), tanker/proxy hits, short infrastructure outages, US–Iran rounds (including another strike campaign on military targets like Jul 7–18), or limbo.
- **Escalated war (Adam, Oct 7):** a step the war hasn't taken yet, counted from Oct 7: US or allied ground forces operating inside Iran or seizing Iranian territory (Kharg, Larak, Qeshm, the Tunbs, Abu Musa); US or Israeli strikes aimed at Iranian civilian infrastructure (power plants, bridges, desalination, refineries, the Kharg terminal); or a confirmed hit that knocks a major Gulf export hub, power or desalination plant offline 7+ days (Abqaiq, Ras Tanura, Ras Laffan, Fujairah, the Yanbu terminal). Another strike campaign on military, nuclear or naval targets like Jul 7–18, or another East-West pipeline outage, doesn't count: both have happened.
- **MOU-style deal:** interim truce / enhanced MOU like the MOU week, or unsigned Iranian concessions; no signed comprehensive deal.
- **Comprehensive deal:** a _signed_ deal in which Iran concedes at least one of Rubio's three terms. Must stay below MOU-style.
- **Resolution (what is in force on the horizon date):** a signed deal wins (comprehensive if it concedes a Rubio term, else MOU-style); otherwise an interim truce or enhanced MOU in force that day is MOU-style, even after earlier strikes; otherwise escalated if any escalated step occurred from Oct 7; otherwise limited war / limbo. Scored as `scen_<horizon>_<scenario>` in `data/forecasts.csv`.
- **Strikes and claims are tripwires, not scenarios.** A US strike on Iran before Nov 3 (`tw_us_strike`) would break Trump's pre-midterm pledge and moves the odds when it fires; a strike campaign on military targets alone stays limited war, while strikes on energy or civilian infrastructure are escalated. An official IRGC/Artesh claim of a specific attack that is independently confirmed (UKMTO, CENTCOM, vessel ID, imagery) fires `tw_irgc_claim`. Unnamed media tallies (Fars "13 violators"), unclaimed hits and denied, unconfirmed claims (Oct 6 helicopter) move nothing on their own.

Oct 16 (am run): no change. Cape Dao (Antigua-flagged bulker, UAE-managed, hit Sept 23, already counted) has sunk near Hormuz: third sinking of the war per IMO (Reuters). Artesh/Navy claims another unnamed tanker on fire in a restricted zone east of the strait (unconfirmed, so no `tw_irgc_claim`). Trump (Newsmax, Oct 15): "we may have to go" to Pickaxe Mountain, "knock it out fast"; no nukes, no ground troops; Iran "asked us to please stop... we're negotiating" (announced threat, weak). Euronews: two carriers on station (GW, GHWB), IntelSky tanker sorties ~50% above Sept (unverified); TR not yet in the Arabian Sea, so `tw_bombers` stays armed. Pezeshkian: bombs won't force surrender. Houthi Aden palace toll 5. No new Kpler/IEA/East-West reading. CME Oct 15 settles: Brent Jan. $103.17, JKM Dec. $29.340. AAA $4.33 / diesel $6.33.

Oct 15 (pm run): no change. CENTCOM says the IRGC hit GFS Pride with a projectile and it sank under tow (rejects Iran's mine claim and its claim to control the strait; 40+ transits in 24h). **GHWB back in the Arabian Sea** (CENTCOM, Oct 15), so two carriers on station (GW, GHWB); TR still transiting the western Pacific (USNI, Oct 13), so `tw_bombers` (three on station) stays armed, but it now fires if GHWB stays when TR arrives (~Nov). CNN: strike plans include MOAB on Iranian energy and nuclear sites (leaked intent, weak; post-election timing already priced). Artesh claims an unnamed AIS-dark tanker set on fire in a prohibited Gulf of Oman zone (unconfirmed). Houthi missile hits Aden presidential palace; coalition counts 20 Houthi attacks on Riyadh airport in October. Reuters: US weighing easing sanctions on shadow-fleet tankers to cut freight costs (not blockade easing). Brent Dec. settle $105.92; JKM Nov. $26.532.

Oct 15 (am run): no change. Vanguard counts 23 attacks around Hormuz in October (10+ since Oct 11); GFS Pride sank, tanker Alfonso's fate unknown, two seafarers missing. None is tied to a Saudi relay ship or a new named, confirmed Iranian claim, so `tw_sts_strike` stays armed and the fired `tw_irgc_claim` is already priced. An Iranian officer says the strait is closed and transits must be coordinated with Iran; Ghalibaf says prepare for war while negotiating. Houthi missile intercepted over Riyadh; Trump still weighing joining Yemen strikes and says "leakers should be shot" over pre-midterm strike reports (weak, matches the pledge already priced). CME Oct 14 settles: Brent Jan. $103.40, JKM Dec. $29.345. AAA $4.33 / diesel $6.32.

Oct 14 (pm run): **`tw_irgc_claim` fired** → Nov 3 escalated 7 → 10, MOU-style 10 → 8 (limited 81). The IRGC Navy officially claimed that a container ship with 2,500+ containers on an "unauthorized" route sank south of Hormuz after hitting a mine; Singapore's MPA confirmed the Singapore-flagged GFS Pride sank after a projectile strike and fire (21 crew evacuated), and a US official said Iran hit it, likely with a missile. The weapon is disputed, but Iran has put its name to a confirmed sinking, the first since Cape Dao (which Vanguard says is also now sinking). Sister ship GFS Giselle was hit too; UKMTO counts 20 attacks in the strait since Oct 1. Kpler: Hormuz exports 8.5 Mbd in the week to Oct 12 (about 40% below prewar), Middle East 14. IEA October OMR: Hormuz total oil 10.9 Mbd in September, bypass exports 5.6. CENTCOM dismissed the IRGC Navy commander's claim to control the strait. Year-end odds hold: post-election escalation was already priced. Price lines re-derived from the new odds.

Oct 12 (pm run): no change. IRGC claims three supertankers struck over two days (two outbound, one at Sohar anchorage in the STS zone), with no ship names; UKMTO logged no Monday attacks beyond Sunday's two projectile hits, so `tw_irgc_claim` stays armed. Rezaei names the US/UAE shuttle along Oman's coast as an explicit target and claims five or six hits a night (an Iranian threat, strong); no hit is tied to a Saudi relay ship, so `tw_sts_strike` stays armed but is the main watch. UK says the RAF Fairford plot was almost certainly IRGC-directed; NATO and 27 countries condemn Iran's hybrid attacks. Houthi missile hits Riyadh airport again (13 dead in the earlier strike). Brent ~$106.

Oct 12 (am run): no change. Rezaei says Iran is "no longer responding" to Washington after calling the US reply "insufficient," and threatens regional cables, data centers and AI facilities if fighting resumes (an Iranian threat, but conditional on a US restart). IRGC Navy: ships in the strait with AIS off will be treated as hostile. UKMTO logged a second unattributed projectile hit on an outbound tanker (Oct 11); UAE coastguard rescued 22 crew from a tanker fire, cause unknown. No named, confirmed Iranian claim, so `tw_irgc_claim` stays armed. Houthis closed Riyadh airport again and hit Dammam. Brent ~$103 in early Asia trade. AAA $4.36 / diesel $6.27.

Oct 11 (pm run): no change. UKMTO confirmed a drone strike on the Nicaragua-flagged tanker MT Petro Dolphin at Sohar Anchorage, Oman (India: 9 crew rescued, 2 missing; unclaimed), and a second drone hit the tanker Valthera in the strait. `tw_sts_strike` fires only when a Saudi STS-relay ship is hit in the Fujairah/Sohar zone. Petro Dolphin is not identified as a Saudi relay ship (owner and cargo unknown), so it stays armed; the hit shows attacks reach the transfer zone and is the main thing to watch. Iran's security chief Rezaei called the US reply on the seven conditions "insufficient" (some accepted, ambiguities left); Houthis hit Dammam's King Fahd airport.

Oct 11 (am run): no change. Saudi GACA: Saturday's Houthi strike on Riyadh airport killed 12 and injured 309, the worst on the Saudi front; adds weight to Trump's "may join" Houthi line (still weak). CENTCOM disabled the Panama-flagged Ocean Molica (ex-Iranian port) running the blockade in the Gulf of Oman, the fourth since July; blockade enforcement on a third-country ship, not a strike on Iran, so `tw_us_strike` does not fire. IRGC supertanker mine claim still unnamed and unconfirmed, `tw_irgc_claim` armed. Iran still reviewing the US reply. AAA $4.36 / diesel $6.28.

Oct 10 (pm run): no change. Houthi missile hits the Riyadh airport terminal again (dozens wounded, flights halted); Trump says the US "may" join Saudi strikes on the Houthis and will "take a look" at his pre-midterm no-strike pledge (weak, but the first hedge on it). IRGC Navy claims an unnamed supertanker hit a mine leaving Hormuz by an "unauthorized" route; no name, position or independent confirmation, so `tw_irgc_claim` stays armed. Yemeni government forces push toward Bab el-Mandeb; no closure, `tw_bab` armed. Kremlin: Putin relayed Iran's views on a deal to Trump.

Oct 10 (am run): no change. The NV Sunshine claim is still unconfirmed (no UKMTO or Vanguard match) and no new hit overnight, so `tw_irgc_claim` stays armed. Trump again calls talks "productive"; Iran still reviewing the US reply; Brent ~$104.4 (Fri). Al Arabiya military source: Houthis laid many mines at Bab el-Mandeb; single-source, no declared closure, so `tw_bab` stays armed. AAA $4.37 / diesel $6.28.

Oct 9 (pm run): no change, no tripwire fired. The IRGC Navy officially claimed a named ship, the Vietnam-flagged LPG carrier NV Sunshine on the southern route off Oman, and vowed region-wide pursuit of ships on "unauthorised" routes and sanctions on firms cooperating with the US. The claim is not yet independently confirmed (the UKMTO hit that day, 13 nm W of Al Jazira, UAE, was the VLCC Gem No.2 per Vanguard), so `tw_irgc_claim` has not fired; but Iran is putting its name to specific attacks again (first since Cape Dao, Sept 23), so a confirmed claim before Nov 3 is likelier. Trump: Russia to release 300k t of diesel. Saudi-led coalition launches a large operation against the Houthis. Brent $104.43.

Oct 9 (am run): no change. NYT: Trump ordered Pentagon options to resume the war, centred on a ~3-day intense campaign against missiles, drones, energy facilities and military sites; he again rules out strikes before the midterms and says he no longer wants a deal. Leaked intent and Trump lines are weak; post-election timing is already priced into Nov 3 escalated (7) and year-end escalated (12); a pre-election strike would fire `tw_us_strike`. Kpler: 10 crossings Oct 7, up from 7. Iran still reviewing the US reply. AAA $4.37 / diesel $6.28.

Oct 8 (pm run): no change. Trump pledges no US attack on Iran before the midterms (Truth Social), after The Atlantic reported a request for pre-election strike options; weak evidence that matches the election-calendar constraint already in the Nov 3 odds. Tanker hits spread beyond the strait: Acers (51 nm N of Qatar, UKMTO, casualties) and Dhalgout (fire ~40 km off Fujairah, not in UKMTO, cause unclear; would fire `tw_sts_strike` only if a strike in the STS zone is confirmed). Both unclaimed. Araghchi: reply to the US "within a few days." Houthis tell Saudi oil workers to evacuate. Treasury sanctions 17 shadow-fleet tankers. Brent $103.48.

Oct 8 (am run): no change. IRGC adviser Naqdi says Iran will soon close the "illegal routes" (the US-escorted southern lane along Oman's coast); an undated adviser threat, not an official attack claim, so no tripwire fires, but it is the main thing to watch. Kpler: seven commodity vessels crossed on Oct 6, the fewest since July 23. Houthis claim another missile at Riyadh airport. AAA $4.36 / diesel $6.28.

Oct 7 (pm run): no change. Unclaimed, unnamed tanker hit by multiple projectiles 51 nm north of Qatar (UKMTO verified, casualties), the deepest Gulf strike this month; Houthi strikes on Abha and Riyadh airports kill 3; senior Iranian official calls enrichment a red line (not a flat refusal of Vance's condition); Iran's army claims US bases were targeted but names no attack. No tripwire fired.

Oct 7 (review follow-up): **Vance (Reuters, Oct 5–6) makes a "meaningful" cut in enrichment capacity a US condition** for any deal, a floor above Rubio's "no nuclear weapon" → year-end deal 15 → 13, by 2027 33 → 31; a signed deal more likely carries a Rubio term (IAEA/enrichment-cap term 40 → 50%), so year-end comprehensive holds at 8 and MOU-style 16 → 14 (limited 66). Nov 3 MOU-style 11 → 10 (limited 82): Iran soft-rejected the counter and calls talks "meaningless." **`tw_irgc_claim` tightened** to official claims of a specific attack that are independently confirmed: one such claim (Cape Dao, Sept 23) against ~8 unclaimed hits since, no US strike since Sept 10, and the WSJ says bombing resumes after the election. **Blink #10 re-derived** from the year-end odds (blink 70, no blink 30, unresolved 0). Tripwires merged, made disjoint and filled in (below).

Oct 7 (Adam, later still): **odds history before Oct 7 removed.** It was scored on earlier scenario definitions, so the chart now starts Oct 7 (marked in `data/rescores.csv`); pre-Oct 7 `scen_*` forecasts are void, and the Oct 4 seed forecasts (made before the repo's first commit) are void and re-recorded Oct 7 at the same p. Tripwire targets are now moves, not levels.

Oct 7 (Adam, afternoon): **status-quo price sub-bands recentred on the forwards.** The limited war / limbo sub-bands had the war premium priced into the status quo (gas median $4.45 vs $4.37 today and falling; Brent median $102 vs January $97.59). Recentred on RBOB-implied gas ~$4.25–4.35, diesel $6.32 and falling, ICE January Brent $97.59 and ICE December JKM $25.84 (Oct 6 settlements). Medians now gas $4.31, diesel $6.23, Brent $97.5, JKM $25.8. The Brent and LNG charts now also plot the resolving contract itself (dashed), so the line and the bands compare like for like.

Oct 7 (Adam, later): **escalated narrowed to steps the war hasn't taken yet** (ground forces in Iran, strikes on Iranian civilian infrastructure, or a major Gulf export hub, power or desalination plant out 7+ days). A July-scale campaign on military targets now counts as limited war. Nov 3 escalated 14 → 7: the sustained-campaign 7 moves to limited war / limbo (81); the 7 left is a hub/plant outage ~4, civilian-infrastructure strikes ~2, ground forces ~2, less overlap. Year-end escalated 20 → 12 (limited 64): post-election escalation gets cheaper and the TR ARG (2,000 Marines) arrives in Nov, but a July-style campaign no longer counts. Brent series now matches Trading Economics.

Oct 7 (review fixes, no new events): **escalated re-scored on the 7-day rule** — its old infra component (14) counted any hit, and Khurais was back within a day; P(export infrastructure offline 7+ days by Nov 3) ~7 + sustained campaign ~7 = 14 (was 21); the 7 moves to limited war / limbo (74). **Year-end comprehensive 6 → 8:** P(deal) 15 × P(at least one Rubio term | deal) ~50%, no longer pinned to the IAEA-only nuclear-deal forecast (6); MOU-style 18 → 16. Price lines re-derived from weighted sub-bands (below). Brent lines now resolve on the January contract, JKM on December.

Oct 6: no change. Houthi claims on Riyadh airport/Rabigh (Saudi confirms airport damage); East-West moving oil to Yanbu; tanker On Peace hit (unclaimed, 12 wounded); Qatar says talks continue; Brent <$100. No tripwire fired.

Oct 5: **UAE-third tripwire fired** (Uhud, Emirates Shipping) → infra +2, half-open −2. **Saudi-infra tripwire fired** (Khurais PS-2; flow restored, contested) → infra +3. Pezeshkian: talks "meaningless"; Ghalibaf: strait shut until 7 conditions met → deal −1, limbo −1, half-open −1.

### Through Midterms (Nov 3)

| Scenario            | P   | Gas (AAA reg.) | Brent (Jan.) | Key Driver                                                                                                     |
| ------------------- | --- | -------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| Limited war / Limbo | 81% | $3.95-4.70     | $82-113      | No settlement; Iran holds strait-first; claimed hits, US strike rounds, limbo                                  |
| Escalated war       | 10% | $4.75-5.10     | $115-127     | New step: Gulf hub/plant out 7+ days (~6), strikes on Iranian civilian infrastructure (~2), ground forces (~2) |
| MOU-style deal      | 8%  | $3.85-4.10     | $73-87       | Iran folds on sequencing or interim text; nothing signed in full                                               |
| Comprehensive deal  | 1%  | $3.85-4.05     | $73-85       | Signed deal conceding a Rubio term before the election                                                         |

**Weighted bands (`scenarios.csv`):** a merged scenario keeps the price mix of the paths inside it as sub-ranges weighted by their odds — limited = round 46 ($4.25-4.50) + strike campaign 7 ($4.45-4.70) + limbo 19 ($4.10-4.30) + half-open 9 ($3.95-4.15), centred on the forwards; escalated = new step 7 ($4.75-5.10); MOU = Iran folds 8 + signed non-comprehensive 3. Every Nov 3 price line = odds × bands, uniform within each sub-range; `build.py` fails if a line drifts more than 1 point. Brent bands are for the January contract (ICE settle $97.59 on Oct 6, ~$3 under December); JKM bands for December ($25.84).

**Gas baseline (AAA, Oct 8):** national regular $4.36 (wk $4.41, mo $4.15); diesel $6.28 (record $6.53 9/22). NY state $4.47 / $6.51; NYC metro $4.56 / $6.73 (≈ +20¢ / +45¢ over national; the NYC lines use the latest gap from `gas.csv`). **2026 reference (AAA):** pre-war $2.98 (Feb 26); high $4.56 (May 21); July low $3.79; Sept peak $4.48 (Sept 24).
**Gas mechanics:** rockets 2-4¢/day, feathers 1-1.5¢/day (~2.4¢ per $1/bbl); no-shock path → ~$4.10-4.25.
**Nov 3 lines (AAA national regular):** ≥$4.50 ~16% · ≥$4.75 ~10% · ≥$5.00 ~2% · <$4.00 ~8%. NYC metro ≥$4.75 ~14%, ≥$5 ~8%. Diesel ≥$6.50 ~15% · ≥$6.75 ~10% · ≥$7.00 ~8% · <$6.00 ~17%. Brent (Jan.) ≥$100 ~40% · ≥$110 ~12% · ≥$120 ~6% · <$90 ~19%. JKM (Dec.) ≥$25 ~69% · ≥$28 ~15% · ≥$31 ~8% · <$20 ~5%.
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

- Iran formally accepts US sequencing, or round two is scheduled with text → YE deal +8, MOU-style by Nov 3 +6.
- US strikes Iran before Nov. 3 (confirmed by CENTCOM, the Pentagon or the White House), breaking Trump's no-strikes-before-the-midterms pledge → escalated by Nov 3 +8, MOU-style by Nov 3 −6, YE escalated +8, YE deal −4, gas ≥$4.50 +12.
- Saudi shuttle ship hit outside the Fujairah/Sohar STS zone → escalated by Nov 3 +3.
- B-1Bs reappear at Diego Garcia/Gulf, B-2/B-52s forward-deploy, or three carriers on station (GHWB back in the AOR after its Phuket port visit while TR arrives) → Blink #10 no-blink +10, escalated by Nov 3 +3.
- US blockade easing → MOU-style by Nov 3 +9.
- Trump–Pezeshkian meeting → MOU-style by Nov 3 +4, YE deal +3.
- CENTCOM-confirmed US deaths from an Iranian attack → escalated by Nov 3 +6, MOU-style by Nov 3 −4.
- East-West line or Yanbu loadings offline 3+ days, by any attacker incl. a repeat of the Sept Iraqi-militia shutdown (confirmed by Kpler, Vortexa or TankerTrackers) → escalated by Nov 3 +3, gas ≥$4.75 +10.
- A Saudi STS-relay ship is hit in the Fujairah/Sohar STS zone → escalated by Nov 3 +4.
- Iran ends strait tolls and permits, or declares Hormuz open to all shipping (Rubio #2) → MOU-style by Nov 3 +10, YE deal +7, YE comprehensive +4.
- Iran offers a concrete cut in enrichment capacity (Vance's condition), in text or on the record → YE deal +6, YE comprehensive +4.
- Direct Iran–Israel exchange: Iranian missiles or drones fired at Israel, or an Israeli strike inside Iran → escalated by Nov 3 +4, MOU-style by Nov 3 −3.
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

- **Force posture:** GW in Arabian Sea; GHWB back in the Arabian Sea Oct 15 after R&R in Phuket Oct 4-9 (CENTCOM). TR CSG + Makin Island ARG en route, arrive ~Nov — GHWB's return makes it a real third carrier if GHWB is still on station when TR arrives (fires `tw_bombers`). Iraq withdrawal complete Sep 30. **Real surge** (3 carriers simultaneously on station / Diego Garcia bombers / extra air defense): ~10% before Nov 3, ~45% by YE. Tanker/P-8 traffic alone ≠ surge.
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
