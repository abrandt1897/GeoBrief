---
name: "geo-brief"
description: 'Geopolitical situation briefings and probabilistic scenario analysis. Use this skill when Adam asks about the Iran war, Strait of Hormuz, gas prices, US foreign policy, sanctions, or any geopolitical conflict status. Also use when he wants probability estimates, scenario trees, or asks "what are the odds of X" about a political or military situation. Always search for current information before responding — this domain changes daily.'
---

# Geo-Brief

## Adam's Style

- Probabilistic, bottom line up front, explicit percentages. Peer-level; don't re-explain basics. "Would you bet on it?" → odds + what changes them.
- TACO (Trump Always Chickens Out) is the baseline for US escalation credibility.
- He catches inconsistencies — **always read this file before quoting numbers.** Scenario tables, Deal Tracker, Blink #10 and Structural must agree (e.g., P(nuclear deal) ≤ P(deal) × P(nuclear terms); comprehensive ≤ P(signed deal by end-2026) ≤ MOU-style + comprehensive; year-end price lines derive from scenario rows).

## Format

**Status:** 2–3 sentences → key developments (48–72h) → ≤2 sentences context.
**Scenarios:** the four below, sorted by P — Scenario | P | Gas (AAA reg., Dec 31) | Key Driver; sums to 100%. Always include the gas column (Adam asked for it Sep 26); note today's baseline and NYC metro ≈ +19¢ over national.
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
- **Jun 17** MOU (Versailles, after the G7; 14-pt, 60 days → lapsed Aug 16-17; $300B fund para 6; HEU dilution only). **Jun 18** blockade lifted, oil waiver. **Jun 25–28** first kinetic round over routing.
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
- **East-West/Yanbu (Oct 13): ~5.8 Mbd (estimate, plotted).** Saudi energy minister, on the record Oct 6 ("back up to 5.8 million barrels" a day, repeated Oct 12); Kpler says Red Sea loadings rebounded faster than expected (45M bbl Sept 17–Oct 4). Khurais PS-2 strike Oct 4 caused a brief halt. Still no tracker rate after Oct 4; a Yanbu loadings figure would replace it. Detail: log/physical-supply.md.
- **STS workaround** (Ras Tanura → Hormuz → STS off Sohar/Fujairah): ~2.5 Mbd Sep (Kpler) — transits Hormuz, not a bypass. VLCC Gulf→China >$30/bbl.
- **Why Saudi shuttles not hit (read):** Asia buyers; roadmap promises no attacks on Arab neighbours; targeting selective (UAE). Sep 28-29 hits spared Saudi/STS-loop ships — pattern holds.
- **Saudi shuttle/STS-zone strike:** none by Nov 3 (had ~30%; `tw_saudi_ship`/`tw_sts_strike` now move year-end escalated); seizure/harassment ~40%; inside next US non-blink round ~60%. Target order: UAE-linked → US-escorted/unauthorized-route → Saudi. Saudi hit = roadmap abandoned → war 60%+.

## Houthis / Bab el-Mandeb

Hold Yemen's Red Sea coast; open war with Riyadh (Riyadh/Yanbu/Taif/Khamis Mushait targeted; UN displaced 230k). Iranian advisers present. US has a Saudi-only-targeting pledge. **Nov 3 (resolved):** Houthi hit (not intercepted) on Yanbu/East-West — happened (Khurais, Oct 4; forecast voided because it was made the same day); Yemeni gov't claims Bab el-Mandeb/Mokha retaken Oct 5 (disputed); no Houthi hit on non-Saudi shipping (had ~20%; `tw_bab` now moves year-end Brent and gas); the US did not join strikes on the Houthis (had ~10%).

## US Capacity & Political Clock

- **Force posture:** GW in Arabian Sea; GHWB back in the Arabian Sea Oct 15 after R&R in Phuket Oct 4-9 (CENTCOM). TR CSG + Makin Island ARG en route, arrive ~Nov — GHWB's return makes it a real third carrier if GHWB is still on station when TR arrives (fires `tw_bombers`). Iraq withdrawal complete Sep 30. **Real surge** (3 carriers simultaneously on station / Diego Garcia bombers / extra air defense): none before Nov 3 (`surge_nov3` resolved no, had ~10%); ~45% by YE. Tanker/P-8 traffic alone ≠ surge.
- **Losses:** 18 US servicemembers killed (Trump, Sep 30).
- **Cost:** $43.6B through Sep 3; ~$2-3B/month low intensity; money not binding. **Binding constraint = interceptors** (½–⅔ depleted, 5+ yrs to rebuild) → most plausible no-blink = short, sharp campaign then declared victory.
- **Congress:** CR to Dec 11; $87.6B supplemental → lame duck. WPR passed 3×; GOP defections 7.
- **Midterms:** generic ~D+9; House flip ~85-90%; Senate toss-up. Post-election both blink and escalation get cheaper.
- **Pre-election deal:** none (`deal_prenov3`, ~4%, resolved no on Nov 3). Trump wanted it after the election; Khamenei authorized talks with the US on Nov 2 and Qatar is drafting a framework.

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
- **Odds (Oct 7):** blink ~70% · no blink ~30% · unresolved ~0% (Dec 31 always resolves it). No blink = YE comprehensive 8 + a Jul-scale campaign on Pickaxe/Kharg/leadership ~22 (the WSJ says bombing resumes in Nov).

**Rezaei "4-5 days" (→ Sep 28-29):** no IRGC-claimed hit; Sep 28-29 four unclaimed hits (incl. ADNOC, PGSA-listed, dark Kuwaiti) + infrastructure threats = enforcement with deniability. Window passed without the claimed-escalation step.

## Deal Tracker (Oct 7)

P(term | deal). P(deal) ≈ 11% by end-2026, 31% by end-2027 (Vance, Oct 5–6: any deal needs a "meaningful" enrichment-capacity cut; −2 on Nov 3 after the confirmed US strike on Qeshm).

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
| Verifiable enrichment cap / IAEA at Pickaxe (Rubio #1) | 50% |
| Economic Outcast rollback                              | 40% |
| Zero fees (Rubio #2)                                   | 30% |
| HEU turned over (Rubio #3)                             | 20% |
| Compensation for July strikes                          | 20% |
| Israel bound signatory                                 | 15% |
| Full denuclearization                                  | 5%  |

**Read:** likely deal = enhanced MOU + unfreeze + Oman-run strait; IAEA access the likeliest Rubio term (up on "concrete nuclear steps" and Vance's enrichment condition, 40 → 50%); HEU turnover unlikely. Rubio 0-for-3 → blink #10.
**Tripwires:** Iran accepts US sequencing or round 2 scheduled with text → YE deal ~21%. Leaked text with IAEA/enrichment cap → deal +5. US delegate on Oman track → joint admin ~90%, deal +10. Unfreeze before signing → deal −5, limbo +5.

## Canonical Odds (Oct 14)

_Snapshot of `state/current.md` in the GeoBrief repo, which is canonical; copy it here on every update so the skill never quotes an older set._

**Scenario set (Adam, Oct 6; renamed Oct 7):** the same four for both horizons, each outcome in exactly one.

- **Limited war / Limbo:** no settlement; strait shut or Iran-controlled (incl. half-open), tanker/proxy hits, short infrastructure outages, US–Iran rounds (including another strike campaign on military targets like Jul 7–18), or limbo.
- **Escalated war (Adam, Oct 7):** a step the war hasn't taken yet, counted from Oct 7: US or allied ground forces operating inside Iran or seizing Iranian territory (Kharg, Larak, Qeshm, the Tunbs, Abu Musa); US or Israeli strikes aimed at Iranian civilian infrastructure (power plants, bridges, desalination, refineries, the Kharg terminal); or a confirmed hit that knocks a major Gulf export hub, power or desalination plant offline 7+ days (Abqaiq, Ras Tanura, Ras Laffan, Fujairah, the Yanbu terminal). Another strike campaign on military, nuclear or naval targets like Jul 7–18, or another East-West pipeline outage, doesn't count: both have happened.
- **MOU-style deal:** interim truce / enhanced MOU like the MOU week, or unsigned Iranian concessions; no signed comprehensive deal.
- **Comprehensive deal:** a _signed_ deal in which Iran concedes at least one of Rubio's three terms. Must stay below MOU-style.
- **Resolution (what is in force on the horizon date):** a signed deal wins (comprehensive if it concedes a Rubio term, else MOU-style); otherwise an interim truce or enhanced MOU in force that day is MOU-style, even after earlier strikes; otherwise escalated if any escalated step occurred from Oct 7; otherwise limited war / limbo. Scored as `scen_<horizon>_<scenario>` in `data/forecasts.csv`.
- **Strikes and claims are tripwires, not scenarios.** A US strike on Iran (`tw_us_strike`; Netanyahu is pressing Trump to strike right after the midterms) moves the year-end odds when it fires; a strike campaign on military targets alone stays limited war, while strikes on energy or civilian infrastructure are escalated. An official IRGC/Artesh claim of a specific attack that is independently confirmed (UKMTO, CENTCOM, vessel ID, imagery) fires `tw_irgc_claim`. Unnamed media tallies (Fars "13 violators"), unclaimed hits and denied, unconfirmed claims (Oct 6 helicopter) move nothing on their own.

Oct 9 (pm run): no change, no tripwire fired. The IRGC Navy officially claimed a named ship, the Vietnam-flagged LPG carrier NV Sunshine on the southern route off Oman, and vowed region-wide pursuit of ships on "unauthorised" routes and sanctions on firms cooperating with the US. The claim is not yet independently confirmed (the UKMTO hit that day, 13 nm W of Al Jazira, UAE, was the VLCC Gem No.2 per Vanguard), so `tw_irgc_claim` has not fired; but Iran is putting its name to specific attacks again (first since Cape Dao, Sept 23), so a confirmed claim before Nov 3 is likelier. Trump: Russia to release 300k t of diesel. Saudi-led coalition launches a large operation against the Houthis. Brent $104.43.

Oct 7 (pm run): no change. Unclaimed, unnamed tanker hit by multiple projectiles 51 nm north of Qatar (UKMTO verified, casualties), the deepest Gulf strike this month; Houthi strikes on Abha and Riyadh airports kill 3; senior Iranian official calls enrichment a red line (not a flat refusal of Vance's condition); Iran's army claims US bases were targeted but names no attack. No tripwire fired.

Oct 7 (review follow-up): **Vance (Reuters, Oct 5–6) makes a "meaningful" cut in enrichment capacity a US condition** for any deal, a floor above Rubio's "no nuclear weapon" → year-end deal 15 → 13, by 2027 33 → 31; a signed deal more likely carries a Rubio term (IAEA/enrichment-cap term 40 → 50%), so year-end comprehensive holds at 8 and MOU-style 16 → 14 (limited 66). Nov 3 MOU-style 11 → 10 (limited 82): Iran soft-rejected the counter and calls talks "meaningless." **`tw_irgc_claim` tightened** to official claims of a specific attack that are independently confirmed: one such claim (Cape Dao, Sept 23) against ~8 unclaimed hits since, no US strike since Sept 10, and the WSJ says bombing resumes after the election. **Blink #10 re-derived** from the year-end odds (blink 70, no blink 30, unresolved 0). Tripwires merged, made disjoint and filled in (below).

Oct 7 (Adam, later still): **odds history before Oct 7 removed.** It was scored on earlier scenario definitions, so the chart now starts Oct 7 (marked in `data/rescores.csv`); pre-Oct 7 `scen_*` forecasts are void, and the Oct 4 seed forecasts (made before the repo's first commit) are void and re-recorded Oct 7 at the same p. Tripwire targets are now moves, not levels.

Oct 7 (Adam, afternoon): **status-quo price sub-bands recentred on the forwards.** The limited war / limbo sub-bands had the war premium priced into the status quo (gas median $4.45 vs $4.37 today and falling; Brent median $102 vs January $97.59). Recentred on RBOB-implied gas ~$4.25–4.35, diesel $6.32 and falling, ICE January Brent $97.59 and ICE December JKM $25.84 (Oct 6 settlements). Medians now gas $4.31, diesel $6.23, Brent $97.5, JKM $25.8. The Brent and LNG charts now also plot the resolving contract itself (dashed), so the line and the bands compare like for like.

Oct 7 (Adam, later): **escalated narrowed to steps the war hasn't taken yet** (ground forces in Iran, strikes on Iranian civilian infrastructure, or a major Gulf export hub, power or desalination plant out 7+ days). A July-scale campaign on military targets now counts as limited war. Nov 3 escalated 14 → 7: the sustained-campaign 7 moves to limited war / limbo (81); the 7 left is a hub/plant outage ~4, civilian-infrastructure strikes ~2, ground forces ~2, less overlap. Year-end escalated 20 → 12 (limited 64): post-election escalation gets cheaper and the TR ARG (2,000 Marines) arrives in Nov, but a July-style campaign no longer counts. Brent series now matches Trading Economics.

Oct 7 (review fixes, no new events): **escalated re-scored on the 7-day rule** — its old infra component (14) counted any hit, and Khurais was back within a day; P(export infrastructure offline 7+ days by Nov 3) ~7 + sustained campaign ~7 = 14 (was 21); the 7 moves to limited war / limbo (74). **Year-end comprehensive 6 → 8:** P(deal) 15 × P(at least one Rubio term | deal) ~50%, no longer pinned to the IAEA-only nuclear-deal forecast (6); MOU-style 18 → 16. Price lines re-derived from weighted sub-bands (below). Brent lines now resolve on the January contract, JKM on December.

Oct 6: no change. Houthi claims on Riyadh airport/Rabigh (Saudi confirms airport damage); East-West moving oil to Yanbu; tanker On Peace hit (unclaimed, 12 wounded); Qatar says talks continue; Brent <$100. No tripwire fired.

Oct 5: **UAE-third tripwire fired** (Uhud, Emirates Shipping) → infra +2, half-open −2. **Saudi-infra tripwire fired** (Khurais PS-2; flow restored, contested) → infra +3. Pezeshkian: talks "meaningless"; Ghalibaf: strait shut until 7 conditions met → deal −1, limbo −1, half-open −1.

### Through Midterms (Nov 3) — resolved

Resolved Nov 3 on the status as of the Nov 2 evening run (Adam: "count the status as is"): **Limited war / Limbo**. No signed deal or interim truce was in force and no escalated step had happened. Every Nov 3 forecast is scored in `data/forecasts.csv` and on the dashboard's Calibration tab; nothing tracks Nov 3 any more.

| Scenario            | P   | Result |
| ------------------- | --- | ------ |
| Limited war / Limbo | 81% | Yes    |
| Escalated war       | 10% | No     |
| MOU-style deal      | 8%  | No     |
| Comprehensive deal  | 1%  | No     |

**Nov 3 price lines, resolved on the last readings before Election Day:** AAA national regular $4.17 (the $4.00–4.50 range had ~75%); NYC metro $4.37 (under $4.75, ~90%); diesel $6.29 ($6.00–6.50, ~68%); Brent January $104.77 ($100–110, ~28%); JKM December $31.70 ($31 or more, ~8%). Binary questions: signed deal before Nov 3 (`deal_prenov3`, 4%), strike on a Saudi shuttle or STS-zone ship (30%), Houthi hit on non-Saudi shipping (20%), US strikes on the Houthis (10%) and a real US surge (10%) all resolved no.

### Through Year-End 2026

| Scenario            | P   |
| ------------------- | --- |
| Limited war / Limbo | 66% |
| Escalated war       | 13% |
| MOU-style deal      | 14% |
| Comprehensive deal  | 7%  |

P(signed deal by YE) 11% sits between comprehensive (7) and MOU + comprehensive (21): 7 comprehensive + 4 signed without a Rubio term (counted in MOU-style with Iran folds 8).

**Gas baseline (AAA, Oct 6):** national regular $4.37 (wk $4.48, mo $4.15); diesel $6.32 (record $6.53 9/22). NY state $4.47 / $6.52; NYC metro $4.55 / $6.73 (≈ +18¢ / +41¢ over national; the NYC lines use the latest gap from `gas.csv`). **2026 reference (AAA):** pre-war $2.98 (Feb 26); high $4.56 (May 21); July low $3.79; Sept peak $4.48 (Sept 24).
**Gas mechanics:** rockets 2-4¢/day, feathers 1-1.5¢/day (~2.4¢ per $1/bbl); no-shock path → ~$4.10-4.25.
**Year-end price lines (Dec 31; added Oct 24, `ye_*`, same thresholds as Nov 3):** gas <$4.00 ~31% · ≥$4.50 ~19% · ≥$4.75 ~9% · ≥$5.00 ~3%. Diesel <$6.00 ~46% · ≥$6.50 ~17% · ≥$6.75 ~11% · ≥$7.00 ~7%. Brent (Feb.) <$90 ~27% · ≥$100 ~50% · ≥$110 ~27% · ≥$120 ~15%. JKM (Feb.) <$20 ~8% · ≥$25 ~75% · ≥$28 ~62% · ≥$31 ~44% (Brent and JKM re-derived Nov 4 on the recentred bands). Bands (`scenarios.csv` ye2026): limited = forward 34 + post-election strike round 20 + half-open 12, gas and diesel centred on the Oct 22–23 futures for Dec 31 (Jan RBOB $3.02 + ~$1.10, gas ~$4.15; Jan ULSD $4.63 + ~$1.40, diesel ~$6.05). Brent and JKM recentred and widened Nov 4 (Adam approved, after the Nov 3 price misses): forward sub-bands centre on Feb Brent $100.94 ($88–114) and Feb JKM $30.34 ($25–36) from the Nov 3 settles, with strike round $96–122 / $28–39 and half-open $80–104 / $21–32; widths follow the ~44%/yr realised vol (about ±$18 Brent and ±$5 JKM over the two months left), and runs recentre them automatically when the Feb contract drifts (build.md step 6). Escalated, MOU-style and comprehensive bands sit above and below as on Nov 3.
**Market cross-check:** January Brent settled $104.77 on Nov 2 (−7.6%, its lowest in about four weeks, as traders unwound the war premium); the year-end bands resolve on the February contract ($109.56 on Oct 30, CME). Dated Brent >$120 (Oct 2 floor) said physical was tighter than futures. Futures have faded every lull; supply recovery + G7 release cap upside.

### Live Tripwires

Registry and targets: `data/tripwires.csv`. Targets are moves from today's odds (`key+=n` / `key-=n`), or a level (`key=v`) for a resolution; the dashboard fills the levels in. The list below is printed by `python3 dashboard/build.py --tripwire-lines`; a test checks it matches.

- Iran formally accepts US sequencing, or round two is scheduled with text → YE deal +8, YE MOU-style +6.
- Saudi shuttle ship hit outside the Fujairah/Sohar STS zone → YE escalated +3.
- B-1Bs reappear at Diego Garcia/Gulf, B-2/B-52s forward-deploy, or three carriers on station (GHWB back in the AOR after its Phuket port visit while TR arrives) → Blink #10 no-blink +10, YE escalated +3.
- US blockade easing → YE MOU-style +9.
- Trump–Pezeshkian meeting → YE MOU-style +4, YE deal +3.
- CENTCOM-confirmed US deaths from an Iranian attack → YE escalated +6, YE MOU-style −4.
- East-West line or Yanbu loadings offline 3+ days, by any attacker incl. a repeat of the Sept Iraqi-militia shutdown (confirmed by Kpler, Vortexa or TankerTrackers) → YE escalated +3, YE gas ≥$4.75 +10.
- A Saudi STS-relay ship is hit in the Fujairah/Sohar STS zone → YE escalated +4.
- Iran ends strait tolls and permits, or declares Hormuz open to all shipping (Rubio #2) → YE MOU-style +10, YE deal +7, YE comprehensive +4.
- Iran offers a concrete cut in enrichment capacity (Vance's condition), in text or on the record → YE deal +6, YE comprehensive +4.
- Direct Iran–Israel exchange: Iranian missiles or drones fired at Israel, or an Israeli strike inside Iran → YE escalated +4, YE MOU-style −3.
- Houthis declare Bab el-Mandeb closed, or hit a non-Saudi ship in the strait (confirmed by UKMTO) → YE Brent (Feb.) ≥$100 +12, YE gas ≥$4.50 +12.
- US resumes a multi-day strike campaign on Iran (confirmed by CENTCOM, the Pentagon or the White House), the post-midterm wave Netanyahu is pressing for → YE escalated +5, YE MOU-style −2, YE deal −2.

Retired Oct 7: the Kpler monthly (lands after Nov 3) and the separate carriers tripwire (merged into bombers). Nov 3: every armed tripwire that moved a Nov 3 number now moves the year-end odds or `ye_*` price lines instead. Past tripwires sit in the dashboard's collapsed section.

### Structural

- Hormuz back to ~20 mb/d (all liquids, monthly) by end-2026: ~4% (needs a deal plus fast mine clearance and insurance; the end-2027 card is void)
- War-ending deal: 11% by end-2026; 31% by end-2027
- Comprehensive nuclear deal in 2026: ~6% (11% × 50%, rounded up); any comprehensive (≥1 Rubio term) ~7%
