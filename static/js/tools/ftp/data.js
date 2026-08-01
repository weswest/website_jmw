// FTP Explainer — data layer.
//
// ALL NUMBERS LIVE IN model.js — the single editable source of numeric
// truth (curve anchors, deposit decay, mortgage prepay, beta, ledger
// inputs). This file re-exports what the scenes consume, plus the
// non-numeric content (glossary, account-path seeds). To change the
// numbers, edit PARAMS in model.js and run
//   node static/js/tools/ftp/derive.mjs
// to confirm the prose still matches.

import { PARAMS, DERIVED, basePts, depositShapes } from './model.js';

export const PLACEHOLDER_RATES = {
  baseCurve: basePts,
  termLiquidityPremiumBps: PARAMS.curve.tlpBps,
  optionalityChargeBps: { mortgage30: DERIVED.mortgage.optionBps, helocCommitment: 80 },
};

// ===== § 2 Balloon loan =====
export const BALLOON = {
  principal: PARAMS.balloon.principal,
  ratePctDefault: PARAMS.balloon.ratePct,
  fundingRatePctDefault: PARAMS.balloon.cdRatePct,
  termYears: PARAMS.balloon.termYears,
};

// ===== § 3 Amortizing loan =====
export const AMORTIZING = {
  principal: PARAMS.amortizing.principal,
  paydownPerYear: PARAMS.amortizing.paydownPerYear,
  loanRatePct: PARAMS.amortizing.loanRatePct,
  ladder: [5, 4, 3, 2, 1],
  tierRatesPct: PARAMS.amortizing.tierRatesPct,
};

// ===== § 5 Cohort animation — 30 deposit accounts =====
// Each account has a path "kind" and a noise seed.
export const ACCOUNT_PATHS = (() => {
  const kinds = [
    'steady-grow-then-decay',
    'bonus-driven',
    'save-then-buy',
    'flat-low',
    'late-spike',
    'gradual-decay',
  ];
  const accounts = [];
  for (let i = 0; i < 30; i++) {
    accounts.push({
      id: i,
      kind: kinds[i % kinds.length],
      seed: (i * 9301 + 49297) % 233280,
      closeMonth: 24 + Math.floor((i * 53) % 60), // close between months 24 and 84
    });
  }
  return accounts;
})();

// ===== § 6 Cohort decay shapes (from the model; opening balance = 1.0) =====
export const COHORT_SHAPES = depositShapes;

// ===== § 11 Beta defaults =====
export const BETA_DEFAULTS = PARAMS.betas;

// ===== § 12 Capital defaults =====
export const CAPITAL_DEFAULTS = {
  riskWeights: { mortgage: 0.50, helocDrawn: 0.50, helocCommitment: 0.10, commercial: 1.00, treasury: 0.00 },
  capitalRatio: 0.10,
  costOfEquityPct: 0.12,
};

// ===== § 13 HELOC commitment =====
export const HELOC = {
  commitment: 100000,
  drawn: 30000,
  feeBps: 50,
  baseUtilization: 0.30,
  stressUtilization: 0.80,
  standbyChargeBps: 80,
};

// ===== Matrix data =====
export const MATRIX_ROWS = [
  { product: 'Balloon loan',       cells: [1, 0, 0, 0, 0, 0, 1, 0] },
  { product: 'Amortizing loan',    cells: [1, 1, 0, 0, 0, 0, 1, 0] },
  { product: 'Mortgage',           cells: [1, 1, 1, 0, 0, 0, 1, 0] },
  { product: 'HELOC commitment',   cells: [1, 1, 1, 0, 0, 0, 1, 1] },
  { product: 'MMDA',               cells: [1, 1, 1, 1, 1, 1, 1, 0] },
  { product: 'MMDA 12m promo',     cells: [1, 1, 1, 1, 1, 1, 1, 1] },
  { product: 'Checking',           cells: [1, 1, 1, 1, 1, 1, 1, 0] },
  { product: 'Savings',            cells: [1, 1, 1, 1, 1, 1, 1, 0] },
];
export const MATRIX_COLS = [
  { key: 'term',     label: 'Term match',      stage: 2 },
  { key: 'ladder',   label: 'Ladder',          stage: 3 },
  { key: 'option',   label: 'Optionality',     stage: 4 },
  { key: 'life',     label: 'Behavioral life', stage: 6 },
  { key: 'nmd',      label: 'NMD mapping',     stage: 7 },
  { key: 'beta',     label: 'Beta split',      stage: 11 },
  { key: 'capital',  label: 'Capital charge',  stage: 12 },
  { key: 'hedge',    label: 'Hedge / option',  stage: 13 },
];

// ===== Glossary =====
// Definitions written for a smart non-banker — fintech treasurer with $200M float —
// not a finance student. No condescension; no jargon-defining-jargon.
// Each definition has one concrete example.
export const GLOSSARY = {
  cd: {
    term: 'CD',
    body: 'Certificate of Deposit. A deposit a customer (or another institution) commits for a fixed term at a fixed rate — early withdrawal incurs a penalty. From the bank\'s perspective, a CD is contractual fixed-rate funding. A 5-year brokered CD at 4.0% means the bank knows it has that funding, at that cost, for five years.',
  },
  fhlb: {
    term: 'FHLB',
    body: 'Federal Home Loan Bank. A government-sponsored cooperative that provides member banks with collateralized borrowings (called "advances") at favorable rates. FHLB advances are one of the cheapest reliable wholesale funding sources for US banks and feature heavily in the base FTP curve.',
  },
  mmda: {
    term: 'MMDA',
    body: 'Money Market Deposit Account. A retail deposit account that pays a higher rate than checking but allows limited withdrawals. MMDAs are non-maturity — the customer can withdraw any time — but in aggregate they behave with high stability and modest beta.',
  },
  nmd: {
    term: 'NMD',
    body: 'Non-Maturity Deposit. Any deposit without a contractual maturity: checking, savings, MMDA. The customer can withdraw whenever. The bank treats them as funding by assigning a behavioral life, calibrated to historical cohort decay.',
  },
  ftp: {
    term: 'FTP',
    body: 'Funds Transfer Pricing. The internal pricing system a bank uses to charge each asset for the funding it consumes and credit each liability for the funding it provides. FTP centralizes interest-rate risk in Treasury, leaves credit risk with the asset team, and gives both the asset and deposit teams a fixed-rate spread that they keep regardless of what the market does.',
  },
  nii: {
    term: 'NII',
    body: 'Net Interest Income. The difference between what the bank earns on its assets and what it pays on its liabilities. The dominant revenue line for most US banks.',
  },
  alm: {
    term: 'ALM',
    body: 'Asset-Liability Management. The function inside Treasury that manages the balance-sheet mismatch between assets and liabilities — duration, convexity, liquidity, capital. FTP is the measurement infrastructure ALM uses to push risk to the central function and surface what each line of business actually contributes.',
  },
  prepay: {
    term: 'Prepay',
    body: 'When a borrower pays off a loan ahead of schedule. Most consequential in mortgages, where borrowers refinance when rates fall. Prepay risk is asymmetric: when rates fall, prepays accelerate (the bank loses its high-rate asset and reinvests at low rates); when rates rise, prepays slow (the bank is stuck with its low-rate asset). This negative convexity is what the optionality charge in FTP pays for.',
  },
  brokered: {
    term: 'Brokered deposit',
    body: 'A deposit raised through a broker rather than directly from a relationship customer. Brokered deposits price at or near wholesale rates — they show up clearly on a screen, and they leave just as quickly when something cheaper appears. Treated as wholesale funding for FTP purposes.',
  },
  repo: {
    term: 'Repo',
    body: 'Repurchase agreement. The bank sells a security (typically a Treasury) to a counterparty with an agreement to buy it back the next day at a slightly higher price. Effectively a one-day collateralized loan. The repo rate is one of the bank\'s shortest-duration funding sources.',
  },
  beta: {
    term: 'Beta',
    body: 'The ratio of deposit-rate change to market-rate change. If the Fed raises rates 100bps and the bank raises checking rates 20bps, the checking beta is 0.20. Lower beta = stickier deposits = more valuable franchise. Most retail checking is 0.10–0.30; high-rate online savings is 0.70+.',
  },
  callable: {
    term: 'Callable',
    body: 'A bond or loan that the issuer can repay early on specified dates. Callable debt is an embedded option — the issuer holds the right to refinance when rates fall. Banks that issue callable debt or write callable loans need to charge or credit FTP for the option value.',
  },
  balloon: {
    term: 'Balloon',
    body: 'A loan that pays interest only (or interest + small principal) until maturity, then repays the entire principal in one final payment. A 5-year balloon at $100k means the borrower owes $100k for the full 5 years, then pays it all back at the end — no amortization to model.',
  },
  amortizing: {
    term: 'Amortizing',
    body: 'A loan that repays principal on a schedule over its life. A 30-year mortgage is amortizing — each monthly payment retires part of the balance, so by year 15 most of the balance is gone. The amortization schedule is what determines how much funding the bank still needs for the loan over time.',
  },
  behavioralLife: {
    term: 'Behavioral life',
    body: 'How long a balance actually stays around, on average, regardless of what the contract says. Contractually a checking account has zero maturity — and without a cutoff its measured life is effectively infinite, because some balances never leave. Banks therefore truncate: everything still present at (say) year 7 is treated as 7-year money, and the weighted-average life is computed on that truncated profile. That policy choice is what turns "deposits without a contract" into "deposits the bank can fund a 5-year asset with."',
  },
  cohort: {
    term: 'Cohort',
    body: 'A group of accounts originated in the same period, tracked together. One MMDA account can do anything; 10,000 MMDAs opened in March 2024 follow a predictable aggregate decay pattern. Cohort thinking is what makes FTP on non-maturity deposits possible.',
  },
  vintage: {
    term: 'Vintage',
    body: 'A cohort, viewed across time. A "2019 vintage" of mortgages or deposits is the group originated in 2019, tracked through subsequent years. Vintages stack: today\'s deposit balance is the sum of every still-living vintage at its current decay state.',
  },
  termLiquidity: {
    term: 'Term liquidity premium',
    body: 'The extra yield the bank pays to lock in funding for a longer period vs. rolling overnight repo. Above and beyond credit spread. A 5-year FHLB advance costs more than 60 overnight repos rolled because the lender takes liquidity risk. Term liquidity premium is one of the three components layered onto the base curve.',
  },
  baseCurve: {
    term: 'Base curve',
    body: 'The starting wholesale funding curve a bank uses for FTP. Typically a blend of brokered CDs, FHLB advances, and Treasury / SOFR rates by tenor. Each institution makes a methodology call about the blend; the choice has governance implications and meaningful impact on which products get rewarded vs. penalized.',
  },
  raroc: {
    term: 'RAROC',
    body: 'Risk-Adjusted Return on Capital. The ratio of net economic earnings (gross spread minus FTP charge minus credit charge minus capital charge) to the equity slug consumed by the asset. The number that tells the asset team whether they\'re creating value above the cost of capital, or destroying it.',
  },
  riskWeight: {
    term: 'Risk weight',
    body: 'The regulatory multiplier applied to an asset to compute how much capital it consumes. A US Treasury risk-weights at 0%, a residential mortgage at 50%, an unsecured commercial loan at 100%. Higher risk weight = more equity consumed per dollar of asset = larger capital charge in FTP.',
  },
  sofr: {
    term: 'SOFR',
    body: 'Secured Overnight Financing Rate. The benchmark US overnight rate, set by actual repo-market transactions collateralized by Treasuries. It replaced LIBOR as the reference rate for floating-rate loans and swaps. "SOFR + 250" means the loan\'s rate resets periodically to whatever overnight money costs, plus a fixed 2.50% margin.',
  },
  fedFunds: {
    term: 'Fed Funds',
    body: 'The overnight rate at which US banks lend reserves to each other. The Federal Reserve targets this rate, which acts as the anchor for nearly every other US interest rate. When market commentary says "the Fed raised rates," it means the Fed Funds target moved.',
  },
};

// Convenience export
export const DATA = {
  PLACEHOLDER_RATES, BALLOON, AMORTIZING,
  ACCOUNT_PATHS, COHORT_SHAPES,
  BETA_DEFAULTS, CAPITAL_DEFAULTS, HELOC,
  MATRIX_ROWS, MATRIX_COLS,
};
