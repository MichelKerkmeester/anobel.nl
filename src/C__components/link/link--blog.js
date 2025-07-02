// ───────────────────────────────────────────────────────────────
// Link: Blog
// Hover Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Initial State Setup (Prevent Flickering)
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Only apply on desktop & tablet
    if (window.innerWidth < 768) return;

    const containers = document.querySelectorAll(".link--blog");
    containers.forEach((container) => {
      const line = container.querySelector(".link--blog-line");
      const icon = container.querySelector(".link--blog-icon.is--arrow");

      if (line) {
        line.style.width = "0%";
        line.style.willChange = "width";
      }

      if (icon) {
        icon.style.opacity = "0";
        icon.style.willChange = "opacity";
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
    const stagger = 0.2;

    const containers = document.querySelectorAll(".link--blog");

    containers.forEach((container) => {
      // Prevent duplicate event listeners
      if (container.dataset.blogLinkAnimated === "true") return;
      container.dataset.blogLinkAnimated = "true";

      const line = container.querySelector(".link--blog-line");
      const icon = container.querySelector(".link--blog-icon.is--arrow");

      if (!line) return;

      // Hover in animation
      const hoverIn = () => {
        // Line animation
        animate(
          line,
          { width: ["0%", "100%"] },
          {
            duration,
            easing,
          }
        );

        // Icon animation with stagger
        if (icon) {
          animate(
            icon,
            { opacity: [0, 1] },
            {
              duration,
              easing,
              delay: stagger,
            }
          );
        }
      };

      // Hover out animation
      const hoverOut = () => {
        // Line animation
        animate(
          line,
          { width: ["100%", "0%"] },
          {
            duration,
            easing,
          }
        );

        // Icon animation (no stagger on hover out)
        if (icon) {
          animate(
            icon,
            { opacity: [1, 0] },
            {
              duration,
              easing,
            }
          );
        }
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
