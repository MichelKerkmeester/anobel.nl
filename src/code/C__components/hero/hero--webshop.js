// ───────────────────────────────────────────────────────────────
// Hero: Webshop
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

      // Hide headers with initial state
      const headers = heroEl.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = /** @type {HTMLElement} */ (header);
        headerEl.style.opacity = "0";
        headerEl.style.transform = "translateX(-7.5rem)";
      });

      // Hide products with initial state (try multiple selectors)
      const productSelectors = [
        ".hero--products",
        ".hero--product-list",
        ".hero--list-w",
        ".hero--content",
      ];
      productSelectors.forEach((selector) => {
        const products = heroEl.querySelectorAll(selector);
        products.forEach((product) => {
          const productEl = /** @type {HTMLElement} */ (product);
          productEl.style.opacity = "0";
        });
      });

      // Hide background with initial state
      const backgrounds = heroEl.querySelectorAll(".hero--background");
      backgrounds.forEach((background) => {
        const backgroundEl = /** @type {HTMLElement} */ (background);
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
          backgroundEl.style.height = "0%";
        } else {
          backgroundEl.style.transform = "translateY(100%)";
        }
      });

      // Hide desktop-only elements
      if (window.innerWidth >= 992) {
        const pointerLine = heroEl.querySelector(".hero--pointer-line");
        if (pointerLine) {
          /** @type {HTMLElement} */ (pointerLine).style.height = "0%";
          /** @type {HTMLElement} */ (pointerLine).style.transformOrigin =
            "top";
        }

        const pointerBullet = heroEl.querySelector(".hero--pointer-bullet");
        if (pointerBullet) {
          /** @type {HTMLElement} */ (pointerBullet).style.transform =
            "scale(0)";
        }

        const subHeading = heroEl.querySelector(".hero--sub-heading");
        if (subHeading) {
          /** @type {HTMLElement} */ (subHeading).style.opacity = "0";
        }

        const descContainer = heroEl.querySelector(
          ".hero--description .container"
        );
        if (descContainer) {
          /** @type {HTMLElement} */ (descContainer).style.opacity = "0";
        }

        const cta = heroEl.querySelector(".hero--btn-w");
        if (cta) {
          /** @type {HTMLElement} */ (cta).style.opacity = "0";
        }
      }
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
    function buildHeroWebshopAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        headers: hero.querySelectorAll(".hero--header"),
        products: [
          ...hero.querySelectorAll(".hero--products"),
          ...hero.querySelectorAll(".hero--product-list"),
          ...hero.querySelectorAll(".hero--list-w"),
          ...hero.querySelectorAll(".hero--content"),
        ],
        backgrounds: hero.querySelectorAll(".hero--background"),
        pointerLine: hero.querySelector(".hero--pointer-line"),
        pointerBullet: hero.querySelector(".hero--pointer-bullet"),
        subHeading: hero.querySelector(".hero--sub-heading"),
        descContainer: hero.querySelector(".hero--description .container"),
        cta: hero.querySelector(".hero--btn-w"),
      };

      /* ---------- PHASE 1 – Headers and Products --------------------- */

      // Headers (improved timing similar to cards)
      if (elements.headers.length) {
        animate(
          elements.headers,
          {
            x: ["-7.5rem", "0rem"],
            opacity: [0, 1],
          },
          {
            duration: isMobile ? 0.8 : 1.1,
            easing: isMobile ? expoOut : easeOut,
            delay: 0,
          }
        );
      }

      // Products (animate first, before background)
      if (elements.products.length) {
        animate(
          elements.products,
          {
            opacity: [0, 1],
          },
          {
            duration: isMobile ? 1.0 : 1.2,
            easing: expoOut,
            delay: 0,
          }
        );
      }

      /* ---------- PHASE 2 – Background --------------------- */

      // Background (animate after products with delay)
      if (elements.backgrounds.length) {
        const backgroundAnimation = isMobile
          ? { height: ["0%", "100%"] }
          : { y: ["100%", "0%"] };

        animate(elements.backgrounds, backgroundAnimation, {
          duration: isMobile ? 1.2 : 0.8,
          easing: isMobile ? expoOut : easeOut,
          delay: 0.25,
        });
      }

      /* ---------- PHASE 3 – Desktop-only elements (exact match with Hero General) --------------------- */
      if (isDesktop) {
        // Timeline base for phase 3 (adjusted for background delay)
        const tPhase2 = 0.2;

        if (elements.pointerLine) {
          /* Ensure line grows downward on desktop */
          /** @type {HTMLElement} */ (
            elements.pointerLine
          ).style.transformOrigin = "top";
          animate(
            elements.pointerLine,
            { height: ["0%", "100%"] },
            {
              duration: 1.4,
              easing: "linear",
              delay: tPhase2 - 0.2,
            }
          );
        }

        if (elements.pointerBullet) {
          animate(
            elements.pointerBullet,
            { scale: [0, 1] },
            {
              duration: 0.75,
              easing: expoOut,
              delay: tPhase2 + 1.2,
            }
          );
        }

        const commonFadeOpts = {
          duration: 0.3,
          easing: easeIn,
          delay: tPhase2 + 1.7,
        };

        elements.subHeading &&
          animate(elements.subHeading, { opacity: [0, 1] }, commonFadeOpts);
        elements.descContainer &&
          animate(elements.descContainer, { opacity: [0, 1] }, commonFadeOpts);

        if (elements.cta) {
          animate(
            elements.cta,
            {
              opacity: [0, 1],
            },
            commonFadeOpts
          );
        }
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
        buildHeroWebshopAnimation(hero);
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
