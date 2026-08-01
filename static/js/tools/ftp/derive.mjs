// FTP Explainer — derivation runner.
//
//   node static/js/tools/ftp/derive.mjs
//
// Prints every landmark number the piece uses, asserts the arithmetic
// identities the story states (in DISPLAY space — after rounding to what
// the reader sees), and greps the prose for each display string so the
// narrative can't silently drift from the model. Exit code 1 on any
// failed assertion or missing prose number.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  PARAMS, DERIVED, baseRate, tsyRate, ftpRate, tlpBps,
  termSofrRate, overnightSofr, fundingPremium, fundingRate, renewalBook,
  mortgagePool, walOf, cprForScenario, optionCostBps, depositShapes,
} from './model.js';

const here = dirname(fileURLToPath(import.meta.url));
const MD_PATH = resolve(here, '../../../../content/tools/funds-transfer-pricing.md');

let failures = 0;
const ok = (cond, label) => {
  console.log(`${cond ? '  ✓' : '  ✗ FAIL'} ${label}`);
  if (!cond) failures++;
};
const d2 = v => v.toFixed(2);

// ---- 1. The curve -------------------------------------------------------
console.log('\n== Curve (tenor → tsy / base / FTP, %) ==');
const tenors = PARAMS.curve.base.map(([t]) => t);
for (const t of tenors) {
  const lbl = t < 1 ? `${Math.round(t * 12)}m` : `${t}y`;
  console.log(`  ${lbl.padStart(4)}  ${d2(tsyRate(t))}  ${d2(baseRate(t))}  ${d2(ftpRate(t))}   (TLP ${tlpBps(t).toFixed(1)}bp)`);
}
const rising = pts => pts.every((v, i) => i === 0 || v > pts[i - 1]);
ok(rising(tenors.map(tsyRate)), 'Treasury curve is strictly upward-sloping');
ok(rising(tenors.map(baseRate)), 'base curve is strictly upward-sloping');
ok(rising(tenors.map(ftpRate)), 'FTP curve is strictly upward-sloping');
ok(tenors.every(t => tsyRate(t) < baseRate(t)), 'Treasuries sit below the base curve everywhere');

console.log('\n== Curve decomposition (Ch 5) ==');
const C = DERIVED.curve;
console.log(`  o/n SOFR ${C.onSofr} · term SOFR(5y) ${C.termSofr5} · TLP ${C.tlpSplit5} · funding premium ${C.fpSplit5} → FTP(5y) ${C.ftp5}`);
console.log(`  funding at 5y: brokered ${(fundingRate(5, 0)).toFixed(2)} · 50/50 ${(fundingRate(5, 0.5)).toFixed(2)} · FHLB ${(fundingRate(5, 1)).toFixed(2)}`);
ok(rising(tenors.map(termSofrRate)), 'term SOFR curve is strictly upward-sloping');
ok(tenors.every(t => termSofrRate(t) >= tsyRate(t)), 'term SOFR sits at/above Treasuries');
ok(Math.abs(overnightSofr() - baseRate(1 / 12)) < 1e-9, 'o/n SOFR anchors the front of the base curve');
ok(tenors.every(t => fundingPremium(t) >= 0), 'funding premium is non-negative at every tenor');
ok(tenors.every(t => Math.abs(fundingRate(t, 0.5) - ftpRate(t)) < 1e-9), '50/50 brokered/FHLB blend reproduces the FTP curve exactly');
ok(tenors.every(t => fundingRate(t, 0) >= fundingRate(t, 1)), 'brokered CDs cost at least FHLB at every tenor');
ok(tenors.slice(3).every(t => fundingRate(t, 1) > termSofrRate(t)), 'FHLB still costs more than term SOFR (1y+)');
ok(d2(+C.onSofr + +C.tlpSplit5 + +C.fpSplit5) === C.ftp5,
  `three-part split foots in display space: ${C.onSofr} + ${C.tlpSplit5} + ${C.fpSplit5} = ${C.ftp5}`);

// ---- 2. The ledger identities (display space) ---------------------------
console.log('\n== Loan-side ledger ==');
const L = DERIVED.loan;
console.log(`  customer ${L.rate} − FTP(5y) ${L.ftpCharge} = gross ${L.gross}`);
console.log(`  gross ${L.gross} − ECL ${L.ecl} − capital ${L.capital} = franchise ${L.franchise}`);
ok(d2(+L.rate - +L.ftpCharge) === L.gross, `7.00 − ${L.ftpCharge} = ${L.gross} foots`);
ok(d2(+L.gross - +L.ecl - +L.capital) === L.franchise, `${L.gross} − 0.50 − 0.60 = ${L.franchise} foots`);

console.log('\n== Chapter-2 NII set ==');
console.log(`  matched $${L.niiMatched.toLocaleString()} · naive $${L.niiNaive.toLocaleString()} · uniform ladder $${L.niiUniform.toLocaleString()} · tiered $${L.niiTiered.toLocaleString()}`);
console.log(`  tiered yearly expense: [${L.tieredYearly.map(v => Math.round(v)).join(', ')}]`);
ok(L.niiMatched === 15000, 'matched NII = $15,000');
ok(L.niiNaive === 1000, 'naive NII = $1,000');
ok(L.niiUniform === 9000, 'uniform-ladder NII = $9,000');
ok(L.niiTiered === 11000, 'tiered-ladder NII = $11,000 (widened term spread)');
ok(L.tieredYearly.every((v, i) => [3000, 2600, 2100, 1500, 800][i] === Math.round(v)),
  'tiered yearly expense = [3000, 2600, 2100, 1500, 800]');
const bal36 = PARAMS.amortizing.principal - PARAMS.amortizing.paydownPerYear * 3;
ok(bal36 === 40000, 'start of year four: $40,000 of loan remains (naive-beat card)');

// ---- 3. Mortgage --------------------------------------------------------
console.log('\n== Mortgage ==');
const M = DERIVED.mortgage;
console.log(`  solved CPR ${(M.cpr0 * 100).toFixed(2)}% → WAL ${M.wal.toFixed(2)}y (target ${PARAMS.mortgage.walYears})`);
console.log(`  FTP read at ${M.walDisplay}y = ${M.read}% · prepay option ${M.optionBps}bps`);
ok(Math.abs(M.wal - PARAMS.mortgage.walYears) < 0.02, `mortgage WAL solves to ${PARAMS.mortgage.walYears}y`);
console.log('  scenarios (Δbps → CPR → WAL → option bps):');
for (const { d } of PARAMS.mortgage.scenarioAnchors.map(a => ({ d: a.d }))) {
  const cpr = cprForScenario(d);
  const wal = walOf(mortgagePool(cpr));
  console.log(`    ${String(d).padStart(5)}  ${(cpr * 100).toFixed(1).padStart(5)}%  ${wal.toFixed(2)}y  ${Math.round(optionCostBps(d))}bp`);
}
const walDown = walOf(mortgagePool(cprForScenario(-250)));
const walUp = walOf(mortgagePool(cprForScenario(250)));
ok(walDown > 5.4 && walDown < 5.6, 'rates −250bp → WAL ≈ 5.5y (band floor)');
ok(walUp <= 8.05, 'rates +250bp → WAL ≤ 8y (band ceiling)');
const walFalls = walOf(mortgagePool(cprForScenario(-150)));
ok(walFalls > 5.9 && walFalls < 6.4, 'rates −150bp → WAL ≈ 6y ("toward six years" card)');
ok((M.wal - walDown) > 2.5 * (walUp - M.wal), 'prepay risk is asymmetric: contraction ≫ extension');

// ---- 4. Deposit ---------------------------------------------------------
console.log('\n== Deposit (checking cohort) ==');
const D = DERIVED.deposit;
console.log(`  survival at wall: ${D.survivalPct}% at ${PARAMS.deposit.truncationMonths / 12}y → survivor floor ${D.survivorFloor}y`);
console.log(`  truncated WAL ${D.wal.toFixed(2)}y → FTP read ${D.read}%`);
console.log(`  credit: ${D.betaTermPct}% × ${D.read} + ${D.betaFloatPct}% × ${DERIVED.curve.overnight} = ${D.termLeg} + ${D.floatLeg} = ${D.credit}`);
console.log(`  spread: ${D.credit} − ${D.ratePaid} paid = ${D.spread}`);
ok(D.wal > 5 && D.wal < 6, 'deposit WAL lands in the 5–6y band the story claims');
ok(D.wal > +D.survivorFloor, 'WAL exceeds the survivors-alone floor (0.60 × 7y)');
ok(d2(+D.termLeg + +D.floatLeg) === D.credit, `display legs foot: ${D.termLeg} + ${D.floatLeg} = ${D.credit}`);
ok(d2(+D.credit - +D.ratePaid) === D.spread, `display spread foots: ${D.credit} − ${D.ratePaid} = ${D.spread}`);
const wall = PARAMS.deposit.truncationMonths;
ok(Math.abs(depositShapes.checking[wall] - PARAMS.deposit.survivalAtWall) < 1e-9, 'decay curve hits the survival target exactly at the wall');

console.log('\n== Renewing savings book ==');
const book = renewalBook(10);
const drift = Math.max(...book.total.map(v => Math.abs(v - 1)));
const backEnd = book.series[0].values[120];
console.log(`  layers ${book.series.length} · max total drift ${(drift * 100).toExponential(2)}% · back book after 10y ${(backEnd * 100).toFixed(1)}%`);
ok(drift < 1e-9, 'renewing book total is flat by construction');
ok(backEnd > 0.10 && backEnd < 0.20, 'back book decays to ~15% after 10 years (half-life ≈ 3.6y)');
ok(book.series.slice(1, -1).every(s => {
  const peak = Math.max(...s.values);
  return s.values[120] < peak; // every closed vintage is past its peak and shrinking
}), 'every vintage layer shrinks after its accumulation year');

// ---- 5. Prose grep ------------------------------------------------------
console.log('\n== Prose check ==');
let md = '';
try { md = readFileSync(MD_PATH, 'utf8'); } catch { console.log('  (prose file not found — skipped)'); }
if (md) {
  const expect = [
    [L.ftpCharge, 'FTP charge (5y)'],
    [L.gross, 'gross spread'],
    [L.franchise, 'loan franchise spread'],
    [`$${L.niiTiered.toLocaleString()}`, 'tiered-ladder NII'],
    ['$40,000', 'naive-beat balance at start of year four'],
    [M.walDisplay, 'mortgage behavioral life'],
    [M.read, 'mortgage FTP read'],
    [`${M.optionBps}bps`, 'prepay option charge'],
    [D.walDisplay, 'deposit behavioral life'],
    [D.read, 'deposit FTP read'],
    [D.credit, 'deposit blended credit'],
    [D.spread, 'deposit franchise spread'],
    [D.ratePaid, 'deposit rate paid'],
    [DERIVED.curve.overnight, 'overnight rate'],
    [`${DERIVED.curve.tlpSplit5} term liquidity`, 'TLP split at 5y'],
    [`${DERIVED.curve.fpSplit5} funding`, 'funding premium split at 5y'],
    [`${D.survivalPct}%`, 'survival at the wall'],
    [D.survivorFloor, 'survivor floor years'],
  ];
  for (const [needle, label] of expect) {
    ok(md.includes(needle), `prose contains "${needle}" (${label})`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll checks pass.\n');
process.exit(failures ? 1 : 0);
