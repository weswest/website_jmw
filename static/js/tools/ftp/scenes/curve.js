// Scene: the price of time — FTP as three stacked ingredients.
//
//   FTP(t) = base rate (o/n SOFR)
//          + term liquidity premium (term SOFR − overnight)
//          + funding premium (what a bank pays over term SOFR)
//
// Beat arc: Treasuries (rates rise with tenor) → overlay term SOFR →
// circle the overnight anchor and name the base rate + TLP → a Fed-
// expectations breather (scroll morphs the curve through scenarios) →
// the two real funding taps (brokered vs FHLB) with a human mix slider
// → the assembled FTP curve swept by a read line that decomposes every
// price → the two Part-I reads. All numbers from model.js.

import {
  theme, makeSvg, drawGrid, drawXAxis, drawYAxis, annot, legendRow,
  fmt, sweepT,
} from '../chart-kit.js';
import {
  PARAMS, DERIVED, tsyPts, termSofrPts, ftpPts, CURVE_TENORS,
  termSofrRate, ftpRate, overnightSofr, fundingRate, fundingPremium,
  termSofrScenario,
} from '../model.js';

export function mountCurveScene({ d3, el }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('curve');
  el.innerHTML = `
    <div class="ftp-viz__legend curve__legend"></div>
    <div class="loan__plot curve__plot"></div>
    <div class="curve__mix" style="display:none">
      <span class="option__lbl">funding mix</span>
      <span class="curve__mix-end">all brokered</span>
      <input type="range" class="option__slider curve__mix-slider" min="0" max="100" step="1" value="50"
             aria-label="Funding mix between brokered CDs and FHLB advances">
      <span class="curve__mix-end">all FHLB</span>
    </div>
    <div class="ftp-readout curve__readout"></div>`;
  const legendEl = el.querySelector('.curve__legend');
  const plotEl = el.querySelector('.curve__plot');
  const mixRow = el.querySelector('.curve__mix');
  const mixSlider = el.querySelector('.curve__mix-slider');
  const readoutEl = el.querySelector('.curve__readout');

  const TENOR_TICKS = [0.083, 0.25, 0.5, 1, 2, 3, 5, 7, 10, 30];
  const ON = overnightSofr() / 100;

  const ch = makeSvg(d3, plotEl, { l: 46, r: 22, t: 18 });
  const SMALL = ch.w < 500;
  const x = d3.scaleLog().domain([0.083, 30]).range([0, ch.w]);
  const y = d3.scaleLinear().domain([0.026, 0.0555]).range([ch.h, 0]);
  drawGrid(d3, ch.g, y, ch.w, T, 4);
  drawXAxis(d3, ch.g, x, ch.h, fmt.tenor, SMALL ? [0.083, 1, 5, 30] : TENOR_TICKS);
  drawYAxis(d3, ch.g, y, d => (d * 100).toFixed(1) + '%', 4);

  const line = d3.line().x(d => x(d.tenor)).y(d => y(d.rate)).curve(d3.curveMonotoneX);
  const bandArea = d3.area().x(d => x(d.tenor)).y0(d => y(d.lo)).y1(d => y(d.hi)).curve(d3.curveMonotoneX);

  const sofrNeutral = termSofrPts;
  const brokPts = CURVE_TENORS.map(t => ({ tenor: t, rate: fundingRate(t, 0) / 100 }));
  const fhlbPts = CURVE_TENORS.map(t => ({ tenor: t, rate: fundingRate(t, 1) / 100 }));
  const blendPts = share => CURVE_TENORS.map(t => ({ tenor: t, rate: fundingRate(t, share) / 100 }));

  function curveLayer(pts, color, { dots = true, width = 2.5, dash = null } = {}) {
    const g = ch.g.append('g').attr('opacity', 0);
    const p = g.append('path').datum(pts).attr('d', line)
      .attr('fill', 'none').attr('stroke', color).attr('stroke-width', width);
    if (dash) p.attr('stroke-dasharray', dash);
    if (dots) {
      g.selectAll(null).data(pts).join('circle')
        .attr('cx', d => x(d.tenor)).attr('cy', d => y(d.rate))
        .attr('r', 4).attr('fill', color)
        .attr('stroke', T.surface).attr('stroke-width', 2);
    }
    return g;
  }

  // layers, bottom to top
  const tlpBand = ch.g.append('path').attr('fill', T.liability).attr('opacity', 0);
  const fpBand = ch.g.append('path').attr('fill', T.spread).attr('opacity', 0);
  const gTsy = curveLayer(tsyPts, T.dim, { dots: false, width: 1.75 });
  const gTsyBold = curveLayer(tsyPts, T.liability);
  const gBrok = curveLayer(brokPts, T.asset, { dots: false, width: 1.75, dash: '2 3' });
  const gFhlb = curveLayer(fhlbPts, T.income, { dots: false, width: 1.75, dash: '2 3' });
  const gSofr = curveLayer(sofrNeutral, T.liability, { dots: false });
  const sofrPath = gSofr.select('path');
  const gFtp = curveLayer(ftpPts, T.spread);
  const ftpPath = gFtp.select('path');
  const ftpDots = gFtp.selectAll('circle');

  // the overnight anchor: dotted base-rate line + a ring on the o/n point
  const onG = ch.g.append('g').attr('opacity', 0);
  const onLine = onG.append('line').attr('x1', 0).attr('x2', ch.w)
    .attr('stroke', T.ink).attr('stroke-width', 1.25).attr('stroke-dasharray', '3 5').attr('opacity', 0.65);
  const onRing = onG.append('circle').attr('r', 8.5)
    .attr('fill', 'none').attr('stroke', T.spread).attr('stroke-width', 2.5);
  const onLbl = onG.append('text').attr('class', 'ftp-lbl').attr('fill', T.ink).attr('opacity', 0.8);
  function setOnLevel(v) {
    onLine.attr('y1', y(v)).attr('y2', y(v));
    onRing.attr('cx', x(0.083)).attr('cy', y(v));
    onLbl.attr('x', ch.w - 4).attr('y', y(v) - 6).attr('text-anchor', 'end')
      .text(`base rate · o/n SOFR ${(v * 100).toFixed(2)}%`);
  }
  setOnLevel(ON);

  const annotG = ch.g.append('g');

  // read line
  const readG = ch.g.append('g').attr('opacity', 0);
  const readLine = readG.append('line').attr('y1', 0).attr('y2', ch.h)
    .attr('stroke', T.ink).attr('stroke-width', 1.5).attr('opacity', 0.6);
  const readDot = readG.append('circle').attr('r', 5.5)
    .attr('fill', T.spread).attr('stroke', T.surface).attr('stroke-width', 2);

  // fixed markers for the 'reads' beat — tenors and reads from the model
  const MW = DERIVED.mortgage, DW = DERIVED.deposit;
  const marksG = ch.g.append('g').attr('opacity', 0);
  [
    { tenor: MW.wal, label: [`mortgage · ${MW.walDisplay}y`, `charge ${MW.read}%`],
      ly: rate => y(rate) - 40, mob: [6, 14] },
    { tenor: DW.wal, label: [`checking cohort · ${DW.walDisplay}y`, `credit ${DW.read}%`],
      ly: () => y(0.0335), mob: [6, 46] },
  ].forEach(mk => {
    const rate = ftpRate(mk.tenor) / 100;
    marksG.append('line')
      .attr('x1', x(mk.tenor)).attr('x2', x(mk.tenor)).attr('y1', 0).attr('y2', ch.h)
      .attr('stroke', T.ink).attr('stroke-width', 1).attr('opacity', 0.35)
      .attr('stroke-dasharray', '3 4');
    marksG.append('circle')
      .attr('cx', x(mk.tenor)).attr('cy', y(rate)).attr('r', 5.5)
      .attr('fill', T.spread).attr('stroke', T.surface).attr('stroke-width', 2);
    // on narrow screens the labels stack in the empty top-left corner
    if (SMALL) annot(marksG, mk.mob[0], mk.mob[1], mk.label.join(' — '), { anchor: 'start' });
    else annot(marksG, x(mk.tenor) - 9, mk.ly(rate), mk.label, { anchor: 'end' });
  });

  const show = (sel, on, op = 1) => sel.transition().duration(350).attr('opacity', on ? op : 0);

  // band helpers (lo/hi in decimal rates)
  const setTlpBand = (sofrFn, onLevel) => {
    tlpBand.datum(CURVE_TENORS.map(t => ({ tenor: t, lo: onLevel, hi: sofrFn(t) })))
      .attr('d', bandArea);
  };
  const setFpBand = share => {
    fpBand.datum(CURVE_TENORS.map(t => ({ tenor: t, lo: termSofrRate(t) / 100, hi: fundingRate(t, share) / 100 })))
      .attr('d', bandArea);
  };
  setTlpBand(t => termSofrRate(t) / 100, ON);
  setFpBand(0.5);

  const pct = v => (v * 100).toFixed(2) + '%';

  // ---- the funding-mix slider ----------------------------------------
  function renderMix(share) {
    ftpPath.datum(blendPts(share)).attr('d', line);
    ftpDots.data(blendPts(share)).attr('cy', d => y(d.rate));
    setFpBand(share);
    fpBand.attr('opacity', 0.18);
    const fp5 = fundingRate(5, share) - termSofrRate(5);
    readoutEl.innerHTML =
      `<span>mix <b>${Math.round((1 - share) * 100)}% brokered · ${Math.round(share * 100)}% FHLB</b></span>` +
      `<span>funding premium at 5y <b>+${fp5.toFixed(2)}%</b></span>` +
      `<span class="ftp-readout__total">assumed funding · 5y <b>${fundingRate(5, share).toFixed(2)}%</b></span>`;
  }
  mixSlider.addEventListener('input', () => renderMix(+mixSlider.value / 100));

  // Reset the morphable pieces to the neutral world.
  function resetNeutral() {
    sofrPath.datum(sofrNeutral).attr('d', line);
    setOnLevel(ON);
    setTlpBand(t => termSofrRate(t) / 100, ON);
    ftpPath.datum(ftpPts).attr('d', line);
    ftpDots.data(ftpPts).attr('cy', d => y(d.rate));
    setFpBand(0.5);
  }

  // ---- Fed-expectation morph (scroll-driven) --------------------------
  // Keyframes: neutral → hikes → neutral → cuts. The o/n anchor, the
  // dotted base line, the term-SOFR curve, and the TLP band all move.
  const SC = PARAMS.curve.fedScenarios;
  const KEY = [SC[1], SC[0], SC[1], SC[2]]; // neutral, hikes, neutral, cuts
  function setFed(t) {
    const p = sweepT(t) * 3;
    const seg = Math.min(2, Math.floor(p));
    const frac = p - seg;
    const [a, b] = [KEY[seg], KEY[seg + 1]];
    const rate = tn => {
      const va = termSofrScenario(tn, a, 1);
      const vb = termSofrScenario(tn, b, 1);
      return (va + (vb - va) * frac) / 100;
    };
    const onNow = rate(0.083);
    sofrPath.datum(CURVE_TENORS.map(tn => ({ tenor: tn, rate: rate(tn) }))).attr('d', line);
    setOnLevel(onNow);
    setTlpBand(tn => rate(tn), onNow);
    const lbl = (frac < 0.5 ? a : b).label;
    readoutEl.innerHTML =
      `<span>the market’s view <b>${lbl}</b></span>` +
      `<span class="ftp-readout__total">o/n anchor <b>${pct(onNow)}</b> · 10y term SOFR <b>${pct(rate(10))}</b></span>`;
  }

  function setRead(t) {
    const tenor = Math.pow(10, Math.log10(1 / 12) + sweepT(t) * (Math.log10(30) - Math.log10(1 / 12)));
    const tlp = termSofrRate(tenor) / 100 - ON;
    const fp = fundingPremium(tenor) / 100;
    const all = ftpRate(tenor) / 100;
    readLine.attr('x1', x(tenor)).attr('x2', x(tenor));
    readDot.attr('cx', x(tenor)).attr('cy', y(all));
    readoutEl.innerHTML =
      `<span>term <b>${fmt.tenor(+tenor.toFixed(2))}</b></span>` +
      `<span>base <b>${pct(ON)}</b></span>` +
      `<span>+ TLP <b>${(tlp * 100).toFixed(2)}%</b></span>` +
      `<span>+ funding <b>${(fp * 100).toFixed(2)}%</b></span>` +
      `<span class="ftp-readout__total">FTP price <b>${pct(all)}</b></span>`;
  }

  const hideMix = () => { mixRow.style.display = 'none'; };

  const BEATS = {
    tsy() {
      show(gTsyBold, true); show(gTsy, false); show(gSofr, false); show(gFtp, false);
      show(gBrok, false); show(gFhlb, false); show(onG, false);
      show(tlpBand, false); show(fpBand, false); show(readG, false); show(marksG, false);
      hideMix();
      annotG.selectAll('*').remove();
      annot(annotG, x(0.1), y(0.051), 'US Treasuries — the risk-free floor');
      annot(annotG, x(2.6), y(0.0295), ['locked-away money costs more:', 'the upward slope is the term premium'], { anchor: 'middle' });
      legendRow(legendEl, [{ color: T.liability, label: 'US Treasury yields by tenor' }]);
      readoutEl.innerHTML = '';
    },
    sofr() {
      resetNeutral();
      show(gTsyBold, false); show(gTsy, true, 0.7); show(gSofr, true); show(gFtp, false);
      show(gBrok, false); show(gFhlb, false); show(onG, false);
      show(tlpBand, false); show(fpBand, false); show(readG, false); show(marksG, false);
      hideMix();
      annotG.selectAll('*').remove();
      annot(annotG, x(0.1), y(0.051), ['term SOFR — the market’s forecast of', 'overnight money, tenor by tenor']);
      annot(annotG, x(24), y(0.0335), ['only the overnight point is a', 'real transaction; the rest is', 'a traded projection'], { anchor: 'end' });
      legendRow(legendEl, [
        { color: T.dim, label: 'US Treasuries' },
        { color: T.liability, label: 'Term SOFR' },
      ]);
      readoutEl.innerHTML = '';
    },
    decompose() {
      resetNeutral();
      show(gTsyBold, false); show(gTsy, false); show(gSofr, true); show(gFtp, false);
      show(gBrok, false); show(gFhlb, false); show(onG, true);
      show(tlpBand, true, 0.2); show(fpBand, false); show(readG, false); show(marksG, false);
      hideMix();
      annotG.selectAll('*').remove();
      annot(annotG, x(0.115), y(0.0322), ['the circled point: overnight SOFR.', 'flatline it — that’s the BASE RATE'], { anchor: 'start' });
      annot(annotG, x(24), y(0.0435), ['the gap above the dotted line is the', 'TERM LIQUIDITY PREMIUM — the price', 'of locking money up, by tenor'], { anchor: 'end' });
      legendRow(legendEl, [
        { color: T.liability, label: 'Term SOFR' },
        { color: T.ink, label: 'Base rate · overnight, flatlined' },
        { color: T.liability, label: 'Shaded · term liquidity premium' },
      ]);
      readoutEl.innerHTML =
        `<span>base <b>${DERIVED.curve.onSofr}%</b></span>` +
        `<span class="ftp-readout__total">TLP at 5y <b>+${DERIVED.curve.tlpSplit5}%</b> · at 30y <b>+${((termSofrRate(30) - overnightSofr())).toFixed(2)}%</b></span>`;
    },
    fed(t) {
      show(gTsyBold, false); show(gTsy, false); show(gSofr, true); show(gFtp, false);
      show(gBrok, false); show(gFhlb, false); show(onG, true);
      show(tlpBand, true, 0.2); show(fpBand, false); show(readG, false); show(marksG, false);
      hideMix();
      annotG.selectAll('*').remove();
      legendRow(legendEl, [
        { color: T.liability, label: 'Term SOFR · reshaped by what the market expects of the Fed' },
        { color: T.ink, label: 'Base rate · moves too' },
      ]);
      setFed(t);
    },
    funding() {
      resetNeutral();
      show(gTsyBold, false); show(gTsy, false); show(gSofr, true, 0.55); show(gFtp, true);
      show(gBrok, true, 0.9); show(gFhlb, true, 0.9); show(onG, false);
      show(tlpBand, false); show(fpBand, true, 0.18); show(readG, false); show(marksG, false);
      mixRow.style.display = '';
      mixSlider.value = 50;
      annotG.selectAll('*').remove();
      if (!SMALL) {
        annot(annotG, x(26), y(fundingRate(30, 0) / 100 + 0.0012), 'brokered CDs — the expensive tap', { anchor: 'end' });
        annot(annotG, x(26), y(fundingRate(30, 1) / 100 - 0.0022), 'FHLB advances — the cheaper tap', { anchor: 'end', bubble: true });
      }
      legendRow(legendEl, [
        { color: T.liability, label: 'Term SOFR — what a bank CAN’T fund at' },
        { color: T.asset, label: 'Brokered CDs' },
        { color: T.income, label: 'FHLB advances' },
        { color: T.spread, label: 'Assumed funding curve · the blend' },
      ]);
      renderMix(0.5);
    },
    stack(t) {
      resetNeutral();
      show(gTsyBold, false); show(gTsy, false); show(gSofr, true, 0.45); show(gFtp, true);
      show(gBrok, false); show(gFhlb, false); show(onG, true);
      show(tlpBand, true, 0.13); show(fpBand, true, 0.16); show(readG, true); show(marksG, false);
      hideMix();
      annotG.selectAll('*').remove();
      legendRow(legendEl, [
        { color: T.spread, label: 'The FTP curve · base + TLP + funding premium' },
        { color: T.ink, label: 'Read line — scroll to sweep' },
      ]);
      setRead(t);
    },
    reads() {
      // ONE curve; the two products differ only in where they sit on it.
      resetNeutral();
      show(gTsyBold, false); show(gTsy, false); show(gSofr, false); show(gFtp, true);
      show(gBrok, false); show(gFhlb, false); show(onG, false);
      show(tlpBand, false); show(fpBand, false); show(readG, false); show(marksG, true);
      hideMix();
      annotG.selectAll('*').remove();
      legendRow(legendEl, [
        { color: T.spread, label: 'The FTP curve · one price list for time' },
        { color: T.ink, label: 'The two terms Part I found' },
      ]);
      readoutEl.innerHTML =
        `<span>mortgage ${MW.walDisplay}y → <b>${MW.read}%</b> charge</span>` +
        `<span class="ftp-readout__total">checking ${DW.walDisplay}y → <b>${DW.read}%</b> credit (before beta)</span>`;
    },
  };

  let currentBeat = null;
  return {
    update(beatId, beatT) {
      const fn = BEATS[beatId];
      if (!fn) return;
      if (currentBeat !== beatId) { currentBeat = beatId; fn(beatT); }
      if (beatId === 'stack') setRead(beatT);
      if (beatId === 'fed') setFed(beatT);
    },
  };
}
