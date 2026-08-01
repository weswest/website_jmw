// FTP Explainer — THE MODEL. Single source of numeric truth.
//
// Every number in the piece — every curve, rate, spread, life, and NII
// figure in both the charts and the prose — derives from the PARAMS
// block below. This file runs unchanged in the browser (imported by the
// scenes) and in Node:
//
//   node static/js/tools/ftp/derive.mjs
//
// prints every derived landmark number, asserts that the arithmetic
// identities the story states actually foot (in display space, i.e.
// after rounding to the precision the reader sees), and greps the prose
// for stale numbers. Edit PARAMS, reload the page, re-run derive.
//
// House rules encoded here:
//  - The base curve is UPWARD-SLOPING. Assertions enforce it.
//  - The deposit's behavioral life is COMPUTED (truncated weighted-
//    average life of the cohort decay curve), never asserted.
//  - The mortgage's behavioral life is a PARAMS target; the model solves
//    for the constant CPR that produces it, so chart and prose agree.
//  - Blends must foot from the numbers the reader is shown.

export const PARAMS = {
  curve: {
    // Bank wholesale base curve anchors: [tenor in years, rate in %].
    // Interpolated in log-tenor space between anchors.
    base: [
      [1 / 12, 3.40],
      [0.25,   3.46],
      [0.5,    3.54],
      [1,      3.66],
      [2,      3.82],
      [3,      3.93],
      [5,      4.10],
      [7,      4.20],
      [10,     4.32],
      [30,     4.55],
    ],
    // Bank credit spread over Treasuries, bps, same tenors as `base`.
    // (Treasury curve = base − spread; kept as a spread so the two
    // curves can never cross by accident.)
    tsySpreadBps: [15, 16, 18, 20, 22, 24, 26, 28, 30, 35],
    // Term liquidity premium, bps by tenor-year. Linear between anchors;
    // scales to zero below the first anchor (overnight money carries no
    // term premium).
    tlpBps: { 1: 5, 2: 8, 3: 10, 5: 13, 7: 18, 10: 24, 30: 40 },
    // Term SOFR sits BELOW the bank base curve by this gap (bps, same
    // tenors as `base`; 0 at the front so overnight SOFR = base 1m).
    // In the curve chapter's decomposition:
    //   FTP(t) = o/n SOFR + [termSofr(t) − o/n]   (term liquidity premium)
    //          +           [FTP(t) − termSofr(t)] (funding premium)
    sofrGapBps: [0, 2, 4, 8, 12, 13, 15, 18, 22, 30],
    // The two places a bank can actually GET term money, expressed as
    // multiples of the funding premium over term SOFR. 50/50 blend
    // reproduces the FTP curve exactly — deliberately divergent for
    // the funding-mix slider.
    funding: { brokeredMult: 1.5, fhlbMult: 0.5, defaultFhlbShare: 0.5 },
    // Fed-expectation scenarios for the curve chapter's breather beat:
    // shift to the overnight anchor (bps) and a multiplier on the term
    // premium (the slope of term SOFR over overnight).
    fedScenarios: [
      { key: 'hikes',   label: 'hikes expected — steep curve, wide premium', dOnBps: -60, slopeMult: 1.6 },
      { key: 'neutral', label: 'no strong view — today’s curve', dOnBps: 0, slopeMult: 1.0 },
      { key: 'cuts',    label: 'cuts priced in — the curve inverts', dOnBps: 90, slopeMult: -0.55 },
    ],
  },

  balloon: { principal: 100000, ratePct: 7.0, cdRatePct: 4.0, termYears: 5 },

  amortizing: {
    principal: 100000,
    paydownPerYear: 20000,
    loanRatePct: 7.0,
    // CD ladder rates by tenor-year. Same SHAPE as the FTP curve but the
    // term spread is deliberately exaggerated (the prose owns up to it in
    // a Simplification footnote) so the tenor effect reads on a chart.
    tierRatesPct: { 1: 2.0, 2: 2.5, 3: 3.0, 4: 3.5, 5: 4.0 },
    uniformRatePct: 4.0,
  },

  mortgage: {
    principal: 100000,
    notePct: 7.0,
    termMonths: 360,
    // Behavioral average life target (years). The model solves for the
    // constant CPR that produces this WAL.
    walYears: 7.6,
    // Rate scenarios for the prepay-option chapter: market mortgage rate
    // moves by `d` bps → the pool's WAL lands at `wal` years. The model
    // solves a CPR for each anchor and interpolates between them for the
    // slider. Deliberately asymmetric: rates down = big contraction,
    // rates up = small extension.
    scenarioAnchors: [
      { d: -250, wal: 5.5 },
      { d: -125, wal: 6.4 },
      { d: 0,    wal: 7.6 },
      { d: 125,  wal: 7.9 },
      { d: 250,  wal: 8.0 },
    ],
    // Illustrative cost of the borrower's prepay option (bps/yr) by the
    // same scenario axis. The d=0 value is the ledger's prepay chip.
    optionCostBps: [[-250, 88], [-125, 58], [0, 35], [125, 26], [250, 22]],
  },

  deposit: {
    // The through-line product is the CHECKING cohort.
    // Cohort decay curve: grows to `peak`×opening by `peakMonth`, then
    // decays exponentially so that `survivalAtWall` of opening balance
    // remains at the truncation wall.
    peak: 1.05,
    peakMonth: 8,
    truncationMonths: 84,   // the 7-year wall: everything alive here is called 7y money
    survivalAtWall: 0.60,   // 60% of opening balances still here at year 7
    beta: 0.20,             // checking β agreed with FP&A
    ratePaidPct: 0.60,      // what the customer receives
    // Contrast products for the "signatures" beat (half-life in months).
    shapes: {
      mmda:    { peak: 1.12, peakMonth: 6, halfLifeMonths: 30, floor: 0.06 },
      savings: { peak: 1.08, peakMonth: 5, halfLifeMonths: 43, floor: 0.08 },
    },
  },

  betas: { checking: 0.20, mmda: 0.30, savings: 0.45, highYieldOnline: 0.75, termCD: 1.00 },

  ledger: { eclPct: 0.50, capitalPct: 0.60 },
};

// ---- interpolation ----------------------------------------------------

// Log-tenor linear interpolation over [tenorYears, ratePct] anchor pairs.
function interpAnchors(anchors, tenor) {
  if (tenor <= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (tenor >= last[0]) return last[1];
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i][0] >= tenor) {
      const [ta, ra] = anchors[i - 1], [tb, rb] = anchors[i];
      const t = (Math.log(tenor) - Math.log(ta)) / (Math.log(tb) - Math.log(ta));
      return ra + t * (rb - ra);
    }
  }
  return last[1];
}

export const baseRate = tenor => interpAnchors(PARAMS.curve.base, tenor);

const tsyAnchors = PARAMS.curve.base.map(([t, r], i) => [t, r - PARAMS.curve.tsySpreadBps[i] / 100]);
export const tsyRate = tenor => interpAnchors(tsyAnchors, tenor);

// TLP in bps: linear between anchor years; below the first anchor it
// scales linearly to zero (overnight money carries no term premium).
export function tlpBps(tenor) {
  const tlp = PARAMS.curve.tlpBps;
  const keys = Object.keys(tlp).map(Number).sort((a, b) => a - b);
  if (tenor <= keys[0]) return tlp[keys[0]] * (tenor / keys[0]);
  if (tenor >= keys[keys.length - 1]) return tlp[keys[keys.length - 1]];
  for (let i = 1; i < keys.length; i++) {
    if (keys[i] >= tenor) {
      const a = keys[i - 1], b = keys[i];
      return tlp[a] + (tenor - a) / (b - a) * (tlp[b] - tlp[a]);
    }
  }
  return 0;
}

// The FTP curve: base + term liquidity premium, in %.
export const ftpRate = tenor => baseRate(tenor) + tlpBps(tenor) / 100;

// Term SOFR: the base curve minus the SOFR gap. Overnight (1m anchor)
// the gap is zero, so o/n SOFR = base(1m) = the ledger's floating leg.
const termSofrAnchors = PARAMS.curve.base.map(([t, r], i) => [t, r - PARAMS.curve.sofrGapBps[i] / 100]);
export const termSofrRate = tenor => interpAnchors(termSofrAnchors, tenor);
export const overnightSofr = () => termSofrAnchors[0][1];

// The funding premium a bank pays over term SOFR to actually raise term
// money, in % — by construction FTP = termSofr + fundingPremium.
export const fundingPremium = tenor => ftpRate(tenor) - termSofrRate(tenor);

// The two funding sources, and the slider blend between them.
// fhlbShare=0 → all brokered CDs (expensive); 1 → all FHLB (cheap);
// the default 50/50 reproduces the FTP curve exactly.
export function fundingRate(tenor, fhlbShare = PARAMS.curve.funding.defaultFhlbShare) {
  const { brokeredMult, fhlbMult } = PARAMS.curve.funding;
  const mult = (1 - fhlbShare) * brokeredMult + fhlbShare * fhlbMult;
  return termSofrRate(tenor) + mult * fundingPremium(tenor);
}

// Term SOFR reshaped by a Fed-expectation scenario: shift the overnight
// anchor, scale the term premium. `mix` interpolates from neutral (0) to
// the full scenario (1) so the breather beat can sweep.
export function termSofrScenario(tenor, scenario, mix = 1) {
  const on = overnightSofr();
  const dOn = scenario.dOnBps / 100 * mix;
  const slope = 1 + (scenario.slopeMult - 1) * mix;
  return on + dOn + slope * (termSofrRate(tenor) - on);
}

// Plot-ready point arrays ({tenor, rate} with rate as a decimal).
export const CURVE_TENORS = PARAMS.curve.base.map(([t]) => t);
export const basePts = PARAMS.curve.base.map(([t, r]) => ({ tenor: t, rate: r / 100 }));
export const tsyPts = tsyAnchors.map(([t, r]) => ({ tenor: t, rate: r / 100 }));
export const ftpPts = CURVE_TENORS.map(t => ({ tenor: t, rate: ftpRate(t) / 100 }));
export const termSofrPts = termSofrAnchors.map(([t, r]) => ({ tenor: t, rate: r / 100 }));

// ---- mortgage pool ------------------------------------------------------

// Prepaying borrowers leave the pool entirely; survivors keep their
// original schedule. Pool balance = scheduled balance × survival.
export function mortgagePool(annualCpr) {
  const { principal, notePct, termMonths } = PARAMS.mortgage;
  const mr = notePct / 100 / 12;
  const pmt = principal * mr / (1 - Math.pow(1 + mr, -termMonths));
  const smm = 1 - Math.pow(1 - annualCpr, 1 / 12);
  const out = []; let sched = principal; let survival = 1;
  for (let m = 0; m <= termMonths; m++) {
    out.push(sched * survival);
    sched = Math.max(0, sched - (pmt - sched * mr));
    survival *= 1 - smm;
  }
  return out;
}

// Weighted-average life of a runoff profile, in years: the area under
// the normalized balance curve (integration by parts of Σ t·runoff).
export function walOf(balances, truncationMonths = null) {
  const M = truncationMonths != null ? Math.min(truncationMonths, balances.length - 1) : balances.length - 1;
  let area = 0;
  for (let m = 1; m <= M; m++) area += (balances[m - 1] + balances[m]) / 2;
  // Balances alive at the truncation wall count at the wall's tenor —
  // they're already inside the area sum, so nothing extra to add.
  return area / balances[0] / 12;
}

function solveCprForWal(targetYears) {
  let lo = 0, hi = 0.6;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (walOf(mortgagePool(mid)) > targetYears) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// Solve each scenario anchor's CPR once at load.
const scenarioCprs = PARAMS.mortgage.scenarioAnchors.map(a => ({ d: a.d, wal: a.wal, cpr: solveCprForWal(a.wal) }));

// CPR for a market-rate move of `d` bps (piecewise linear between anchors).
export function cprForScenario(d) {
  const a = scenarioCprs;
  if (d <= a[0].d) return a[0].cpr;
  if (d >= a[a.length - 1].d) return a[a.length - 1].cpr;
  for (let i = 1; i < a.length; i++) {
    if (a[i].d >= d) {
      const t = (d - a[i - 1].d) / (a[i].d - a[i - 1].d);
      return a[i - 1].cpr + t * (a[i].cpr - a[i - 1].cpr);
    }
  }
  return a[a.length - 1].cpr;
}

// Illustrative prepay-option cost (bps/yr) for a market-rate move.
export function optionCostBps(d) {
  const a = PARAMS.mortgage.optionCostBps;
  if (d <= a[0][0]) return a[0][1];
  if (d >= a[a.length - 1][0]) return a[a.length - 1][1];
  for (let i = 1; i < a.length; i++) {
    if (a[i][0] >= d) {
      const t = (d - a[i - 1][0]) / (a[i][0] - a[i - 1][0]);
      return a[i - 1][1] + t * (a[i][1] - a[i - 1][1]);
    }
  }
  return a[a.length - 1][1];
}

// Individual borrower paths for the "lives" beats. Each returns a
// month-indexed balance array (0..termMonths).
export function borrowerPaths() {
  const { principal, notePct, termMonths } = PARAMS.mortgage;
  const mr = notePct / 100 / 12;
  const pmt = principal * mr / (1 - Math.pow(1 + mr, -termMonths));
  const path = ({ extraMonthly = 0, extraAnnual = 0, exitMonth = null }) => {
    const out = []; let bal = principal;
    for (let m = 0; m <= termMonths; m++) {
      out.push(Math.max(0, bal));
      if (exitMonth != null && m + 1 >= exitMonth) { bal = 0; continue; }
      bal = bal * (1 + mr) - pmt - extraMonthly - (m % 12 === 11 ? extraAnnual : 0);
      if (bal <= 0) bal = 0;
    }
    return out;
  };
  return {
    sched: path({}),
    seller: path({ exitMonth: 36 }),          // sells the house three years in
    bonus: path({ extraAnnual: 6000 }),       // pays the bonus down every December
    paycheck: path({ extraMonthly: 150 }),    // a bit extra every pay period
    refi: path({ exitMonth: 62 }),            // refinances when rates dip in year five
    lateSale: path({ exitMonth: 110 }),       // moves in year nine
  };
}

// ---- deposit cohort ----------------------------------------------------

// The checking cohort's decay curve, normalized to opening balance = 1.
// Linear growth to the peak, then exponential decay calibrated to leave
// exactly `survivalAtWall` at the truncation wall.
export function checkingShape() {
  const { peak, peakMonth, truncationMonths, survivalAtWall } = PARAMS.deposit;
  const k = Math.log(peak / survivalAtWall) / (truncationMonths - peakMonth);
  const arr = [];
  for (let m = 0; m <= truncationMonths; m++) {
    arr.push(m <= peakMonth
      ? 1 + (peak - 1) * (m / peakMonth)
      : peak * Math.exp(-k * (m - peakMonth)));
  }
  return arr;
}

function contrastShape({ peak, peakMonth, halfLifeMonths, floor }) {
  const arr = [];
  for (let m = 0; m <= PARAMS.deposit.truncationMonths; m++) {
    arr.push(m <= peakMonth
      ? 1 + (peak - 1) * (m / peakMonth)
      : floor + (peak - floor) * Math.exp(-Math.LN2 * (m - peakMonth) / halfLifeMonths));
  }
  return arr;
}

export const depositShapes = {
  checking: checkingShape(),
  mmda: contrastShape(PARAMS.deposit.shapes.mmda),
  savings: contrastShape(PARAMS.deposit.shapes.savings),
};

// ---- the renewing savings book -----------------------------------------

// A mature savings book (half-life ≈ 3.6y) whose runoff is replaced,
// month by month, with new accounts. A "vintage" is the cohort of
// accounts opened during one calendar year. Every month each layer
// decays; the month's total runoff comes back as inflow to the current
// year's vintage — so the TOTAL is flat by construction (that is the
// whole story of the beat) while every individual layer shrinks.
export function renewalBook(years = 10) {
  const { halfLifeMonths } = PARAMS.deposit.shapes.savings;
  const f = Math.pow(2, -1 / halfLifeMonths); // monthly survival factor
  const M = years * 12;
  const bals = [1];        // layer 0 = the back book, opens at 100%
  const series = [[1]];    // month-indexed history per layer
  for (let m = 1; m <= M; m++) {
    let runoff = 0;
    for (let i = 0; i < bals.length; i++) {
      const lost = bals[i] * (1 - f);
      bals[i] -= lost; runoff += lost;
    }
    const y = Math.ceil(m / 12); // vintage year 1..years
    while (bals.length <= y) { bals.push(0); series.push(Array(m).fill(0)); }
    bals[y] += runoff; // new money replaces exactly what ran off
    for (let i = 0; i < bals.length; i++) series[i].push(bals[i]);
  }
  const months = Array.from({ length: M + 1 }, (_, m) => m);
  return {
    months,
    series: series.map((values, i) => ({ key: i === 0 ? 'back' : `y${i}`, values })),
    total: months.map(m => series.reduce((s, v) => s + v[m], 0)),
  };
}

// ---- derived landmark numbers ------------------------------------------

const r2 = v => Math.round(v * 100) / 100;
const d2 = v => v.toFixed(2);
const d1 = v => v.toFixed(1);

function ladderNumbers() {
  const { paydownPerYear, loanRatePct, tierRatesPct, uniformRatePct, principal } = PARAMS.amortizing;
  const balances = [1, 2, 3, 4, 5].map(y => principal - paydownPerYear * (y - 1)); // start-of-year
  const income = balances.reduce((s, b) => s + b * loanRatePct / 100, 0);
  // Tiered ladder: the rung retiring at year-end n is priced at tenor n.
  const tieredTotal = [1, 2, 3, 4, 5].reduce((s, n) => s + paydownPerYear * tierRatesPct[n] / 100 * n, 0);
  // Yearly tiered expense (for the chart): rungs n ≥ current year still alive.
  const tieredYearly = [1, 2, 3, 4, 5].map(yr =>
    [1, 2, 3, 4, 5].filter(n => n >= yr).reduce((s, n) => s + paydownPerYear * tierRatesPct[n] / 100, 0));
  const uniformTotal = [1, 2, 3, 4, 5].reduce((s, n) => s + paydownPerYear * uniformRatePct / 100 * n, 0);
  const naiveExpense = 5 * principal * uniformRatePct / 100;
  return {
    income,
    tieredYearly,
    niiTiered: income - tieredTotal,
    niiUniform: income - uniformTotal,
    niiNaive: income - naiveExpense,
    niiMatched: 5 * (principal * PARAMS.balloon.ratePct / 100 - principal * PARAMS.balloon.cdRatePct / 100),
  };
}

function buildDerived() {
  // -- loan side --
  const ftp5 = ftpRate(5);
  const gross = PARAMS.balloon.ratePct - ftp5;
  const franchiseLoan = gross - PARAMS.ledger.eclPct - PARAMS.ledger.capitalPct;

  // -- mortgage --
  const cpr0 = cprForScenario(0);
  const behavioral = mortgagePool(cpr0);
  const mortWal = walOf(behavioral);
  const mortRead = ftpRate(mortWal);

  // -- deposit --
  const shape = depositShapes.checking;
  const depWal = walOf(shape, PARAMS.deposit.truncationMonths);
  const survivorFloorYears = PARAMS.deposit.survivalAtWall * PARAMS.deposit.truncationMonths / 12;
  const depRead = ftpRate(depWal);
  const overnight = ftpRate(1 / 12);
  const beta = PARAMS.deposit.beta;
  const termLeg = (1 - beta) * depRead;
  const floatLeg = beta * overnight;
  const credit = termLeg + floatLeg;
  const depSpread = credit - PARAMS.deposit.ratePaidPct;

  const ladder = ladderNumbers();

  // -- curve decomposition at the 5y reference tenor --
  const on = overnightSofr();
  const ts5 = termSofrRate(5);

  return {
    curve: {
      ftp5: d2(ftp5),
      overnight: d2(overnight),
      tlp1y: Math.round(tlpBps(1)),
      tlp30y: Math.round(tlpBps(30)),
      // the three-part split the curve chapter teaches:
      // FTP(5y) = o/n SOFR + term liquidity premium + funding premium
      onSofr: d2(on),
      termSofr5: d2(ts5),
      tlpSplit5: d2(ts5 - on),
      fpSplit5: d2(ftp5 - ts5),
    },
    loan: {
      rate: d2(PARAMS.balloon.ratePct),
      ftpCharge: d2(ftp5),
      gross: d2(r2(gross)),
      ecl: d2(PARAMS.ledger.eclPct),
      capital: d2(PARAMS.ledger.capitalPct),
      franchise: d2(r2(franchiseLoan)),
      ...ladder,
    },
    mortgage: {
      cpr0,
      behavioral,
      wal: mortWal,
      walDisplay: d1(mortWal),
      read: d2(mortRead),
      optionBps: Math.round(optionCostBps(0)),
      scenarios: scenarioCprs,
    },
    deposit: {
      wal: depWal,
      walDisplay: d1(depWal),
      survivorFloor: d1(survivorFloorYears),
      survivalPct: Math.round(PARAMS.deposit.survivalAtWall * 100),
      read: d2(depRead),
      beta,
      betaTermPct: Math.round((1 - beta) * 100),
      betaFloatPct: Math.round(beta * 100),
      termLeg: d2(termLeg),
      floatLeg: d2(floatLeg),
      credit: d2(credit),
      ratePaid: d2(PARAMS.deposit.ratePaidPct),
      spread: d2(depSpread),
      // raw values for chart geometry
      termLegVal: termLeg, floatLegVal: floatLeg, creditVal: credit,
      spreadVal: depSpread, ratePaidVal: PARAMS.deposit.ratePaidPct,
    },
  };
}

export const DERIVED = buildDerived();
