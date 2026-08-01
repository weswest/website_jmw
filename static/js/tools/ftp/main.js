// FTP Explainer — entry point (scrollytelling mode).
//
// The scroller tracks the reader; scene modules own their pinned
// graphics. Scenes mount lazily the first time they enter the viewport
// (so hidden containers are never measured at zero size) and re-mount on
// resize with their last state re-applied.

const v = new URL(import.meta.url).searchParams.get('v') || '';
const bust = v ? `?v=${v}` : '';

const [
  { DATA, GLOSSARY },
  { mountGlossary },
  { mountScroller },
  { mountMillScene },
  { mountLoanScene },
  { mountOptionScene },
  { mountDepositsScene },
  { mountCurveScene },
  { mountBetaScene },
  { mountLedgerScene },
] = await Promise.all([
  import(`./data.js${bust}`),
  import(`./glossary.js${bust}`),
  import(`./scroller.js${bust}`),
  import(`./scenes/mill.js${bust}`),
  import(`./scenes/loan.js${bust}`),
  import(`./scenes/option.js${bust}`),
  import(`./scenes/deposits.js${bust}`),
  import(`./scenes/curve.js${bust}`),
  import(`./scenes/beta.js${bust}`),
  import(`./scenes/ledger.js${bust}`),
]);

window.FTP = { DATA, GLOSSARY };

function init() {
  if (typeof window.d3 === 'undefined') {
    console.error('[FTP] D3 not loaded; aborting.');
    return;
  }
  const d3 = window.d3;

  mountGlossary({ d3, DATA, GLOSSARY });

  const FACTORIES = {
    mill: el => mountMillScene({ d3, el, variant: 'open' }),
    close: el => mountMillScene({ d3, el, variant: 'close' }),
    loan: el => mountLoanScene({ d3, el, DATA }),
    option: el => mountOptionScene({ d3, el }),
    deposits: el => mountDepositsScene({ d3, el, DATA }),
    curve: el => mountCurveScene({ d3, el, DATA }),
    beta: el => mountBetaScene({ d3, el, DATA }),
    ledger: el => mountLedgerScene({ d3, el }),
  };

  const instances = new Map(); // sceneId → {instance, el}
  const lastState = new Map(); // sceneId → {beatId, beatT}

  function beatsOf(sceneId) {
    const sceneEl = document.querySelector(`.scene[data-scene="${sceneId}"]`);
    if (!sceneEl) return [];
    return Array.from(sceneEl.querySelectorAll('.step')).map(s => s.getAttribute('data-beat'));
  }

  function ensure(sceneId) {
    if (instances.has(sceneId)) return instances.get(sceneId).instance;
    const factory = FACTORIES[sceneId];
    const el = document.querySelector(`[data-scene-viz="${sceneId}"]`);
    if (!factory || !el) return null;
    try {
      const instance = factory(el);
      instances.set(sceneId, { instance, el });
      return instance;
    } catch (e) {
      console.error(`[FTP] scene "${sceneId}" failed to mount:`, e);
      return null;
    }
  }

  function apply(sceneId, beatId, beatT) {
    const instance = ensure(sceneId);
    if (!instance) return;
    lastState.set(sceneId, { beatId, beatT });
    try {
      instance.update(beatId, beatT);
    } catch (e) {
      console.error(`[FTP] scene "${sceneId}" beat "${beatId}":`, e);
    }
  }

  document.addEventListener('ftp:progress', e => {
    const { sceneId, beatId, beatT } = e.detail;
    apply(sceneId, beatId, beatT);
  });

  // Mount scenes as they approach the viewport, painted to whichever end
  // the reader is entering from.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sceneEl = entry.target;
      const sceneId = sceneEl.getAttribute('data-scene');
      if (instances.has(sceneId)) return;
      const beats = beatsOf(sceneId);
      if (!beats.length) return;
      const fromBelow = sceneEl.getBoundingClientRect().top < 0;
      apply(sceneId, fromBelow ? beats[beats.length - 1] : beats[0], fromBelow ? 1 : 0);
    });
  }, { rootMargin: '25% 0px 25% 0px' });
  document.querySelectorAll('.scene').forEach(s => observer.observe(s));

  const scroller = mountScroller();

  // Re-mount mounted scenes on resize (SVG viewBoxes are sized in real px).
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const mounted = Array.from(instances.keys());
      instances.clear();
      mounted.forEach(sceneId => {
        const st = lastState.get(sceneId);
        if (st) apply(sceneId, st.beatId, st.beatT);
      });
      scroller.update();
    }, 200);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
