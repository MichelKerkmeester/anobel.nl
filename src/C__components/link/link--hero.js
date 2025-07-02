// ───────────────────────────────────────────────────────────────
// Link: Hero
// Hover Animation - Desktop & Tablet Only (Optimized)
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Initial State Setup (Prevent Flickering)
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Only apply on desktop & tablet
    if (window.innerWidth < 768) return;

    const containers = document.querySelectorAll('.link--hero');
    containers.forEach((container) => {
      const line = container.querySelector('.link--divider-line');
      const icon = container.querySelector('.link--icon');
      const description = container.querySelector('.link--description-w');

      if (line) {
        line.style.width = "0%";
        line.style.willChange = "width";
      }

      if (icon) {
        icon.style.transform = "rotate(0deg)";
        icon.style.willChange = "transform";
      }

      if (description) {
        // Measure natural height and store it
        description.style.height = "auto";
        const naturalHeight = description.offsetHeight;
        description.dataset.naturalHeight = naturalHeight.toString();
        description.style.height = "0px";
        description.style.overflow = "hidden";
        description.style.willChange = "height";
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
    const duration = 0.5;
    const easing = [0.22, 1, 0.36, 1]; // Ease Out
    const heightDuration = 0.375; // Slightly faster for height (0.5 * 0.75)

    const containers = document.querySelectorAll('.link--hero');

    containers.forEach((container) => {
      // Prevent duplicate event listeners
      if (container.dataset.heroLinkAnimated === "true") return;
      container.dataset.heroLinkAnimated = "true";

      const line = container.querySelector('.link--divider-line');
      const icon = container.querySelector('.link--icon');
      const description = container.querySelector('.link--description-w');

      if (!line) return;

      // Hover in animation
      const hoverIn = () => {
        // Line animation (starts immediately)
        animate(line, { width: ["0%", "100%"] }, {
          duration,
          easing
        });

        // Icon rotation (simultaneous with line)
        if (icon) {
          animate(icon, { rotate: ["0deg", "180deg"] }, {
            duration,
            easing
          });
        }

        // Description height (simultaneous with line and icon)
        if (description) {
          const naturalHeight = parseInt(description.dataset.naturalHeight || "0", 10);
          animate(description, { height: ["0px", `${naturalHeight}px`] }, {
            duration: heightDuration,
            easing
          });
        }
      };

      // Hover out animation
      const hoverOut = () => {
        // Line animation
        animate(line, { width: ["100%", "0%"] }, {
          duration,
          easing
        });

        // Icon rotation
        if (icon) {
          animate(icon, { rotate: ["180deg", "0deg"] }, {
            duration,
            easing
          });
        }

        // Description height
        if (description) {
          const naturalHeight = parseInt(description.dataset.naturalHeight || "0", 10);
          animate(description, { height: [`${naturalHeight}px`, "0px"] }, {
            duration: heightDuration,
            easing
          });
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