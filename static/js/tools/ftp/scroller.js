// Scroll engine — sticky-scene scrollytelling.
//
// Layout is CSS (position: sticky); this module only tracks WHERE the
// reader is. A trigger line sits at 55% of the viewport. The scene and
// step under that line are active; progress through the active step is
// beatT ∈ [0,1], which sweep beats map onto time / n / tenor.
//
// Beats are discrete: a beat ACTIVATES (card appears, chart snaps to the
// beat's start state) when the step top crosses the trigger line, but
// beatT stays 0 until the step card reaches its sticky lock position.
// Only then does continued scroll drive the sweep — text first, then
// motion. The lock position is read from the card's computed sticky
// `top`, so CSS (including breakpoints) stays the single source of truth.
//
// Events (on document):
//   ftp:beat     — active beat changed  {sceneId, beatId, beatIdx, stepEl, sceneEl}
//   ftp:progress — every scroll frame   {sceneId, beatId, beatIdx, beatT}
//
// Debug: ?beat=<sceneId>.<beatIdx>[&t=0.5] scrolls there on load.
// Console: window.FTPDEBUG.goto('loan', 5, 0.5)

const TRIGGER = 0.55;

// Sticky-card lock line in px, or null when the card isn't sticky
// (overlay scenes keep the plain trigger-relative progress).
function lockYOf(stepEl) {
  const card = stepEl.querySelector('.step__card');
  if (!card) return null;
  const cs = getComputedStyle(card);
  if (cs.position !== 'sticky') return null;
  const top = parseFloat(cs.top);
  return Number.isNaN(top) ? null : top;
}

// Progress through a step: 0 until the card locks, 1 when the next step
// is about to take over (step bottom reaches the trigger line).
function progressOf(stepEl, r, vh) {
  const lockY = lockYOf(stepEl);
  if (lockY == null) return (vh * TRIGGER - r.top) / Math.max(1, r.height);
  const sweepLen = r.height - (vh * TRIGGER - lockY);
  return (lockY - r.top) / Math.max(1, sweepLen);
}

export function mountScroller() {
  const scenes = Array.from(document.querySelectorAll('.scene')).map(el => ({
    el,
    id: el.getAttribute('data-scene'),
    title: el.getAttribute('data-title') || '',
    steps: Array.from(el.querySelectorAll('.step')),
  }));

  const progressBar = document.querySelector('.story__progress i');
  const chapterEl = document.querySelector('.story__chapter');

  let last = { sceneId: null, beatIdx: -1 };

  function update() {
    const vh = window.innerHeight;
    const triggerY = vh * TRIGGER;

    if (progressBar) {
      const doc = document.documentElement;
      const p = doc.scrollTop / Math.max(1, doc.scrollHeight - vh);
      progressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`;
    }

    let active = null;
    for (const scene of scenes) {
      const r = scene.el.getBoundingClientRect();
      if (r.top <= triggerY && r.bottom >= triggerY) { active = scene; break; }
    }

    if (chapterEl) {
      if (active) chapterEl.textContent = active.title;
      chapterEl.classList.toggle('is-visible', !!active);
    }
    if (!active || active.steps.length === 0) return;

    const steps = active.steps;
    let idx = -1, t = 0;
    for (let i = 0; i < steps.length; i++) {
      const r = steps[i].getBoundingClientRect();
      if (triggerY < r.top) {
        // In the gap before this step: the previous step is complete.
        if (i === 0) { idx = 0; t = 0; } else { idx = i - 1; t = 1; }
        break;
      }
      if (triggerY <= r.bottom) {
        idx = i;
        t = Math.max(0, Math.min(1, progressOf(steps[i], r, vh)));
        break;
      }
    }
    if (idx === -1) { idx = steps.length - 1; t = 1; }

    const stepEl = steps[idx];
    const beatId = stepEl.getAttribute('data-beat');

    steps.forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
      s.classList.toggle('is-past', i < idx);
    });

    if (last.sceneId !== active.id || last.beatIdx !== idx) {
      last = { sceneId: active.id, beatIdx: idx };
      document.dispatchEvent(new CustomEvent('ftp:beat', {
        detail: { sceneId: active.id, beatId, beatIdx: idx, stepEl, sceneEl: active.el },
      }));
    }
    document.dispatchEvent(new CustomEvent('ftp:progress', {
      detail: { sceneId: active.id, beatId, beatIdx: idx, beatT: t },
    }));
  }

  let rafId = null;
  function schedule() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { rafId = null; update(); });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();

  // ---- debug jump -----------------------------------------------------
  function goto(sceneId, beatIdx, t = 0.5) {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const step = scene.steps[Math.max(0, Math.min(scene.steps.length - 1, beatIdx))];
    if (!step) return;
    const vh = window.innerHeight;
    const r = step.getBoundingClientRect();
    const lockY = lockYOf(step);
    let y;
    if (lockY == null) {
      y = window.scrollY + r.top + t * r.height - vh * TRIGGER;
    } else {
      // Invert progressOf: land so the card is locked and sweep = t.
      const sweepLen = r.height - (vh * TRIGGER - lockY);
      y = window.scrollY + r.top - lockY + t * Math.max(1, sweepLen);
    }
    window.scrollTo(0, Math.max(0, y));
    update();
  }
  window.FTPDEBUG = { goto, scenes };

  const params = new URLSearchParams(location.search);
  const target = params.get('beat');
  if (target) {
    const [sid, bidx] = target.split('.');
    const t = parseFloat(params.get('t') || '0.5');
    // Jump twice: once after layout, again after fonts/charts settle.
    setTimeout(() => goto(sid, parseInt(bidx || '0', 10), t), 250);
    setTimeout(() => goto(sid, parseInt(bidx || '0', 10), t), 1200);
  }

  return { update, goto };
}
