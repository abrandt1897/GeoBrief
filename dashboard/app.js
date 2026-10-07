// @ts-check
"use strict";

/** @typedef {"limited_war" | "escalated_war" | "mou_deal" | "comprehensive_deal"} Group */
/** @typedef {{ date: string, horizon: string, scenario: string, p: number, note: string }} OddsRow */
/** @typedef {{ horizon: string, scenario: string, label: string, group: Group | "", gas_band: string, diesel_band: string, brent_band: string, lng_band: string, driver: string }} Scenario */
/** @typedef {{ date: string, source: string, nat_regular: number | null, nat_diesel: number | null, ny_regular: number | null, ny_diesel: number | null, nyc_regular: number | null, nyc_diesel: number | null }} GasRow */
/** @typedef {{ date: string, source: string, brent_ice_front: number | null, dated_brent: number | null, dated_floor: number | null, rial_per_usd: number | null }} MarketRow */
/** @typedef {{ date: string, source: string, brent_front: number | null, brent_spot: number | null, jkm_front: number | null }} EnergyRow */
/** @typedef {{ id: string, made_on: string, question: string, p: number, resolves_on: string, resolution_rule: string, outcome: number | "void" | null, resolved_on: string, notes: string }} Forecast */
/** @typedef {{ id: string, condition: string, effect: string, status: "armed" | "fired" | "expired", set_on: string, fired_on: string, evidence: string }} Tripwire */
/** @typedef {{ term: string, p: number, rubio: string }} Term */
/** @typedef {{ date: string, end_date: string, label: string, detail: string, type: "blink" | "non_blink" | "pending" | "unscored" }} Blink */
/** @typedef {{ date: string, text: string, chart: string | null }} GBEvent */
/** @typedef {{ cond: string, effect: string }} Bet */
/** @typedef {{ date: string, series: string, mbd: number | null, kind: string, source: string, note: string }} SupplyRow */
/** @typedef {{ date: string, label: string }} SupplyEvent */
/** @typedef {{ title: string, lead: string, more: string }} SupplyNote */
/**
 * @typedef {object} Brief
 * @property {string} updated
 * @property {string} headline
 * @property {string} status
 * @property {string} change_note
 * @property {Bet[]} bets
 * @property {{ blink: number, no_blink: number, unresolved: number, rubio_met: number }} blink10
 * @property {{ ye2026: number, ye2027: number }} deal_p
 * @property {string} election_day
 */
/**
 * @typedef {object} Payload
 * @property {Brief} brief
 * @property {OddsRow[]} odds
 * @property {Scenario[]} scenarios
 * @property {GasRow[]} gas
 * @property {MarketRow[]} markets
 * @property {EnergyRow[]} energy
 * @property {Forecast[]} forecasts
 * @property {Tripwire[]} tripwires
 * @property {Term[]} terms
 * @property {Blink[]} blinks
 * @property {GBEvent[]} events
 * @property {SupplyRow[]} supply
 * @property {SupplyEvent[]} supply_events
 * @property {SupplyNote | null} supply_note
 */
/** @typedef {{ date: string, v: Record<string, number> }} DateRow */
/** @typedef {{ d: string, v: number | null }} Pt */
/** @typedef {{ name: string, color: string, width?: number, dash?: string, points: Pt[] }} Series */
/** @typedef {{ v: number, value: string, name: string, color: string, boxW: number }} EndLabel */
/** @typedef {{ lo: number, hi: number, w: number, color: string, title: string }} Band */
/** @typedef {{ date: string, text: string }} Annotation */
/**
 * @typedef {object} ChartOpts
 * @property {string} label
 * @property {string} start
 * @property {string} end
 * @property {string[]} dates
 * @property {Series[]} series
 * @property {number} yMin
 * @property {number} yMax
 * @property {number[]} yTicks
 * @property {(v: number, tip?: boolean) => string} yFmt
 * @property {EndLabel[]} [endLabels]
 * @property {Band[]} [bands]
 * @property {Annotation[]} [annotations]
 * @property {string | null} [endMark] label for the dashed line at the right edge (default "Election Day"; null for none)
 * @property {Annotation[]} [vlines] labelled vertical markers drawn inside the plot
 * @property {number} [annoRows] rows the annotation captions cycle through (default 2)
 * @property {number} [maxGap] break a line where consecutive readings are more than this many days apart
 */
/** @typedef {{ id: string, label: string, title: string, sub?: string, dek: string, render: (el: HTMLElement) => void }} Tab */
/** @typedef {{ date: string, v: number }} Reading */

(() => {
  const NS = "http://www.w3.org/2000/svg";

  /** @param {string} id @returns {HTMLElement} */
  const $ = (id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing #${id}`);
    return el;
  };
  /** @param {ParentNode} root @param {string} sel @returns {Element} */
  const q = (root, sel) => {
    const el = root.querySelector(sel);
    if (!el) throw new Error(`Missing ${sel}`);
    return el;
  };
  /** @param {unknown} s @returns {string} */
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"]/g,
      (c) => /** @type {Record<string, string>} */ ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
    );

  /** @type {Payload} */
  const D = JSON.parse($("geobrief-data").textContent ?? "{}");

  const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  const MO_SHORT = ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", "JUL.", "AUG.", "SEPT.", "OCT.", "NOV.", "DEC."];
  /** Days since epoch for an ISO date. @param {string} s @returns {number} */
  const day = (s) => {
    const [y, m, d] = s.slice(0, 10).split("-").map(Number);
    return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / 864e5;
  };
  /** @param {number} n @returns {string} */
  const isoOf = (n) => new Date(n * 864e5).toISOString().slice(0, 10);
  /** @param {string} s @returns {string} */
  const fmtDate = (s) => {
    const [, m, d] = s.slice(0, 10).split("-").map(Number);
    return `${MONTHS[(m ?? 1) - 1] ?? ""} ${d ?? ""}`;
  };
  /** @param {string} tok @returns {string} */
  const cv = (tok) => `var(${tok})`;
  /**
   * Overall range of a price band: "lo-hi" or weighted sub-ranges "lo-hi:w|lo-hi:w".
   * @param {string} band @returns {[number, number] | null}
   */
  const bandRange = (band) => {
    if (!band) return null;
    const segs = band.split("|").map((part) => (part.split(":")[0] ?? "").split("-").map(Number));
    return [Math.min(...segs.map(([lo = 0]) => lo)), Math.max(...segs.map(([, hi = 0]) => hi))];
  };

  /** @type {Record<Group, string>} */
  const GROUP_COLORS = {
    limited_war: "--war",
    escalated_war: "--war-dark",
    mou_deal: "--calm",
    comprehensive_deal: "--calm-dark",
  };
  /** @param {string} k @returns {string} */
  const colorOf = (k) => GROUP_COLORS[/** @type {Group} */ (k)] ?? "--muted";
  /** @type {Record<Group, string>} */
  const GROUP_NAMES = {
    limited_war: "Limited war / Limbo",
    escalated_war: "Escalated war",
    mou_deal: "MOU-style deal",
    comprehensive_deal: "Comprehensive deal",
  };
  /** @type {Group[]} */
  const GROUP_ORDER = ["limited_war", "escalated_war", "mou_deal", "comprehensive_deal"];
  const election = D.brief.election_day;
  const WAR_START = "2026-02-28";

  // ---------- data shaping ----------
  /** @type {Map<string, Scenario>} */
  const meta = new Map(D.scenarios.map((s) => [`${s.horizon}:${s.scenario}`, s]));
  /** @param {string} horizon @param {string} key @returns {Scenario} */
  const scen = (horizon, key) => {
    const s = meta.get(`${horizon}:${key}`);
    if (!s) throw new Error(`Unknown scenario ${horizon}:${key}`);
    return s;
  };
  /** @param {string} horizon @returns {DateRow[]} */
  const byDate = (horizon) => {
    /** @type {Record<string, Record<string, number>>} */
    const m = {};
    for (const r of D.odds) if (r.horizon === horizon) (m[r.date] ??= {})[r.scenario] = r.p;
    return Object.keys(m)
      .sort()
      .map((date) => ({ date, v: m[date] ?? {} }));
  };
  const nov = byDate("nov3");
  const ye = byDate("ye2026");
  const latestNov = nov[nov.length - 1];
  const latestYe = ye[ye.length - 1];
  if (!latestNov || !latestYe) throw new Error("odds.csv has no nov3 or ye2026 rows");
  const prevNov = nov[nov.length - 2];
  /**
   * One update's odds summed into the four scenarios. Older updates used finer scenarios that each map to one
   * of the four; an update holding a row that maps to none (e.g. an unsplit war total) gives null throughout.
   * @param {Record<string, number>} v @param {string} [horizon] @returns {Record<Group, number | null>}
   */
  const groups = (v, horizon = "nov3") => {
    /** @type {Record<Group, number>} */
    const g = { limited_war: 0, escalated_war: 0, mou_deal: 0, comprehensive_deal: 0 };
    for (const [k, p] of Object.entries(v)) {
      const grp = meta.get(`${horizon}:${k}`)?.group;
      if (!grp) return { limited_war: null, escalated_war: null, mou_deal: null, comprehensive_deal: null };
      g[grp] += p;
    }
    return g;
  };
  /** @param {Record<string, number>} v @returns {string[]} */
  const keysByP = (v) => Object.keys(v).sort((a, b) => (v[b] ?? 0) - (v[a] ?? 0));
  /** @type {Map<string, Forecast>} */
  const latestF = new Map();
  for (const f of D.forecasts) {
    const cur = latestF.get(f.id);
    if (!cur || f.made_on >= cur.made_on) latestF.set(f.id, f);
  }
  const gasRows = [...D.gas].sort((a, b) => (a.date < b.date ? -1 : 1));
  const mkRows = [...D.markets].sort((a, b) => (a.date < b.date ? -1 : 1));
  const enRows = [...D.energy].sort((a, b) => (a.date < b.date ? -1 : 1));
  /**
   * Non-null readings of one numeric column, oldest first.
   * @template {{ date: string }} T
   * @param {T[]} rows
   * @param {(r: T) => number | null} get
   * @returns {Reading[]}
   */
  const readings = (rows, get) =>
    rows.flatMap((r) => {
      const v = get(r);
      return v == null ? [] : [{ date: r.date, v }];
    });
  /** @param {Reading[]} rs @param {number} [back] @returns {Reading | null} */
  const nth = (rs, back = 0) => rs[rs.length - 1 - back] ?? null;

  // ---------- generic line chart with hover ----------
  /** @param {HTMLElement} host @param {ChartOpts} o */
  function lineChart(host, o) {
    const W = 1000;
    const H = 400;
    const L = 40;
    const T = 20;
    const B = 370;
    const R = 900;
    const x0 = day(o.start);
    const x1 = day(o.end);
    /** @param {string} d */
    const X = (d) => L + ((day(d) - x0) / (x1 - x0)) * (R - L);
    /** @param {number} v */
    const Y = (v) => T + ((o.yMax - v) / (o.yMax - o.yMin)) * (B - T);
    const lastDate = o.dates[o.dates.length - 1] ?? o.start;
    const lastX = X(lastDate);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H + 10}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("tabindex", "0");
    svg.setAttribute("aria-label", `${o.label}. Use left and right arrow keys to read values by date.`);

    let h = `<rect x="${L}" y="${T}" width="${lastX - L}" height="${B - T}" style="fill:var(--panel)"/>`;
    // Tick labels go on top of the lines, with a halo in the panel colour so a line never runs through them.
    let tickText = "";
    for (const t of o.yTicks) {
      h += `<line x1="${L}" x2="${R}" y1="${Y(t)}" y2="${Y(t)}" style="stroke:var(--rule)"/>`;
      tickText += `<text x="${L + 4}" y="${Y(t) - 5}" font-size="13" paint-order="stroke" style="fill:var(--muted);stroke:var(--panel);stroke-width:4px;stroke-linejoin:round">${o.yFmt(t)}</text>`;
    }
    const d0 = new Date(x0 * 864e5);
    let y = d0.getUTCFullYear();
    let m = d0.getUTCMonth() + (d0.getUTCDate() === 1 ? 0 : 1);
    for (;;) {
      if (m > 11) {
        m = 0;
        y++;
      }
      const ms = `${y}-${String(m + 1).padStart(2, "0")}-01`;
      if (day(ms) > x1) break;
      h += `<line x1="${X(ms)}" x2="${X(ms)}" y1="${T}" y2="${B}" style="stroke:var(--bg)" stroke-width="1.5"/>`;
      h += `<text x="${X(ms)}" y="${B + 24}" font-size="13" text-anchor="middle" style="fill:var(--muted)">${MO_SHORT[m] ?? ""}</text>`;
      m++;
    }
    const endMark = o.endMark === undefined ? "Election Day" : o.endMark;
    if (endMark) {
      h += `<line x1="${R}" x2="${R}" y1="${T}" y2="${B}" style="stroke:var(--fg)" stroke-dasharray="3 4"/>`;
      h += `<text x="${R - 4}" y="${T + 16}" font-size="13" font-weight="600" text-anchor="end" style="fill:var(--fg)">${esc(endMark)}</text>`;
    }
    for (const v of o.vlines ?? []) {
      h += `<line x1="${X(v.date)}" x2="${X(v.date)}" y1="${T}" y2="${B}" style="stroke:var(--war)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      h += `<text x="${X(v.date) + 6}" y="${T + 16}" font-size="13" font-weight="700" style="fill:var(--war)">${esc(v.text)}</text>`;
    }
    for (const b of o.bands ?? []) {
      h += `<rect x="${R + 8}" y="${Y(b.hi)}" width="${b.w}" height="${Y(b.lo) - Y(b.hi)}" style="fill:${cv(b.color)}" fill-opacity=".9"><title>${esc(b.title)}</title></rect>`;
    }
    for (const s of o.series) {
      const pts = s.points.flatMap((p) => (p.v == null ? [] : [{ d: p.d, v: p.v }]));
      // Split into runs so a line never implies readings across a long gap.
      /** @type {{ d: string, v: number }[][]} */
      const runs = [];
      for (const p of pts) {
        const run = runs[runs.length - 1];
        const prev = run?.[run.length - 1];
        if (run && prev && day(p.d) - day(prev.d) <= (o.maxGap ?? Infinity)) run.push(p);
        else runs.push([p]);
      }
      for (const run of runs) {
        if (run.length < 2) continue;
        const line = run.map((p) => `${X(p.d).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
        h += `<polyline fill="none"${s.dash ? ` stroke-dasharray="${s.dash}"` : ""} stroke-width="${s.width ?? 3.5}" stroke-linejoin="round" stroke-linecap="round" style="stroke:${cv(s.color)}" points="${line}"/>`;
      }
      if (pts.length < 25) {
        for (const p of pts) h += `<circle cx="${X(p.d)}" cy="${Y(p.v)}" r="3.5" style="fill:${cv(s.color)}"/>`;
      }
    }
    h += tickText;
    h += `<line x1="${lastX}" x2="${lastX}" y1="${T - 6}" y2="${B}" style="stroke:var(--fg)" stroke-width="1.5"/>`;
    h += `<polygon points="${lastX - 7},${T - 14} ${lastX + 7},${T - 14} ${lastX},${T - 5}" style="fill:var(--fg)"/>`;
    // End labels, nudged apart so they never overlap.
    const labs = (o.endLabels ?? []).map((l) => ({ ...l, y: Y(l.v) })).sort((a, b) => a.y - b.y);
    labs.forEach((l, i) => {
      const prev = labs[i - 1];
      if (prev && l.y - prev.y < 34) l.y = prev.y + 34;
    });
    for (const l of labs) {
      h += `<circle cx="${lastX}" cy="${Y(l.v)}" r="6" style="fill:${cv(l.color)}"/>`;
      h += `<rect x="${lastX + 12}" y="${l.y - 14}" width="${l.boxW}" height="28" style="fill:${cv(l.color)}"/>`;
      h += `<text x="${lastX + 12 + l.boxW / 2}" y="${l.y + 6}" font-size="17" font-weight="700" text-anchor="middle" style="fill:var(--on-accent)">${esc(l.value)}</text>`;
      h += `<text x="${lastX + 20 + l.boxW}" y="${l.y + 6}" font-size="18" font-weight="600" style="fill:${cv(l.color)}">${esc(l.name)}</text>`;
    }
    h += `<g class="hover" style="display:none"><line y1="${T}" y2="${B}" style="stroke:var(--fg)" stroke-dasharray="2 3"/></g>`;
    h += `<rect class="hit" x="${L}" y="${T - 14}" width="${R - L}" height="${B - T + 14}" fill="transparent"/>`;
    svg.innerHTML = h;
    host.appendChild(svg);

    const badge = document.createElement("div");
    badge.className = "datebadge";
    badge.style.left = `${(lastX / W) * 100}%`;
    badge.textContent = fmtDate(lastDate);
    host.appendChild(badge);
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.hidden = true;
    host.appendChild(tip);

    const hov = /** @type {SVGGElement} */ (q(svg, ".hover"));
    const hline = q(hov, "line");
    const dots = o.series.map((s) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", "7");
      c.setAttribute("style", `fill:${cv(s.color)};stroke:var(--bg);stroke-width:2`);
      hov.appendChild(c);
      return c;
    });
    let idx = o.dates.length - 1;
    /** @param {number} i */
    const show = (i) => {
      idx = Math.max(0, Math.min(o.dates.length - 1, i));
      const d = o.dates[idx];
      if (d === undefined) return;
      const x = X(d);
      hov.style.display = "";
      hline.setAttribute("x1", String(x));
      hline.setAttribute("x2", String(x));
      let rowsHtml = "";
      o.series.forEach((s, k) => {
        const dot = dots[k];
        const p = s.points.find((pt) => pt.d === d);
        if (!dot) return;
        if (p && p.v != null) {
          dot.style.display = "";
          dot.setAttribute("cx", String(x));
          dot.setAttribute("cy", String(Y(p.v)));
          rowsHtml += `<div><span class="k" style="--c:${cv(s.color)}">${esc(s.name)}</span><span class="v">${o.yFmt(p.v, true)}</span></div>`;
        } else dot.style.display = "none";
      });
      tip.innerHTML = `<b>${fmtDate(d)}</b>${rowsHtml || '<div class="muted">No reading</div>'}`;
      tip.hidden = false;
      const hostW = host.clientWidth;
      const px = (x / W) * hostW;
      const tw = tip.offsetWidth;
      tip.style.left = `${Math.max(0, Math.min(hostW - tw, px > hostW * 0.6 ? px - tw - 14 : px + 14))}px`;
    };
    const hide = () => {
      hov.style.display = "none";
      tip.hidden = true;
    };
    /** @param {PointerEvent} evt @returns {number} */
    const nearest = (evt) => {
      const r = svg.getBoundingClientRect();
      const vx = ((evt.clientX - r.left) / r.width) * W;
      let best = 0;
      let bd = Infinity;
      o.dates.forEach((d, i) => {
        const dd = Math.abs(X(d) - vx);
        if (dd < bd) {
          bd = dd;
          best = i;
        }
      });
      return best;
    };
    const hit = q(svg, ".hit");
    hit.addEventListener("pointermove", (e) => show(nearest(/** @type {PointerEvent} */ (e))));
    hit.addEventListener("pointerdown", (e) => show(nearest(/** @type {PointerEvent} */ (e))));
    hit.addEventListener("pointerleave", (e) => {
      if (/** @type {PointerEvent} */ (e).pointerType === "mouse") hide();
    });
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        show(idx - 1);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        show(idx + 1);
        e.preventDefault();
      } else if (e.key === "Escape") hide();
    });
    svg.addEventListener("focus", () => show(idx));
    svg.addEventListener("blur", hide);

    if (o.annotations?.length) {
      const an = document.createElement("div");
      an.className = "annos";
      // Greedy rows: each caption takes the first row where it clears its neighbour by real pixel width;
      // a caption that fits no existing row opens a new one, so captions never overlap.
      host.appendChild(an);
      const hostW = host.clientWidth || W;
      const capW = matchMedia("(width <= 560px)").matches ? 84 : 112; // matches .annos div in styles.css
      const rightEdge = Array.from({ length: o.annoRows ?? 2 }, () => -Infinity);
      /** @type {HTMLDivElement[][]} */
      const rows = rightEdge.map(() => []);
      for (const a of [...o.annotations].sort((x, y) => day(x.date) - day(y.date))) {
        const left = (X(a.date) / W) * 100;
        const px = (left / 100) * hostW;
        let row = rightEdge.findIndex((r) => px - capW / 2 >= r + 4);
        if (row < 0) {
          row = rightEdge.length;
          rightEdge.push(-Infinity);
          rows.push([]);
        }
        rightEdge[row] = px + capW / 2;
        const el = document.createElement("div");
        el.style.left = `${left}%`;
        el.textContent = a.text;
        an.appendChild(el);
        rows[row]?.push(el);
      }
      // Stack rows by their tallest caption, since captions wrap to two lines on phones.
      let top = 0;
      for (const els of rows.filter((r) => r.length)) {
        for (const el of els) el.style.top = `${top}px`;
        top += Math.max(...els.map((el) => el.offsetHeight || 30)) + 6;
      }
      an.style.height = `${Math.max(30, top + 4)}px`;
    }
  }

  // ---------- panels ----------
  const latest = latestNov;
  const latestYeRow = latestYe;

  /**
   * Scenario-odds line chart for one horizon: one line per scenario.
   * @param {HTMLElement} el
   * @param {{ horizon: string, rows: DateRow[], end: string, endMark: string, byLabel: string, note: string }} o
   */
  function scenarioChart(el, o) {
    const cur = o.rows[o.rows.length - 1];
    if (!cur) return;
    const dates = o.rows.map((r) => r.date);
    const first = dates[0] ?? cur.date;
    const start = isoOf(Math.min(day(first), day(cur.date) - 35));
    const g = groups(cur.v, o.horizon);
    /** @type {Series[]} */
    const series = GROUP_ORDER.map((k) => ({
      name: GROUP_NAMES[k],
      color: GROUP_COLORS[k],
      width: 2.5,
      points: o.rows.map((r) => ({ d: r.date, v: groups(r.v, o.horizon)[k] })),
    }));
    /** @type {EndLabel[]} */
    const endLabels = GROUP_ORDER.map((k) => ({
      v: g[k] ?? 0,
      value: `${Math.round(g[k] ?? 0)}%`,
      name: GROUP_NAMES[k],
      color: GROUP_COLORS[k],
      boxW: 58,
    }));
    const maxV = Math.max(...series.flatMap((s) => s.points.map((p) => p.v ?? 0)));
    const yMax = Math.max(70, Math.ceil((maxV + 5) / 10) * 10);
    /** @type {number[]} */
    const ticks = [];
    for (let t = 0; t <= yMax - 10; t += 20) ticks.push(t);
    el.innerHTML =
      `<div class="controls"><div style="font-size:13px" class="muted">Probability of each outcome by ${esc(o.byLabel)}</div></div>` +
      '<div class="chart" style="margin-top:30px"></div>' +
      `<div class="note">${o.note}</div>`;
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: `Line chart of scenario probabilities by date through ${o.byLabel}`,
      start,
      end: o.end,
      dates,
      series,
      yMin: 0,
      yMax,
      yTicks: ticks,
      yFmt: (v, tip) => `${tip ? Math.round(v) : v}%`,
      endLabels,
      endMark: o.endMark,
    });
  }

  /** @param {HTMLElement} el */
  function oddsPanel(el) {
    scenarioChart(el, {
      horizon: "nov3",
      rows: nov,
      end: election,
      endMark: "Election Day",
      byLabel: "Nov. 3",
      note: "Each point is one update in odds.csv. Before Oct. 6 the odds used finer scenarios, summed here into the four; that split puts earlier deal odds under MOU-style. Lines start Oct. 4 because the Sept. 30 war split wasn’t recorded. Hover or tap the chart to read any date.",
    });
  }

  /** @typedef {"gas" | "diesel" | "brent" | "lng"} Fuel */
  /** @typedef {{ name: string, color: string, width?: number, dash?: string, pts: Reading[] }} FuelLine */
  /**
   * @typedef {object} FuelCfg
   * @property {string} label button text
   * @property {string} unit
   * @property {string} chartLabel
   * @property {() => FuelLine[]} lines
   * @property {(s: Scenario) => string} band
   * @property {number} dp decimals for prices
   * @property {number} [step] y-axis step; omitted = 25¢ or 50¢ by range
   * @property {[string, number, [string, number][]]} buckets "<" forecast id, its price, then ">=" ids and prices
   * @property {string} note
   */
  /** @param {(r: GasRow) => number | null} get @param {string} name @returns {FuelLine[]} */
  const gasLine = (get, name) => [{ name, color: "--fg", pts: readings(gasRows, get) }];
  const BANDS_NOTE =
    "Bars right of Election Day show each scenario’s Nov. 3 range; bar width is proportional to its probability. The ranges under the chart don’t overlap, so they sum to 100%.";
  /** @type {Record<Fuel, FuelCfg>} */
  const FUELS = {
    gas: {
      label: "Gas",
      unit: "AAA national regular, $ per gallon",
      chartLabel: "AAA national regular gas prices with Nov. 3 scenario price bands",
      lines: () => gasLine((r) => r.nat_regular, "Regular"),
      band: (sc) => sc.gas_band,
      dp: 2,
      buckets: [
        "gas_nat_lt400",
        4,
        [
          ["gas_nat_450", 4.5],
          ["gas_nat_475", 4.75],
          ["gas_nat_500", 5],
        ],
      ],
      note: `${BANDS_NOTE} Before Oct. 4 the series is backfilled from archived AAA pages, AAA’s weekly posts and news reports quoting AAA. Hover or tap to read any day.`,
    },
    diesel: {
      label: "Diesel",
      unit: "AAA national diesel, $ per gallon",
      chartLabel: "AAA national diesel prices with Nov. 3 scenario price bands",
      lines: () => gasLine((r) => r.nat_diesel, "Diesel"),
      band: (sc) => sc.diesel_band,
      dp: 2,
      buckets: [
        "gas_diesel_lt600",
        6,
        [
          ["gas_diesel_650", 6.5],
          ["gas_diesel_675", 6.75],
          ["gas_diesel_700", 7],
        ],
      ],
      note: `${BANDS_NOTE} Before Oct. 4 the series is backfilled from archived AAA pages, AAA’s weekly posts and news reports quoting AAA. Hover or tap to read any day.`,
    },
    brent: {
      label: "Brent",
      unit: "ICE Brent futures and EIA Brent spot, $ per barrel",
      chartLabel: "Brent crude futures and spot prices with Nov. 3 scenario price bands",
      lines: () => [
        { name: "Brent futures", color: "--fg", pts: readings(enRows, (r) => r.brent_front) },
        {
          name: "Brent spot (EIA)",
          color: "--muted",
          width: 2.5,
          dash: "1 5",
          pts: readings(enRows, (r) => r.brent_spot),
        },
      ],
      band: (sc) => sc.brent_band,
      dp: 2,
      step: 10,
      buckets: [
        "brent_lt90",
        90,
        [
          ["brent_100", 100],
          ["brent_110", 110],
          ["brent_120", 120],
        ],
      ],
      note: `${BANDS_NOTE} Bands and ranges are for the January contract, the front month on Nov. 3 after December expires Oct. 30; they sit about $3 under December for backwardation. Futures are the ICE front month, the price most headlines quote; spot is EIA’s daily Europe Brent FOB, which prices physical cargoes now and runs well above futures when prompt barrels are scarce. EIA spot lags a few days.`,
    },
    lng: {
      label: "LNG",
      unit: "Asian spot LNG (Platts JKM front month), $ per million Btu",
      chartLabel: "JKM Asian LNG prices with Nov. 3 scenario price bands",
      lines: () => [{ name: "JKM", color: "--fg", pts: readings(enRows, (r) => r.jkm_front) }],
      band: (sc) => sc.lng_band,
      dp: 2,
      step: 5,
      buckets: [
        "lng_jkm_lt20",
        20,
        [
          ["lng_jkm_25", 25],
          ["lng_jkm_28", 28],
          ["lng_jkm_31", 31],
        ],
      ],
      note: `${BANDS_NOTE} JKM is the Asian spot LNG benchmark and the one most exposed to Hormuz, since Qatar ships about a fifth of the world’s LNG through it. The series is the continuous front-month future, so it steps when the contract rolls mid-month; bands and ranges are for the December contract, the front month on Nov. 3.`,
    },
  };
  /** @type {Fuel} */
  let gasFuel = "gas";

  /** @param {HTMLElement} el */
  function gasPanel(el) {
    const cfg = FUELS[gasFuel];
    const lines = cfg.lines();
    const allDates = [...new Set(lines.flatMap((l) => l.pts.map((r) => r.date)))].sort();
    const lastDate = allDates[allDates.length - 1] ?? latest.date;
    const start = `${lastDate.slice(0, 4)}-01-01`;
    const dates = allDates.filter((d) => d >= start);
    /** @param {number} v */
    const money = (v) => `$${v.toFixed(cfg.dp)}`;
    /** @type {Series[]} */
    const series = lines.map((l) => ({
      name: l.name,
      color: l.color,
      ...(l.width ? { width: l.width } : {}),
      ...(l.dash ? { dash: l.dash } : {}),
      points: l.pts.filter((r) => r.date >= start).map((r) => ({ d: r.date, v: r.v })),
    }));
    const bands = scenarioBands(cfg.band, money);
    const vals = [
      ...series.flatMap((x) => x.points.flatMap((pt) => (pt.v == null ? [] : [pt.v]))),
      ...bands.flatMap((b) => [b.lo, b.hi]),
    ];
    const step = cfg.step ?? (Math.max(...vals) - Math.min(...vals) > 2.5 ? 0.5 : 0.25);
    const pad = step / 5;
    const yMin = Math.floor((Math.min(...vals) - pad) / step) * step;
    const yMax = Math.ceil((Math.max(...vals) + pad) / step) * step;
    /** @type {number[]} */
    const ticks = [];
    for (let t = yMin; t <= yMax - step + step / 25; t += step) ticks.push(Number(t.toFixed(2)));
    const [ltId, low, ge] = cfg.buckets;
    const legend = `<div class="legend" style="margin-top:10px">${lines
      .flatMap((l) => {
        const cur = nth(l.pts);
        if (!cur) return [];
        const sw = l.dash
          ? `background:repeating-linear-gradient(90deg,${cv(l.color)} 0 3px,transparent 3px 6px)`
          : `background:${cv(l.color)}`;
        return [
          `<span><span class="sw" style="${sw}"></span>${esc(l.name)} <b>${money(cur.v)}</b> <span class="muted">(${fmtDate(cur.date)})</span></span>`,
        ];
      })
      .join("")}</div>`;
    const ids = /** @type {Fuel[]} */ (Object.keys(FUELS));
    el.innerHTML =
      `<div class="controls"><div class="seg" role="group" aria-label="Price">${ids
        .map(
          (k) =>
            `<button type="button" id="seg-${k}" data-fuel="${k}" aria-pressed="${k === gasFuel}">${FUELS[k].label}</button>`,
        )
        .join("")}</div><div style="font-size:13px" class="muted">${esc(cfg.unit)}</div></div>` +
      legend +
      '<div class="chart" style="margin-top:30px"></div>' +
      priceBuckets(ltId, low, ge, cfg.step ? (v) => `$${v}` : money) +
      `<div class="note">${esc(cfg.note)}</div>`;
    for (const k of ids) {
      $(`seg-${k}`).onclick = () => {
        gasFuel = k;
        render();
      };
    }
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: cfg.chartLabel,
      start,
      end: election,
      dates,
      series,
      yMin,
      yMax,
      yTicks: ticks,
      yFmt: (v, tip) => (tip || step < 1 ? `$${v.toFixed(2)}` : `$${v.toFixed(0)}`),
      bands,
      ...(day(start) < day(WAR_START) ? { vlines: [{ date: WAR_START, text: "War begins" }] } : {}),
      maxGap: 21,
    });
  }

  /**
   * Nov. 3 price bands, one per current scenario, sized by its latest probability.
   * @param {(s: Scenario) => string} field
   * @param {(v: number) => string} f
   * @returns {Band[]}
   */
  function scenarioBands(field, f) {
    return Object.keys(latest.v).flatMap((k) => {
      const s = meta.get(`nov3:${k}`);
      const p = latest.v[k] ?? 0;
      const range = s ? bandRange(field(s)) : null;
      if (!s || !range) return [];
      const [lo, hi] = range;
      // Width scales with probability and fits the 92-unit gutter right of Election Day (100% → 88).
      return [{ lo, hi, w: Math.max(6, p * 0.88), color: colorOf(k), title: `${s.label}: ${f(lo)}–${f(hi)} (${p}%)` }];
    });
  }

  /**
   * Turns the "< low" and "≥ threshold" forecasts into non-overlapping price ranges that sum to 100%.
   * @param {string} ltId forecast id for "below low"
   * @param {number} low
   * @param {[string, number][]} ge forecast ids for "at or above" each threshold, ascending
   * @param {(v: number) => string} f price format
   * @returns {string}
   */
  function priceBuckets(ltId, low, ge, f) {
    const lt = latestF.get(ltId);
    const ps = ge.map(([id]) => latestF.get(id)?.p);
    if (!lt || ps.some((p) => p == null)) return "";
    const at = /** @type {number[]} */ (ps);
    const first = ge[0]?.[1] ?? low;
    const cells = [
      [`Under ${f(low)}`, lt.p],
      [`${f(low)}–${f(first)}`, 100 - lt.p - (at[0] ?? 0)],
      ...ge.map(([, t], i) => {
        const next = ge[i + 1];
        return next ? [`${f(t)}–${f(next[1])}`, (at[i] ?? 0) - (at[i + 1] ?? 0)] : [`${f(t)} or more`, at[i] ?? 0];
      }),
    ];
    return `<div class="figs">${cells
      .map(([label, p]) => `<div><small>${label} on Nov. 3</small><strong>${Math.round(Number(p))}%</strong></div>`)
      .join("")}</div>`;
  }

  /** Physical-supply data sources; the button picks which one the Gulf and Hormuz lines use. */
  const SUPPLY_SOURCES = {
    iea: { label: "IEA", unit: "IEA total oil: crude, NGLs and products." },
    kpler: { label: "Kpler", unit: "Kpler crude only." },
  };
  /** @typedef {keyof typeof SUPPLY_SOURCES} SupplySource */
  /** @type {SupplySource} */
  let supplySource = "iea";

  /**
   * Physical-supply series in draw order; the colour follows the series, never its rank.
   * @param {SupplySource} src
   */
  const supplySeries = (src) => [
    { key: `gulf_${src}`, name: "Gulf exports", color: "--fg", width: 3.5 },
    { key: `hormuz_${src}`, name: "Hormuz flows", color: "--war", width: 3 },
    { key: "eastwest", name: "East-West pipeline", color: "--calm", width: 2.5 },
  ];

  /** @param {HTMLElement} el */
  function supplyPanel(el) {
    const cols = supplySeries(supplySource);
    const keys = new Set(cols.map((c) => c.key));
    // Single-source readings stay in supply.csv for the record but aren't plotted until confirmed.
    const rowsS = D.supply
      .filter((r) => r.mbd != null && r.kind !== "unconfirmed" && keys.has(r.series))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    const dates = [...new Set(rowsS.map((r) => r.date))];
    const lastDate = dates[dates.length - 1] ?? D.brief.updated;
    /** @type {Series[]} */
    const series = cols.map((c) => ({
      name: c.name,
      color: c.color,
      width: c.width,
      points: rowsS.filter((r) => r.series === c.key).map((r) => ({ d: r.date, v: r.mbd })),
    }));
    // Same y-axis for both sources so switching doesn't rescale the chart.
    const maxV = Math.max(20, ...D.supply.map((r) => (r.kind !== "unconfirmed" ? (r.mbd ?? 0) : 0)));
    const yMax = Math.ceil((maxV + 1) / 5) * 5;
    /** @type {number[]} */
    const ticks = [];
    for (let t = 0; t < yMax; t += 5) ticks.push(t);
    const latestOf = cols.flatMap((c) => {
      const r = rowsS.filter((x) => x.series === c.key).pop();
      return r && r.mbd != null ? [{ c, r, v: r.mbd }] : [];
    });
    const legend = `<div class="legend" style="margin-top:10px">${latestOf
      .map(
        ({ c, r, v }) =>
          `<span><span class="sw" style="background:${cv(c.color)}"></span>${esc(c.name)} <b>${v.toFixed(1)}</b> <span class="muted">(${fmtDate(r.date)})</span></span>`,
      )
      .join("")}</div>`;
    const sn = D.supply_note;
    const note = sn
      ? `<div class="supply-note"><h3>${esc(sn.title)}</h3>${sn.lead}${sn.more ? `<details><summary>Full note</summary>${sn.more}</details>` : ""}</div>`
      : "";
    const ids = /** @type {SupplySource[]} */ (Object.keys(SUPPLY_SOURCES));
    el.innerHTML =
      `<div class="controls"><div class="seg" role="group" aria-label="Data source">${ids
        .map(
          (k) =>
            `<button type="button" id="src-${k}" aria-pressed="${k === supplySource}">${SUPPLY_SOURCES[k].label}</button>`,
        )
        .join(
          "",
        )}</div><div style="font-size:13px" class="muted">Million barrels a day. ${SUPPLY_SOURCES[supplySource].unit} Monthly averages are plotted mid-month; dots are individual readings.</div></div>` +
      legend +
      '<div class="chart" style="margin-top:30px"></div>' +
      note;
    for (const k of ids) {
      $(`src-${k}`).onclick = () => {
        supplySource = k;
        render();
      };
    }
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: `Line chart of Gulf exports, Hormuz flows (${SUPPLY_SOURCES[supplySource].label}) and Saudi East-West pipeline throughput since January`,
      start: "2026-01-01",
      end: isoOf(day(lastDate) + 30),
      dates,
      series,
      yMin: 0,
      yMax,
      yTicks: ticks,
      yFmt: (v, tip) => (tip ? `${v.toFixed(1)} mb/d` : v === ticks[ticks.length - 1] ? `${v} mb/d` : `${v}`),
      endMark: null,
      vlines: [{ date: WAR_START, text: "War begins" }],
    });
  }

  /** @param {Blink} b @returns {string} */
  const blinkDates = (b) => {
    if (!b.end_date || b.type === "pending") return fmtDate(b.date);
    const sameMonth = b.end_date.slice(5, 7) === b.date.slice(5, 7);
    return `${fmtDate(b.date)}–${sameMonth ? Number(b.end_date.slice(8)) : fmtDate(b.end_date)}`;
  };
  /** @type {Record<Blink["type"], [string, string]>} */
  const BLINK_TAGS = {
    blink: ["BLINK", "--limbo"],
    non_blink: ["CARRIED OUT", "--war"],
    pending: ["PENDING", "--war"],
    unscored: ["NOT SCORED", "--muted"],
  };

  /** @param {HTMLElement} el */
  function blinkPanel(el) {
    const s = day("2026-04-01");
    const e = day(D.brief.updated) + 14;
    /** @param {string} d */
    const P = (d) => 2 + ((Math.min(day(d), e) - s) / (e - s)) * 96;
    const tops = [8, 150, 38, 176];
    let h =
      '<div class="timeline" role="img" aria-label="Timeline of US threats since April: blinks, one non-blink, and Blink 10 pending"><div class="axis"></div>';
    D.blinks.forEach((b, i) => {
      if (b.type === "non_blink") {
        h += `<div class="band" style="left:${P(b.date)}%;width:${P(b.end_date) - P(b.date)}%"></div>`;
      } else {
        h += `<div class="mark" style="left:${P(b.date)}%;${b.type === "pending" ? "background:var(--war)" : ""}"></div>`;
      }
      const cls = b.type === "non_blink" ? "cap non-blink" : "cap";
      // Keep captions near either edge inside the chart instead of centring them on the mark.
      const pos = P(b.date);
      const shift = pos < 10 ? -15 : pos > 90 ? -85 : -50;
      h += `<div class="${cls}" style="left:${pos}%;top:${tops[i % 4] ?? 8}px;transform:translateX(${shift}%)">${esc(b.label)}</div>`;
    });
    for (let m = 3; m <= 11; m++) {
      const ms = `2026-${String(m + 1).padStart(2, "0")}-01`;
      if (day(ms) <= e) h += `<div class="mo" style="left:${P(ms)}%">${MO_SHORT[m] ?? ""}</div>`;
    }
    h += "</div>";
    const nb = D.blinks.filter((b) => b.type === "blink").length;
    h += `<ol class="blist" aria-label="Every US threat or deadline, oldest first">${D.blinks
      .map((b) => {
        const [tag, color] = BLINK_TAGS[b.type];
        return `<li><span class="when">${esc(blinkDates(b))}</span><span class="what"><b>${esc(b.label)}</b><span>${esc(b.detail)}</span></span><span class="tag" style="color:${cv(color)}">${tag}</span></li>`;
      })
      .join("")}</ol>`;
    h += `<div class="note" style="margin-top:12px">${nb} blinks, 1 threat carried out. Rubio’s three terms met so far: ${D.brief.blink10.rubio_met}.</div>`;
    el.innerHTML = h;
  }

  /** @param {HTMLElement} el */
  function tripPanel(el) {
    const order = { fired: 0, armed: 1, expired: 2 };
    const col = { fired: "--war", armed: "--calm", expired: "--muted" };
    const items = [...D.tripwires].sort((a, b) => order[a.status] - order[b.status]);
    el.innerHTML = `<div class="cols">${items
      .map(
        (t) =>
          `<div class="trip"><div class="st" style="color:${cv(col[t.status])}">${t.status.toUpperCase()}${t.fired_on ? ` · ${fmtDate(t.fired_on).toUpperCase()}` : ""}</div>` +
          `<div class="c"${t.status === "expired" ? ' style="color:var(--muted)"' : ""}>${esc(t.condition)}</div><div class="e">${esc(t.effect)}</div>` +
          (t.evidence ? `<div class="e" style="font-weight:400">${esc(t.evidence)}</div>` : "") +
          "</div>",
      )
      .join("")}</div>`;
  }

  /** @param {HTMLElement} el */
  function dealPanel(el) {
    el.innerHTML = `<div class="bars">${D.terms
      .map(
        (t) =>
          `<div class="row"><div>${esc(t.term)}${t.rubio ? ` <b>(Rubio #${t.rubio})</b>` : ""}</div><div class="track"><div class="fill" style="width:${t.p}%;background:${t.rubio ? "var(--calm)" : "var(--limbo)"}"></div></div><div class="pv">${t.p}%</div></div>`,
      )
      .join(
        "",
      )}<div class="note" style="margin-top:8px">Probability that each term is in a deal, if there is one. P(deal) is ${D.brief.deal_p.ye2026}% by end-2026 and ${D.brief.deal_p.ye2027}% by end-2027. Green marks Rubio’s three terms.</div></div>`;
  }

  /** @param {HTMLElement} el */
  function yePanel(el) {
    scenarioChart(el, {
      horizon: "ye2026",
      rows: ye,
      end: `${latestYeRow.date.slice(0, 4)}-12-31`,
      endMark: "Dec. 31",
      byLabel: "Dec. 31",
      note: "Each point is one update in odds.csv. The four year-end scenarios start Oct. 6; the earlier set had no limited/escalated war split. Hover or tap the chart to read any date.",
    });
  }

  /** @param {HTMLElement} el */
  function calPanel(el) {
    // Score the latest version of each forecast once; void ones (unscorable or replaced) are left out.
    const current = [...latestF.values()].filter((f) => f.outcome !== "void");
    const res = current.filter((f) => f.outcome === 0 || f.outcome === 1);
    const brier = res.length
      ? (res.reduce((a, f) => a + (f.p / 100 - Number(f.outcome)) ** 2, 0) / res.length).toFixed(3)
      : "—";
    /** @type {Map<number, number[]>} */
    const buckets = new Map();
    for (const f of res) {
      const b = Math.min(9, Math.floor(f.p / 10));
      buckets.set(b, [...(buckets.get(b) ?? []), Number(f.outcome)]);
    }
    const dots = [...buckets]
      .map(([b, xs]) => {
        const obs = xs.reduce((a, v) => a + v, 0) / xs.length;
        return `<circle cx="${30 + (b + 0.5) * 18}" cy="${190 - obs * 180}" r="${3 + Math.sqrt(xs.length) * 2}" style="fill:var(--war)"/>`;
      })
      .join("");
    const open = current.length - res.length;
    const next = current
      .filter((f) => f.outcome == null)
      .map((f) => f.resolves_on)
      .sort()[0];
    el.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:center" class="sans">' +
      `<svg viewBox="0 0 220 220" width="260" role="img" aria-label="Reliability plot" style="max-width:100%"><rect x="30" y="10" width="180" height="180" style="fill:var(--panel)"/><line x1="30" y1="190" x2="210" y2="10" style="stroke:var(--muted)" stroke-dasharray="4 4"/>${dots}` +
      '<text x="120" y="212" font-size="11" text-anchor="middle" style="fill:var(--muted)">FORECAST</text><text x="14" y="100" font-size="11" text-anchor="middle" transform="rotate(-90 14 100)" style="fill:var(--muted)">OBSERVED</text></svg>' +
      `<div style="display:flex;flex-direction:column;gap:8px"><div style="display:flex;gap:32px"><div><small class="muted">Brier score</small><div style="font-size:32px;font-weight:700">${brier}</div></div><div><small class="muted">Resolved</small><div style="font-size:32px;font-weight:700">${res.length}</div></div><div><small class="muted">Open</small><div style="font-size:32px;font-weight:700">${open}</div></div></div>` +
      `<div style="font-size:15px;max-width:380px">${res.length ? "Each dot is a bucket of forecasts; the closer to the diagonal, the better calibrated." : `No forecasts have resolved yet. The next ones resolve on ${next ? fmtDate(next) : "—"}.`}</div></div></div>`;
  }

  /** @type {Tab[]} */
  const TABS = [
    {
      id: "odds",
      label: "Scenario Odds",
      title: "The Odds Through Election Day",
      dek: "GeoBrief’s probability for each path to Nov. 3, re-derived after every material event. Four scenarios: limited and escalated war in orange, MOU-style and comprehensive deals in green.",
      render: oddsPanel,
    },
    {
      id: "gas",
      label: "Gas Prices",
      title: "Energy Prices Against The Scenarios",
      dek: "Gas, diesel, Brent crude and Asian LNG, each with the price range every scenario implies on Nov. 3. Pump prices rise 2–4¢ a day after a shock and fall 1–1.5¢ a day after it passes.",
      render: gasPanel,
    },
    {
      id: "supply",
      label: "Physical Supply",
      title: "How Much Oil Is Getting Out",
      dek: "",
      render: supplyPanel,
    },
    {
      id: "blinks",
      label: "TACO Tracker",
      title: "The TACO Tracker",
      sub: "Trump Always Chickens Out Tracker",
      dek: "Every US threat or deadline since April, and whether it was carried out. Announced threats are weak evidence; a quiet buildup of forces is the real warning sign.",
      render: blinkPanel,
    },
    {
      id: "tripwires",
      label: "Tripwires",
      title: "What Would Move The Odds",
      dek: "Observable events that would change the forecast, and by how much. Armed tripwires are checked on every run.",
      render: tripPanel,
    },
    {
      id: "deal",
      label: "Deal Terms",
      title: "What A Deal Would Likely Contain",
      dek: "If there is a deal, the probability that each term is in it.",
      render: dealPanel,
    },
    {
      id: "yearend",
      label: "Year-End",
      title: "Where Things Stand By Dec. 31",
      dek: "Probability of each outcome by the end of 2026.",
      render: yePanel,
    },
    {
      id: "calibration",
      label: "Calibration",
      title: "How Good Are These Forecasts?",
      dek: "Every forecast is dated and scored once it resolves, using the Brier score (lower is better).",
      render: calPanel,
    },
  ];
  /** @param {string | null | undefined} id @returns {id is string} */
  const isTab = (id) => TABS.some((t) => t.id === id);
  let tab = "odds";
  const hashTab = location.hash.slice(1);
  if (isTab(hashTab)) tab = hashTab;
  else {
    try {
      const saved = localStorage.getItem("gb-tab");
      if (isTab(saved)) tab = saved;
    } catch {
      // Storage can be blocked; the default tab is fine.
    }
  }

  function render() {
    const cur = TABS.find((t) => t.id === tab) ?? TABS[0];
    if (!cur) return;
    $("tabs").innerHTML = TABS.map(
      (t) =>
        `<button type="button" role="tab" id="tab-${t.id}" aria-selected="${t.id === tab}" data-tab="${t.id}">${t.label}</button>`,
    ).join("");
    $("panel-title").textContent = cur.title;
    $("panel-sub").textContent = cur.sub ?? "";
    $("panel-sub").hidden = !cur.sub;
    $("panel-dek").textContent = cur.dek;
    $("panel-dek").hidden = !cur.dek;
    const p = $("panel");
    p.innerHTML = "";
    cur.render(p);
    $("scenarios").hidden = tab !== "odds";
    $("ye-scenarios").hidden = tab !== "yearend";
    $("bet").hidden = tab !== "odds" && tab !== "yearend";
  }
  /** @param {string} id */
  const selectTab = (id) => {
    tab = id;
    try {
      localStorage.setItem("gb-tab", tab);
    } catch {
      // Storage can be blocked; the tab still switches.
    }
    render();
  };
  $("tabs").addEventListener("click", (e) => {
    const b = /** @type {HTMLElement | null} */ (/** @type {Element} */ (e.target).closest("button[data-tab]"));
    if (!b?.dataset.tab) return;
    selectTab(b.dataset.tab);
    const nb = document.getElementById(`tab-${tab}`);
    nb?.focus();
  });
  $("tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = TABS.findIndex((t) => t.id === tab) + (e.key === "ArrowRight" ? 1 : -1);
    const next = TABS[(i + TABS.length) % TABS.length];
    if (!next) return;
    selectTab(next.id);
    document.getElementById(`tab-${tab}`)?.focus();
    e.preventDefault();
  });

  // ---------- menu ----------
  const drawerItems = [
    ...TABS.map((t) => ({ href: "#odds", tab: t.id, name: t.label, sub: t.sub ?? t.title })),
    { href: "#scenarios", tab: "odds", name: "Scenario Table", sub: "Every path to Nov. 3 with gas and drivers" },
    { href: "#dispatches", tab: "", name: "Dispatches", sub: "The latest events" },
    { href: "#method", tab: "", name: "Method", sub: "How the odds are made and checked" },
  ];
  $("drawer-list").innerHTML = drawerItems
    .map(
      (d) =>
        `<li><a href="${d.href}"${d.tab ? ` data-tab="${d.tab}"` : ""}>${esc(d.name)}<small>${esc(d.sub)}</small></a></li>`,
    )
    .join("");
  const menuBtn = $("menu-btn");
  const drawer = $("drawer");
  /** @param {boolean} open */
  const setMenu = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", () => setMenu(drawer.hidden !== false));
  drawer.addEventListener("click", (e) => {
    const a = /** @type {HTMLElement | null} */ (/** @type {Element} */ (e.target).closest("a"));
    if (!a) return;
    if (a.dataset.tab) selectTab(a.dataset.tab);
    setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!drawer.hidden && !(/** @type {Element} */ (e.target).closest("header.top"))) setMenu(false);
  });

  // ---------- static sections ----------
  $("headline").textContent = D.brief.headline;
  // Count down from the reader's today (Eastern), not from the last update, so the number never goes stale.
  const todayET = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const daysLeft = day(election) - day(todayET);
  const countdown =
    daysLeft > 1
      ? `${daysLeft} days to Election Day`
      : daysLeft === 1
        ? "1 day to Election Day"
        : daysLeft === 0
          ? "Election Day"
          : "Election Day has passed";
  $("dateline").textContent = `Updated ${fmtDate(D.brief.updated)}, ${D.brief.updated.slice(0, 4)} · ${countdown}`;
  $("change-note").textContent = D.brief.change_note;
  $("scen-body").innerHTML = keysByP(latest.v)
    .map((k) => {
      const s = scen("nov3", k);
      const range = bandRange(s.gas_band);
      const band = range ? `$${range.map((v) => v.toFixed(2)).join("–")}` : "—";
      return `<tr><td style="font-weight:600"><span style="display:inline-block;width:12px;height:3px;vertical-align:middle;margin-right:8px;background:${cv(colorOf(k))}"></span>${esc(s.label)}</td><td class="num"><span class="pill" style="background:${cv(colorOf(k))}">${latest.v[k] ?? 0}%</span></td><td style="white-space:nowrap">${band}</td><td>${esc(s.driver)}</td></tr>`;
    })
    .join("");
  const prevYe = ye[ye.length - 2];
  $("ye-body").innerHTML = keysByP(latestYe.v)
    .map((k) => {
      const s = scen("ye2026", k);
      const p = latestYe.v[k] ?? 0;
      const was = prevYe?.v[k];
      const d = was == null ? "—" : p === was ? "Unch." : `${p > was ? "+" : "−"}${Math.abs(p - was)}`;
      return `<tr><td style="font-weight:600"><span style="display:inline-block;width:12px;height:3px;vertical-align:middle;margin-right:8px;background:${cv(colorOf(k))}"></span>${esc(s.label)}</td><td class="num"><span class="pill" style="background:${cv(colorOf(k))}">${p}%</span></td><td class="num" style="white-space:nowrap">${d}</td><td>${esc(s.driver)}</td></tr>`;
    })
    .join("");
  $("ye-note").textContent =
    `As of ${fmtDate(latestYe.date)}${prevYe ? `; change since ${fmtDate(prevYe.date)}` : ""}.`;
  $("bets").innerHTML = D.brief.bets
    .map((b) => `<div class="bet"><div class="c">${esc(b.cond)}</div><div class="e">${esc(b.effect)}</div></div>`)
    .join("");
  // Dispatches: newest first, older ones revealed a page at a time back to the start of the war.
  const DISP_FIRST = 6;
  const DISP_PAGE = 8;
  const dispAll = [...D.events].reverse();
  let dispShown = 0;
  const dispMore = /** @type {HTMLButtonElement} */ ($("disp-more"));
  /** @param {number} n */
  const showDispatches = (n) => {
    const next = dispAll.slice(dispShown, dispShown + n);
    $("disp").insertAdjacentHTML(
      "beforeend",
      next
        .map(
          (e) =>
            `<div class="disp"><div class="d">${fmtDate(e.date)}${e.date.slice(0, 4) === D.brief.updated.slice(0, 4) ? "" : `, ${e.date.slice(0, 4)}`}</div><div>${esc(e.text)}</div></div>`,
        )
        .join(""),
    );
    dispShown += next.length;
    const left = dispAll.length - dispShown;
    dispMore.hidden = left <= 0;
    dispMore.textContent = `Load ${Math.min(DISP_PAGE, left)} older dispatches (${left} left)`;
  };
  dispMore.addEventListener("click", () => showDispatches(DISP_PAGE));
  showDispatches(DISP_FIRST);

  // ---------- ticker ----------
  const gNow = groups(latest.v);
  const gPrev = prevNov ? groups(prevNov.v) : null;
  const escNow = gNow.escalated_war ?? 0;
  /** @param {number} a @param {number | null | undefined} b @param {number} dp @returns {[string, string]} */
  const delta = (a, b, dp) => {
    if (b == null) return ["", ""];
    const d = a - b;
    if (Math.abs(d) < 1e-9) return ["UNCH", "var(--tick-muted)"];
    return [`${d > 0 ? "▲" : "▼"}${Math.abs(d).toFixed(dp)}`, d > 0 ? "var(--tick-up)" : "var(--tick-down)"];
  };
  const natR = readings(gasRows, (r) => r.nat_regular);
  const nat = nth(natR);
  const natP = nth(natR, 1);
  const nyc = nth(readings(gasRows, (r) => r.nyc_regular));
  const dsl = nth(readings(gasRows, (r) => r.nat_diesel));
  // Brent: daily settles in energy.csv (the chart's series), not the occasional markets.csv readings.
  const brR = readings(enRows, (r) => r.brent_front);
  const br = nth(brR);
  const brP = nth(brR, 1);
  // Physical price: the newer of a Dated Brent reading (markets.csv, possibly a floor) and EIA spot (energy.csv).
  const datedM = mkRows.filter((r) => r.dated_brent != null).pop();
  const spotE = enRows.filter((r) => r.brent_spot != null).pop();
  const phys =
    datedM && (!spotE || datedM.date >= spotE.date)
      ? { date: datedM.date, v: Number(datedM.dated_brent), floor: Boolean(datedM.dated_floor), name: "DATED BRENT" }
      : spotE
        ? { date: spotE.date, v: Number(spotE.brent_spot), floor: false, name: "BRENT SPOT" }
        : null;
  const futOn = phys
    ? readings(enRows, (r) => r.brent_front)
        .filter((r) => r.date <= phys.date)
        .pop()
    : null;
  const warF = latestF.get("war_nov3");
  const rial = nth(readings(mkRows, (r) => r.rial_per_usd));
  const tw = { armed: 0, fired: 0, expired: 0 };
  for (const t of D.tripwires) tw[t.status]++;
  /** @type {[string, string, [string, string]][]} */
  const items = [
    ["ESCALATED WAR BY NOV. 3", `${Math.round(escNow)}%`, delta(escNow, gPrev?.escalated_war, 0)],
    ["DEAL BY YE", `${D.brief.deal_p.ye2026}%`, ["", ""]],
  ];
  if (warF) items.unshift(["WAR BY NOV. 3", `${warF.p}%`, ["", ""]]);
  if (br) items.push(["BRENT", `$${br.v.toFixed(2)}`, delta(br.v, brP?.v, 2)]);
  if (phys) {
    const gap = futOn ? phys.v - futOn.v : null;
    items.push([
      `${phys.name} (${fmtDate(phys.date).toUpperCase()})`,
      `${phys.floor ? ">" : ""}$${phys.v.toFixed(0)}`,
      gap != null && gap >= 5
        ? [`${phys.floor ? "AT LEAST " : ""}$${gap.toFixed(0)} OVER FUTURES`, "var(--tick-up)"]
        : ["", ""],
    ]);
  }
  if (nat) items.push(["AAA NATIONAL", `$${nat.v.toFixed(2)}`, delta(nat.v, natP?.v, 2)]);
  if (nyc) items.push(["NYC METRO", `$${nyc.v.toFixed(2)}`, ["", ""]]);
  if (dsl) items.push(["DIESEL", `$${dsl.v.toFixed(2)}`, ["", ""]]);
  if (rial) items.push(["RIAL", `${(rial.v / 1e6).toFixed(2)}M/$`, ["", ""]]);
  items.push([
    "BLINK #10",
    `${D.brief.blink10.blink} / ${D.brief.blink10.no_blink} / ${D.brief.blink10.unresolved}`,
    ["", ""],
  ]);
  items.push(["TRIPWIRES", `${tw.armed} ARMED`, [`${tw.fired} FIRED`, "var(--tick-up)"]]);
  const one = items
    .map(
      ([k, v, [d, c]]) =>
        `<span class="item"><span class="k">${k}</span> <span class="v">${v}</span> <span class="v" style="color:${c || "inherit"}">${d}</span></span>`,
    )
    .join("");
  $("ticker").innerHTML = `${one}<span aria-hidden="true" style="display:inline-flex">${one}</span>`;
  const tickerBtn = $("ticker-toggle");
  tickerBtn.addEventListener("click", () => {
    const paused = tickerBtn.getAttribute("aria-pressed") !== "true";
    tickerBtn.setAttribute("aria-pressed", String(paused));
    tickerBtn.setAttribute("aria-label", paused ? "Resume ticker" : "Pause ticker");
    tickerBtn.closest(".ticker")?.classList.toggle("paused", paused);
  });

  // Right-click (desktop) or long-press (touch) on the ticker opens a menu to disable it;
  // a "Show ticker" button in the footer brings it back. The choice persists.
  const tickerSec = /** @type {HTMLElement} */ (tickerBtn.closest(".ticker"));
  const tickMenu = $("ticker-menu");
  const tickerOn = $("ticker-on");
  /** @param {boolean} off */
  const setTickerOff = (off) => {
    tickerSec.hidden = off;
    tickerOn.hidden = !off;
    tickMenu.hidden = true;
    try {
      if (off) localStorage.setItem("gb-ticker", "off");
      else localStorage.removeItem("gb-ticker");
    } catch {
      // Storage can be blocked; the toggle still applies for this visit.
    }
  };
  try {
    if (localStorage.getItem("gb-ticker") === "off") setTickerOff(true);
  } catch {
    // Storage can be blocked; show the ticker.
  }
  /** @param {number} x @param {number} y */
  const openTickMenu = (x, y) => {
    tickMenu.hidden = false;
    const r = tickMenu.getBoundingClientRect();
    tickMenu.style.left = `${Math.max(8, Math.min(x, innerWidth - r.width - 8))}px`;
    tickMenu.style.top = `${Math.max(8, Math.min(y - r.height, innerHeight - r.height - 8))}px`;
    $("ticker-off").focus();
  };
  tickerSec.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openTickMenu(e.clientX, e.clientY);
  });
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let pressTimer;
  let longPressed = false;
  tickerSec.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      longPressed = false;
      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => {
        longPressed = true;
        openTickMenu(t.clientX, t.clientY);
      }, 550);
    },
    { passive: true },
  );
  const cancelPress = () => clearTimeout(pressTimer);
  tickerSec.addEventListener("touchmove", cancelPress, { passive: true });
  tickerSec.addEventListener("touchcancel", cancelPress);
  tickerSec.addEventListener("touchend", (e) => {
    cancelPress();
    // Swallow the tap that ends a long-press so it doesn't also pause the ticker.
    if (longPressed) e.preventDefault();
  });
  $("ticker-off").addEventListener("click", () => setTickerOff(true));
  tickerOn.addEventListener("click", () => setTickerOff(false));
  document.addEventListener("pointerdown", (e) => {
    if (!tickMenu.hidden && !tickMenu.contains(/** @type {Node} */ (e.target))) tickMenu.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") tickMenu.hidden = true;
  });
  addEventListener("scroll", () => (tickMenu.hidden = true), { passive: true });

  render();
})();
