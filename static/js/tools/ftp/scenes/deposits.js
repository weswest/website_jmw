// Scene: manufacturing a term — deposits.
//
// One pinned chart moves through the views: a single chaotic checking
// account, thirty accounts, the cohort average, a scroll-driven law-of-
// large-numbers convergence (scroll sets n), the product decay shapes,
// a scroll-scrubbed vintage stack, the truncation wall (where the
// behavioral life becomes defensible), and the statistical contract.
// Rebuild-with-crossfade between view families; scroll drives n and
// time inside the sweep beats. Decay curves and the WAL come from
// model.js.

import {
  theme, makeSvg, drawGrid, drawXAxis, drawYAxis, annot, legendRow,
  fmt, sweepT, mulberry32, chaosAccounts, accountPath,
} from '../chart-kit.js';
import { PARAMS, DERIVED, renewalBook } from '../model.js';

export function mountDepositsScene({ d3, el, DATA }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('deposits');
  el.innerHTML = `
    <div class="ftp-viz__legend deposits__legend"></div>
    <div class="deposits__counter" aria-hidden="true"></div>
    <div class="loan__plot deposits__plot"></div>
    <div class="deposits__caption"></div>`;
  const legendEl = el.querySelector('.deposits__legend');
  const counterEl = el.querySelector('.deposits__counter');
  const plotEl = el.querySelector('.deposits__plot');
  const captionEl = el.querySelector('.deposits__caption');

  const MONTHS = 84;
  let view = null;   // 'paths' | 'lln' | 'shapes' | 'vintages' | 'contract'
  let V = null;      // per-view refs

  function freshPlot() {
    plotEl.innerHTML = '';
    plotEl.classList.remove('is-in');
    // force reflow so the fade-in class re-triggers
    void plotEl.offsetWidth;
    plotEl.classList.add('is-in');
  }

  // ---- view: paths (one / thirty / average) --------------------------
  function buildPaths() {
    freshPlot();
    const ch = makeSvg(d3, plotEl, { l: 46, t: 16 });
    const x = d3.scaleLinear().domain([0, MONTHS]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 3.4]).range([ch.h, 0]);
    drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, [0, 12, 24, 36, 48, 60, 72, 84]);
    drawYAxis(d3, ch.g, y, d => Math.round(d * 100) + '%', 3);
    const line = d3.line().x((d, i) => x(i)).y(d => y(Math.min(3.35, d))).curve(d3.curveMonotoneX);

    const paths30 = chaosAccounts(30, MONTHS, 11, 0.14);
    const single = accountPath(1913, MONTHS, {
      vol: 0.16, drift: 0.02,
      events: [{ m: 18, mult: 1.6 }, { m: 33, mult: 0.45 }, { m: 52, mult: 1.5 }],
      closeAt: 71,
    });
    const avg = Array.from({ length: MONTHS }, (_, m) => d3.mean(paths30, p => p[m]));

    const others = ch.g.append('g');
    paths30.forEach((p, i) => {
      others.append('path').datum(p).attr('d', line)
        .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 1)
        .attr('opacity', 0).attr('data-i', i);
    });
    // path lengths, for the account-by-account draw in the thirty beat
    const lens = [];
    others.selectAll('path').each(function () { lens.push(this.getTotalLength()); });
    const singlePath = ch.g.append('path').datum(single).attr('d', line)
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2.25);
    const avgPath = ch.g.append('path').datum(avg).attr('d', line)
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 3).attr('opacity', 0);
    const annotG = ch.g.append('g');
    V = { ch, x, y, others, singlePath, avgPath, annotG, lens, last: null };
  }

  function paintPaths(beatId, t) {
    const { others, singlePath, avgPath, annotG, x, y, lens } = V;

    // The thirty beat draws each account's trajectory start-to-finish,
    // one after another, driven by scroll — thirty quick lives, lived
    // in front of you rather than materializing as a block.
    if (beatId === 'thirty') {
      if (V.last !== 'thirty') {
        V.last = 'thirty';
        annotG.selectAll('*').remove();
        annot(annotG, x(6), y(3.1), '30 accounts · 30 different lives');
        singlePath.interrupt().transition().duration(300).attr('opacity', 0.4).attr('stroke', T.liability).attr('stroke-width', 1);
        avgPath.interrupt().transition().duration(300).attr('opacity', 0);
        legendRow(legendEl, [{ color: T.liability, label: '30 checking accounts, opened the same quarter' }]);
        captionEl.textContent = 'scroll — each account’s history draws in turn';
      }
      const prog = sweepT(t) * 30;
      others.selectAll('path').each(function (_, i) {
        const p = d3.select(this);
        const L = lens[i];
        if (prog >= i + 1) {
          p.interrupt().attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
            .attr('opacity', 0.4).attr('stroke-width', 1).attr('stroke', T.liability);
        } else if (prog <= i) {
          p.interrupt().attr('opacity', 0);
        } else {
          const r = prog - i;
          p.interrupt().attr('stroke-dasharray', `${L} ${L}`).attr('stroke-dashoffset', L * (1 - r))
            .attr('opacity', 0.9).attr('stroke-width', 1.6).attr('stroke', T.liability);
        }
      });
      counterEl.innerHTML = `account <b>${Math.max(1, Math.min(30, Math.ceil(prog)))}</b> of 30`;
      return;
    }

    if (V.last === beatId) return;
    V.last = beatId;
    annotG.selectAll('*').remove();
    const clearDash = sel => sel.attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
    if (beatId === 'one') {
      clearDash(others.selectAll('path')).transition().duration(300).attr('opacity', 0);
      singlePath.transition().duration(300).attr('opacity', 1).attr('stroke', T.liability).attr('stroke-width', 2.25);
      avgPath.transition().duration(300).attr('opacity', 0);
      annot(annotG, x(33) + 10, y(0.72), 'sudden drawdown', { bubble: true, target: [x(33), y(0.55)] });
      annot(annotG, x(69), y(0.45), ['account', 'closes'], { anchor: 'end', bubble: true, target: [x(71), y(0.12)] });
      annot(annotG, x(6), y(3.1), 'one account · balance vs. opening balance');
      legendRow(legendEl, [{ color: T.liability, label: 'One checking account' }]);
    } else { // average
      clearDash(others.selectAll('path')).transition().duration(300).attr('opacity', 0.13).attr('stroke', T.ink);
      singlePath.transition().duration(300).attr('opacity', 0.13).attr('stroke', T.ink).attr('stroke-width', 1);
      avgPath.transition().duration(300).attr('opacity', 1);
      annot(annotG, x(48), y(1.7), 'the average is already a shape', { anchor: 'middle', bubble: true, target: [x(48), y(1.02)] });
      legendRow(legendEl, [
        { color: T.dim, label: 'Individual accounts' },
        { color: T.liability, label: 'Cohort average' },
      ]);
    }
    counterEl.textContent = '';
    captionEl.textContent = '';
  }

  // ---- view: law of large numbers (scroll drives n) ------------------
  function buildLln() {
    freshPlot();
    const ch = makeSvg(d3, plotEl, { l: 46, t: 16 });
    const decay = DATA.COHORT_SHAPES.checking;
    const x = d3.scaleLinear().domain([0, decay.length]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 1.75]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T, 3);
    drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, [0, 12, 24, 36, 48, 60, 72, 84]);
    drawYAxis(d3, ch.g, y, d => Math.round(d * 100) + '%', 3);
    ch.g.append('line').attr('x1', 0).attr('x2', ch.w).attr('y1', y(1)).attr('y2', y(1))
      .attr('stroke', T.grid).attr('stroke-width', 1);
    const line = d3.line().x((d, i) => x(i)).y(d => y(Math.max(0, Math.min(1.72, d)))).curve(d3.curveMonotoneX);
    const noisy = ch.g.append('path')
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2);
    const trueCurve = ch.g.append('path').datum(decay).attr('d', line)
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 4').attr('opacity', 0.4);
    V = { ch, x, y, line, noisy, decay };
    legendRow(legendEl, [{ color: T.liability, label: 'Checking cohort · average balance per account' }]);
    captionEl.textContent = '';
  }

  function paintLln(t) {
    const tt = sweepT(t);
    const n = Math.round(Math.pow(10, tt * 4));
    const noiseAmt = 0.55 / Math.sqrt(n);
    const rand = mulberry32(500 + 37);
    let rw = 0;
    const path = V.decay.map(v => {
      rw = rw * 0.86 + (rand() - 0.5) * noiseAmt;
      return Math.max(0, v * (1 + rw * 1.8));
    });
    V.noisy.datum(path).attr('d', V.line(path));
    counterEl.innerHTML = `n = <b>${n.toLocaleString()}</b> accounts`;
  }

  // ---- view: three decay shapes --------------------------------------
  function buildShapes() {
    freshPlot();
    const series = [
      { key: 'mmda', label: 'MMDA · half-life ≈ 2.5y', color: '#8fb6cc', hl: 30 },
      { key: 'savings', label: 'Savings · ≈ 3.6y', color: '#4a94bd', hl: 43 },
      { key: 'checking', label: 'Checking · hasn’t halved by year 7', color: '#135d86', hl: null },
    ];
    const ch = makeSvg(d3, plotEl, { l: 46, r: 20, t: 16 });
    const x = d3.scaleLinear().domain([0, MONTHS]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 1.3]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T, 3);
    drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, [0, 12, 24, 36, 48, 60, 72, 84]);
    drawYAxis(d3, ch.g, y, d => Math.round(d * 100) + '%', 3);
    const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);
    series.forEach(s => {
      const decay = DATA.COHORT_SHAPES[s.key];
      ch.g.append('path').datum(decay).attr('d', line)
        .attr('fill', 'none').attr('stroke', s.color).attr('stroke-width', 2.5);
      if (s.hl != null) {
        ch.g.append('circle')
          .attr('cx', x(s.hl)).attr('cy', y(decay[s.hl]))
          .attr('r', 4.5).attr('fill', s.color)
          .attr('stroke', T.surface).attr('stroke-width', 2);
      }
    });
    const chk = DATA.COHORT_SHAPES.checking;
    annot(ch.g, x(76), y(chk[83]) + 30, `${DERIVED.deposit.survivalPct}% still here`,
      { anchor: 'end', bubble: true, target: [x(83), y(chk[83]) + 4] });
    annot(ch.g, x(46), y(1.22), 'growth → peak → decay → a long, long tail', { anchor: 'middle' });
    legendRow(legendEl, series.map(s => ({ color: s.color, label: s.label })));
    counterEl.textContent = '';
    captionEl.textContent = 'dots mark each product’s half-life — checking never gets there inside the window';
  }

  // ---- view: the renewing book (scroll runs time forward) -------------
  // A mature SAVINGS book (half-life ≈ 3.6y) whose monthly runoff is
  // replaced by new accounts; each color is one year's vintage of new
  // money. Every layer shrinks; the total (from the model, flat by
  // construction) never moves. Scroll reveals the decade left-to-right.
  function buildVintages() {
    freshPlot();
    const book = renewalBook(10);
    const M = 120;
    const ch = makeSvg(d3, plotEl, { l: 48, t: 16, r: 20 });
    const x = d3.scaleLinear().domain([0, M]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 1.28]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T, 3);
    drawXAxis(d3, ch.g, x, ch.h, m => '+' + (m / 12) + 'y',
      ch.w < 500 ? [0, 24, 48, 72, 96, 120] : [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120]);
    drawYAxis(d3, ch.g, y, d => '$' + Math.round(d * 100) + 'M', 3);

    // back book stays blue; each year's vintage cycles through four
    // clearly-distinct hues, so adjacent layers never share a color.
    const VINT = ['#c9a227', '#7b5ea7', '#2e8b74', '#b5644a'];
    const color = i => (i === 0 ? '#135d86' : VINT[(i - 1) % VINT.length]);

    const keys = book.series.map(s => s.key);
    const rows = book.months.map(m => {
      const r = { m };
      book.series.forEach(s => { r[s.key] = s.values[m]; });
      return r;
    });
    const stacked = d3.stack().keys(keys)(rows);
    const area = d3.area()
      .x(d => x(d.data.m)).y0(d => y(d[0])).y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    const clipRect = ch.g.append('clipPath').attr('id', 'ftp-vint-clip')
      .append('rect').attr('x', 0).attr('y', 0).attr('height', ch.h).attr('width', 0);
    const lg = ch.g.append('g').attr('clip-path', 'url(#ftp-vint-clip)');
    stacked.forEach((s, i) => {
      lg.append('path').attr('d', area(s))
        .attr('fill', color(i)).attr('opacity', 0.82)
        .attr('stroke', T.surface).attr('stroke-width', 1);
    });
    lg.append('path').datum(book.total)
      .attr('d', d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', T.ink).attr('stroke-width', 2.5);

    // name the layers at the right edge (thick ones only), plus the flat total
    const lbls = ch.g.append('g').attr('opacity', 0);
    let acc = 0;
    book.series.forEach((s, i) => {
      const v = s.values[M];
      const yMid = y(acc + v / 2);
      acc += v;
      if (v > 0.06) {
        lbls.append('text').attr('class', 'ftp-lbl-sm')
          .attr('x', ch.w - 6).attr('y', yMid + 3).attr('text-anchor', 'end')
          .attr('fill', '#fff').attr('opacity', 0.92)
          .text(i === 0 ? 'back book' : `+${i}y`);
      }
    });
    annot(ch.g, x(58), y(1.16), 'every layer shrinks — the total never moves', { anchor: 'middle' });

    V = { clipRect, chw: ch.w, lbls };
    legendRow(legendEl, [
      { color: '#135d86', label: 'The back book' },
      { color: '#c9a227', label: 'Each new color · one year’s vintage of new accounts' },
      { color: T.ink, label: 'Total book' },
    ]);
    counterEl.textContent = '';
  }

  function paintVintages(t) {
    const tt = sweepT(t);
    V.clipRect.attr('width', tt * V.chw);
    V.lbls.attr('opacity', tt > 0.985 ? 1 : 0);
    counterEl.innerHTML = tt > 0.02 ? `year <b>${(tt * 10).toFixed(1)}</b> of 10` : '';
    captionEl.textContent = 'runoff replaced by new accounts, month by month — savings book, half-life ≈ 3.6y';
  }

  // ---- view: the truncation wall --------------------------------------
  // Where the behavioral life becomes defensible: without a cutoff the
  // decay tail runs forever; the 7-year wall converts it into a finite,
  // computable weighted-average life.
  function buildTruncate() {
    freshPlot();
    const decay = DATA.COHORT_SHAPES.checking;
    const WALL = PARAMS.deposit.truncationMonths;
    const EXT = 20; // months of "the math keeps going" shown past the wall
    const ch = makeSvg(d3, plotEl, { l: 46, r: 20, t: 16 });
    const x = d3.scaleLinear().domain([0, WALL + EXT]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 1.3]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T, 3);
    drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, [0, 24, 48, 72, 96]);
    drawYAxis(d3, ch.g, y, d => Math.round(d * 100) + '%', 3);

    // the tail the model would keep projecting, forever
    const ratio = decay[WALL] / decay[WALL - 1];
    const tail = d3.range(0, EXT + 1).map(i => decay[WALL] * Math.pow(ratio, i));
    ch.g.append('rect')
      .attr('x', x(WALL)).attr('width', ch.w - x(WALL)).attr('y', 0).attr('height', ch.h)
      .attr('fill', T.ink).attr('opacity', 0.05);
    ch.g.append('path').datum(tail)
      .attr('d', d3.line().x((d, i) => x(WALL + i)).y(d => y(d)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 5').attr('opacity', 0.6);

    // the area that IS the weighted-average life
    const area = d3.area().x((d, i) => x(i)).y0(ch.h).y1(d => y(d)).curve(d3.curveMonotoneX);
    ch.g.append('path').datum(decay).attr('d', area)
      .attr('fill', T.liability).attr('opacity', 0.10);
    ch.g.append('path').datum(decay)
      .attr('d', d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX))
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2.5);

    // the wall
    ch.g.append('line')
      .attr('x1', x(WALL)).attr('x2', x(WALL)).attr('y1', 0).attr('y2', ch.h)
      .attr('stroke', T.rule).attr('stroke-width', 2);
    ch.g.append('circle').attr('cx', x(WALL)).attr('cy', y(decay[WALL]))
      .attr('r', 4.5).attr('fill', T.liability).attr('stroke', T.surface).attr('stroke-width', 2);
    annot(ch.g, x(WALL) - 8, y(1.22), ['the wall: everything alive here', 'is called 7-year money'], { anchor: 'end' });
    annot(ch.g, x(WALL) - 10, y(decay[WALL]) + 34, [`${DERIVED.deposit.survivalPct}% still here`],
      { anchor: 'end', bubble: true, target: [x(WALL), y(decay[WALL]) + 5] });
    // right-aligned against the plot edge; on narrow screens the dim
    // region is too tight for it — the card carries the idea there
    if (ch.w >= 500) {
      annot(ch.g, ch.w - 8, y(0.30), ['without the wall,', 'the tail never ends'], { anchor: 'end', bubble: true });
    }

    // the WAL marker — the area under the truncated curve, as a tenor
    const walM = DERIVED.deposit.wal * 12;
    ch.g.append('line')
      .attr('x1', x(walM)).attr('x2', x(walM)).attr('y1', y(0)).attr('y2', y(1.05))
      .attr('stroke', T.spread).attr('stroke-width', 2);
    annot(ch.g, x(walM) - 10, y(0.16),
      [`weighted-average life ≈ ${DERIVED.deposit.walDisplay}y`,
       `(survivors alone: ${DERIVED.deposit.survivalPct}% × 7y = ${DERIVED.deposit.survivorFloor}y)`],
      { anchor: 'end', bubble: true, target: [x(walM), y(0.3)] });

    legendRow(legendEl, [
      { color: T.liability, label: 'Checking cohort decay (n = 10,000)' },
      { color: T.spread, label: `Weighted-average life ≈ ${DERIVED.deposit.walDisplay}y` },
    ]);
    counterEl.textContent = '';
    captionEl.textContent = 'the shaded area under the curve is the weighted-average life';
  }

  // ---- view: the statistical contract --------------------------------
  function buildContract() {
    freshPlot();
    const decay = DATA.COHORT_SHAPES.checking;
    const WALL = PARAMS.deposit.truncationMonths;
    const ch = makeSvg(d3, plotEl, { l: 46, r: 20, t: 16 });
    const x = d3.scaleLinear().domain([0, MONTHS]).range([0, ch.w]);
    const y = d3.scaleLinear().domain([0, 1.3]).range([ch.h, 0]);
    drawGrid(d3, ch.g, y, ch.w, T, 3);
    drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, [0, 12, 24, 36, 48, 60, 72, 84]);
    drawYAxis(d3, ch.g, y, d => Math.round(d * 100) + '%', 3);
    const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);
    ch.g.append('path').datum(decay).attr('d', line)
      .attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2.5);
    // the ladder that funds it: each rung sized to the MOST the cohort
    // holds during that year, so the steps always sit on or above the
    // curve; the last rung ends at the truncation wall.
    const stair = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveStepAfter);
    const stairData = d3.range(1, 8).map(yr => {
      const from = (yr - 1) * 12, to = Math.min(WALL, yr * 12);
      return [from, d3.max(decay.slice(from, to + 1))];
    });
    stairData.push([WALL, decay[WALL]]);
    ch.g.append('path').datum(stairData).attr('d', stair)
      .attr('fill', 'none').attr('stroke', T.spread).attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 5');
    ch.g.append('line')
      .attr('x1', x(WALL)).attr('x2', x(WALL)).attr('y1', y(0)).attr('y2', y(decay[WALL]))
      .attr('stroke', T.rule).attr('stroke-width', 2);
    annot(ch.g, x(40), y(1.18), ['fund it like the ladder in Chapter 2 —', 'rung for rung, out to the wall'], { anchor: 'middle' });
    annot(ch.g, x(60), y(0.30), [`term found ≈ ${DERIVED.deposit.walDisplay} years`], { anchor: 'middle' });
    legendRow(legendEl, [
      { color: T.liability, label: 'Checking cohort decay (n = 10,000)' },
      { color: T.spread, label: 'The notional funding ladder' },
    ]);
    counterEl.textContent = '';
    captionEl.textContent = 'rungs sized to the most the cohort holds each year';
  }

  // ---- dispatch ------------------------------------------------------
  const VIEW_OF = {
    one: 'paths', thirty: 'paths', average: 'paths',
    lln: 'lln', shapes: 'shapes', vintages: 'vintages',
    truncate: 'truncate', contract: 'contract',
  };

  return {
    update(beatId, beatT) {
      const v = VIEW_OF[beatId];
      if (!v) return;
      if (view !== v) {
        view = v;
        if (v === 'paths') buildPaths();
        else if (v === 'lln') buildLln();
        else if (v === 'shapes') buildShapes();
        else if (v === 'vintages') buildVintages();
        else if (v === 'truncate') buildTruncate();
        else buildContract();
      }
      if (v === 'paths') paintPaths(beatId, beatT);
      else if (v === 'lln') paintLln(beatT);
      else if (v === 'vintages') paintVintages(beatT);
    },
  };
}
