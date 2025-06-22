// ───────────────────────────────────────────────────────────────
// Hero: Cards
// Intro Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Initial State Setup (Prevent Flickering)
  ────────────────────────────────────────────────────────────────*/
  function setupInitialStates() {
    // Make page wrapper visible but keep animated elements hidden
    const pageWrapper = /** @type {HTMLElement|null} */ (
      document.querySelector(".page--wrapper")
    );
    if (pageWrapper) {
      pageWrapper.style.opacity = "1";
      pageWrapper.style.visibility = "visible";
    }

    // Hide elements that will be animated to prevent flickering
    const heroSections = document.querySelectorAll(
      ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)"
    );

    heroSections.forEach((hero) => {
      const heroEl = /** @type {HTMLElement} */ (hero);

      // Hide card wrapper initially
      const cardWrappers = heroEl.querySelectorAll(".hero--card-w");
      cardWrappers.forEach((cardW) => {
        const cardWEl = /** @type {HTMLElement} */ (cardW);
        cardWEl.style.height = "0%";
      });

      // Hide card content with initial scale
      const cardContents = heroEl.querySelectorAll(".hero--card-content");
      cardContents.forEach((content) => {
        const contentEl = /** @type {HTMLElement} */ (content);
        contentEl.style.transform = "scale(1.5)";
      });

      // Hide headers with initial state
      const headers = heroEl.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = /** @type {HTMLElement} */ (header);
        headerEl.style.opacity = "0";
        headerEl.style.transform = "scale(0.9)";
      });

      // Hide card image overlays
      const imageOverlays = heroEl.querySelectorAll(
        ".hero--card-image-overlay"
      );
      imageOverlays.forEach((overlay) => {
        const overlayEl = /** @type {HTMLElement} */ (overlay);
        overlayEl.style.opacity = "0";
      });

      // Hide card containers with initial transform
      const cardContainers = heroEl.querySelectorAll(".hero--card-container");
      cardContainers.forEach((container) => {
        const containerEl = /** @type {HTMLElement} */ (container);
        containerEl.style.transform = "translateY(100%)";
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initHeroAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate, inView, stagger } = window.Motion || {};
    if (!animate || !inView) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initHeroAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Helpers
    ────────────────────────────────────────────────────────────────*/
    const HERO_SECTION_SELECTOR =
      ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";

    const getViewportType = () => {
      const viewportWidth = innerWidth;
      return {
        isDesktop: viewportWidth >= 992,
        isMobile: viewportWidth < 992,
      };
    };

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    const easeOut = [0.22, 1, 0.36, 1]; // "Ease Out"
    const easeIn = [0.55, 0, 0.55, 0.2]; // "Ease In"
    const expoOut = [0.16, 1, 0.3, 1]; // "Out Expo"

    /* ─────────────────────────────────────────────────────────────
       5. Build one timeline per hero
    ────────────────────────────────────────────────────────────────*/
    function buildHeroCardsAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        cardWrappers: hero.querySelectorAll(".hero--card-w"),
        cardContents: hero.querySelectorAll(".hero--card-content"),
        headers: hero.querySelectorAll(".hero--header"),
        imageOverlays: hero.querySelectorAll(".hero--card-image-overlay"),
        cardContainers: hero.querySelectorAll(".hero--card-container"),
      };

      /* ---------- PHASE 1 – Card wrapper, content, and headers --------------------- */

      // Card wrappers (match imgWrap from general for mobile)
      if (elements.cardWrappers.length) {
        animate(
          elements.cardWrappers,
          {
            height: ["0%", "100%"],
          },
          {
            duration: isMobile ? 1.2 : 0.8,
            easing: isMobile ? expoOut : easeOut,
            delay: 0,
          }
        );
      }

      // Card content
      if (elements.cardContents.length) {
        animate(
          elements.cardContents,
          {
            scale: [1.5, 1],
          },
          {
            duration: isMobile ? 1.0 : 1.2,
            easing: expoOut,
            delay: 0,
          }
        );
      }

      // Header (match header from general for mobile)
      if (elements.headers.length) {
        // Build animation object based on device
        const headerAnimation = isMobile
          ? {
              opacity: [0, 1],
              x: ["-50%", "0%"],
            }
          : {
              scale: [0.9, 1],
              opacity: [0, 1],
            };

        animate(elements.headers, headerAnimation, {
          duration: isMobile ? 0.8 : 1.1,
          easing: isMobile ? expoOut : easeOut,
          delay: 0,
        });
      }

      /* ---------- PHASE 2 – Image overlays and card containers --------------------- */

      // Image overlays
      if (elements.imageOverlays.length) {
        animate(
          elements.imageOverlays,
          {
            opacity: [0, 1],
          },
          {
            duration: isMobile ? 0.7 : 0.9,
            easing: easeIn,
            delay: 0.25,
          }
        );
      }

      // Card containers
      if (elements.cardContainers.length) {
        animate(
          elements.cardContainers,
          {
            y: ["100%", "0%"],
          },
          {
            duration: isMobile ? 0.7 : 0.9,
            easing: easeIn,
            delay: 0.25,
          }
        );
      }

      // Fade out loader once animation starts
      const loader = document.querySelector(".loader");
      if (loader) {
        const loaderEl = /** @type {HTMLElement} */ (loader);

        animate(
          loaderEl,
          {
            opacity: [1, 0],
          },
          {
            duration: 0.2,
            easing: [0.76, 0, 0.24, 1], // power3.inOut equivalent
            delay: 0.1,
            onStart: () => {
              // Dispatch event to signal preloader has finished
              document.dispatchEvent(new Event("preloaderFinished"));
            },
            onComplete: () => {
              // Hide the loader completely after animation
              loaderEl.style.display = "none";
            },
          }
        );
      }
    }

    /* ─────────────────────────────────────────────────────────────
       6. One-time init per hero block (skips WF stub)
    ────────────────────────────────────────────────────────────────*/
    inView(
      HERO_SECTION_SELECTOR,
      (/** @type {HTMLElement} */ hero) => {
        if (hero.dataset.hAnim === "done") return;
        hero.dataset.hAnim = "done";
        buildHeroCardsAnimation(hero);
      },
      { amount: 0.1 }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     7. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations
  initHeroAnimation();
})();
