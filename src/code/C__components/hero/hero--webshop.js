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
        headerEl.style.transform = "translateX(-7.5rem) translateZ(0)";
        headerEl.style.willChange = "transform, opacity";
      });

      // Hide product children for staggered animation
      const productItems = heroEl.querySelectorAll(".hero--products > *");
      productItems.forEach((item) => {
        const itemEl = /** @type {HTMLElement} */ (item);
        itemEl.style.opacity = "0";
        itemEl.style.transform = "translateY(7.5rem) translateZ(0)";
        itemEl.style.willChange = "transform, opacity";
      });

      // Ensure parent container is visible and not transformed
      const productContainers = heroEl.querySelectorAll(".hero--products");
      productContainers.forEach((container) => {
        const containerEl = /** @type {HTMLElement} */ (container);
        containerEl.style.opacity = "1";
        containerEl.style.transform = "none";
      });

      // Hide background with initial state (mobile only)
      const backgrounds = heroEl.querySelectorAll(".hero--background");
      backgrounds.forEach((background) => {
        const backgroundEl = /** @type {HTMLElement} */ (background);
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
          backgroundEl.style.opacity = "0";
        }
        // Desktop: background stays visible from start
      });

      // Hide desktop-only elements
      if (window.innerWidth >= 992) {
        const pointerLine = heroEl.querySelector(".hero--pointer-line");
        if (pointerLine) {
          /** @type {HTMLElement} */
          (pointerLine).style.height = "0%";
          /** @type {HTMLElement} */
          (pointerLine).style.transformOrigin = "top";
        }

        const pointerBullet = heroEl.querySelector(".hero--pointer-bullet");
        if (pointerBullet) {
          /** @type {HTMLElement} */
          (pointerBullet).style.transform = "scale(0) translateZ(0)";
          /** @type {HTMLElement} */
          (pointerBullet).style.willChange = "transform";
        }

        const subHeading = heroEl.querySelector(".hero--sub-heading");
        if (subHeading) {
          /** @type {HTMLElement} */
          (subHeading).style.opacity = "0";
        }

        const descContainer = heroEl.querySelector(
          ".hero--description .container"
        );
        if (descContainer) {
          /** @type {HTMLElement} */
          (descContainer).style.opacity = "0";
        }

        const cta = heroEl.querySelector(".hero--btn-w");
        if (cta) {
          /** @type {HTMLElement} */
          (cta).style.opacity = "0";
        }
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initHeroAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate, inView } = window.Motion || {};
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

    // Viewport caching for performance
    let cachedViewport = null;
    let viewportCacheTime = 0;
    const VIEWPORT_CACHE_DURATION = 100; // ms

    const getViewportType = () => {
      const now = performance.now();
      if (!cachedViewport || (now - viewportCacheTime) > VIEWPORT_CACHE_DURATION) {
        const viewportWidth = innerWidth;
        cachedViewport = {
          isDesktop: viewportWidth >= 992,
          isMobile: viewportWidth < 992,
        };
        viewportCacheTime = now;
      }
      return cachedViewport;
    };

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    const easeOut = [0.22, 1, 0.36, 1]; // "Ease Out"
    const easeIn = [0.55, 0, 0.55, 0.2]; // "Ease In"
    const expoOut = [0.16, 1, 0.3, 1]; // "Out Expo"

    /* ─────────────────────────────────────────────────────────────
       5. Performance utilities
    ────────────────────────────────────────────────────────────────*/
    // willChange management
    const removeWillChange = (element) => {
      if (element && element.style) {
        element.style.willChange = "auto";
      }
    };

    const removeWillChangeBatch = (elements) => {
      if (!elements) return;
      const nodeList = elements.length !== undefined ? elements : [elements];
      Array.from(nodeList).forEach(el => {
        if (el && el.style) {
          el.style.willChange = "auto";
        }
      });
    };

    // Loader animation utility
    const animateLoader = (delay = 0.1) => {
      const loader = document.querySelector(".loader");
      if (!loader) return;

      animate(
        loader,
        { opacity: [1, 0] },
        {
          duration: 0.3,
          easing: expoOut,
          delay: delay,
          onStart: () => {
            document.dispatchEvent(new Event("preloaderFinished"));
          },
          onComplete: () => {
            loader.style.display = "none";
            removeWillChange(loader);
          },
        }
      );
    };

    /* ─────────────────────────────────────────────────────────────
       6. Build one timeline per hero
    ────────────────────────────────────────────────────────────────*/
    function buildHeroWebshopAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        headers: hero.querySelectorAll(".hero--header"),
        products: hero.querySelectorAll(".hero--products"),
        backgrounds: hero.querySelectorAll(".hero--background"),
        pointerLine: hero.querySelector(".hero--pointer-line"),
        pointerBullet: hero.querySelector(".hero--pointer-bullet"),
        subHeading: hero.querySelector(".hero--sub-heading"),
        descContainer: hero.querySelector(".hero--description .container"),
        cta: hero.querySelector(".hero--btn-w"),
      };

      /* ---------- PHASE 1 – Headers and Products --------------------- */
      // Phase 1 properties
      const headerDuration = isMobile ? 0.8 : 1.1;
      const headerEasing = isMobile ? expoOut : easeOut;
      const headerDelay = 0;
      const productDuration = isMobile ? 0.6 : 0.6;
      const productEasing = isMobile ? expoOut : easeOut;
      const productDelay = isMobile
        ? 0.15
        : (/** @type {number} */ index) => 0.175 + index * 0.015;

      // Headers
      if (elements.headers.length) {
        animate(
          elements.headers,
          {
            x: ["-7.5rem", "0rem"],
            opacity: [0, 1],
          },
          {
            duration: headerDuration,
            easing: headerEasing,
            delay: headerDelay,
            onComplete: () => {
              removeWillChangeBatch(elements.headers);
            }
          }
        );
      }

      // Products
      if (elements.products.length) {
        const productChildren = hero.querySelectorAll(".hero--products > *");
        if (productChildren.length > 0) {
          animate(
            productChildren,
            {
              opacity: [0, 1],
              y: ["7.5rem", "0rem"],
            },
            {
              duration: productDuration,
              easing: productEasing,
              delay: productDelay,
            }
          );
        }
      }

      /* ---------- PHASE 2 – Background --------------------- */
      // Phase 2 properties
      const backgroundDuration = 0.9;
      const backgroundDelay = 0.2;

      // Background (animate after products with delay - mobile only)
      if (elements.backgrounds.length && isMobile) {
        animate(
          elements.backgrounds,
          { opacity: [0, 1] },
          {
            duration: backgroundDuration,
            easing: easeOut,
            delay: backgroundDelay,
          }
        );
      }

      /* ---------- PHASE 3 – Pointers, Sub copy, CTA (Desktop only) ---------------------- */
      if (isDesktop) {
        // Phase 3 properties
        const tPhase2 = 0.2;
        const pointerLineDelay = tPhase2 - 0.2;
        const pointerLineDuration = 1.4;
        const pointerBulletDelay = tPhase2 + 0.95;
        const pointerBulletDuration = 0.75;
        const fadeDelay = tPhase2 + 1.7;
        const fadeDuration = 0.3;
        const commonFadeOpts = {
          duration: fadeDuration,
          easing: easeIn,
          delay: fadeDelay,
        };

        if (elements.pointerLine) {
          /* Ensure line grows downward on desktop */
          /** @type {HTMLElement} */
          (elements.pointerLine).style.transformOrigin = "top";
          animate(
            elements.pointerLine,
            { height: ["0%", "100%"] },
            {
              duration: pointerLineDuration,
              easing: "linear",
              delay: pointerLineDelay,
            }
          );
        }

        if (elements.pointerBullet) {
          animate(
            elements.pointerBullet,
            { scale: [0, 1] },
            {
              duration: pointerBulletDuration,
              easing: expoOut,
              delay: pointerBulletDelay,
            }
          );
        }

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

      // Fade out loader
      animateLoader(0.1);
    }

    /* ─────────────────────────────────────────────────────────────
       7. One-time init per hero block (skips WF stub)
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
     8. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations
  initHeroAnimation();
})();
