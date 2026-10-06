// @ts-check
"use strict";

/** @typedef {"war" | "limbo" | "calm"} Group */
/** @typedef {{ date: string, horizon: string, scenario: string, p: number, note: string }} OddsRow */
/** @typedef {{ horizon: string, scenario: string, label: string, group: Group, gas_band: string, brent_band: string, driver: string }} Scenario */
/** @typedef {{ date: string, source: string, nat_regular: number | null, nat_diesel: number | null, ny_regular: number | null, ny_diesel: number | null, nyc_regular: number | null, nyc_diesel: number | null }} GasRow */
/** @typedef {{ date: string, source: string, brent_ice_front: number | null, dated_brent: number | null, rial_per_usd: number | null }} MarketRow */
/** @typedef {{ id: string, made_on: string, question: string, p: number, resolves_on: string, resolution_rule: string, outcome: number | null, resolved_on: string, notes: string }} Forecast */
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
 * @property {(d: string) => string} [tipExtra]
 * @property {string | null} [endMark] label for the dashed line at the right edge (default "Election Day"; null for none)
 * @property {Annotation[]} [vlines] labelled vertical markers drawn inside the plot
 * @property {number} [annoRows] rows the annotation captions cycle through (default 2)
 * @property {number} [maxGap] break a line where consecutive readings are more than this many days apart
 */
/** @typedef {{ id: string, label: string, title: string, dek: string, render: (el: HTMLElement) => void }} Tab */
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

  /** @type {Record<string, string>} */
  const COLORS = {
    war_limited: "--war",
    war_infra: "--war-dark",
    war_sustained: "--war-light",
    war_total: "--war",
    war_resumed: "--war",
    limbo: "--limbo",
    half_open: "--calm",
    iran_folds: "--calm-light",
    deal: "--calm-dark",
  };
  /** @param {string} k @returns {string} */
  const colorOf = (k) => COLORS[k] ?? "--muted";
  /** @type {Record<Group, string>} */
  const GROUP_COLORS = { war: "--war", limbo: "--limbo", calm: "--calm" };
  /** @type {Record<Group, string>} */
  const GROUP_NAMES = { war: "War", limbo: "Limbo", calm: "De-escalation" };
  /** @type {Group[]} */
  const GROUP_ORDER = ["war", "calm", "limbo"];
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
  /** @param {Record<string, number>} v @returns {Record<Group, number>} */
  const groups = (v) => {
    /** @type {Record<Group, number>} */
    const g = { war: 0, limbo: 0, calm: 0 };
    for (const [k, p] of Object.entries(v)) {
      const s = meta.get(`nov3:${k}`);
      if (s) g[s.group] += p;
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
      tip.innerHTML = `<b>${fmtDate(d)}</b>${rowsHtml || '<div class="muted">No reading</div>'}${o.tipExtra ? o.tipExtra(d) : ""}`;
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
      // Greedy rows: each caption takes the first row where it clears its neighbour by real pixel width.
      const hostW = host.clientWidth || W;
      const capW = matchMedia("(width <= 560px)").matches ? 84 : 112; // matches .annos div in styles.css
      const rightEdge = Array.from({ length: o.annoRows ?? 2 }, () => -Infinity);
      let used = 1;
      for (const a of o.annotations) {
        const left = (X(a.date) / W) * 100;
        const px = (left / 100) * hostW;
        let row = rightEdge.findIndex((r) => px - capW / 2 >= r + 4);
        if (row < 0) row = rightEdge.indexOf(Math.min(...rightEdge));
        rightEdge[row] = px + capW / 2;
        used = Math.max(used, row + 1);
        const el = document.createElement("div");
        el.style.left = `${left}%`;
        el.style.top = `${row * 30}px`;
        el.textContent = a.text;
        an.appendChild(el);
      }
      an.style.height = `${used * 30 + 10}px`;
      host.appendChild(an);
    }
  }

  // ---------- panels ----------
  let all = false;
  const latest = latestNov;
  const latestYeRow = latestYe;

  /** @param {HTMLElement} el */
  function oddsPanel(el) {
    const dates = nov.map((r) => r.date);
    const first = dates[0] ?? latest.date;
    const start = isoOf(Math.min(day(first), day(latest.date) - 35));
    /** @type {Series[]} */
    let series;
    /** @type {EndLabel[]} */
    let endLabels = [];
    const g = groups(latest.v);
    if (!all) {
      series = GROUP_ORDER.map((k) => ({
        name: GROUP_NAMES[k],
        color: GROUP_COLORS[k],
        points: nov.map((r) => ({ d: r.date, v: groups(r.v)[k] })),
      }));
      endLabels = GROUP_ORDER.map((k) => ({
        v: g[k],
        value: `${Math.round(g[k])}%`,
        name: GROUP_NAMES[k],
        color: GROUP_COLORS[k],
        boxW: 58,
      }));
    } else {
      series = keysByP(latest.v).map((k) => ({
        name: scen("nov3", k).label,
        color: colorOf(k),
        width: 2.5,
        points: nov.map((r) => ({ d: r.date, v: r.v[k] ?? null })),
      }));
    }
    const maxV = Math.max(...series.flatMap((s) => s.points.map((p) => p.v ?? 0)));
    const yMax = Math.max(70, Math.ceil((maxV + 5) / 10) * 10);
    /** @type {number[]} */
    const ticks = [];
    for (let t = 0; t <= yMax - 10; t += 20) ticks.push(t);
    const annos = D.events.flatMap((e) =>
      e.chart && day(e.date) >= day(start) ? [{ date: e.date, text: e.chart }] : [],
    );
    const legend = all
      ? `<div class="legend" style="margin-top:10px">${keysByP(latest.v)
          .map(
            (k) =>
              `<span><span class="sw" style="background:${cv(colorOf(k))}"></span>${esc(scen("nov3", k).label)} <b>${latest.v[k] ?? 0}%</b></span>`,
          )
          .join("")}</div>`
      : "";
    el.innerHTML =
      `<div class="controls"><div class="seg" role="group" aria-label="Lines shown"><button type="button" id="seg-grouped" aria-pressed="${!all}">War / limbo / de-escalation</button><button type="button" id="seg-all" aria-pressed="${all}">All seven scenarios</button></div><div style="font-size:13px" class="muted">Probability of each outcome by Nov. 3</div></div>` +
      legend +
      '<div class="chart" style="margin-top:30px"></div>' +
      '<div class="note">Each point is one update in odds.csv. Sept. 30 values are reconstructed from the Oct. 4 changes, and the war split wasn’t recorded that day, so "All seven" starts Oct. 4. Hover or tap the chart to read any date.</div>';
    $("seg-grouped").onclick = () => {
      all = false;
      render();
    };
    $("seg-all").onclick = () => {
      all = true;
      render();
    };
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: "Line chart of scenario probabilities by date through Election Day",
      start,
      end: election,
      dates,
      series,
      yMin: 0,
      yMax,
      yTicks: ticks,
      yFmt: (v, tip) => `${tip ? Math.round(v) : v}%`,
      endLabels,
      annotations: annos,
    });
  }

  /** @type {"ytd" | "recent"} */
  let gasRange = "ytd";

  /** @param {HTMLElement} el */
  function gasPanel(el) {
    const allDates = gasRows.filter((r) => r.nat_regular != null).map((r) => r.date);
    const lastDate = allDates[allDates.length - 1] ?? latest.date;
    const start = gasRange === "ytd" ? `${lastDate.slice(0, 4)}-01-01` : isoOf(day(lastDate) - 45);
    const shown = gasRows.filter((r) => r.date >= start);
    const natR = readings(shown, (r) => r.nat_regular);
    const dslR = readings(gasRows, (r) => r.nat_diesel);
    const dates = allDates.filter((d) => d >= start);
    const nat = nth(natR);
    const dsl = nth(dslR);
    /** @type {Series[]} */
    const series = [{ name: "National", color: "--fg", points: shown.map((r) => ({ d: r.date, v: r.nat_regular })) }];
    const bands = Object.keys(latest.v).flatMap((k) => {
      const s = meta.get(`nov3:${k}`);
      const p = latest.v[k] ?? 0;
      if (!s?.gas_band) return [];
      const [lo = 0, hi = 0] = s.gas_band.split("-").map(Number);
      return [
        {
          lo,
          hi,
          w: Math.max(6, p * 2.2),
          color: colorOf(k),
          title: `${s.label}: $${lo.toFixed(2)}–${hi.toFixed(2)} (${p}%)`,
        },
      ];
    });
    const vals = [...natR.map((r) => r.v), ...bands.flatMap((b) => [b.lo, b.hi])];
    const yMin = Math.floor((Math.min(...vals) - 0.05) * 4) / 4;
    const yMax = Math.ceil((Math.max(...vals) + 0.05) * 4) / 4;
    /** @type {number[]} */
    const ticks = [];
    for (let t = yMin; t <= yMax - 0.24; t += 0.25) ticks.push(Number(t.toFixed(2)));
    const lines = ["gas_nat_450", "gas_nat_475", "gas_nat_500", "gas_nat_lt400", "gas_diesel_650"].flatMap((k) => {
      const f = latestF.get(k);
      return f ? [f] : [];
    });
    /** @param {string} name @param {string} color @param {Reading | null} r */
    const legendItem = (name, color, r) =>
      r
        ? `<span><span class="sw" style="background:${cv(color)}"></span>${esc(name)} <b>$${r.v.toFixed(2)}</b> <span class="muted">(${fmtDate(r.date)})</span></span>`
        : "";
    const legend =
      gasRange === "ytd"
        ? `<div class="legend" style="margin-top:10px">${legendItem("National", "--fg", nat)}</div>`
        : "";
    el.innerHTML =
      `<div class="controls"><div class="seg" role="group" aria-label="Date range"><button type="button" id="seg-ytd" aria-pressed="${gasRange === "ytd"}">Year to date</button><button type="button" id="seg-recent" aria-pressed="${gasRange === "recent"}">Last 45 days</button></div><div style="font-size:13px" class="muted">AAA regular, $ per gallon</div></div>` +
      legend +
      '<div class="chart" style="margin-top:30px"></div>' +
      `<div class="figs">${lines
        .map(
          (f) =>
            `<div><small>${esc(f.question.replace("AAA ", "").replace(" on Nov 3", ""))}</small><strong>${f.p}%</strong></div>`,
        )
        .join("")}</div>` +
      `<div class="note">Bars right of Election Day show each scenario’s Nov. 3 price range; bar width is proportional to its probability. Latest diesel: $${dsl ? dsl.v.toFixed(2) : "—"}. Before Oct. 4 the series is backfilled from AAA’s weekly posts and news reports quoting AAA (about twice a week). Hover or tap to read any day.</div>`;
    $("seg-ytd").onclick = () => {
      gasRange = "ytd";
      render();
    };
    $("seg-recent").onclick = () => {
      gasRange = "recent";
      render();
    };
    /** @type {EndLabel[]} */
    const endLabels = [];
    // Year to date leaves too little room right of "today" for end labels; the legend carries the values instead.
    if (gasRange === "recent" && nat) {
      endLabels.push({ v: nat.v, value: `$${nat.v.toFixed(2)}`, name: "National", color: "--fg", boxW: 66 });
    }
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: "AAA regular gas prices with Nov. 3 scenario price bands",
      start,
      end: election,
      dates,
      series,
      yMin,
      yMax,
      yTicks: ticks,
      yFmt: (v) => `$${v.toFixed(2)}`,
      bands,
      endLabels,
      ...(day(start) < day(WAR_START) ? { vlines: [{ date: WAR_START, text: "War begins" }] } : {}),
      maxGap: 21,
      tipExtra: (d) => {
        const r = dslR.find((q2) => q2.date === d);
        return r ? `<div><span>Diesel</span><span class="v">$${r.v.toFixed(2)}</span></div>` : "";
      },
    });
  }

  /** Physical-supply series in draw order; the colour follows the series, never its rank. */
  const SUPPLY_SERIES = [
    // Colour = what is measured; dotted = Kpler crude-only basis, solid = IEA total oil (crude, NGLs, products).
    { key: "gulf_iea", name: "Gulf exports · IEA total oil", color: "--fg", width: 3.5 },
    { key: "gulf_kpler", name: "Gulf exports · Kpler crude", color: "--fg", width: 2.5, dash: "1 5" },
    { key: "hormuz_iea", name: "Hormuz · IEA total oil", color: "--war", width: 3 },
    { key: "hormuz_kpler", name: "Hormuz · Kpler crude", color: "--war", width: 2.5, dash: "1 5" },
    { key: "eastwest", name: "East-West pipeline", color: "--calm", width: 2.5 },
  ];

  /** @param {HTMLElement} el */
  function supplyPanel(el) {
    const rowsS = D.supply.filter((r) => r.mbd != null).sort((a, b) => (a.date < b.date ? -1 : 1));
    const dates = [...new Set(rowsS.map((r) => r.date))];
    const lastDate = dates[dates.length - 1] ?? D.brief.updated;
    /** @type {Series[]} */
    const series = SUPPLY_SERIES.map((c) => ({
      name: c.name,
      color: c.color,
      width: c.width,
      ...(c.dash ? { dash: c.dash } : {}),
      points: rowsS.filter((r) => r.series === c.key).map((r) => ({ d: r.date, v: r.mbd })),
    }));
    const maxV = Math.max(20, ...rowsS.map((r) => r.mbd ?? 0));
    const yMax = Math.ceil((maxV + 1) / 5) * 5;
    /** @type {number[]} */
    const ticks = [];
    for (let t = 0; t < yMax; t += 5) ticks.push(t);
    const latestOf = SUPPLY_SERIES.flatMap((c) => {
      const r = rowsS.filter((x) => x.series === c.key).pop();
      return r && r.mbd != null ? [{ c, r, v: r.mbd }] : [];
    });
    const legend = `<div class="legend" style="margin-top:10px">${latestOf
      .map(
        ({ c, r, v }) =>
          `<span><span class="sw" style="${c.dash ? `background:repeating-linear-gradient(90deg,${cv(c.color)} 0 3px,transparent 3px 6px)` : `background:${cv(c.color)}`}"></span>${esc(c.name)} <b>${v.toFixed(1)}</b> <span class="muted">(${fmtDate(r.date)})</span></span>`,
      )
      .join("")}</div>`;
    const sn = D.supply_note;
    const note = sn
      ? `<div class="supply-note"><h3>${esc(sn.title)}</h3>${sn.lead}${sn.more ? `<details><summary>Full note</summary>${sn.more}</details>` : ""}</div>`
      : "";
    el.innerHTML =
      `<div class="controls"><div style="font-size:13px" class="muted">Million barrels a day. Monthly averages are plotted mid-month; dots are individual readings.</div></div>` +
      legend +
      '<div class="chart" style="margin-top:30px"></div>' +
      '<div class="note">Two bases, never mixed on one line: IEA counts total oil (crude, NGLs and products), Kpler counts crude only, so IEA runs higher. "Gulf exports" covers every route; "Hormuz" is only what passes the strait; the East-West pipeline carries Saudi crude to Yanbu on the Red Sea, bypassing it. Every point carries its source and vintage (hover or tap); revised figures replace preliminary ones (Kpler Sept. went from 12.8 to 16.3). Dots are readings; the lines between them are straight connections, not data, so a long stretch between dots (Hormuz May–July, the pipeline May–August) has no reading behind it. Totals did not dip during the Sept. 11–22 pipeline shutdown: Saudi Arabia rerouted crude through Hormuz (Ras Tanura and Juaymah loadings reached ~4 mb/d within a week; Saudi loadings hit 8.8 mb/d in the week to Sept. 27, per Kpler), which is why the Hormuz lines climb as the pipeline line drops to zero. The Oct. 4 Khurais strike is not plotted because its effect on flow is contested.</div>' +
      note;
    lineChart(/** @type {HTMLElement} */ (q(el, ".chart")), {
      label: "Line chart of Gulf crude exports, Hormuz flows and Saudi East-West pipeline throughput since January",
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
      annotations: D.supply_events.filter((e) => e.date !== WAR_START).map((e) => ({ date: e.date, text: e.label })),
      annoRows: 4,
      tipExtra: (d) =>
        rowsS
          .filter((r) => r.date === d)
          .map((r) => `<div class="src">${esc(r.source)}${r.note ? ` · ${esc(r.note)}` : ""}</div>`)
          .join(""),
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
    const l = latestYeRow;
    const st = ["deal_ye2027", "hormuz_20_ye2027", "nuke_deal_2026", "surge_ye2026"].flatMap((k) => {
      const f = latestF.get(k);
      return f ? [f] : [];
    });
    el.innerHTML =
      `<div class="bars">${keysByP(l.v)
        .map((k) => {
          const p = l.v[k] ?? 0;
          return `<div class="row"><div>${esc(scen("ye2026", k).label)}</div><div class="track" style="height:22px"><div class="fill" style="width:${p * 2}%;background:${cv(colorOf(k))}"></div></div><div class="pv">${p}%</div></div>`;
        })
        .join("")}</div>` +
      `<div class="figs" style="margin-top:16px">${st.map((f) => `<div><small>${esc(f.question)}</small><strong>${f.p}%</strong></div>`).join("")}</div>` +
      `<div class="note" style="margin-top:12px">As of ${fmtDate(l.date)}. Bars are scaled to 50%.</div>`;
  }

  /** @param {HTMLElement} el */
  function calPanel(el) {
    const res = D.forecasts.filter((f) => f.outcome === 0 || f.outcome === 1);
    const brier = res.length
      ? (res.reduce((a, f) => a + (f.p / 100 - (f.outcome ?? 0)) ** 2, 0) / res.length).toFixed(3)
      : "—";
    /** @type {Map<number, number[]>} */
    const buckets = new Map();
    for (const f of res) {
      const b = Math.min(9, Math.floor(f.p / 10));
      buckets.set(b, [...(buckets.get(b) ?? []), f.outcome ?? 0]);
    }
    const dots = [...buckets]
      .map(([b, xs]) => {
        const obs = xs.reduce((a, v) => a + v, 0) / xs.length;
        return `<circle cx="${30 + (b + 0.5) * 18}" cy="${190 - obs * 180}" r="${3 + Math.sqrt(xs.length) * 2}" style="fill:var(--war)"/>`;
      })
      .join("");
    const open = D.forecasts.length - res.length;
    const next = D.forecasts
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
      dek: "GeoBrief’s probability for each path to Nov. 3, re-derived after every material event. War scenarios are combined in orange; de-escalation (half-open, Iran folds, deal) in green.",
      render: oddsPanel,
    },
    {
      id: "gas",
      label: "Gas Prices",
      title: "Gas Prices Against The Scenarios",
      dek: "AAA national average regular, with the price range each scenario implies on Nov. 3. Prices rise 2–4¢ a day after a shock and fall 1–1.5¢ a day after it passes.",
      render: gasPanel,
    },
    {
      id: "supply",
      label: "Physical Supply",
      title: "How Much Oil Is Getting Out",
      dek: "Gulf crude exports, flows through the Strait of Hormuz and Saudi Arabia's East-West bypass pipeline, from January through the war. Ship counts aren't barrels, and a daily snapshot isn't a monthly average.",
      render: supplyPanel,
    },
    {
      id: "blinks",
      label: "Blink Count",
      title: "The Blink Count",
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
      dek: "Probability of each outcome by the end of 2026, plus the longer structural odds.",
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
    $("panel-dek").textContent = cur.dek;
    const p = $("panel");
    p.innerHTML = "";
    cur.render(p);
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
    ...TABS.map((t) => ({ href: "#odds", tab: t.id, name: t.label, sub: t.title })),
    { href: "#scenarios", tab: "", name: "Scenario Table", sub: "Every path to Nov. 3 with gas and drivers" },
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
  const daysLeft = day(election) - day(D.brief.updated);
  $("dateline").textContent =
    `Updated ${fmtDate(D.brief.updated)}, ${D.brief.updated.slice(0, 4)} · ${daysLeft} days to Election Day`;
  $("status").textContent = D.brief.status;
  $("change-note").textContent = D.brief.change_note;
  $("scen-body").innerHTML = keysByP(latest.v)
    .map((k) => {
      const s = scen("nov3", k);
      const band = s.gas_band
        ? `$${s.gas_band
            .split("-")
            .map((v) => Number(v).toFixed(2))
            .join("–")}`
        : "—";
      return `<tr><td style="font-weight:600"><span style="display:inline-block;width:12px;height:3px;vertical-align:middle;margin-right:8px;background:${cv(colorOf(k))}"></span>${esc(s.label)}</td><td class="num"><span class="pill" style="background:${cv(colorOf(k))}">${latest.v[k] ?? 0}%</span></td><td style="white-space:nowrap">${band}</td><td>${esc(s.driver)}</td></tr>`;
    })
    .join("");
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
  const brR = readings(mkRows, (r) => r.brent_ice_front);
  const br = nth(brR);
  const brP = nth(brR, 1);
  const dated = nth(readings(mkRows, (r) => r.dated_brent));
  const rial = nth(readings(mkRows, (r) => r.rial_per_usd));
  const tw = { armed: 0, fired: 0, expired: 0 };
  for (const t of D.tripwires) tw[t.status]++;
  /** @type {[string, string, [string, string]][]} */
  const items = [
    ["WAR BY NOV. 3", `${Math.round(gNow.war)}%`, delta(gNow.war, gPrev?.war, 0)],
    ["DEAL BY YE", `${D.brief.deal_p.ye2026}%`, ["", ""]],
  ];
  if (br) items.push(["BRENT", `$${br.v.toFixed(2)}`, delta(br.v, brP?.v, 2)]);
  if (dated) items.push(["DATED BRENT", `>$${dated.v.toFixed(0)}`, ["SQUEEZE", "var(--tick-up)"]]);
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

  render();
})();
