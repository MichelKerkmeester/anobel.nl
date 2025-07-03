// ───────────────────────────────────────────────────────────────
// Link: General
// Hover Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Initial State Setup (Prevent Flickering)
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Only apply on desktop & tablet
    if (window.innerWidth < 768) return;

    const containers = document.querySelectorAll(".link--general");
    containers.forEach((container) => {
      const line = container.querySelector(".link--divider-line");

      if (line) {
        line.style.width = "0%";
        line.style.willChange = "width";
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initLinkAnimation() {
    const { animate } = window.Motion || {};
    if (!animate) {
      setTimeout(initLinkAnimation, 100);
      return;
    }

    // Only apply on desktop & tablet
    if (window.innerWidth < 768) return;

    /* ─────────────────────────────────────────────────────────────
       3. Animation Properties
    ────────────────────────────────────────────────────────────────*/
    const duration = 0.6;
    const easing = [0.22, 1, 0.36, 1]; // Ease Out

    const containers = document.querySelectorAll(".link--general");

    containers.forEach((container) => {
      // Prevent duplicate event listeners
      if (container.dataset.generalLinkAnimated === "true") return;
      container.dataset.generalLinkAnimated = "true";

      const line = container.querySelector(".link--divider-line");

      if (!line) return;

      // Hover in animation
      const hoverIn = () => {
        animate(
          line,
          { width: ["0%", "100%"] },
          {
            duration,
            easing,
          }
        );
      };

      // Hover out animation
      const hoverOut = () => {
        animate(
          line,
          { width: ["100%", "0%"] },
          {
            duration,
            easing,
          }
        );
      };

      // Add event listeners
      container.addEventListener("mouseenter", hoverIn);
      container.addEventListener("mouseleave", hoverOut);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. Initialize
  ────────────────────────────────────────────────────────────────*/
  setupInitialStates();
  initLinkAnimation();
})();
