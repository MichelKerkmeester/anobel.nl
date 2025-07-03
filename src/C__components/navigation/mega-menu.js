// ───────────────────────────────────────────────────────────────
// Navigation
// Mega Menu
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initMegaMenu() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initMegaMenu, 100);
      return;
    }
    /* ─────────────────────────────────────────────────────────────
       2. Element Selection and Validation
    ────────────────────────────────────────────────────────────────*/
    const megaMenu = /** @type {HTMLElement|null} */ (
      document.querySelector(".nav--mega-menu")
    );
    const menuButton = /** @type {HTMLElement|null} */ (
      document.querySelector(".btn--hamburger")
    );

    if (!megaMenu || !menuButton) return;

    /* ─────────────────────────────────────────────────────────────
       3. Animation Configuration
    ────────────────────────────────────────────────────────────────*/
    // Track menu state
    let isOpen = false;

    // Easing curves
    const power2Out = [0.165, 0.84, 0.44, 1]; // "Power2 Out"
    const power2In = [0.55, 0.055, 0.675, 0.19]; // "Power2 In"

    // Animation configurations
    const OPEN_CONFIG = {
      duration: 0.8,
      easing: power2Out,
      delay: 0.2,
    };

    const CLOSE_CONFIG = {
      duration: 0.4,
      easing: power2In,
    };

    /* ─────────────────────────────────────────────────────────────
       4. Animation Functions
    ────────────────────────────────────────────────────────────────*/
    // Open menu function
    function openMenu() {
      megaMenu.style.display = "flex";

      animate(
        megaMenu,
        {
          height: ["0svh", "100svh"],
          width: ["100%", "100%"],
        },
        OPEN_CONFIG
      ).finished.then(() => {
        megaMenu.style.borderRadius = "0rem";
      });
    }

    // Close menu function
    function closeMenu() {
      megaMenu.style.borderRadius = "0.75rem";

      animate(
        megaMenu,
        {
          height: ["100svh", "0svh"],
          width: ["100%", "100%"],
        },
        CLOSE_CONFIG
      ).finished.then(() => {
        megaMenu.style.display = "none";
      });
    }

    /* ─────────────────────────────────────────────────────────────
       5. Event Handlers
    ────────────────────────────────────────────────────────────────*/
    // Toggle menu on button click
    menuButton.addEventListener("click", () => {
      if (!isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
      isOpen = !isOpen;
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Initialize when Webflow is ready
  // @ts-ignore - Webflow global loaded externally
  if (typeof window.Webflow !== "undefined") {
    window.Webflow.push(() => {
      initMegaMenu();
    });
  } else {
    // Fallback if Webflow is not available
    initMegaMenu();
  }
})();
