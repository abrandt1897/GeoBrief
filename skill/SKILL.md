---
name: "geo-brief"
description: "Geopolitical situation briefings and probabilistic scenario analysis. Use this skill when Adam asks about the Iran war, Strait of Hormuz, gas prices, US foreign policy, sanctions, or any geopolitical conflict status. Also use when he wants probability estimates, scenario trees, or asks \"what are the odds of X\" about a political or military situation. Always search for current information before responding — this domain changes daily."
---

# Geo-Brief

## Adam's Style
- Probabilistic, bottom line up front, explicit percentages. Peer-level; don't re-explain basics. "Would you bet on it?" → odds + what changes them.
- TACO (Trump Always Chickens Out) is the baseline for US escalation credibility.
- He catches inconsistencies — **always read this file before quoting numbers.** Scenario tables, Deal Tracker, Blink #10 and Structural must agree (e.g., P(nuclear deal) ≤ P(deal) × P(nuclear terms); year-end "deal" = P(deal by end-2026); Nov 3 gas lines derive from scenario rows).

## Format
**Status:** 2–3 sentences → key developments (48–72h) → ≤2 sentences context.
**Scenarios:** table sorted by P — Scenario | P | Gas (AAA reg., Nov 3) | Key Driver; sums to ~100%, ≥1 tail. Always include the gas column (Adam asked for it Sep 26); note today's baseline and NY metro ≈ +10¢.
**Close:** "What Would Change My Bet" — 2–3 observable tripwires: "If [X] → [scenario] ~Y%."

## Rules
- **Search first** (≥1 search); lead with what's new.
- **Update after odds:** revise this file and propose the updated skill; don't announce unless it fails. Consolidate, don't append.
- Direct, no hedging; honest about uncertainty.
- **Strait/supply claims are contested by default** until Kpler/Windward/PortWatch/Vortexa confirm. Name source + metric; ship counts ≠ barrels; daily snapshot ≠ monthly average; crude ≠ crude+products. Kpler prelims get revised (Sep 28: 12.8 → 16.3 Mbd) — cite vintage. Don't let a single-source figure harden into this file.
- **Reroute ≠ bypass:** say which chokepoint barrels transit. Sohar STS replaces East-West *volume*, not *route* — those barrels transit Hormuz.
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
- **Sep 29** IRGC (Mohebbi) threatens regional infrastructure; Ghalibaf: if Iran can't sell oil, no one will. **UKMTO: 3 tankers hit by unknown projectiles in Hormuz — unclaimed.** Vanguard IDs: **Mersin Prosperity** (VLCC), **Sinbad** (Liberia/Anglo-Eastern, inbound, on PGSA non-compliant list), **Al Ruwais** (ADNOC LR2 = 2nd UAE-linked hit). None Saudi shuttles or identified STS-loop ships → fits selective targeting (UAE-linked, blacklisted, dark). Saudi cabinet demands pre-Feb 28 strait, no fees. New arms-procurement sanctions + $15M IRGC-finance reward. IRGC letter urging US voters to oust Trump allies. Rial record low (>2.5M/$). Brent settles $102.59 (−2.6%) on supply.
- **Sep 30** Araghchi presents US response to Pezeshkian's cabinet; Pezeshkian: "every effort" to bring agreement to fruition, "win-win." Content undisclosed. Trump: "lost 18," war won "one way or the other," "things happening very soon," later "time has come" to deal or "maybe blow them up." US completes Iraq withdrawal. Brent Nov ~$103.7 (expiry), Dec ~$98.8.
- **Oct 1** Leak: TR CSG + Makin Island ARG (2,000 Marines) left San Diego, arrive ~Nov; WSJ: Trump told aides he expects to resume bombing in Nov. Brent +4.4% to $102.31. Treasury auto/rail sanctions; Bessent: Iran loaded zero crude in Sep. Houthi drone on Medina power station.
- **Oct 2** G7 releases 100M bbl crude+diesel; China suspends product exports for Oct; Dated Brent >$120 vs ICE Dec $102.25 (physical squeeze). 2 tanker incidents off Musandam (one disabled NE of Limah, one near-miss off Khasab) — unclaimed, unnamed. Trump rally: war ends 'probably right after the midterms, one way or the other'; Saudis reportedly planning Houthi offensive.
- **Oct 3** Riyadh Aramco refinery fire (cause unconfirmed). Rubio expels remaining Iranian UNGA delegates. Trump: 'easy way or the hard way'; Hegseth echoes. Rial 2.69M/$, CB sells $2B.
- **Oct 4** **Iran soft-rejects US counter:** Baghaei — US text 'more or less' prior positions on nukes; Iran's focus = strait, needs US steps first; denies IAEA-for-relief offer. Ghalibaf: strait stays shut until 7 MOU-based conditions met. Another tanker hit in Hormuz (engine room, UKMTO; unclaimed). Houthis claim Khurais + Riyadh Aramco strikes (unverified); Yemeni govt/Saudi offensive on Sanaa/Saada begins. Oil minister Paknejad resigns. GHWB in Phuket for R&R Oct 4-9. OPEC+ holds Nov targets. **All B-1Bs leave RAF Fairford for CONUS home stations** (force protection after Fairford plot: 5 arrested Sep 27, Iranian-British dual national arrested Oct 3). Pre-election Europe-based strike capacity down; Iran's European plot achieved an effect.

## Physical Supply (Sep 28–30)
- **Kpler Sep (prelim, two vintages):** Mideast exports 12.8 Mbd / Hormuz ~7.4 Mbd (Reuters, Sep 28) → later 16.3 Mbd / Hormuz ~9.7 Mbd. Feb baseline 18.8–19.5 Mbd. Saudi ~5.4 Mbd (Aug 2.45); Ras Tanura 3.6 Mbd. 19 Saudi VLCCs exited Hormuz in a week. Excludes AIS-dark.
- **Daily snapshot:** Kpler via CNBC/JPM — **Hormuz crude at prewar levels as of Sep 28**, products/LNG still constrained; relies on US escorts. Goldman: Gulf exports incl. dark back at 2025 average; Iran shipped no crude by sea in Sep. **Partial confirmation** of the earlier contested >20 Mbd tweet (crude only, short window). Monthly Hormuz still ~half prewar. Windward: 17 transits Sep 29 (7 dark).
- **East-West/Yanbu: back online, partial.** Restarted Sep 22; Yanbu loadings ~2 Mbd (trade sources); Kpler throughput ~2.65 → 3-4 Mbd expected; pre-attack ~5.5 Mbd ~1 month away (nameplate 7). TankerTrackers: ~10M bbl loading Sep 27. Still under Houthi fire; France assisting defense.
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
- **Core deadlock = sequencing:** Iran = blockade lift/unfreeze first; US = strait/goodwill first. Reuters: components agreed — but sequencing *is* the deadlock, so don't over-read.
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

| Term | P |
|---|---|
| US blockade lifted | 90% |
| Mutual non-attack (shipping/bases) | 90% |
| Asset unfreeze | 87% |
| Iran "reaffirms" no nukes | 80% |
| Iran-Oman joint strait administration | 78% |
| Oil waiver restored | 75% |
| Mine-clearing coalition w/ Iranian consent | 70% |
| $300B reconstruction fund | 55% |
| Lebanon/Hezbollah linked | 55% |
| Capped "service fees" survive | 52% |
| Houthi Red Sea standdown | 42% |
| Verifiable enrichment cap / IAEA at Pickaxe (Rubio #1) | 40% |
| Economic Outcast rollback | 40% |
| Zero fees (Rubio #2) | 30% |
| HEU turned over (Rubio #3) | 20% |
| Compensation for July strikes | 20% |
| Israel bound signatory | 15% |
| Full denuclearization | 5% |

**Read:** likely deal = enhanced MOU + unfreeze + Oman-run strait; IAEA access the likeliest Rubio term (up on "concrete nuclear steps"); HEU turnover unlikely. Rubio 0-for-3 → blink #10.
**Tripwires:** Iran accepts US sequencing or round 2 scheduled with text → YE deal ~25%. Leaked text with IAEA/enrichment cap → deal +5. US delegate on Oman track → joint admin ~90%, deal +10. Unfreeze before signing → deal −5, limbo +5.

## Canonical Odds (Oct 4)
Changed vs Sep 30: Iran soft-rejected the US counter (strait-first, no nuclear talks) — partial fire of the "rejects outright" tripwire, applied ~+2 war; leaked Nov bombing intent + TR/ARG deployment (weak signal per rules, but real forces → mostly a YE/post-election effect); 3 more unclaimed Hormuz hits; Houthi claims on Khurais/Riyadh + Riyadh refinery fire (unconfirmed cause) → infra +1; delegation expelled → deal −2. Net Nov 3: war +3, deal −2, half-open −1.

### Through Midterms (Nov 3)
| Scenario | P | Gas (AAA reg.) | Brent | Key Driver |
|---|---|---|---|---|
| War: limited round (Sep 10-style) | 39% | $4.40-4.60 | $103-112 | Iran holds strait-first; claimed hit or US strike |
| Limbo / extensions | 20% | $4.20-4.40 | $95-105 | Mediator traffic continues, no text agreed |
| Half-open, Iran-influenced | 12% | $4.00-4.25 | $86-96 | Escorted crude near prewar; Yanbu ramp; G7 release |
| War: oil-infrastructure hit | 9% | $4.75-5.10+ | $118-130+ | Yanbu/Abqaiq/Khurais, Sohar/Fujairah STS, Kharg |
| War: sustained campaign, no infra hit | 7% | $4.55-4.75 | $110-118 | Interceptor-limited; early start of Nov buildup |
| Iran folds | 8% | $3.90-4.10 | $80-90 | Rial ~2.7M, 70-90% inflation; accepts US sequencing |
| Deal | 5% | $3.85-4.05 | $76-88 | Iran accepts US text as basis |

War total = 55% (Oct 4 late: B-1B withdrawal −1 sustained, +1 limbo). NY state ≈ +10¢, **NYC metro ≈ +19¢** over national (corrected Oct 4).

**Gas baseline (AAA, Oct 4):** national regular $4.37 (yday $4.38, wk $4.48, mo $4.15); diesel $6.34 (record $6.53 9/22). NY state $4.47 / $6.52; NYC metro $4.56 / $6.74. Drifting down ~1¢/day. G7 diesel release caps diesel; China product-export halt and Dated Brent >$120 push the other way.
**Gas mechanics:** rockets 2-4¢/day, feathers 1-1.5¢/day (~2.4¢ per $1/bbl); no-shock path → ~$4.10-4.25.
**Nov 3 lines (AAA national regular):** ≥$4.50 ~38% · ≥$4.75 ~9% · ≥$5.00 ~4% · <$4.00 ~8%. NYC metro ≥$4.75 ~25%, ≥$5 ~7%. National diesel ≥$6.50 ~35%.
**Market cross-check:** ICE Brent ~$102 prices less war than 56%; Dated >$120 says physical is tighter than futures. Futures have faded every lull; supply recovery + G7 release cap upside.

### Through Year-End 2026
| Scenario | P |
|---|---|
| War resumed | 48% |
| Half-open | 18% |
| Deal | 16% |
| Limbo | 9% |
| Iran folds | 9% |

### Live Tripwires
- Iran formally accepts US sequencing / round 2 scheduled with text → YE deal ~23%, Nov 3 war ~51%.
- Iran formally rejects counter / mediators declare talks suspended → Nov 3 war ~60%.
- IRGC claims any hit, mine-laying, or infra strike → Nov 3 war ~60%.
- Iranian or proxy hit on Yanbu/East-West/Abqaiq confirmed (not intercepted) → infra-hit ~14%, Nov 3 ≥$4.75 ~16%.
- Saudi shuttle or STS-loop ship hit → war 60%+.
- Third UAE-linked hit or Fujairah/Sohar STS-zone strike → infra-hit +2, half-open −2.
- Kpler monthly Hormuz crude >12 Mbd in Oct → half-open +5, Nov 3 ≥$4.50 ~32%.
- B-1Bs reappear at Diego Garcia/Gulf, or B-2/B-52s forward-deploy → no-blink +10, Nov 3 sustained +3 (B-1 exit itself = force protection, not a blink).
- GHWB returns to AOR while TR arrives (true 3 on station), or Diego Garcia bombers → no-blink +10, Nov 3 sustained +3.
- US blockade easing → half-open/deal +8; before signing = blink #10.
- Trump–Pezeshkian meeting → deal +3, limbo +3.
- CENTCOM-confirmed US deaths or US strike on Pickaxe → war 60%+.

### Structural
- Hormuz back to ~20 mb/d (all liquids, monthly) by end-2027: ~20%
- War-ending deal: 16% by end-2026; 34% by end-2027
- Comprehensive nuclear deal in 2026: ~6% (16% × 40%)
