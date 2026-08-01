// Shared chart scaffolding for the FTP scrollytelling scenes.
// Scenes build persistent SVGs and morph them; these helpers cover the
// parts every scene needs: theme colors, sized SVGs, axes, labels, and
// the synthetic account paths. All financial math lives in model.js.

import { tlpBps } from './model.js';

export function theme() {
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => (css.getPropertyValue(name) || '').trim() || fallback;
  return {
    asset: v('--ftp-asset', '#b5544a'),
    assetSoft: v('--ftp-asset-soft', '#e2bcb5'),
    liability: v('--ftp-liability', '#1d7fb0'),
    liabilitySoft: v('--ftp-liability-soft', '#b8cdd5'),
    spread: v('--ftp-spread', '#9c742a'),
    spreadSoft: v('--ftp-spread-soft', '#ead7ad'),
    income: v('--ftp-income', '#00897b'),
    ink: v('--ftp-ink', '#1a1a1a'),
    dim: v('--ftp-dim', 'rgba(28,26,22,0.52)'),
    grid: v('--ftp-grid', '#e7e2d8'),
    rule: v('--ftp-rule', '#2c2620'),
    ruleSoft: v('--ftp-rule-soft', '#c9c2b6'),
    surface: v('--ftp-paper-2', '#f9f7f3'),
  };
}

export const REDUCED = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const dur = ms => (REDUCED ? 0 : ms);

export const clamp01 = v => Math.max(0, Math.min(1, v));

// Map a beat's scroll progress onto a sub-range with hold zones at both
// ends, so sweeps finish before the step scrolls away. The scroller
// already holds beatT at 0 until the step card locks, so these margins
// are just cushion.
export const sweepT = (t, a = 0.04, b = 0.94) => clamp01((t - a) / (b - a));

// SVG sized to the holder's real pixels — viewBox matches, text is true-size.
export function makeSvg(d3, holder, margin = {}) {
  const m = { t: 14, r: 18, b: 28, l: 52, ...margin };
  const rect = holder.getBoundingClientRect();
  const W = Math.max(280, rect.width);
  const H = Math.max(140, rect.height);
  const svg = d3.select(holder).append('svg')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('width', '100%').attr('height', '100%');
  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);
  return { svg, g, w: W - m.l - m.r, h: H - m.t - m.b, W, H, m };
}

export function drawGrid(d3, g, y, w, T, ticks = 4) {
  return g.append('g').attr('class', 'ftp-gridlines')
    .selectAll('line').data(y.ticks(ticks)).join('line')
    .attr('x1', 0).attr('x2', w)
    .attr('y1', d => y(d)).attr('y2', d => y(d))
    .attr('stroke', T.grid).attr('stroke-width', 1);
}

export function drawXAxis(d3, g, x, h, fmtFn, tickVals) {
  const axis = tickVals ? d3.axisBottom(x).tickValues(tickVals) : d3.axisBottom(x).ticks(6);
  return g.append('g').attr('class', 'ftp-axis').attr('transform', `translate(0,${h})`)
    .call(axis.tickFormat(fmtFn).tickSize(0).tickPadding(9))
    .call(sel => sel.select('.domain').remove());
}

export function drawYAxis(d3, g, y, fmtFn, ticks = 4) {
  return g.append('g').attr('class', 'ftp-axis')
    .call(d3.axisLeft(y).ticks(ticks).tickFormat(fmtFn).tickSize(0).tickPadding(8))
    .call(sel => sel.select('.domain').remove());
}

// End-of-line labels with simple collision resolution.
export function endLabels(d3, g, items, w) {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < 14) sorted[i].y = sorted[i - 1].y + 14;
  }
  sorted.forEach(it => {
    g.append('text').attr('class', 'ftp-lbl')
      .attr('x', it.x != null ? it.x : w + 6).attr('y', it.y + 4)
      .attr('text-anchor', it.anchor || 'start')
      .attr('fill', it.color)
      .text(it.text);
  });
}

export function annot(g, x, y, text, { anchor = 'start', dy = 0, cls = 'ftp-annot', bubble = false, target = null } = {}) {
  const lines = Array.isArray(text) ? text : [text];
  const holder = bubble ? g.append('g') : g;
  const t = holder.append('text').attr('class', cls)
    .attr('x', x).attr('y', y + dy).attr('text-anchor', anchor);
  lines.forEach((line, i) => {
    t.append('tspan').attr('x', x).attr('dy', i === 0 ? 0 : 13).text(line);
  });
  // Bubble mode: a paper chip behind the text so callouts stay readable
  // when they sit on top of lines, plus an optional leader to the point
  // they describe.
  if (bubble) {
    const bb = t.node().getBBox();
    const pad = 5;
    if (target) {
      const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
      holder.insert('line', 'text')
        .attr('x1', cx).attr('y1', cy).attr('x2', target[0]).attr('y2', target[1])
        .attr('stroke', 'rgba(44,38,32,0.4)').attr('stroke-width', 1);
    }
    holder.insert('rect', 'text')
      .attr('x', bb.x - pad).attr('y', bb.y - pad + 1)
      .attr('width', bb.width + pad * 2).attr('height', bb.height + pad * 2 - 2)
      .attr('rx', 4)
      .attr('fill', 'rgba(249,247,243,0.94)')
      .attr('stroke', 'rgba(44,38,32,0.18)').attr('stroke-width', 1);
    return holder;
  }
  return t;
}

export function legendRow(el, items) {
  el.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('span');
    li.className = 'ftp-viz__key';
    li.innerHTML = `<i style="background:${item.color}"></i>${item.label}`;
    el.appendChild(li);
  });
}

export const fmt = {
  k: d => '$' + Math.round(d / 1000) + 'k',
  yr: d => 'Y' + d,
  pct: d => d + '%',
  tenor: d => (d < 1 ? Math.round(d * 12) + 'm' : d + 'y'),
  moYr: d => (d / 12) + 'y',
  money: d => (d < 0 ? '−$' : '$') + Math.abs(Math.round(d)).toLocaleString(),
};

export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// A single synthetic deposit account, normalized to opening balance = 1.
export function accountPath(seed, months, { vol = 0.10, drift = 0, events = [], closeAt = null } = {}) {
  const rand = mulberry32(seed);
  const out = []; let bal = 1;
  for (let m = 0; m < months; m++) {
    if (closeAt != null && m >= closeAt) { out.push(0); continue; }
    bal *= 1 + drift + (rand() - 0.5) * vol;
    const ev = events.find(e => e.m === m);
    if (ev) bal *= ev.mult;
    bal = Math.max(0.02, bal);
    out.push(bal);
  }
  return out;
}

export function chaosAccounts(n, months, baseSeed, vol) {
  const paths = [];
  const rand = mulberry32(baseSeed);
  for (let i = 0; i < n; i++) {
    const kind = i % 5;
    const seed = baseSeed + i * 7919;
    if (kind === 0) paths.push(accountPath(seed, months, { vol, drift: 0.012, events: [{ m: 30 + (i % 20), mult: 0.35 }] }));
    else if (kind === 1) paths.push(accountPath(seed, months, { vol: vol * 1.6, drift: 0.002, events: [{ m: 18, mult: 1.9 }, { m: 44, mult: 0.5 }] }));
    else if (kind === 2) paths.push(accountPath(seed, months, { vol: vol * 0.5, drift: -0.004 }));
    else if (kind === 3) paths.push(accountPath(seed, months, { vol, drift: 0.006, closeAt: 30 + Math.floor(rand() * (months - 34)) }));
    else paths.push(accountPath(seed, months, { vol: vol * 0.8, drift: -0.012 }));
  }
  return paths;
}

// Interpolate a {tenor, rate}[] curve in log-tenor space (matches the
// plotted log x scale).
export function interpCurve(curve, tenor) {
  if (tenor <= curve[0].tenor) return curve[0].rate;
  if (tenor >= curve[curve.length - 1].tenor) return curve[curve.length - 1].rate;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].tenor >= tenor) {
      const a = curve[i - 1], b = curve[i];
      const t = (Math.log(tenor) - Math.log(a.tenor)) / (Math.log(b.tenor) - Math.log(a.tenor));
      return a.rate + t * (b.rate - a.rate);
    }
  }
  return curve[curve.length - 1].rate;
}

// Term liquidity premium in bps — delegated to the model so the plotted
// curve and every derived number share one definition.
export function tlpAt(_DATA, tenor) {
  return tlpBps(tenor);
}
