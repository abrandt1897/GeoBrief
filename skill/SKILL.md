---
name: "geo-brief"
description: 'Geopolitical situation briefings and probabilistic scenario analysis. Use this skill when Adam asks about the Iran war, Strait of Hormuz, gas prices, US foreign policy, sanctions, or any geopolitical conflict status. Also use when he wants probability estimates, scenario trees, or asks "what are the odds of X" about a political or military situation. Always search for current information before responding — this domain changes daily.'
---

# Geo-Brief

## Adam's Style

- Probabilistic, bottom line up front, explicit percentages. Peer-level; don't re-explain basics. "Would you bet on it?" → odds + what changes them.
- TACO (Trump Always Chickens Out) is the baseline for US escalation credibility.
- He catches inconsistencies — **always read this file before quoting numbers.** Scenario tables, Deal Tracker, Blink #10 and Structural must agree (e.g., P(nuclear deal) ≤ P(deal) × P(nuclear terms); comprehensive ≤ P(signed deal by end-2026) ≤ MOU-style + comprehensive; Nov 3 gas lines derive from scenario rows).

## Format

**Status:** 2–3 sentences → key developments (48–72h) → ≤2 sentences context.
**Scenarios:** the four below, sorted by P — Scenario | P | Gas (AAA reg., Nov 3) | Key Driver; sums to 100%. Always include the gas column (Adam asked for it Sep 26); note today's baseline and NYC metro ≈ +19¢ over national.
**Scenario set (Adam, Oct 6; renamed Oct 7):** the same four for both horizons, each outcome in exactly one.

- **Limited war / Limbo:** no settlement; strait shut or Iran-controlled (incl. half-open), tanker/proxy hits, short infrastructure outages, US–Iran rounds (including another strike campaign on military targets like Jul 7–18), or limbo.
- **Escalated war (Adam, Oct 7):** a step the war hasn't taken yet, counted from Oct 7: US or allied ground forces operating inside Iran or seizing Iranian territory (Kharg, Larak, Qeshm, the Tunbs, Abu Musa); US or Israeli strikes aimed at Iranian civilian infrastructure (power plants, bridges, desalination, refineries, the Kharg terminal); or a confirmed hit that knocks a major Gulf export hub, power or desalination plant offline 7+ days (Abqaiq, Ras Tanura, Ras Laffan, Fujairah, the Yanbu terminal). Another strike campaign on military, nuclear or naval targets like Jul 7–18, or another East-West pipeline outage, doesn't count: both have happened.
- **MOU-style deal:** interim truce / enhanced MOU like the MOU week, or unsigned Iranian concessions; no signed comprehensive deal.
- **Comprehensive deal:** a _signed_ deal in which Iran concedes at least one of Rubio's three terms. Must stay below MOU-style.
- **Resolution:** what is in force on the horizon date — a signed deal wins; otherwise an interim truce/enhanced MOU in force is MOU-style, even after earlier strikes; otherwise escalated if any escalated step occurred from Oct 7; otherwise limited war / limbo.

**Close:** "What Would Change My Bet" — 2–3 observable tripwires: "If [X] → [scenario] ~Y%."

## Rules

- **Search first** (≥1 search); lead with what's new.
- **Numbers come from the repo:** `state/current.md` and `data/*.csv` in GeoBrief (live at <https://abrandt1897.github.io/GeoBrief/>) are canonical; check them before quoting odds or tripwires. Price lines are scenario odds × weighted bands; tripwire targets must move the odds.
- **Update after odds:** revise this file and propose the updated skill; don't announce unless it fails. Consolidate, don't append.
- Direct, no hedging; honest about uncertainty.
- **Strait/supply claims are contested by default** until Kpler/Windward/PortWatch/Vortexa confirm. Name source + metric; ship counts ≠ barrels; daily snapshot ≠ monthly average; crude ≠ crude+products. Kpler prelims get revised (Sep 28: 12.8 → 16.3 Mbd) — cite vintage. Don't let a single-source figure harden into this file.
- **Reroute ≠ bypass:** say which chokepoint barrels transit. Sohar STS replaces East-West _volume_, not _route_ — those barrels transit Hormuz.
- **Ship IDs:** UKMTO rarely names vessels; Vanguard Tech / Windward usually do within a day. Check owner/manager (UAE-linked?), PGSA non-compliant list, and dark transit before inferring targeting.
- **Gas:** pull live AAA every time — national regular/diesel (gasprices.aaa.com) + NY state/NYC metro (?state=NY). WebFetch on ?state=NY has returned the wrong state; use Firecrawl scrape (maxAge 0, query prompt).
- **Trump signals:** announced threats/deadlines are weak evidence (9/9 blinks); unannounced action + quiet force buildup is the real warning. Watch constraints (gas, 10-yr ~5%, interceptors, election calendar), not posts. Leaked timing intent ("bomb after midterms") and "deal or blow them up" lines are weak.
- **Iran signals:** Iranian deadlines/threats are strong evidence — Tehran converts threats to action more reliably than Washington. IRGC-claimed hits > UKMTO-confirmed unattributed hits > Iranian-media "explosions" with no confirmed hit.
- **Written text > public posture:** a written counter via mediators outweighs same-week Trump rejections/threats.

---

## War Arc (Feb 28 – Oct 4, 2026)

- **Feb 28** US-Israel campaign; Khamenei killed (Mojtaba succeeds). **Apr 13** dual blockade.
- **Jun 17** MOU (Islamabad; 14-pt, 60 days → lapsed Aug 16-17; $300B fund para 6; HEU dilution only). **Jun 18** blockade lifted, oil waiver. **Jun 25–28** first kinetic round over routing.
- **Jul 7–24** first US non-blink (~11 nights, 300+ targets, waiver revoked); Iran hits Qatar/Kuwait/Jordan/Bahrain. **Jul 12** PGSA closes strait (permit regime). **Jul 14** blockade back; Houthis break Saudi truce. **~Jul 18-19** US troops killed in Jordan — no escalation.
- **Jul 24–Aug 29** pause (interceptor shortages). PGSA tolls ≤$2M/vessel, yuan/crypto. **Aug 24** "Economic Outcast" sanctions. **Aug 25** Iran-Oman corridor framework. UAE suspends trade/finance with Iran.
- **Aug 30–Sep 10** Larak strikes; Sep 5 US hits 3 Iranian tankers; **Sep 10** largest shipping exchange (US sinks 5 Iranian tankers; Iran hits 10 ships + Jordan base).
- **Sep 11** Iraqi-militia drones shut Saudi East-West line; Houthis take Yemen's Red Sea coast, Saudi-Houthi war reignites. Brent $108-109.
- **Sep 21-22** Witkoff/Kushner–Araghchi indirect at UNGA. Trump UNGA: "deal or annihilate," deal "right after the election."
- **Sep 23-24** Pezeshkian won't limit nuclear program; Iran roadmap (≈MOU + sequencing). **IRGC claims Cape Dao** (UAE-linked; selective punishment). Rezaei: US has "4-5 days." Trump backs diesel export ban.
- **Sep 25** Araghchi **7-day plan** (blockade lift + waiver + unfreeze + ceasefire incl. Lebanon → strait open day 6-7 → talks). Pezeshkian floats IAEA inspectors + HEU dilution.
- **Sep 26-27** Trump rejects plan ("not acceptable"); leak: bombing after midterms. Iranian-media blasts near Qeshm (unconfirmed). PGSA charterer blacklist. Trump–Xi: oppose Iranian nukes **and transit fees**; Xi backs return to MOU.
- **Sep 28** Trump denies sanctions relief for nuke concessions. Aramco resumes Yanbu loadings (Oct schedule issued). Netanyahu in Abu Dhabi; Iran warns UAE of "very dangerous consequences." RAF Fairford incident (UK PM Burnham: "strong indications" of Iran; Tehran denies). Evening: Kuwaiti VLCC **Al Funtas** (KOTC, transiting dark) hit in Hormuz. Brent ~$107 Asia open, faded on Qatar mediation.
- **Sep 28-29** **US written response delivered via Qatar** (Doha, Araghchi en route home). Reuters source: components broadly agreed, **dispute is sequencing**; doc = 7-day trust-building → "enhanced MOU" with concrete nuclear steps.
- **Sep 29** IRGC (Mohebbi) threatens regional infrastructure; Ghalibaf: if Iran can't sell oil, no one will. **UKMTO: 3 tankers hit by unknown projectiles in Hormuz — unclaimed.** Vanguard IDs: **Mersin Prosperity** (VLCC), **Sinbad** (Liberia/Anglo-Eastern, inbound, on PGSA non-compliant list), **Al Ruwais** (ADNOC LR2 = 2nd UAE-linked hit). None Saudi shuttles or identified STS-loop ships → fits selective targeting (UAE-linked, blacklisted, dark). Saudi cabinet demands pre-Feb 28 strait, no fees. New arms-procurement sanctions + $15M IRGC-finance reward. IRGC letter urging US voters to oust Trump allies. Rial record low (>2.5M/$). Brent $96.16 (Trading Economics) on supply.
- **Sep 30** Araghchi presents US response to Pezeshkian's cabinet; Pezeshkian: "every effort" to bring agreement to fruition, "win-win." Content undisclosed. Trump: "lost 18," war won "one way or the other," "things happening very soon," later "time has come" to deal or "maybe blow them up." US completes Iraq withdrawal. Brent Nov ~$103.7 (expiry), Dec ~$98.8.
- **Oct 1** Leak: TR CSG + Makin Island ARG (2,000 Marines) left San Diego, arrive ~Nov; WSJ: Trump told aides he expects to resume bombing in Nov. Brent +4.4% to $102.31. Treasury auto/rail sanctions; Bessent: Iran loaded zero crude in Sep. Houthi drone on Medina power station.
- **Oct 2** G7 releases 100M bbl crude+diesel; China suspends product exports for Oct; Dated Brent >$120 vs ICE Dec $102.25 (physical squeeze). 2 tanker incidents off Musandam (one disabled NE of Limah, one near-miss off Khasab) — unclaimed, unnamed. Trump rally: war ends 'probably right after the midterms, one way or the other'; Saudis reportedly planning Houthi offensive.
- **Oct 3** Riyadh Aramco refinery fire (cause unconfirmed). Rubio expels remaining Iranian UNGA delegates. Trump: 'easy way or the hard way'; Hegseth echoes. Rial 2.69M/$, CB sells $2B.
- **Oct 4** **Iran soft-rejects US counter:** Baghaei — US text 'more or less' prior positions on nukes; Iran's focus = strait, needs US steps first; denies IAEA-for-relief offer. Ghalibaf: strait stays shut until 7 MOU-based conditions met. Another tanker hit in Hormuz (engine room, UKMTO; unclaimed). Houthis claim Khurais + Riyadh Aramco strikes (unverified); Yemeni govt/Saudi offensive on Sanaa/Saada begins. Oil minister Paknejad resigns. GHWB in Phuket for R&R Oct 4-9. OPEC+ holds Nov targets. **All B-1Bs leave RAF Fairford for CONUS home stations** (force protection after Fairford plot: 5 arrested Sep 27, Iranian-British dual national arrested Oct 3). Pre-election Europe-based strike capacity down; Iran's European plot achieved an effect.

## Physical Supply (Sep 28–30)

- **Kpler Sep (prelim, two vintages):** Mideast exports 12.8 Mbd / Hormuz ~7.4 Mbd (Reuters, Sep 28) → later 16.3 Mbd / Hormuz ~9.7 Mbd. Feb baseline 18.8–19.5 Mbd. Saudi ~5.4 Mbd (Aug 2.45); Ras Tanura 3.6 Mbd. 19 Saudi VLCCs exited Hormuz in a week. Excludes AIS-dark.
- **Daily snapshot:** Kpler via CNBC/JPM — **Hormuz crude at prewar levels as of Sep 28**, products/LNG still constrained; relies on US escorts. Goldman: Gulf exports incl. dark back at 2025 average; Iran shipped no crude by sea in Sep. **Partial confirmation** of the earlier contested >20 Mbd tweet (crude only, short window). Monthly Hormuz still ~half prewar. Windward: 17 transits Sep 29 (7 dark).
- **East-West/Yanbu (Oct 5): contested after Khurais PS-2 strike.** Pre-strike ~6 Mbd (>80% of 7; Bloomberg Oct 2 — supersedes Kpler ~2.65 Sep 30). Oct 4 strike = satellite-confirmed large fire; brief halt confirmed; AFP source says stopped, Bloomberg + Reuters say flowing → lean flowing (~75%), rate unknown. Resolve with Yanbu loadings (Kpler/Vortexa/TankerTrackers). Detail: log/physical-supply.md.
- **STS workaround** (Ras Tanura → Hormuz → STS off Sohar/Fujairah): ~2.5 Mbd Sep (Kpler) — transits Hormuz, not a bypass. VLCC Gulf→China >$30/bbl.
- **Why Saudi shuttles not hit (read):** Asia buyers; roadmap promises no attacks on Arab neighbours; targeting selective (UAE). Sep 28-29 hits spared Saudi/STS-loop ships — pattern holds.
- **Saudi shuttle/STS-zone strike:** ~30% by Nov 3 (Fujairah STS risk up after 2nd UAE-linked hit); seizure/harassment ~40%; inside next US non-blink round ~60%. Target order: UAE-linked → US-escorted/unauthorized-route → Saudi. Saudi hit = roadmap abandoned → war 60%+.

## Houthis / Bab el-Mandeb

Hold Yemen's Red Sea coast; open war with Riyadh (Riyadh/Yanbu/Taif/Khamis Mushait targeted; UN displaced 230k). Iranian advisers present. US has a Saudi-only-targeting pledge. **By Nov 3:** Houthi hit (not intercepted) on Yanbu/East-West ~40%; non-Saudi shipping hit ~20%; US joins vs Houthis ~10%.

## US Capacity & Political Clock

- **Force posture:** GW in Arabian Sea; GHWB on R&R in Phuket Oct 4-9 after 6 months (likely rotating out). TR CSG + Makin Island ARG en route, arrive ~Nov — press calls it a 'third carrier,' but with GHWB leaving it may net to rotation; count it a surge only if GHWB returns to the AOR or bombers/air defense follow. Iraq withdrawal complete Sep 30. **Real surge** (3 carriers simultaneously on station / Diego Garcia bombers / extra air defense): ~10% before Nov 3, ~45% by YE. Tanker/P-8 traffic alone ≠ surge.
- **Losses:** 18 US servicemembers killed (Trump, Sep 30).
- **Cost:** $43.6B through Sep 3; ~$2-3B/month low intensity; money not binding. **Binding constraint = interceptors** (½–⅔ depleted, 5+ yrs to rebuild) → most plausible no-blink = short, sharp campaign then declared victory.
- **Congress:** CR to Dec 11; $87.6B supplemental → lame duck. WPR passed 3×; GOP defections 7.
- **Midterms:** generic ~D+9; House flip ~85-90%; Senate toss-up. Post-election both blink and escalation get cheaper.
- **Pre-election deal:** ~7% — written counter exists, but Trump wants post-election and denies relief-for-nukes; pass-through only ~15-30¢ by Nov 3.

## MOU & Rubio's Terms

- **MOU:** toll-free passage via Iranian "best efforts"; unfreeze ($6B Qatar + ~$24B) never delivered (Iran's #1 grievance); HEU dilution. Never terminated; current docs = "enhanced MOU."
- **Rubio's 3:** (1) no nuclear weapon; (2) strait open without tolls; (3) HEU turned over. **0 of 3 met.** Enhanced-MOU "concrete nuclear steps" = possible movement on #1. Trump–Xi anti-fee line + Saudi cabinet no-fees demand strengthen #2.
- **Core deadlock = sequencing:** Iran = blockade lift/unfreeze first; US = strait/goodwill first. Reuters: components agreed — but sequencing _is_ the deadlock, so don't over-read.
- **Channels:** Qatar shuttle (primary), Pakistan; Witkoff/Kushner; GCC own-track; Salalah stalled.
- Paying Iranian fees is sanctionable incl. crypto. Macron-Oman demining coalition = only non-TACO path to breaking fees.

## TACO Tracker

**9 blinks:** Apr 7 ultimatum; May 4-6 Project Freedom; May 18 strike off; May 28 Oman threat; Jun 11 Kharg; Jun 17 → MOU; Jun 28 stand-down; Jul 18-19 troops killed → nothing; Aug 28 major-bank deadline lapsed.
**Not scored:** Sep 10 round; Sep 26 rejection; Sep 28 "no relief for nukes"; Sep 30 "deal or blow them up."
**Lesson:** only US non-blink (Jul 7-18) lasted 11 days. **Live red lines:** direct hit on US ship/base (breached Aug 31, Sep 10 — no response); mine-laying.

**Blink #10 — "Deal or Annihilate" (Sep 22).** Resolves Dec 31, 2026.

- **Blink:** deal meeting none of Rubio's 3; OR Dec 31 with neither deal nor annihilation-scale campaign; OR unfreeze/blockade easing before a signed deal.
- **No blink:** campaign ≥ Jul 8-18 scale hitting Pickaxe/Kharg/leadership; OR deal meeting ≥1 of Rubio's 3.
- **Odds (Oct 4):** blink ~38% · no blink ~38% · unresolved ~24%.

**Rezaei "4-5 days" (→ Sep 28-29):** no IRGC-claimed hit; Sep 28-29 four unclaimed hits (incl. ADNOC, PGSA-listed, dark Kuwaiti) + infrastructure threats = enforcement with deniability. Window passed without the claimed-escalation step.

## Deal Tracker (Oct 4)

P(term | deal). P(deal) ≈ 16% by end-2026, 34% by end-2027.

| Term                                                   | P   |
| ------------------------------------------------------ | --- |
| US blockade lifted                                     | 90% |
| Mutual non-attack (shipping/bases)                     | 90% |
| Asset unfreeze                                         | 87% |
| Iran "reaffirms" no nukes                              | 80% |
| Iran-Oman joint strait administration                  | 78% |
| Oil waiver restored                                    | 75% |
| Mine-clearing coalition w/ Iranian consent             | 70% |
| $300B reconstruction fund                              | 55% |
| Lebanon/Hezbollah linked                               | 55% |
| Capped "service fees" survive                          | 52% |
| Houthi Red Sea standdown                               | 42% |
| Verifiable enrichment cap / IAEA at Pickaxe (Rubio #1) | 40% |
| Economic Outcast rollback                              | 40% |
| Zero fees (Rubio #2)                                   | 30% |
| HEU turned over (Rubio #3)                             | 20% |
| Compensation for July strikes                          | 20% |
| Israel bound signatory                                 | 15% |
| Full denuclearization                                  | 5%  |

**Read:** likely deal = enhanced MOU + unfreeze + Oman-run strait; IAEA access the likeliest Rubio term (up on "concrete nuclear steps"); HEU turnover unlikely. Rubio 0-for-3 → blink #10.
**Tripwires:** Iran accepts US sequencing or round 2 scheduled with text → YE deal ~23%. Leaked text with IAEA/enrichment cap → deal +5. US delegate on Oman track → joint admin ~90%, deal +10. Unfreeze before signing → deal −5, limbo +5.

## Canonical Odds (Oct 7)

_Snapshot of `state/current.md` in the GeoBrief repo, which is canonical; copy it here on every update so the skill never quotes an older set._

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
