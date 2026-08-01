// Scene: the reckoning — the two-sided FTP ledger, built as HTML bars.
// Beats reveal stages: asset side → deposit side → deductions/options →
// the full attributable ledger with the three team scores.
// Every number comes from the model.

import { theme } from '../chart-kit.js';
import { DERIVED } from '../model.js';

export function mountLedgerScene({ d3, el }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('ledger');

  const L = DERIVED.loan, D = DERIVED.deposit;
  const MAX = 7.0; // bar scale: 7.00% = full width
  const bar = (val, color, opacity = 0.85, split = null) => {
    const w = Math.abs(val) / MAX * 100;
    if (split) {
      const w1 = split[0] / MAX * 100, w2 = split[1] / MAX * 100;
      return `<div class="lrow__bar"><i style="width:${w1}%;background:${T.spread}"></i><i style="width:${w2}%;background:${T.liability}"></i></div>`;
    }
    return `<div class="lrow__bar"><i style="width:${w}%;background:${color};opacity:${opacity}"></i></div>`;
  };
  const row = (stage, label, val, barHtml, cls = '') =>
    `<div class="lrow ${cls}" data-s="${stage}"><span class="lrow__label">${label}</span>${barHtml}<b class="lrow__val">${val}</b></div>`;

  el.innerHTML = `
    <div class="ledger__grid">
      <div class="ledger__col" data-s="1">
        <div class="ledger__head">The loan <em>· asset side</em></div>
        ${row(1, 'Customer rate', `${L.rate}%`, bar(+L.rate, T.asset))}
        ${row(1, 'FTP charge (5y)', `−${L.ftpCharge}%`, bar(+L.ftpCharge, T.liability))}
        ${row(1, 'Gross spread', `+${L.gross}%`, bar(+L.gross, T.spread), 'lrow--result')}
        ${row(3, 'Expected credit losses', `−${L.ecl}%`, bar(+L.ecl, T.asset, 0.45))}
        ${row(3, 'Capital charge', `−${L.capital}%`, bar(+L.capital, T.ink, 0.3))}
        ${row(3, 'Franchise spread', `+${L.franchise}%`, bar(+L.franchise, T.spread), 'lrow--result lrow--final')}
      </div>
      <div class="ledger__col" data-s="2">
        <div class="ledger__head">The checking cohort <em>· deposit side</em></div>
        ${row(2, 'FTP credit (β split)', `${D.credit}%`, bar(D.creditVal, T.spread, 0.85, [D.termLegVal, D.floatLegVal]))}
        ${row(2, 'Rate paid to customer', `−${D.ratePaid}%`, bar(D.ratePaidVal, T.ruleSoft, 0.8))}
        ${row(2, 'Franchise spread', `+${D.spread}%`, bar(D.spreadVal, T.spread), 'lrow--result lrow--final')}
      </div>
    </div>
    <div class="ledger__options" data-s="3">
      <span class="ledger__opt-label">options, priced where written — this balloon loan owes none; the Chapter&nbsp;2 mortgage pays:</span>
      <span class="ledger__chip">mortgage prepay <b>+${DERIVED.mortgage.optionBps}bps</b></span>
      <span class="ledger__chip">promo-rate floor <b>haircut</b></span>
      <span class="ledger__chip">HELOC standby <b>+80bps</b></span>
    </div>
    <div class="ledger__teams" data-s="4">
      <span class="ledger__team"><em>Lending</em><b>+${L.franchise}%</b><i>franchise spread · origination</i></span>
      <span class="ledger__team"><em>Deposits</em><b>+${D.spread}%</b><i>franchise spread · funding</i></span>
      <span class="ledger__team"><em>Treasury</em><b>the residual</b><i>rate risk, managed</i></span>
    </div>`;

  const staged = Array.from(el.querySelectorAll('[data-s]'));
  const STAGE = { asset: 1, deposit: 2, refine: 3, full: 4 };

  function setStage(n) {
    staged.forEach(node => {
      node.classList.toggle('is-on', parseInt(node.getAttribute('data-s'), 10) <= n);
    });
  }
  setStage(1);

  return {
    update(beatId) {
      setStage(STAGE[beatId] || 1);
    },
  };
}
