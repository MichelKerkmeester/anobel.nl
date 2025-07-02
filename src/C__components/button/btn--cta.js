// ───────────────────────────────────────────────────────────────
// Button: CTA (Optimized)
// Animate on Hover
// ───────────────────────────────────────────────────────────────

// Import centralized utilities
import { DEVICE, EASING } from '../utils/motion-config.js';

(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Device Detection Helpers
  ────────────────────────────────────────────────────────────────*/

  // Use centralized device detection
  const isDesktopOrTablet = DEVICE.isTabletOrDesktop;

  /* ─────────────────────────────────────────────────────────────
     2. Initial State Setup
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Only run on desktop and tablet
    if (!isDesktopOrTablet()) return;

    const btnContainers = document.querySelectorAll(".btn--cta");

    btnContainers.forEach((container) => {
      const buttons = container.querySelectorAll(".btn");

      buttons.forEach((btn) => {
        const iconBase = btn.querySelector(".btn--icon.is--animated-base");
        const iconAbsolute = btn.querySelector(".btn--icon.is--animated-absolute");

        if (iconBase && iconAbsolute) {
          // Set initial states to match GSAP behavior
          const iconAbsoluteEl = /** @type {HTMLElement} */ (iconAbsolute);
          const iconBaseEl = /** @type {HTMLElement} */ (iconBase);

          // Match GSAP initial state: only set opacity, leave x position at default
          iconAbsoluteEl.style.opacity = "0";
          iconAbsoluteEl.style.willChange = "opacity, transform";
          
          iconBaseEl.style.opacity = "1";
          iconBaseEl.style.transform = "translateX(0%)";
          iconBaseEl.style.willChange = "opacity, transform";
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initBtnCtaAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initBtnCtaAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    // Use centralized easing curves
    const power1Out = EASING.power1Out;
    const power0 = [0, 0, 1, 1]; // "Linear" (Power0)

    /* ─────────────────────────────────────────────────────────────
       5. Build button container animations
    ────────────────────────────────────────────────────────────────*/
    function buildBtnCtaAnimation() {
      // Only run on desktop and tablet
      if (!isDesktopOrTablet()) return;

      const btnContainers = document.querySelectorAll(".btn--cta");

      btnContainers.forEach((container) => {
        const containerEl = /** @type {HTMLElement} */ (container);
        const buttons = containerEl.querySelectorAll(".btn");

        // Store animation controls for each button
        /** @type {{ hoverIn: () => void, hoverOut: () => void }[]} */
        const buttonAnimations = [];

        buttons.forEach((btn) => {
          const iconBase = btn.querySelector(".btn--icon.is--animated-base");
          const iconAbsolute = btn.querySelector(".btn--icon.is--animated-absolute");

          if (iconBase && iconAbsolute) {
            const iconAbsoluteEl = /** @type {HTMLElement} */ (iconAbsolute);
            const iconBaseEl = /** @type {HTMLElement} */ (iconBase);

            // Create hover in animation
            const hoverInAnimation = () => {
              // Animate absolute icon in
              animate(
                iconAbsoluteEl,
                {
                  x: "0%", // Match GSAP: animate to 0% from current position
                  opacity: 1,
                },
                {
                  duration: 0.3,
                  easing: power1Out,
                }
              );

              // Animate base icon out
              animate(
                iconBaseEl,
                {
                  x: "200%",
                  opacity: 0,
                },
                {
                  duration: 0.3,
                  easing: power0,
                }
              );
            };

            // Create hover out animation
            const hoverOutAnimation = () => {
              // Animate absolute icon out
              animate(
                iconAbsoluteEl,
                {
                  opacity: 0,
                },
                {
                  duration: 0.3,
                  easing: power0,
                }
              );

              // Animate base icon in
              animate(
                iconBaseEl,
                {
                  x: "0%",
                  opacity: 1,
                },
                {
                  duration: 0.3,
                  easing: power1Out,
                }
              );
            };

            // Store animations for this button
            buttonAnimations.push({
              hoverIn: hoverInAnimation,
              hoverOut: hoverOutAnimation,
            });
          }
        });

        // Add container-level hover events
        if (buttonAnimations.length > 0) {
          // Prevent duplicate event listeners
          if (containerEl.dataset.btnCtaAnimated !== "true") {
            containerEl.dataset.btnCtaAnimated = "true";

            // Container mouseenter - play all hover in animations
            containerEl.addEventListener("mouseenter", () => {
              buttonAnimations.forEach((animation) => animation.hoverIn());
            });

            // Container mouseleave - play all hover out animations
            containerEl.addEventListener("mouseleave", () => {
              buttonAnimations.forEach((animation) => animation.hoverOut());
            });
          }
        }
      });
    }

    // Build animations
    buildBtnCtaAnimation();
  }

  /* ─────────────────────────────────────────────────────────────
     6. Override original button animation (compatibility)
  ────────────────────────────────────────────────────────────────*/
  // Make btnAnimation available globally for compatibility
  /** @type {any} */ (window).btnAnimation = () => {
    console.log("btn--cta: Using Motion.dev animation instead of GSAP");
  };

  /* ─────────────────────────────────────────────────────────────
     7. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations
  initBtnCtaAnimation();
})();
