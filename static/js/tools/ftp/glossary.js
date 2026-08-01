// Glossary — click-to-learn popovers driven by inline <dfn data-term="...">.
// Definitions live in data.js GLOSSARY object.

export function mountGlossary({ GLOSSARY }) {
  const dfns = Array.from(document.querySelectorAll('dfn[data-term]'));
  if (dfns.length === 0) return;

  // One popover element shared across all terms
  const popover = document.createElement('div');
  popover.className = 'glossary-popover';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'false');
  popover.innerHTML = `
    <button class="glossary-popover__close" aria-label="Close">×</button>
    <span class="glossary-popover__term"></span>
    <div class="glossary-popover__body"></div>
  `;
  document.body.appendChild(popover);

  const termEl = popover.querySelector('.glossary-popover__term');
  const bodyEl = popover.querySelector('.glossary-popover__body');
  const closeBtn = popover.querySelector('.glossary-popover__close');

  let activeDfn = null;

  function hide() {
    popover.classList.remove('is-visible');
    if (activeDfn) {
      activeDfn.classList.remove('is-open');
      activeDfn.setAttribute('aria-expanded', 'false');
      activeDfn = null;
    }
  }

  function show(dfn) {
    const key = dfn.getAttribute('data-term');
    const entry = GLOSSARY[key];
    if (!entry) {
      console.warn(`[FTP] Unknown glossary term: ${key}`);
      return;
    }
    if (activeDfn === dfn) {
      hide();
      return;
    }
    if (activeDfn) {
      activeDfn.classList.remove('is-open');
      activeDfn.setAttribute('aria-expanded', 'false');
    }
    activeDfn = dfn;
    dfn.classList.add('is-open');
    dfn.setAttribute('aria-expanded', 'true');

    termEl.textContent = entry.term;
    bodyEl.textContent = entry.body;

    // Position the popover below the dfn, clamped to viewport
    const rect = dfn.getBoundingClientRect();
    popover.classList.add('is-visible');
    // Force layout so we know popover dims
    const pw = popover.offsetWidth;
    const ph = popover.offsetHeight;
    const margin = 12;
    let left = rect.left + window.scrollX;
    if (left + pw + margin > window.innerWidth + window.scrollX) {
      left = window.innerWidth + window.scrollX - pw - margin;
    }
    let top = rect.bottom + window.scrollY + 6;
    // If we're near the bottom of the viewport, flip up
    if (rect.bottom + ph + margin > window.innerHeight) {
      top = rect.top + window.scrollY - ph - 6;
    }
    popover.style.left = `${Math.max(margin, left)}px`;
    popover.style.top = `${Math.max(margin, top)}px`;
  }

  dfns.forEach((dfn) => {
    dfn.setAttribute('role', 'button');
    dfn.setAttribute('tabindex', '0');
    dfn.setAttribute('aria-expanded', 'false');
    dfn.addEventListener('click', (e) => {
      e.stopPropagation();
      show(dfn);
    });
    dfn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(dfn);
      }
    });
  });

  closeBtn.addEventListener('click', hide);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeDfn) hide();
  });
  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && activeDfn && !activeDfn.contains(e.target)) hide();
  });
}
