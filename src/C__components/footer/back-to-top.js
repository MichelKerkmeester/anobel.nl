// ───────────────────────────────────────────────────────────────
// Footer: Back to Top
// Smooth scroll to page top with reduced motion support
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     Desktop Only: Early return for mobile/tablet
  ────────────────────────────────────────────────────────────────*/
  if (window.innerWidth < 992) return;

  /* ─────────────────────────────────────────────────────────────
     Back to Top Button Handler
  ────────────────────────────────────────────────────────────────*/
  const backToTopButton = document.querySelector("#back-to-top");

  if (backToTopButton) {
    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // Remove focus from button
      backToTopButton.blur();
    });
  }
})();
