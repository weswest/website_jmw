// Scene: one loan, lived forward — the workbench.
//
// Two stacked panels share an x axis: balances on top, annualized income
// run-rate below, plus a live readout strip. On sweep beats, scroll
// drives a "now" cursor from month 0 to the horizon; the readout shows
// that month's balances, rates, income, expense, and NII. Beats change
// the funding CONFIGURATION; scrolling within a beat sweeps time.
//
// Mode A (months 0–60): balloon → matched → shock → floating → rule →
//   naive amortizing → ladder → tiered ladder.
// Mode B (months 0–360): zoom (scroll stretches the axis 5y → 30y) →
//   one borrower sells → many lives → the behavioral aggregate →
//   funding staircase → behavioral term (WAL).
//
// All financial math comes from model.js.

import {
  theme, makeSvg, drawGrid, drawXAxis, drawYAxis, annot, legendRow,
  fmt, dur, sweepT, interpCurve,
} from '../chart-kit.js';
import { PARAMS, DERIVED, mortgagePool, borrowerPaths } from '../model.js';

export function mountLoanScene({ d3, el, DATA }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('loan');
  el.innerHTML = `
    <div class="loan__panel-head loan__head--bal">
      <span class="loan__panel-title">Balances</span>
      <div class="ftp-viz__legend loan__legend-bal"></div>
    </div>
    <div class="loan__plot loan__plot--bal"></div>
    <div class="loan__panel-head loan__head--inc">
      <span class="loan__panel-title">Income · annualized run-rate</span>
      <div class="ftp-viz__legend loan__legend-inc"></div>
    </div>
    <div class="loan__plot loan__plot--inc"></div>
    <div class="loan__panel-head loan__head--rates" style="display:none">
      <span class="loan__panel-title">Rates</span>
      <div class="ftp-viz__legend loan__legend-rates"></div>
    </div>
    <div class="loan__plot loan__plot--rates" style="display:none"></div>
    <div class="loan__readout"></div>
    <details class="loan__foot" style="display:none"><summary></summary><p></p></details>`;
  const balLegendEl = el.querySelector('.loan__legend-bal');
  const incLegendEl = el.querySelector('.loan__legend-inc');
  const ratesLegendEl = el.querySelector('.loan__legend-rates');
  const balHolder = el.querySelector('.loan__plot--bal');
  const incHolder = el.querySelector('.loan__plot--inc');
  const ratesHolder = el.querySelector('.loan__plot--rates');
  const balHead = el.querySelector('.loan__head--bal');
  const incHead = el.querySelector('.loan__head--inc');
  const ratesHead = el.querySelector('.loan__head--rates');
  const readoutEl = el.querySelector('.loan__readout');
  const footEl = el.querySelector('.loan__foot');

  const basePts = DATA.PLACEHOLDER_RATES.baseCurve;

  // ---- data (all from the model) --------------------------------------
  const sofr = m => 3.4 + 1.1 * Math.sin(m / 6.5) + 0.5 * Math.sin(m / 2.7 + 1.3);
  const balloonBal = m => (m < 60 ? 100000 : 0);
  const amortBal = m => (m < 60 ? 100000 - 20000 * Math.floor(m / 12) : 0);
  const months60 = d3.range(0, 61);
  const months360 = d3.range(0, 361);

  const TIERED = DERIVED.loan.tieredYearly;             // yearly expense, tiered rates
  const TIER_RATES = Object.fromEntries(
    Object.entries(PARAMS.amortizing.tierRatesPct).map(([k, v]) => [k, v.toFixed(1) + '%']));
  const money = v => '$' + Math.round(v).toLocaleString();

  // Mode B: contractual schedule, individual borrowers, behavioral pool.
  const schedBal = mortgagePool(0);
  const behavBal = DERIVED.mortgage.behavioral;
  const LIVES = borrowerPaths();
  const walMonths = Math.round(DERIVED.mortgage.wal * 12);
  const walLbl = `average life ≈ ${DERIVED.mortgage.walDisplay}y`;

  // Funding staircase over the BEHAVIORAL curve, built from quoted tenors.
  const TENORS = [12, 36, 60, 120, 240, 360];
  const TENOR_LBL = { 12: '1y', 36: '3y', 60: '5y', 120: '10y', 240: '20y', 360: '30y' };
  const tranchesB = (() => {
    let prev = 0;
    return TENORS.map(t => {
      const tr = {
        t, top: behavBal[prev], bot: behavBal[t],
        size: behavBal[prev] - behavBal[t],
        rate: interpCurve(basePts, t / 12),
        lbl: TENOR_LBL[t],
      };
      prev = t;
      return tr;
    });
  })();
  const stairExpense = m => tranchesB.reduce((s, tr) => s + (m < tr.t ? tr.size * tr.rate : 0), 0);
  const stairBal = m => tranchesB.reduce((s, tr) => s + (m < tr.t ? tr.size : 0), 0);

  // Rates-panel data (mode A). The shock scenario steps SOFR +200bp at
  // month 24; the contractual legs don't move. The floating scenario has
  // all three moving in lockstep.
  const RATES_VIEWS = {
    shock: {
      sofr: m => sofr(m) + (m >= 24 ? 2 : 0),
      loan: () => 7, cd: () => 4,
      legend: 'contractual',
      note: { x: 40, y: 6.75, text: ['the market jumps +200bps —', 'neither contract cares'], anchor: 'middle', bubble: true },
    },
    floating: {
      sofr,
      loan: m => sofr(m) + 2.5, cd: m => sofr(m) - 0.5,
      legend: 'floating',
      note: { x: 30, y: 1.05, text: 'three lines, one dance — the gaps never change', anchor: 'middle' },
    },
  };

  // Expandable footnotes under the readout. Content keyed per beat.
  const FOOTNOTES = {
    simple: {
      summary: 'Note: this is a <u>simplified</u> scenario',
      body: 'Assumes the CD customer won’t break the CD early, the borrower always pays on time and never repays ahead of schedule, and the bank’s people, systems, and branches all work for free. Real banks get none of those guarantees — and how these complications get factored in is captured in later chapters.',
    },
    ladder: {
      summary: '<u>Simplification</u>: the term spread here is exaggerated',
      body: 'The tenor effect is real — locking money up longer genuinely costs more — but a two-point gap between 1-year and 5-year money is drawn for visibility. Chapter 5 builds the actual curve, where the gaps are measured in fractions of a point.',
    },
  };

  // ---- configs -------------------------------------------------------
  const CFG = {
    intro: {
      mode: 'A', sweep: true,
      legend: [{ color: T.asset, label: 'Loan · $100k balloon at 7%' }],
      asset: balloonBal, funding: null, income: m => 0.07 * balloonBal(m), expense: null,
      readRates: () => ({ a: '7.00%', f: null }),
      notes: [{ x: 57, y: 52000, text: ['principal repaid', 'at month 60'], anchor: 'end' }],
    },
    findmoney: {
      mode: 'A', sweep: false,
      legend: [
        { color: T.asset, label: 'Loan · $100k the borrower wants today' },
        { color: T.liability, label: 'CD · $100k a customer agrees to lock up' },
      ],
      asset: balloonBal, funding: balloonBal,
      income: null, expense: null,
      summary: [['the bank needs', '$100,000 in cash'], ['a deposit customer has', '$100,000 sitting idle'], ['the deal', 'lock it up · 5 years · 4%']],
      notes: [{ x: 30, y: 108000, text: 'the borrower’s money IS the depositor’s money', anchor: 'middle' }],
    },
    matched: {
      mode: 'A', sweep: true, foot: 'simple',
      legend: [
        { color: T.asset, label: 'Loan · 7%' },
        { color: T.liability, label: 'Funding · 5y CD at 4%' },
      ],
      asset: balloonBal, funding: balloonBal,
      income: m => 0.07 * balloonBal(m), expense: m => (m < 60 ? 4000 : 0),
      readRates: () => ({ a: '7.00%', f: '4.00%' }),
      notes: [{ x: 30, y: 108000, text: 'two identical balances — perfectly overlapped', anchor: 'middle' }],
      incNotes: [{ x: 30, y: 5550, text: '$3,000 / year — locked', anchor: 'middle' }],
    },
    shock: {
      mode: 'A', sweep: false, rates: 'shock', foot: 'simple',
      legend: [
        { color: T.asset, label: 'Loan · 7%' },
        { color: T.liability, label: 'Funding · 5y CD at 4%' },
      ],
      asset: balloonBal, funding: balloonBal,
      income: m => 0.07 * balloonBal(m), expense: m => (m < 60 ? 4000 : 0),
      readRates: () => ({ a: '7.00%', f: '4.00%' }),
      summary: [['5-year NII', money(DERIVED.loan.niiMatched)], ['after a +200bp shock', 'unchanged'], ['why', 'both rates are contractual']],
    },
    floating: {
      mode: 'A', sweep: true, rates: 'floating', foot: 'simple',
      legend: [
        { color: T.asset, label: 'Loan · SOFR + 250' },
        { color: T.liability, label: 'Funding · SOFR − 50' },
      ],
      asset: balloonBal, funding: balloonBal,
      income: m => (m < 60 ? (sofr(m) + 2.5) * 1000 : 0), expense: m => (m < 60 ? (sofr(m) - 0.5) * 1000 : 0),
      readRates: m => ({ a: (sofr(m) + 2.5).toFixed(2) + '%', f: (sofr(m) - 0.5).toFixed(2) + '%' }),
      incNotes: [{ x: 30, y: 950, text: 'both legs dance; the gold band never changes', anchor: 'middle' }],
    },
    rule: {
      mode: 'A', sweep: false,
      legend: [
        { color: T.asset, label: 'Loan · SOFR + 250' },
        { color: T.liability, label: 'Funding · SOFR − 50' },
      ],
      asset: balloonBal, funding: balloonBal,
      income: m => (m < 60 ? (sofr(m) + 2.5) * 1000 : 0), expense: m => (m < 60 ? (sofr(m) - 0.5) * 1000 : 0),
      readRates: m => ({ a: 'SOFR+250', f: 'SOFR−50' }),
      summary: [['the rule', 'match rate type + term'], ['result', 'spread locked at booking'], ['in', 'every rate environment']],
    },
    naive: {
      mode: 'A', sweep: true,
      legend: [
        { color: T.asset, label: 'Loan · repays $20k/yr' },
        { color: T.liability, label: 'Funding · still one $100k CD' },
        { color: T.assetSoft, label: 'Overfunding gap' },
      ],
      asset: amortBal, funding: m => (m < 60 ? 100000 : 0), gap: true,
      income: m => 0.07 * amortBal(m), expense: m => (m < 60 ? 4000 : 0),
      readRates: () => ({ a: '7.00%', f: '4.00%' }),
      notes: [{ x: 40, y: 76000, text: ['paying 4% on funding', 'with no asset behind it'], anchor: 'middle' }],
    },
    ladder: {
      mode: 'A', sweep: true,
      legend: [
        { color: T.asset, label: 'Loan · repays $20k/yr' },
        { color: T.liability, label: 'CD ladder · five $20k tranches' },
      ],
      asset: amortBal, funding: amortBal, tranches: 'uniform',
      income: m => 0.07 * amortBal(m), expense: m => 0.04 * amortBal(m),
      readRates: () => ({ a: '7.00%', f: '4.00%' }),
    },
    'ladder-rates': {
      mode: 'A', sweep: false, foot: 'ladder',
      legend: [
        { color: T.asset, label: 'Loan · repays $20k/yr' },
        { color: T.liability, label: 'CD ladder · priced by tenor' },
      ],
      asset: amortBal, funding: amortBal, tranches: 'tiered',
      income: m => 0.07 * amortBal(m), expense: m => (m < 60 ? TIERED[Math.floor(m / 12)] : 0),
      readRates: () => ({ a: '7.00%', f: 'by tenor' }),
      summary: [['5-year NII', money(DERIVED.loan.niiTiered)], ['vs. uniform-rate ladder', money(DERIVED.loan.niiUniform)], ['vs. the naive single CD', money(DERIVED.loan.niiNaive)]],
    },
    zoom: {
      mode: 'B', sweep: false, zoomSweep: true,
      legend: [{ color: T.asset, label: 'Mortgage · contractual amortization' }],
      asset: m => schedBal[m], funding: null,
      income: m => 0.07 * schedBal[m], expense: null,
    },
    sell: {
      mode: 'B', sweep: false,
      legend: [
        { color: T.dim, label: 'Contractual amortization' },
        { color: T.asset, label: 'One borrower — sells the house at year 3' },
      ],
      asset: m => LIVES.seller[m], ghost: m => schedBal[m],
      income: m => 0.07 * LIVES.seller[m], expense: null,
      summary: [['the schedule says', '30 years'], ['the borrower says', 'moving day'], ['prepay penalty', 'none — it’s America']],
      notes: [{ x: 42, y: 40000, text: ['sells at year 3 —', 'balance snaps to zero'], anchor: 'start' }],
    },
    lives: {
      mode: 'B', sweep: false,
      legend: [
        { color: T.dim, label: 'Contractual amortization' },
        { color: T.asset, label: 'Individual borrowers, individual lives' },
      ],
      asset: m => LIVES.seller[m], assetOpacity: 0.45, livesOpacity: 0.45,
      ghost: m => schedBal[m],
      income: null,
      summary: [['a bonus every December', 'pays down early'], ['extra with every paycheck', 'shaves years'], ['a refi, a late sale', 'each its own exit']],
    },
    behavioral: {
      // The lives→aggregate morph is DRIVEN BY SCROLL (aggSweep): the
      // spaghetti dims and the smooth behavioral curve draws itself
      // left-to-right as the reader sweeps through the beat.
      mode: 'B', sweep: false, aggSweep: true, behav: true,
      legend: [
        { color: T.dim, label: 'Contractual amortization' },
        { color: T.asset, label: 'Behavioral balance · 10,000 borrowers aggregated' },
      ],
      asset: m => LIVES.seller[m], assetOpacity: 0.12, livesOpacity: 0.12,
      ghost: m => schedBal[m],
      income: m => 0.07 * behavBal[m], expense: null,
      notes: [{ x: 150, y: 58000, text: ['the aggregate is a new curve —', 'and it is not the contract'], anchor: 'start' }],
    },
    staircase: {
      mode: 'B', sweep: false, behav: true, slow: true,
      legend: [
        { color: T.asset, label: 'Behavioral balance' },
        { color: T.liability, label: 'Funding staircase · quoted tenors' },
        { color: T.dim, label: 'Waste — paid for, not needed' },
      ],
      asset: m => behavBal[m], assetOpacity: 0, funding: stairBal, stair: true, waste: true,
      income: m => 0.07 * behavBal[m], expense: stairExpense,
      summary: [['rungs to match it', '360'], ['tenors the market quotes', '6'], ['the shaded gap', 'pure funding waste']],
    },
    term: {
      mode: 'B', sweep: false, behav: true,
      legend: [
        { color: T.dim, label: 'Contractual amortization' },
        { color: T.asset, label: 'Behavioral balance' },
        { color: T.spread, label: walLbl },
      ],
      asset: m => behavBal[m], assetOpacity: 0, funding: null, ghost: m => schedBal[m], halfLife: true,
      income: m => 0.07 * behavBal[m], expense: null,
      summary: [['contractual term', '30 years'], ['behavioral term', `≈ ${DERIVED.mortgage.walDisplay} years`], ['FTP funds it at', `${DERIVED.mortgage.walDisplay} years`]],
    },
  };

  // ---- panels --------------------------------------------------------
  let mode = null;
  let P = null; // built panel refs
  let currentCfg = null;
  let currentFoot = null;

  function buildPanels(newMode) {
    mode = newMode;
    balHolder.innerHTML = '';
    incHolder.innerHTML = '';
    const H = mode === 'A' ? 60 : 360;

    const bal = makeSvg(d3, balHolder, { t: 16, r: 18, b: 26, l: 52 });
    const inc = makeSvg(d3, incHolder, { t: 8, r: 18, b: 26, l: 52 });
    const SMALL = bal.w < 420;
    const xB = d3.scaleLinear().domain([0, H]).range([0, bal.w]);
    const xI = d3.scaleLinear().domain([0, H]).range([0, inc.w]);
    const yB = d3.scaleLinear().domain([0, 115000]).range([bal.h, 0]);
    const yI = d3.scaleLinear().domain([0, 8500]).range([inc.h, 0]);

    drawGrid(d3, bal.g, yB, bal.w, T, 3);
    drawGrid(d3, inc.g, yI, inc.w, T, 3);
    const ticks = mode === 'A'
      ? (SMALL ? [0, 24, 48] : [0, 12, 24, 36, 48, 60])
      : (SMALL ? [0, 120, 240, 360] : [0, 60, 120, 180, 240, 300, 360]);
    const axB = drawXAxis(d3, bal.g, xB, bal.h, fmt.moYr, ticks);
    const axI = drawXAxis(d3, inc.g, xI, inc.h, fmt.moYr, ticks);
    drawYAxis(d3, bal.g, yB, fmt.k, 3);
    drawYAxis(d3, inc.g, yI, fmt.k, 3);

    const months = mode === 'A' ? months60 : months360;
    const balLine = (mode === 'A'
      ? d3.line().x(d => xB(d)).curve(d3.curveStepAfter)
      : d3.line().x(d => xB(d)).curve(d3.curveMonotoneX));
    const incLine = d3.line().x(d => xI(d)).curve(mode === 'A' ? d3.curveStepAfter : d3.curveMonotoneX);

    // layer order: gap/waste, tranches, ghost, lives, funding, asset, annots, cursor
    P = {
      bal, inc, xB, xI, yB, yI, months, balLine, incLine, axB, axI, SMALL,
      gapArea: bal.g.append('path').attr('fill', T.asset).attr('opacity', 0),
      wasteArea: bal.g.append('path').attr('fill', T.ink).attr('opacity', 0),
      trancheG: bal.g.append('g'),
      stairPath: bal.g.append('path').attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2).attr('opacity', 0),
      ghostPath: bal.g.append('path').attr('fill', 'none').attr('stroke', T.dim)
        .attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4').attr('opacity', 0),
      livesG: bal.g.append('g'),
      fundPath: bal.g.append('path').attr('fill', 'none').attr('stroke', T.liability)
        .attr('stroke-width', 2.5).attr('stroke-dasharray', '7 6').attr('stroke-linejoin', 'round').attr('opacity', 0),
      assetPath: bal.g.append('path').attr('fill', 'none').attr('stroke', T.asset)
        .attr('stroke-width', 2.5).attr('stroke-linejoin', 'round'),
      behavPath: bal.g.append('path').attr('fill', 'none').attr('stroke', T.asset)
        .attr('stroke-width', 2.5).attr('stroke-linejoin', 'round').attr('opacity', 0),
      hlLine: bal.g.append('line').attr('stroke', T.spread).attr('stroke-width', 2).attr('opacity', 0),
      hlLbl: bal.g.append('text').attr('class', 'ftp-lbl').attr('fill', T.spread).attr('opacity', 0),
      balAnnotG: bal.g.append('g'),
      goldBand: inc.g.append('path').attr('fill', T.spread).attr('opacity', 0.16),
      redBand: inc.g.append('path').attr('fill', T.asset).attr('opacity', 0.18),
      marketPath: inc.g.append('path').attr('fill', 'none').attr('stroke', T.dim)
        .attr('stroke-width', 1.5).attr('stroke-dasharray', '4 4').attr('opacity', 0),
      incomePath: inc.g.append('path').attr('fill', 'none').attr('stroke', T.income).attr('stroke-width', 2),
      expensePath: inc.g.append('path').attr('fill', 'none').attr('stroke', T.asset).attr('stroke-width', 2).attr('opacity', 0),
      incAnnotG: inc.g.append('g'),
      curB: bal.g.append('g').attr('opacity', 0),
      curI: inc.g.append('g').attr('opacity', 0),
    };
    // the individual-borrower spaghetti + the fixed behavioral curve (mode B)
    if (mode === 'B') {
      [LIVES.bonus, LIVES.paycheck, LIVES.refi, LIVES.lateSale].forEach(path => {
        P.livesG.append('path')
          .datum(months360)
          .attr('d', d3.line().x(m => xB(m)).y(m => yB(path[m])).curve(d3.curveMonotoneX))
          .attr('fill', 'none').attr('stroke', T.asset).attr('stroke-width', 1.25)
          .attr('opacity', 0);
      });
      P.behavPath.attr('d',
        d3.line().x(m => xB(m)).y(m => yB(behavBal[m])).curve(d3.curveMonotoneX)(months360));
      P.behavLen = P.behavPath.node().getTotalLength();
    }
    // the rates panel (mode A): SOFR vs the two contractual legs
    ratesHolder.innerHTML = '';
    if (mode === 'A') {
      const rt = makeSvg(d3, ratesHolder, { t: 8, r: 18, b: 26, l: 52 });
      const xR = d3.scaleLinear().domain([0, 60]).range([0, rt.w]);
      const yR = d3.scaleLinear().domain([0, 8.5]).range([rt.h, 0]);
      drawGrid(d3, rt.g, yR, rt.w, T, 3);
      drawXAxis(d3, rt.g, xR, rt.h, fmt.moYr, ticks);
      drawYAxis(d3, rt.g, yR, v => v + '%', 3);
      P.rates = {
        rt, xR, yR,
        sofrPath: rt.g.append('path').attr('fill', 'none').attr('stroke', T.ink)
          .attr('stroke-width', 1.5).attr('stroke-dasharray', '4 4').attr('opacity', 0.65),
        loanPath: rt.g.append('path').attr('fill', 'none').attr('stroke', T.asset).attr('stroke-width', 2),
        cdPath: rt.g.append('path').attr('fill', 'none').attr('stroke', T.liability).attr('stroke-width', 2),
        annotG: rt.g.append('g'),
        cur: rt.g.append('line').attr('y1', 0).attr('y2', rt.h)
          .attr('stroke', T.ink).attr('stroke-width', 1).attr('opacity', 0),
      };
    }
    P.curB.append('line').attr('y1', 0).attr('y2', bal.h).attr('stroke', T.ink).attr('stroke-width', 1).attr('opacity', 0.45);
    P.curBDot = P.curB.append('circle').attr('r', 5.5).attr('fill', T.spread)
      .attr('stroke', T.surface).attr('stroke-width', 2);
    P.curBLbl = P.curB.append('text').attr('class', 'ftp-lbl').attr('fill', T.ink).attr('y', -4);
    P.curI.append('line').attr('y1', 0).attr('y2', inc.h).attr('stroke', T.ink).attr('stroke-width', 1).attr('opacity', 0.45);
    currentCfg = null;
  }

  // Set the mode-B x-domain (used by the zoom beat) and re-render axes.
  function setDomainB(end) {
    const { xB, xI, axB, axI, SMALL } = P;
    xB.domain([0, end]);
    xI.domain([0, end]);
    const step = end <= 96 ? 12 : end <= 200 ? 36 : 60;
    let ticks = d3.range(0, end + 1, step);
    if (SMALL) ticks = ticks.filter((_, i) => i % 2 === 0 || i === ticks.length - 1);
    const ax = x => d3.axisBottom(x).tickValues(ticks).tickFormat(fmt.moYr).tickSize(0).tickPadding(9);
    axB.call(ax(xB)).call(sel => sel.select('.domain').remove());
    axI.call(ax(xI)).call(sel => sel.select('.domain').remove());
  }

  function setZoom(t) {
    const end = Math.round(60 + sweepT(t) * 300);
    setDomainB(end);
    const { xB, xI, yB, yI } = P;
    const ms = months360.filter(m => m <= end);
    P.assetPath.interrupt().attr('opacity', 1)
      .attr('d', d3.line().x(m => xB(m)).y(m => yB(schedBal[m])).curve(d3.curveMonotoneX)(ms));
    P.incomePath.interrupt().attr('opacity', 1)
      .attr('d', d3.line().x(m => xI(m)).y(m => yI(0.07 * schedBal[m])).curve(d3.curveMonotoneX)(ms));
    readoutEl.innerHTML = `<div class="loan__cells loan__cells--summary">` +
      cell('sum', 'the window', `<b>0 → ${Math.round(end / 12)} years</b>`) +
      cell('sum', 'the loan', `<b>$100k · 30y fixed · 7%</b>`) + '</div>';
  }

  // Scroll-driven lives→aggregate morph (the `behavioral` beat): the
  // spaghetti of individual borrowers dims while the smooth behavioral
  // curve draws itself left-to-right, its income line and annotation
  // arriving with it.
  function setAggregate(t) {
    const s = sweepT(t);
    const spag = 0.45 - 0.33 * Math.min(1, s * 1.6); // dim early
    P.livesG.selectAll('path').interrupt().attr('opacity', spag);
    P.assetPath.interrupt().attr('opacity', spag);
    const L = P.behavLen || 0;
    P.behavPath.interrupt()
      .attr('opacity', s > 0.02 ? 1 : 0)
      .attr('stroke-dasharray', `${L} ${L}`)
      .attr('stroke-dashoffset', L * (1 - s));
    P.incomePath.interrupt().attr('opacity', s);
    P.balAnnotG.attr('opacity', Math.max(0, (s - 0.75) * 4));
  }

  function apply(cfgId, immediate) {
    const cfg = CFG[cfgId];
    if (mode !== cfg.mode) buildPanels(cfg.mode);
    if (currentCfg === cfgId) return;
    currentCfg = cfgId;
    // leaving the zoom beat: snap the domain back to the full window
    if (cfg.mode === 'B' && !cfg.zoomSweep && P.xB.domain()[1] !== 360) setDomainB(360);

    // Panel layout: rates beats swap the balances panel out — income
    // rises to the top slot and the rates chart takes the bottom.
    const showRates = !!cfg.rates;
    balHead.style.display = showRates ? 'none' : '';
    balHolder.style.display = showRates ? 'none' : '';
    ratesHead.style.display = showRates ? '' : 'none';
    ratesHolder.style.display = showRates ? '' : 'none';
    if (showRates && P.rates) {
      const rv = RATES_VIEWS[cfg.rates];
      const { xR, yR, rt } = P.rates;
      const rl = fn => d3.line().x(m => xR(m)).y(m => yR(fn(m))).curve(d3.curveMonotoneX)(months60.slice(0, 60));
      P.rates.sofrPath.attr('d', rl(rv.sofr));
      P.rates.loanPath.attr('d', rl(rv.loan));
      P.rates.cdPath.attr('d', rl(rv.cd));
      legendRow(ratesLegendEl, [
        { color: T.ink, label: 'SOFR · the market' },
        { color: T.asset, label: 'Loan rate' },
        { color: T.liability, label: 'CD rate' },
      ]);
      P.rates.annotG.selectAll('*').remove();
      if (!P.SMALL && rv.note) annot(P.rates.annotG, xR(rv.note.x), yR(rv.note.y), rv.note.text, { anchor: rv.note.anchor, bubble: rv.note.bubble });
    }

    // Expandable footnote under the readout.
    const footKey = cfg.foot || null;
    if (footKey !== currentFoot) {
      currentFoot = footKey;
      if (footKey) {
        footEl.querySelector('summary').innerHTML = FOOTNOTES[footKey].summary;
        footEl.querySelector('p').innerHTML = FOOTNOTES[footKey].body;
        footEl.open = false;
        footEl.style.display = '';
      } else {
        footEl.style.display = 'none';
      }
    }

    legendRow(balLegendEl, cfg.legend);
    // Income panel keys money DIRECTION (in teal, out red), not product.
    const incLegend = cfg.income ? [{ color: T.income, label: 'Income' }] : [];
    if (cfg.expense) {
      incLegend.push({ color: T.asset, label: 'Expense' });
      incLegend.push({ color: T.spread, label: 'NII' });
    }
    if (cfg.market) incLegend.push({ color: T.dim, label: 'New-funding cost' });
    legendRow(incLegendEl, incLegend);
    // A beat with no income data rests the whole panel — crisp empty
    // axes read as a rendering bug, not a pause.
    const incDim = cfg.income ? '' : '0.22';
    incHolder.style.transition = 'opacity 400ms';
    incHolder.style.opacity = incDim;
    incHead.style.transition = 'opacity 400ms';
    incHead.style.opacity = incDim;

    const { months, xB, yB, xI, yI, balLine, incLine } = P;
    // `slow` beats stretch every fade so the graph converts gradually as
    // the card settles, instead of snapping in a single frame.
    const d = ms => (immediate ? 0 : dur(ms * (cfg.slow ? 2.4 : 1)));
    const tr = sel => sel.transition().duration(d(450));
    // Transitioning a path whose `d` is not yet set produces garbage
    // frames — snap those into place instead. Opacity must ride the SAME
    // transition: a second transition on the element would interrupt the
    // d-morph and strand the path at its old shape.
    const morphPath = (sel, dStr, opac) => {
      if (!sel.attr('d')) {
        sel.attr('d', dStr);
        if (opac != null) tr(sel).attr('opacity', opac);
      } else {
        const t = tr(sel).attr('d', dStr);
        if (opac != null) t.attr('opacity', opac);
      }
    };

    if (!cfg.zoomSweep) {
      morphPath(P.assetPath, balLine.y(m => yB(cfg.asset(m)))(months), cfg.assetOpacity != null ? cfg.assetOpacity : 1);
    }

    // the fixed behavioral aggregate line (mode B). During the aggSweep
    // beat its reveal is scroll-driven; elsewhere it's on or off.
    if (mode === 'B' && !cfg.aggSweep) {
      P.behavPath.interrupt()
        .attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
      tr(P.behavPath).attr('opacity', cfg.behav ? 1 : 0);
    }

    // individual borrower lives (mode B)
    if (!cfg.aggSweep) {
      P.livesG.selectAll('path').transition().duration(d(400))
        .attr('opacity', cfg.livesOpacity || 0);
    }

    if (cfg.funding && !cfg.stair) {
      morphPath(P.fundPath, balLine.y(m => yB(cfg.funding(m)))(months), 1);
    } else {
      tr(P.fundPath).attr('opacity', 0);
    }

    // funding staircase (mode B)
    if (cfg.stair) {
      const stairLine = d3.line().x(d0 => xB(d0)).y(m => yB(stairBal(m))).curve(d3.curveStepAfter);
      morphPath(P.stairPath, stairLine(months), 1);
    } else if (P.stairPath) {
      tr(P.stairPath).attr('opacity', 0);
    }

    // overfunding gap (naive)
    if (cfg.gap) {
      const gapArea = d3.area().x(m => xB(m))
        .y0(m => yB(cfg.asset(m))).y1(m => yB(cfg.funding(m)))
        .curve(d3.curveStepAfter);
      tr(P.gapArea.attr('d', gapArea(months))).attr('opacity', 0.13);
    } else {
      tr(P.gapArea).attr('opacity', 0);
    }

    // waste (staircase vs the behavioral curve)
    if (cfg.waste) {
      const wasteArea = d3.area().x(m => xB(m))
        .y0(m => yB(behavBal[m])).y1(m => yB(stairBal(m)))
        .curve(d3.curveStepAfter);
      tr(P.wasteArea.attr('d', wasteArea(months))).attr('opacity', 0.07);
    } else {
      tr(P.wasteArea).attr('opacity', 0);
    }

    // ghost (contractual amortization, mode B)
    if (cfg.ghost) {
      const gl = d3.line().x(m => xB(m)).y(m => yB(cfg.ghost(m))).curve(d3.curveMonotoneX);
      P.ghostPath.attr('d', gl(months));
      tr(P.ghostPath).attr('opacity', 0.8);
    } else {
      tr(P.ghostPath).attr('opacity', 0);
    }

    // CD tranches (mode A ladders)
    P.trancheG.selectAll('*').remove();
    if (cfg.tranches) {
      let top = 100000;
      for (const tenor of [1, 2, 3, 4, 5]) {
        const yTop = yB(top), yBot = yB(top - 20000);
        P.trancheG.append('rect')
          .attr('x', 0).attr('width', xB(tenor * 12))
          .attr('y', yTop + 1).attr('height', Math.max(1, yBot - yTop - 2))
          .attr('rx', 3).attr('fill', T.liability).attr('opacity', 0)
          .transition().duration(d(450)).attr('opacity', 0.22);
        const rateTxt = cfg.tranches === 'tiered' ? ` at ${TIER_RATES[tenor]}` : '';
        P.trancheG.append('text').attr('class', 'ftp-lbl')
          .attr('x', 8).attr('y', (yTop + yBot) / 2 + 4)
          .attr('fill', T.ink).attr('opacity', 0)
          .text(`${tenor}y CD · $20k${rateTxt}`)
          .transition().duration(d(450)).attr('opacity', 0.75);
        top -= 20000;
      }
    }
    // tenor labels for mode B staircase
    if (cfg.stair) {
      tranchesB.forEach(trn => {
        const thick = (yB(trn.bot) - yB(trn.top)) >= 16;
        P.trancheG.append('text').attr('class', 'ftp-lbl-sm')
          .attr('x', thick ? xB(trn.t) - 5 : Math.min(xB(trn.t) + 4, P.bal.w - 14))
          .attr('y', thick ? yB(trn.top) + 13 : (yB(trn.top) + yB(trn.bot)) / 2 + 3)
          .attr('text-anchor', thick ? 'end' : 'start')
          .attr('fill', T.ink).attr('opacity', 0.55)
          .text(trn.lbl);
      });
    }

    // behavioral average-life marker
    if (cfg.halfLife) {
      P.hlLine.attr('x1', xB(walMonths)).attr('x2', xB(walMonths)).attr('y1', 0).attr('y2', P.bal.h);
      P.hlLbl.attr('x', xB(walMonths) + 6).attr('y', 14).text(walLbl);
      tr(P.hlLine).attr('opacity', 1);
      tr(P.hlLbl).attr('opacity', 1);
    } else {
      tr(P.hlLine).attr('opacity', 0);
      tr(P.hlLbl).attr('opacity', 0);
    }

    // ---- income panel ----
    const hasExp = !!cfg.expense;
    if (cfg.income && !cfg.zoomSweep && !cfg.aggSweep) {
      morphPath(P.incomePath, incLine.y(m => yI(cfg.income(m)))(months), 1);
    } else if (cfg.aggSweep) {
      // scroll drives the reveal; just set the shape
      P.incomePath.interrupt().attr('d', incLine.y(m => yI(cfg.income(m)))(months));
    } else if (!cfg.income) {
      tr(P.incomePath).attr('opacity', 0);
    }
    if (hasExp) {
      morphPath(P.expensePath, incLine.y(m => yI(cfg.expense(m)))(months), 1);
      const goldA = d3.area().x(m => xI(m))
        .defined(m => cfg.income(m) >= cfg.expense(m) && (cfg.income(m) > 0 || cfg.expense(m) > 0))
        .y0(m => yI(cfg.expense(m))).y1(m => yI(cfg.income(m)))
        .curve(mode === 'A' ? d3.curveStepAfter : d3.curveMonotoneX);
      const redA = d3.area().x(m => xI(m))
        .defined(m => cfg.income(m) < cfg.expense(m))
        .y0(m => yI(cfg.income(m))).y1(m => yI(cfg.expense(m)))
        .curve(mode === 'A' ? d3.curveStepAfter : d3.curveMonotoneX);
      P.goldBand.attr('d', goldA(months));
      P.redBand.attr('d', redA(months));
      tr(P.goldBand).attr('opacity', 0.16);
      tr(P.redBand).attr('opacity', 0.18);
    } else {
      tr(P.expensePath).attr('opacity', 0);
      tr(P.goldBand).attr('opacity', 0);
      tr(P.redBand).attr('opacity', 0);
    }
    if (cfg.market) {
      P.marketPath.attr('d', incLine.y(m => yI(cfg.market(m)))(months));
      tr(P.marketPath).attr('opacity', 1);
    } else {
      tr(P.marketPath).attr('opacity', 0);
    }

    // annotations (no transitions — rebuilt per config; skipped on small screens)
    P.balAnnotG.selectAll('*').remove();
    (P.SMALL ? [] : cfg.notes || []).forEach(n => annot(P.balAnnotG, xB(n.x), yB(n.y), n.text, { anchor: n.anchor }));
    P.incAnnotG.selectAll('*').remove();
    (P.SMALL ? [] : cfg.incNotes || []).forEach(n => annot(P.incAnnotG, xI(n.x), yI(n.y), n.text, { anchor: n.anchor }));
  }

  // ---- readout -------------------------------------------------------
  const cell = (cls, label, html) =>
    `<span class="loan__cell loan__cell--${cls}"><span>${label}</span>${html}</span>`;

  function readoutAt(cfg, m) {
    const aBal = cfg.asset(m);
    const inc = cfg.income(m);
    const rates = cfg.readRates ? cfg.readRates(m) : { a: '', f: '' };
    let html = `<div class="loan__month">Month ${m}<em>· year ${Math.min(5, Math.floor(m / 12) + 1)}</em></div><div class="loan__cells">`;
    html += cell('asset', 'Loan', `<b>${fmt.money(aBal)}</b> @ ${rates.a} <i>+${fmt.money(inc)}/yr</i>`);
    if (cfg.expense) {
      const fBal = cfg.funding ? cfg.funding(m) : 0;
      const exp = cfg.expense(m);
      html += cell('fund', 'Funding', `<b>${fmt.money(fBal)}</b> @ ${rates.f} <i>−${fmt.money(exp)}/yr</i>`);
      const nii = inc - exp;
      html += cell(nii >= 0 ? 'nii' : 'neg', 'NII', `<b>${nii < 0 ? '−' : '+'}${fmt.money(Math.abs(nii))}/yr</b>`);
    }
    html += '</div>';
    readoutEl.innerHTML = html;
  }

  function readoutSummary(cfg) {
    const rows = (cfg.summary || []).map(([k, v]) =>
      cell('sum', k, `<b>${v}</b>`)).join('');
    readoutEl.innerHTML = `<div class="loan__cells loan__cells--summary">${rows}</div>`;
  }

  function setCursor(cfg, t) {
    const H = mode === 'A' ? 60 : 360;
    const m = Math.round(sweepT(t) * H);
    const { xB, yB, xI } = P;
    if (!cfg.rates) {
      P.curB.attr('opacity', 1).select('line').attr('x1', xB(m)).attr('x2', xB(m));
      P.curBDot.attr('cx', xB(m)).attr('cy', yB(cfg.asset(Math.min(m, H - (mode === 'A' ? 1 : 0)))));
      P.curBLbl.attr('x', Math.min(xB(m) + 8, P.bal.w - 52)).text(`mo ${m}`);
    } else {
      P.curB.attr('opacity', 0);
    }
    P.curI.attr('opacity', 1).select('line').attr('x1', xI(m)).attr('x2', xI(m));
    if (P.rates) {
      P.rates.cur.attr('opacity', cfg.rates ? 0.45 : 0)
        .attr('x1', P.rates.xR(m)).attr('x2', P.rates.xR(m));
    }
    readoutAt(cfg, Math.min(m, H - 1));
  }

  function hideCursor() {
    if (!P) return;
    P.curB.attr('opacity', 0);
    P.curI.attr('opacity', 0);
    if (P.rates) P.rates.cur.attr('opacity', 0);
  }

  // ---- public --------------------------------------------------------
  return {
    update(beatId, beatT) {
      const cfg = CFG[beatId];
      if (!cfg) return;
      const firstBuild = mode !== cfg.mode;
      apply(beatId, firstBuild);
      if (cfg.zoomSweep) {
        hideCursor();
        setZoom(beatT);
      } else if (cfg.aggSweep) {
        hideCursor();
        setAggregate(beatT);
        readoutSummary(cfg);
      } else if (cfg.sweep) {
        setCursor(cfg, beatT);
      } else {
        hideCursor();
        readoutSummary(cfg);
      }
    },
  };
}
