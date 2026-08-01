// Scene: the option you sold — asymmetric mortgage prepay risk.
//
// A behavioral paydown curve with a human-adjustable rate slider. Move
// the market mortgage rate and the pool's future rewrites itself:
// rates up → slightly fewer prepays, modest extension; rates down →
// refi wave, massive contraction. The average life stays inside a
// ~5.5–8y band (the model enforces it), but the asymmetry is vivid —
// and the meter under the chart prices it: the value of the prepay
// option the bank sold the borrower, which returns in the ledger as
// the "mortgage prepay" charge.
//
// Scroll drives the slider between story positions; grabbing the slider
// overrides scroll until the next beat.

import {
  theme, makeSvg, drawGrid, drawXAxis, drawYAxis, annot, legendRow, fmt, dur,
} from '../chart-kit.js';
import { PARAMS, DERIVED, mortgagePool, borrowerPaths, walOf, cprForScenario, optionCostBps } from '../model.js';

export function mountOptionScene({ d3, el }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('option');
  el.innerHTML = `
    <div class="ftp-viz__legend option__legend"></div>
    <div class="loan__plot option__plot"></div>
    <div class="option__controls">
      <div class="option__row">
        <span class="option__lbl">market mortgage rate</span>
        <input type="range" class="option__slider" min="-250" max="250" step="5" value="0"
               aria-label="Market mortgage rate scenario">
        <b class="option__rate"></b>
      </div>
      <div class="option__row option__row--meter">
        <span class="option__lbl">the borrower's option is worth</span>
        <div class="option__meter"><i></i></div>
        <b class="option__meter-val"></b>
      </div>
      <div class="option__hint">drag the slider — or keep scrolling and the story drives it</div>
    </div>
    <div class="ftp-readout option__readout"></div>`;
  const legendEl = el.querySelector('.option__legend');
  const plotEl = el.querySelector('.option__plot');
  const slider = el.querySelector('.option__slider');
  const rateEl = el.querySelector('.option__rate');
  const meterEl = el.querySelector('.option__meter i');
  const meterValEl = el.querySelector('.option__meter-val');
  const meterRow = el.querySelector('.option__row--meter');
  const readoutEl = el.querySelector('.option__readout');

  const note = PARAMS.mortgage.notePct;
  const schedBal = borrowerPaths().sched;
  const months = d3.range(0, 361);

  const ch = makeSvg(d3, plotEl, { t: 16, r: 18, b: 26, l: 52 });
  const x = d3.scaleLinear().domain([0, 360]).range([0, ch.w]);
  const y = d3.scaleLinear().domain([0, 115000]).range([ch.h, 0]);
  drawGrid(d3, ch.g, y, ch.w, T, 3);
  drawXAxis(d3, ch.g, x, ch.h, fmt.moYr, ch.w < 420 ? [0, 120, 240, 360] : [0, 60, 120, 180, 240, 300, 360]);
  drawYAxis(d3, ch.g, y, fmt.k, 3);
  const mkLine = bal => d3.line().x(m => x(m)).y(m => y(bal[m])).curve(d3.curveMonotoneX)(months);

  // contractual ghost + neutral-scenario reference + live scenario curve
  ch.g.append('path').attr('d', mkLine(schedBal))
    .attr('fill', 'none').attr('stroke', T.dim).attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 4').attr('opacity', 0.8);
  ch.g.append('path').attr('d', mkLine(DERIVED.mortgage.behavioral))
    .attr('fill', 'none').attr('stroke', T.asset).attr('stroke-width', 1.25).attr('opacity', 0.3);
  const livePath = ch.g.append('path')
    .attr('fill', 'none').attr('stroke', T.asset).attr('stroke-width', 2.5);
  const walLine = ch.g.append('line')
    .attr('y1', 0).attr('y2', ch.h).attr('stroke', T.spread).attr('stroke-width', 2);
  const walLbl = ch.g.append('text').attr('class', 'ftp-lbl')
    .attr('fill', T.spread).attr('y', 14);
  annot(ch.g, x(352), y(schedBal[130]), ['dashes: the contract', 'thin red: today’s expectation'], { anchor: 'end' });

  legendRow(legendEl, [
    { color: T.dim, label: 'Contractual amortization' },
    { color: T.asset, label: 'Behavioral balance · this scenario' },
    { color: T.spread, label: 'Average life' },
  ]);

  const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±');
  const fmtD = d0 => `${sign(d0)}${Math.abs(d0)}bps`;
  let meterOn = false; // the option calculus hasn't been introduced yet

  function render(d0, animate) {
    const bal = mortgagePool(cprForScenario(d0));
    const wal = walOf(bal);
    const opt = Math.round(optionCostBps(d0));
    const wm = wal * 12;
    const t = sel => (animate ? sel.transition().duration(dur(400)) : sel.interrupt());
    if (!livePath.attr('d')) livePath.attr('d', mkLine(bal));
    else t(livePath).attr('d', mkLine(bal));
    t(walLine).attr('x1', x(wm)).attr('x2', x(wm));
    t(walLbl).attr('x', x(wm) + 6);
    walLbl.text(`avg life ${wal.toFixed(1)}y`);
    rateEl.textContent = (note + d0 / 100).toFixed(2) + '%';
    meterEl.style.width = Math.min(100, opt) + '%';
    meterValEl.textContent = `≈ ${opt}bps/yr`;
    readoutEl.innerHTML =
      `<span>rates <b>${fmtD(d0)}</b></span>` +
      `<span>average life <b>${wal.toFixed(1)}y</b></span>` +
      (meterOn ? `<span class="ftp-readout__total">prepay option ≈ <b>${opt}bps/yr</b></span>` : '');
  }

  let userTouched = false;
  slider.addEventListener('input', () => {
    userTouched = true;
    render(+slider.value, false);
  });

  // Beat arc: the paydown story first (meter hidden — the reader only
  // watches the average life move), THEN the option-value calculus
  // activates: `penalty` introduces the priced option, `optvalue` drives
  // rates down with the meter live, `price` lands the FTP charge.
  const BEAT_TARGET = { meet: 0, falls: -150, rises: 150, penalty: 0, optvalue: -150, price: 0 };
  const METER_ON = new Set(['penalty', 'optvalue', 'price']);
  let currentBeat = null;

  render(0, false);
  meterRow.classList.add('is-off');

  return {
    update(beatId) {
      if (currentBeat === beatId) return;
      currentBeat = beatId;
      userTouched = false;
      meterOn = METER_ON.has(beatId);
      meterRow.classList.toggle('is-off', !meterOn);
      meterRow.classList.toggle('is-hot', beatId === 'optvalue' || beatId === 'price');
      const target = BEAT_TARGET[beatId];
      if (target == null || userTouched) return;
      slider.value = target;
      render(target, true);
    },
  };
}
