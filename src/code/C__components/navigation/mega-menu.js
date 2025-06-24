// ───────────────────────────────────────────────────────────────
// Navigation: Mega Menu
// Mobile menu with smooth animations
// ───────────────────────────────────────────────────────────────

// Import centralized utilities
import { EASING, initMotionWithRetry, initWithWebflow, optimizeForAnimation, resetOptimization } from '../utils/motion-config.js';

(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Initialization and Setup
  ────────────────────────────────────────────────────────────────*/
  initWithWebflow(() => {
    initMotionWithRetry(({ animate }) => {
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
      // Optimize elements for animation
      optimizeForAnimation(megaMenu);

      // Track menu state
      let isOpen = false;

      // Animation configurations
      const OPEN_CONFIG = {
        duration: 0.8,
        easing: EASING.power2Out,
        delay: 200
      };

      const CLOSE_CONFIG = {
        duration: 0.4,
        easing: EASING.power2In
      };

      /* ─────────────────────────────────────────────────────────────
         4. Animation Functions
      ────────────────────────────────────────────────────────────────*/
      // Open menu function
      function openMenu() {
        megaMenu.style.display = "flex";
        
        animate(megaMenu, {
          height: ["0svh", "100svh"],
          width: ["100%", "100%"]
        }, OPEN_CONFIG).finished.then(() => {
          megaMenu.style.borderRadius = "0rem";
        });
      }

      // Close menu function  
      function closeMenu() {
        megaMenu.style.borderRadius = "0.75rem";
        
        animate(megaMenu, {
          height: ["100svh", "0svh"],
          width: ["100%", "100%"]
        }, CLOSE_CONFIG).finished.then(() => {
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

      /* ─────────────────────────────────────────────────────────────
         6. Cleanup
      ────────────────────────────────────────────────────────────────*/
      // Cleanup on page unload
      window.addEventListener("beforeunload", () => {
        resetOptimization(megaMenu);
      });
    });
  });
})();
