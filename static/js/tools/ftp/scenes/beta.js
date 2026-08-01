// Scene: the beta twist — how much of a market move reaches the customer.
// Views: Fed vs. checking-rate history → the beta spectrum → the split
// credit diagram (term piece + overnight piece → the spread holds).
// The split numbers come from the model, so they always foot.

import {
  theme, makeSvg, drawGrid, drawXAxis, drawYAxis, annot, legendRow, fmt,
} from '../chart-kit.js';
import { DERIVED } from '../model.js';

export function mountBetaScene({ d3, el, DATA }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('beta');
  el.innerHTML = `
    <div class="ftp-viz__legend beta__legend"></div>
    <div class="loan__plot beta__plot"></div>
    <div class="deposits__caption beta__caption"></div>`;
  const legendEl = el.querySelector('.beta__legend');
  const plotEl = el.querySelector('.beta__plot');
  const captionEl = el.querySelector('.beta__caption');

  let view = null;

  function freshPlot() {
    plotEl.innerHTML = '';
    plotEl.classList.remove('is-in');
    void plotEl.offsetWidth;
    plotEl.classList.add('is-in');
  }

  function buildFed() {
    freshPlot();
    const ch = makeSvg(d3, plotEl, { l: 42, t: 20 });
    const x = d3.scaleLinear().domain([0, 8]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 6]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T);
    drawXAxis(d3, ch.g, x, ch.h, fmt.yr, [0, 2, 4, 6, 8]);
    drawYAxis(d3, ch.g, y, fmt.pct);
    const fed = [[0, 1.0], [1.5, 1.0], [1.75, 2.0], [2, 3.0], [2.25, 4.0], [2.5, 4.75], [3, 5.25], [4.5, 5.25], [4.75, 4.75], [5, 4.25], [5.5, 3.75], [6, 3.25], [6.5, 3.0], [8, 3.0]];
    const chk = [[0, 0.15], [2, 0.15], [2.5, 0.35], [3, 0.62], [3.5, 0.85], [4.5, 1.00], [5.5, 0.85], [6.5, 0.68], [8, 0.60]];
    const step = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveStepAfter);
    const smooth = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveMonotoneX);
    ch.g.append('path').datum(fed).attr('d', step)
      .attr('fill', 'none').attr('stroke', T.ink).attr('stroke-width', 2);
    ch.g.append('path').datum(chk).attr('d', smooth)
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2.5);
    annot(ch.g, x(3.1) + 6, y(3.6), 'Fed: +425bps');
    annot(ch.g, x(4.6), y(1.45), 'checking: +85bps → β ≈ 0.20');
    legendRow(legendEl, [
      { color: T.ink, label: 'Fed Funds' },
      { color: T.liability, label: 'Checking rate paid' },
    ]);
    captionEl.textContent = '';
  }

  function buildSpectrum() {
    freshPlot();
    const ch = makeSvg(d3, plotEl, { l: 138, r: 74, t: 14, b: 14 });
    const B = DATA.BETA_DEFAULTS;
    const products = [
      { label: 'Checking', beta: B.checking },
      { label: 'MMDA', beta: B.mmda },
      { label: 'Savings', beta: B.savings },
      { label: 'High-yield online', beta: B.highYieldOnline },
      { label: 'Term CD', beta: B.termCD },
    ];
    const yBand = d3.scaleBand().domain(products.map(p => p.label)).range([0, ch.h]).paddingInner(0.42);
    const x = d3.scaleLinear().domain([0, 1]).range([0, ch.w]);
    const barH = Math.min(24, yBand.bandwidth());
    products.forEach(p => {
      const yPos = yBand(p.label) + (yBand.bandwidth() - barH) / 2;
      const split = x(1 - p.beta);
      ch.g.append('rect')
        .attr('x', 0).attr('y', yPos).attr('width', Math.max(0, split - 1)).attr('height', barH)
        .attr('rx', 3).attr('fill', T.spread).attr('opacity', 0.85);
      ch.g.append('rect')
        .attr('x', split + 1).attr('y', yPos).attr('width', Math.max(0, ch.w - split - 1)).attr('height', barH)
        .attr('rx', 3).attr('fill', T.liability).attr('opacity', 0.85);
      ch.g.append('text').attr('class', 'ftp-lbl')
        .attr('x', -10).attr('y', yPos + barH / 2 + 4)
        .attr('text-anchor', 'end').attr('fill', T.ink)
        .text(p.label);
      ch.g.append('text').attr('class', 'ftp-lbl')
        .attr('x', ch.w + 8).attr('y', yPos + barH / 2 + 4)
        .attr('fill', T.dim)
        .text('β = ' + p.beta.toFixed(2));
    });
    legendRow(legendEl, [
      { color: T.spread, label: 'Sticky — credited off the term curve' },
      { color: T.liability, label: 'Floating — credited at overnight' },
    ]);
    captionEl.textContent = 'the gold fraction is franchise value';
  }

  function buildSplit() {
    freshPlot();
    const D = DERIVED.deposit, O = DERIVED.curve.overnight;
    const ch = makeSvg(d3, plotEl, { l: 150, r: 30, t: 26, b: 18 });
    const x = d3.scaleLinear().domain([0, D.creditVal * 1.12]).range([0, ch.w]);
    const rows = [
      { y: 0.14, label: `FTP credit · ${D.credit}%`, segs: [
        { w: D.termLegVal, color: T.spread,
          lbl: `${D.betaTermPct}% × ${D.read}% ${D.walDisplay}-year · locked`, anchor: 'start' },
        { w: D.floatLegVal, color: T.liability,
          lbl: `${D.betaFloatPct}% × ${O}% overnight · floats`, anchor: 'end' },
      ] },
      { y: 0.52, label: `Rate paid · ${D.ratePaid}%`, segs: [
        { w: D.ratePaidVal, color: T.ruleSoft, lbl: 'what the customer receives', anchor: 'start' },
      ] },
    ];
    const barH = Math.min(34, ch.h * 0.2);
    rows.forEach(r => {
      const yPos = r.y * ch.h;
      ch.g.append('text').attr('class', 'ftp-lbl')
        .attr('x', -12).attr('y', yPos + barH / 2 + 4)
        .attr('text-anchor', 'end').attr('fill', T.ink).text(r.label);
      let cx = 0;
      r.segs.forEach(s => {
        ch.g.append('rect')
          .attr('x', x(cx) + (cx ? 1 : 0)).attr('y', yPos)
          .attr('width', Math.max(1, x(s.w) - 2)).attr('height', barH)
          .attr('rx', 3).attr('fill', s.color).attr('opacity', s.color === T.ruleSoft ? 0.7 : 0.85);
        ch.g.append('text').attr('class', 'ftp-lbl-sm')
          .attr('x', s.anchor === 'end' ? x(cx + s.w) : x(cx) + 8)
          .attr('text-anchor', s.anchor === 'end' ? 'end' : 'start')
          .attr('y', yPos + barH + 16)
          .attr('fill', T.dim).text(s.lbl);
        cx += s.w;
      });
    });
    // the spread brace
    const y1 = rows[0].y * ch.h + barH / 2;
    const y2 = rows[1].y * ch.h + barH / 2;
    const bx = x(D.creditVal * 1.06);
    ch.g.append('path')
      .attr('d', `M ${x(D.creditVal)} ${y1} H ${bx} V ${y2} H ${x(D.ratePaidVal)}`)
      .attr('fill', 'none').attr('stroke', T.ink).attr('stroke-width', 1.25).attr('opacity', 0.55);
    annot(ch.g, bx - 6, (y1 + y2) / 2 - 8, [`spread: ${D.spread}%`, 'held on BOTH pieces', 'when the Fed moves'], { anchor: 'end' });
    legendRow(legendEl, [
      { color: T.spread, label: 'Term piece — locked at origination' },
      { color: T.liability, label: 'Floating piece — moves with the Fed, like the rate paid' },
    ]);
    captionEl.textContent = `β = ${D.beta.toFixed(2)} checking · ${D.walDisplay}-year truncated life`;
  }

  return {
    update(beatId) {
      if (view === beatId) return;
      view = beatId;
      if (beatId === 'fed') buildFed();
      else if (beatId === 'spectrum') buildSpectrum();
      else if (beatId === 'split') buildSplit();
    },
  };
}
