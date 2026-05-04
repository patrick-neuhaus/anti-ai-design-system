// ============================================================
// Apresentação Plus by Artemis — slide engine
// vanilla JS. arrow keys, space, F (fullscreen), Home/End
// ============================================================
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;

  const counter = document.querySelector('.counter');
  const progressBar = document.querySelector('.progress-bar');

  function go(i) {
    if (i < 0 || i >= total) return;
    slides[current].classList.remove('is-active');
    current = i;
    slides[current].classList.add('is-active');
    if (counter) counter.textContent = `${current + 1} / ${total}`;
    if (progressBar) progressBar.style.width = `${((current + 1) / total) * 100}%`;
    // sync URL hash for deep link
    history.replaceState(null, '', `#${current + 1}`);
  }

  function next() { go(Math.min(current + 1, total - 1)); }
  function prev() { go(Math.max(current - 1, 0)); }

  document.addEventListener('keydown', (e) => {
    // ignore inside iframe-focused slides? always handle parent keys
    if (e.target.tagName === 'IFRAME') return;
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(total - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        break;
    }
  });

  // click navigation: left half = prev, right half = next (only when no demo iframe)
  document.querySelector('.stage')?.addEventListener('click', (e) => {
    if (e.target.closest('iframe')) return;
    if (e.target.closest('.demo-frame')) return;
    if (e.target.closest('a')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) prev(); else next();
  });

  // initial: respect hash
  const hash = parseInt(location.hash.slice(1), 10);
  if (hash && hash >= 1 && hash <= total) {
    go(hash - 1);
  } else {
    go(0);
  }
})();
