// Scene: the timber company — a hand-drawn SVG illustration of one
// company with two arms (logging + home building), which morphs in place
// into a bank. Color carries the mapping: the funding side wears blue,
// the asset side red, and the price tag gold.
//
// variant 'open'  — beats: meet, one-pnl, free-lumber, market-price, two-pnls, bank
// variant 'close' — beats: scoreboard, end

import { theme } from '../chart-kit.js';
import { DERIVED } from '../model.js';

export function mountMillScene({ d3, el, variant = 'open' }) {
  const T = theme();
  el.innerHTML = '';
  el.classList.add('mill');

  const svg = d3.select(el).append('svg')
    .attr('class', 'mill__svg')
    .attr('viewBox', '0 0 1000 560')
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const root = svg.append('g');
  const G = 470; // ground y

  // ---- ground --------------------------------------------------------
  root.append('line').attr('x1', 40).attr('x2', 960).attr('y1', G).attr('y2', G)
    .attr('stroke', T.rule).attr('stroke-width', 2.5).attr('stroke-linecap', 'round');

  // ---- hanging banner ------------------------------------------------
  const banner = root.append('g');
  banner.append('line').attr('x1', 430).attr('y1', 0).attr('x2', 438).attr('y2', 36).attr('stroke', T.rule).attr('stroke-width', 1.5);
  banner.append('line').attr('x1', 570).attr('y1', 0).attr('x2', 562).attr('y2', 36).attr('stroke', T.rule).attr('stroke-width', 1.5);
  banner.append('rect').attr('x', 350).attr('y', 36).attr('width', 300).attr('height', 64).attr('rx', 6)
    .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 2);
  banner.append('text').attr('class', 'mill-banner t-timber').attr('x', 500).attr('y', 66).attr('text-anchor', 'middle').text('CASCADE TIMBER CO.');
  banner.append('text').attr('class', 'mill-banner t-bank').attr('x', 500).attr('y', 66).attr('text-anchor', 'middle').text('THE BANK');
  banner.append('text').attr('class', 'mill-banner-sub t-timber').attr('x', 500).attr('y', 88).attr('text-anchor', 'middle').text('one company · two arms');
  banner.append('text').attr('class', 'mill-banner-sub t-bank').attr('x', 500).attr('y', 88).attr('text-anchor', 'middle').text('one balance sheet · two businesses');

  // ---- left arm: logging / deposits ---------------------------------
  const gLeft = root.append('g').attr('class', 'mill__arm mill__arm--left');

  function conifer(g, x, h) {
    const t = g.append('g');
    t.append('rect').attr('x', x - 4).attr('y', G - 16).attr('width', 8).attr('height', 16)
      .attr('fill', T.ruleSoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
    [0.0, 0.32, 0.58].forEach((off, i) => {
      const base = G - 16 - off * h;
      const half = (h * 0.30) * (1 - off * 0.55);
      const tip = base - h * (0.42 - i * 0.03);
      t.append('polygon')
        .attr('points', `${x - half},${base} ${x + half},${base} ${x},${tip}`)
        .attr('fill', T.liabilitySoft).attr('stroke', T.rule).attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round');
    });
    return t;
  }
  conifer(gLeft, 82, 85);
  conifer(gLeft, 122, 125);
  conifer(gLeft, 165, 95);

  // log pile (timber only)
  const logs = gLeft.append('g').attr('class', 't-timber');
  [[215, G - 14], [243, G - 14], [229, G - 38]].forEach(([cx, cy]) => {
    logs.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 14)
      .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 2);
    logs.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 5)
      .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 1);
  });
  // coin stack (bank only) — same spot
  const coins = gLeft.append('g').attr('class', 't-bank');
  [[229, G - 10], [229, G - 24], [229, G - 38]].forEach(([cx, cy]) => {
    coins.append('ellipse').attr('cx', cx).attr('cy', cy).attr('rx', 22).attr('ry', 9)
      .attr('fill', T.spreadSoft).attr('stroke', T.rule).attr('stroke-width', 1.75);
  });
  coins.append('text').attr('class', 'mill-coin').attr('x', 229).attr('y', G - 34).attr('text-anchor', 'middle').text('$');

  // mill shed / bank branch
  const shed = gLeft.append('g');
  shed.append('rect').attr('x', 290).attr('y', 370).attr('width', 140).attr('height', 100)
    .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 2);
  shed.append('polygon').attr('points', `280,370 360,305 440,370`)
    .attr('fill', T.liability).attr('fill-opacity', 0.25).attr('stroke', T.rule).attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round');
  // saw blade (timber)
  const saw = shed.append('g').attr('class', 't-timber');
  saw.append('circle').attr('cx', 360).attr('cy', 424).attr('r', 30)
    .attr('fill', T.spreadSoft).attr('stroke', T.rule).attr('stroke-width', 2).attr('stroke-dasharray', '7 5');
  saw.append('circle').attr('cx', 360).attr('cy', 424).attr('r', 4).attr('fill', T.rule);
  // columns + coin (bank)
  const branch = shed.append('g').attr('class', 't-bank');
  [305, 335, 385, 415].forEach(cx => {
    branch.append('rect').attr('x', cx - 5).attr('y', 388).attr('width', 10).attr('height', 82)
      .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 1.5);
  });
  branch.append('line').attr('x1', 292).attr('x2', 428).attr('y1', 384).attr('y2', 384)
    .attr('stroke', T.rule).attr('stroke-width', 1.5);
  branch.append('circle').attr('cx', 360).attr('cy', 345).attr('r', 15)
    .attr('fill', T.spreadSoft).attr('stroke', T.rule).attr('stroke-width', 1.75);
  branch.append('text').attr('class', 'mill-coin').attr('x', 360).attr('y', 351).attr('text-anchor', 'middle').text('$');

  gLeft.append('text').attr('class', 'mill-lbl t-timber').attr('x', 250).attr('y', 512).attr('text-anchor', 'middle').text('The logging arm');
  gLeft.append('text').attr('class', 'mill-lbl t-bank').attr('x', 250).attr('y', 512).attr('text-anchor', 'middle').text('The deposit franchise');
  gLeft.append('text').attr('class', 'mill-lbl-sub t-timber').attr('x', 250).attr('y', 532).attr('text-anchor', 'middle').text('produces lumber');
  gLeft.append('text').attr('class', 'mill-lbl-sub t-bank').attr('x', 250).attr('y', 532).attr('text-anchor', 'middle').text('produces funding');

  // ---- center: the flow + the price tag ------------------------------
  const gFlow = root.append('g');
  gFlow.append('line').attr('x1', 442).attr('x2', 558).attr('y1', 436).attr('y2', 436).attr('stroke', T.rule).attr('stroke-width', 2);
  gFlow.append('line').attr('x1', 442).attr('x2', 558).attr('y1', 448).attr('y2', 448).attr('stroke', T.rule).attr('stroke-width', 2);
  for (let x = 454; x <= 546; x += 16) {
    gFlow.append('circle').attr('cx', x).attr('cy', 456).attr('r', 4)
      .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 1.5);
  }
  // the thing on the belt: plank (timber) / banknote (bank)
  const plank = gFlow.append('g').attr('class', 't-timber');
  plank.append('rect').attr('x', 474).attr('y', 424).attr('width', 52).attr('height', 10).attr('rx', 2)
    .attr('fill', T.spreadSoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
  const bill = gFlow.append('g').attr('class', 't-bank');
  bill.append('rect').attr('x', 474).attr('y', 420).attr('width', 52).attr('height', 14).attr('rx', 2)
    .attr('fill', T.spreadSoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
  bill.append('circle').attr('cx', 500).attr('cy', 427).attr('r', 4.5)
    .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 1);
  // direction chevron
  gFlow.append('polyline').attr('points', '560,428 574,442 560,456')
    .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 2)
    .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');

  // price tag on a signpost over the belt
  const gTag = root.append('g').attr('class', 'mill__tag');
  gTag.append('line').attr('x1', 500).attr('x2', 500).attr('y1', 436).attr('y2', 414)
    .attr('stroke', T.rule).attr('stroke-width', 2);
  const tagPulse = gTag.append('circle').attr('class', 'mill__tag-pulse')
    .attr('cx', 500).attr('cy', 392).attr('r', 46)
    .attr('fill', 'none').attr('stroke', T.spread).attr('stroke-width', 2).attr('opacity', 0);
  const tagRect = gTag.append('rect').attr('x', 442).attr('y', 372).attr('width', 116).attr('height', 40).attr('rx', 8)
    .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 2);
  gTag.append('circle').attr('cx', 452).attr('cy', 392).attr('r', 3.5)
    .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 1.5);
  const tagText = gTag.append('text').attr('class', 'mill-tag-text')
    .attr('x', 505).attr('y', 398).attr('text-anchor', 'middle').text('?');

  // ---- right arm: building / lending ---------------------------------
  const gRight = root.append('g').attr('class', 'mill__arm mill__arm--right');
  // framed house
  gRight.append('polygon').attr('points', `600,${G} 600,395 655,350 710,395 710,${G}`)
    .attr('fill', 'none').attr('stroke', T.rule).attr('stroke-width', 2).attr('stroke-linejoin', 'round');
  for (let x = 615; x <= 695; x += 16) {
    gRight.append('line').attr('x1', x).attr('x2', x).attr('y1', 402).attr('y2', G)
      .attr('stroke', T.rule).attr('stroke-width', 1.2).attr('opacity', 0.75);
  }
  // finished house
  gRight.append('rect').attr('x', 760).attr('y', 390).attr('width', 150).attr('height', 80)
    .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 2);
  gRight.append('polygon').attr('points', '750,390 835,330 920,390')
    .attr('fill', T.asset).attr('fill-opacity', 0.25).attr('stroke', T.rule).attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round');
  gRight.append('rect').attr('x', 880).attr('y', 345).attr('width', 14).attr('height', 28)
    .attr('fill', T.surface).attr('stroke', T.rule).attr('stroke-width', 1.5);
  gRight.append('rect').attr('x', 795).attr('y', 426).attr('width', 24).attr('height', 44)
    .attr('fill', T.ruleSoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
  const win = gRight.append('g');
  win.append('rect').attr('x', 850).attr('y', 414).attr('width', 28).attr('height', 24)
    .attr('fill', T.liabilitySoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
  win.append('line').attr('x1', 864).attr('x2', 864).attr('y1', 414).attr('y2', 438).attr('stroke', T.rule).attr('stroke-width', 1);
  win.append('line').attr('x1', 850).attr('x2', 878).attr('y1', 426).attr('y2', 426).attr('stroke', T.rule).attr('stroke-width', 1);
  // mortgage chip (bank only)
  const chip = gRight.append('g').attr('class', 't-bank');
  chip.append('rect').attr('x', 780).attr('y', 296).attr('width', 110).attr('height', 26).attr('rx', 13)
    .attr('fill', T.assetSoft).attr('stroke', T.rule).attr('stroke-width', 1.5);
  chip.append('text').attr('class', 'mill-chip').attr('x', 835).attr('y', 313).attr('text-anchor', 'middle').text('mortgage · 7%');

  gRight.append('text').attr('class', 'mill-lbl t-timber').attr('x', 755).attr('y', 512).attr('text-anchor', 'middle').text('The home-building arm');
  gRight.append('text').attr('class', 'mill-lbl t-bank').attr('x', 755).attr('y', 512).attr('text-anchor', 'middle').text('The lending business');
  gRight.append('text').attr('class', 'mill-lbl-sub t-timber').attr('x', 755).attr('y', 532).attr('text-anchor', 'middle').text('consumes lumber');
  gRight.append('text').attr('class', 'mill-lbl-sub t-bank').attr('x', 755).attr('y', 532).attr('text-anchor', 'middle').text('consumes funding');

  // ---- HTML overlay cards -------------------------------------------
  const cards = document.createElement('div');
  cards.className = 'mill__cards';
  cards.innerHTML = `
    <div class="pnl pnl--consol"></div>
    <div class="pnl pnl--mill"></div>
    <div class="pnl pnl--builder"></div>`;
  el.appendChild(cards);
  const cConsol = cards.querySelector('.pnl--consol');
  const cMill = cards.querySelector('.pnl--mill');
  const cBuilder = cards.querySelector('.pnl--builder');

  const row = (label, val, cls = '') => `<div class="pnl__row ${cls}"><span>${label}</span><b>${val}</b></div>`;
  const CARD = {
    consol: `<div class="pnl__title">Cascade Timber Co. — consolidated</div>` +
      row('Home sales', '$58M') + row('All costs', '−$46M') +
      row('Profit', '+$12M', 'pnl__row--result') +
      `<div class="pnl__note">…earned by which arm?</div>`,
    millFree: `<div class="pnl__title">The mill's P&amp;L</div>` +
      row('External sales', '$0') + row('Operating costs', '−$12M') +
      row('', '−$12M', 'pnl__row--result is-neg') +
      `<div class="pnl__note">a cost center?</div>`,
    builderFree: `<div class="pnl__title">The builder's P&amp;L</div>` +
      row('Home sales', '$58M') + row('Lumber', '$0 — free') + row('Build costs', '−$34M') +
      row('', '+$24M', 'pnl__row--result') +
      `<div class="pnl__note">a genius?</div>`,
    millHonest: `<div class="pnl__title">The mill's P&amp;L</div>` +
      row('Lumber, at market', '+$18M') + row('Operating costs', '−$12M') +
      row('', '+$6M', 'pnl__row--result is-pos'),
    builderHonest: `<div class="pnl__title">The builder's P&amp;L</div>` +
      row('Home sales', '$58M') + row('Lumber, at market', '−$18M') + row('Build costs', '−$34M') +
      row('', '+$6M', 'pnl__row--result is-pos'),
    scoreDeposits: `<div class="pnl__title">The deposit franchise</div>` +
      row('FTP credit', `${DERIVED.deposit.credit}%`) + row('Rate paid', `−${DERIVED.deposit.ratePaid}%`) +
      row('Franchise spread', `+${DERIVED.deposit.spread}%`, 'pnl__row--result is-pos'),
    scoreLending: `<div class="pnl__title">The lending business</div>` +
      row('Customer rate', `${DERIVED.loan.rate}%`) + row('FTP charge', `−${DERIVED.loan.ftpCharge}%`) +
      row('Credit + capital', `−${(+DERIVED.loan.ecl + +DERIVED.loan.capital).toFixed(2)}%`) +
      row('Franchise spread', `+${DERIVED.loan.franchise}%`, 'pnl__row--result is-pos'),
    scoreTreasury: `<div class="pnl__title">Treasury</div>` +
      `<div class="pnl__note pnl__note--solo">holds the rate risk both teams shed —<br>measured on managing it</div>`,
  };

  // ---- state machine -------------------------------------------------
  function setTag(text, gold) {
    tagText.text(text).classed('is-gold', gold).attr('font-size', text.length > 6 ? null : null);
    tagText.classed('is-long', text.length > 6);
    tagRect.attr('fill', gold ? T.spreadSoft : T.surface).attr('stroke', gold ? T.spread : T.rule);
    tagPulse.interrupt();
    if (gold) {
      tagPulse.attr('opacity', 0.8).attr('r', 40)
        .transition().duration(900).attr('opacity', 0).attr('r', 74);
    } else {
      tagPulse.attr('opacity', 0);
    }
  }

  function setCards(consol, mill, builder) {
    cConsol.innerHTML = consol || '';
    cMill.innerHTML = mill || '';
    cBuilder.innerHTML = builder || '';
    cConsol.classList.toggle('is-visible', !!consol);
    cMill.classList.toggle('is-visible', !!mill);
    cBuilder.classList.toggle('is-visible', !!builder);
  }

  function setMode(bank) {
    el.classList.toggle('mill--bank', bank);
    el.classList.toggle('mill--timber', !bank);
  }

  function setArms(left, right) { // 'dim' | 'hot' | ''
    gLeft.attr('class', `mill__arm mill__arm--left ${left ? 'is-' + left : ''}`);
    gRight.attr('class', `mill__arm mill__arm--right ${right ? 'is-' + right : ''}`);
  }

  const BEATS = {
    'meet':         () => { setMode(false); setArms('', ''); setTag('?', false); setCards(null, null, null); },
    'one-pnl':      () => { setMode(false); setArms('dim', 'dim'); setTag('?', false); setCards(CARD.consol, null, null); },
    'free-lumber':  () => { setMode(false); setArms('dim', 'hot'); setTag('$0', false); setCards(null, CARD.millFree, CARD.builderFree); },
    'market-price': () => { setMode(false); setArms('', ''); setTag('$430 / MBF', true); setCards(null, null, null); },
    'two-pnls':     () => { setMode(false); setArms('', ''); setTag('$430 / MBF', true); setCards(null, CARD.millHonest, CARD.builderHonest); },
    'bank':         () => { setMode(true); setArms('', ''); setTag('FTP', true); setCards(null, null, null); },
    'scoreboard':   () => { setMode(true); setArms('', ''); setTag('FTP', true); setCards(CARD.scoreTreasury, CARD.scoreDeposits, CARD.scoreLending); },
    'end':          () => { setMode(true); setArms('', ''); setTag('FTP', true); setCards(null, null, null); },
  };

  // initial paint
  (BEATS[variant === 'close' ? 'scoreboard' : 'meet'])();

  return {
    update(beatId) {
      const fn = BEATS[beatId];
      if (fn) fn();
    },
  };
}
