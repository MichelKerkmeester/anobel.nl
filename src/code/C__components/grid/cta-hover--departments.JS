// Afdeling: CTA
// Hover Animation
(() => {
  /* Pull Motion APIs */
  const { animate } = window.motion || {};
  if (!animate) {
    console.warn('Motion.dev not found');
    return;
  }

  const isPointerHover = matchMedia('(min-width:768px) and (hover:hover)').matches;
  if (!isPointerHover) return; // Bail on touch devices

  document.querySelectorAll('.grid--card-department.is--cta').forEach(card => {
    const btn = card.querySelector('#cta');
    if (!btn) return;

    // Mouse enter (Hover)
    card.addEventListener('pointerenter', () => {
      animate(
        btn, { backgroundColor: 'var(--_color-tokens---bg-brand--dark)' }, {
          duration: 0.05,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    });

    // Mouse leave (Enabled)
    card.addEventListener('pointerleave', () => {
      animate(
        btn, { backgroundColor: 'var(--_color-tokens---bg-brand--base)' }, {
          duration: 0.05,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    });
  });
})();
