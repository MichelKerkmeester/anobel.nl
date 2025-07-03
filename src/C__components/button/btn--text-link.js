// ───────────────────────────────────────────────────────────────
// Button: Text Link (Optimized)
// Animate on Hover - Desktop & Tablet Only
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Device Detection Helpers
  ────────────────────────────────────────────────────────────────*/
  // Device detection helpers
  const isDesktopOrTablet = () => window.innerWidth >= 768;
  const isTouchDevice = () => window.innerWidth < 992;

  /* ─────────────────────────────────────────────────────────────
     2. Initial State Setup
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Only proceed if desktop or tablet
    if (!isDesktopOrTablet()) return;

    // Set initial states for underline hover elements
    const hoverElements = document.querySelectorAll(
      '.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover'
    );

    hoverElements.forEach((el) => {
      const hoverEl = /** @type {HTMLElement} */ (el);
      hoverEl.style.width = "0%";
      hoverEl.style.visibility = "hidden";
      hoverEl.style.willChange = "width";
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initTextLinkAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initTextLinkAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    const power1Out = [0.25, 0.46, 0.45, 0.94]; // "Power1 Out"

    /* ─────────────────────────────────────────────────────────────
       5. Build text link animations
    ────────────────────────────────────────────────────────────────*/
    function buildTextLinkAnimation() {
      // Only proceed if desktop or tablet
      if (!isDesktopOrTablet()) return;

      const textLinks = document.querySelectorAll(
        '.btn--text-link[data-text-link-hover="Underline"]'
      );

      textLinks.forEach((link) => {
        const linkEl = /** @type {HTMLElement} */ (link);
        const hoverElement = linkEl.querySelector(".btn--text-link-hover");

        if (!hoverElement) return;

        const hoverEl = /** @type {HTMLElement} */ (hoverElement);

        // Prevent duplicate event listeners
        if (linkEl.dataset.textLinkAnimated === "true") return;
        linkEl.dataset.textLinkAnimated = "true";

        // Create hover animations
        const showUnderline = () => {
          animate(
            hoverEl,
            {
              width: ["0%", "100%"],
            },
            {
              duration: 0.3,
              easing: power1Out,
              onStart: () => {
                hoverEl.style.visibility = "visible";
              },
            }
          );
        };

        const hideUnderline = () => {
          animate(
            hoverEl,
            {
              width: ["100%", "0%"],
            },
            {
              duration: 0.3,
              easing: power1Out,
              onComplete: () => {
                hoverEl.style.visibility = "hidden";
              },
            }
          );
        };

        // Handle different device types
        if (isTouchDevice()) {
          // For touch devices, use touch events
          linkEl.addEventListener("touchstart", showUnderline);
          linkEl.addEventListener("touchend", hideUnderline);
        } else {
          // For non-touch devices, use mouse events
          linkEl.addEventListener("mouseenter", showUnderline);
          linkEl.addEventListener("mouseleave", hideUnderline);
        }
      });
    }

    // Build animations
    buildTextLinkAnimation();
  }

  /* ─────────────────────────────────────────────────────────────
     6. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations when Webflow is ready
  // @ts-ignore - Webflow global loaded externally
  if (typeof window.Webflow !== "undefined") {
    window.Webflow.push(() => {
      initTextLinkAnimation();
    });
  } else {
    // Fallback if Webflow is not available
    initTextLinkAnimation();
  }
})();
