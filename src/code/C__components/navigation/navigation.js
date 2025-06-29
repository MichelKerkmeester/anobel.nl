// ───────────────────────────────────────────────────────────────
// Navigation
// ───────────────────────────────────────────────────────────────
function initCenteredScalingNavigationBar() {
  /* ─────────────────────────────────────────────────────────────
     1. Cache DOM elements for performance
  ────────────────────────────────────────────────────────────────*/
  const navigationInnerItems = document.querySelectorAll(
    "[data-navigation-item]"
  );

  /* ─────────────────────────────────────────────────────────────
     2. Apply staggered transition delays
  ────────────────────────────────────────────────────────────────*/
  // Apply CSS transition delay for staggered animation effect
  navigationInnerItems.forEach((item, index) => {
    const itemEl = /** @type {HTMLElement} */ (item);
    itemEl.style.transitionDelay = `${index * 0.05}s`;
  });

  /* ─────────────────────────────────────────────────────────────
     3. Toggle Navigation (Open/Close)
  ────────────────────────────────────────────────────────────────*/
  // Handle navigation toggle buttons
  document
    .querySelectorAll('[data-navigation-toggle="toggle"]')
    .forEach((toggleBtn) => {
      toggleBtn.addEventListener("click", () => {
        const navStatusEl = document.querySelector("[data-navigation-status]");
        if (!navStatusEl) return;

        // Check current state and toggle
        if (
          navStatusEl.getAttribute("data-navigation-status") === "not-active"
        ) {
          // Open navigation
          navStatusEl.setAttribute("data-navigation-status", "active");
          // If you use Lenis you can 'stop' Lenis here: Example Lenis.stop();
        } else {
          // Close navigation
          navStatusEl.setAttribute("data-navigation-status", "not-active");
          // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
        }
      });
    });

  /* ─────────────────────────────────────────────────────────────
     4. Close Navigation (Close only)
  ────────────────────────────────────────────────────────────────*/
  // Handle dedicated close buttons
  document
    .querySelectorAll('[data-navigation-toggle="close"]')
    .forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        const navStatusEl = document.querySelector("[data-navigation-status]");
        if (!navStatusEl) return;

        // Always close navigation
        navStatusEl.setAttribute("data-navigation-status", "not-active");
        // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
      });
    });

  /* ─────────────────────────────────────────────────────────────
     5. Keyboard Navigation (ESC key)
  ────────────────────────────────────────────────────────────────*/
  // Close navigation on ESC key press
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      // ESC key
      const navStatusEl = document.querySelector("[data-navigation-status]");
      if (!navStatusEl) return;

      // Only close if navigation is currently active
      if (navStatusEl.getAttribute("data-navigation-status") === "active") {
        navStatusEl.setAttribute("data-navigation-status", "not-active");
        // If you use Lenis you can 'start' Lenis here: Example Lenis.start();
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   6. Initialize on DOM ready
────────────────────────────────────────────────────────────────*/
// Initialize Centered Scaling Navigation Bar
document.addEventListener("DOMContentLoaded", function () {
  initCenteredScalingNavigationBar();
});
