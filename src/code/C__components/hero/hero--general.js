// ───────────────────────────────────────────────────────────────
// Hero: General
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

      // Hide frames initially
      const frames = heroEl.querySelectorAll(".hero--frame.is--general");
      frames.forEach((frame) => {
        const frameEl = /** @type {HTMLElement} */ (frame);
        frameEl.style.opacity = "0";
        frameEl.style.padding = "0rem";
        frameEl.style.willChange = "padding, opacity";
      });

      // Hide list wrapper border radius
      const listWrapper = heroEl.querySelector(".hero--list-w.is--general");
      if (listWrapper) {
        /** @type {HTMLElement} */
        (listWrapper).style.borderRadius = "0rem";
        /** @type {HTMLElement} */
        (listWrapper).style.willChange = "border-radius";
      }

      // Hide image wrapper
      const imgWrap = heroEl.querySelector(".hero--image-w");
      if (imgWrap) {
        /** @type {HTMLElement} */
        (imgWrap).style.height = "0%";
        /** @type {HTMLElement} */
        (imgWrap).style.willChange = "height";
      }

      // Hide headers
      const headers = heroEl.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = /** @type {HTMLElement} */ (header);
        headerEl.style.opacity = "0";
        headerEl.style.transform = "translateX(-7.5rem) translateZ(0)";
        headerEl.style.willChange = "transform, opacity";
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
    const expoOut = [0.16, 1, 0.3, 1]; // "Out Expo"

    /* ─────────────────────────────────────────────────────────────
       5. Performance utilities
    ────────────────────────────────────────────────────────────────*/
    // willChange management
    const setWillChange = (element, properties) => {
      if (element && element.style) {
        element.style.willChange = properties;
      }
    };

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
    function buildHeroGeneralAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        frames: hero.querySelectorAll(".hero--frame.is--general"),
        listWrapper: hero.querySelector(".hero--list-w.is--general"),
        imgWrap: hero.querySelector(".hero--image-w"),
        heroImage: hero.querySelector(".hero--image.is--general"),
        headers: hero.querySelectorAll(".hero--header"),
        pointerLine: hero.querySelector(".hero--pointer-line"),
        pointerBullet: hero.querySelector(".hero--pointer-bullet"),
        subHeading: hero.querySelector(".hero--sub-heading"),
        descContainer: hero.querySelector(".hero--description .container"),
        cta: hero.querySelector(".hero--btn-w"),
      };

      /* ---------- PHASE 1 – Frame --------------------- */
      // Frame properties
      const padFrom = "0rem";
      const padTo = isDesktop ? "2rem" : "0rem";
      const radiusTo = isDesktop ? "1rem" : "0rem";

      elements.frames.forEach((frame) => {
        const frameEl = /** @type {HTMLElement} */ (frame);

        animate(
          frameEl,
          {
            padding: [padFrom, padTo],
            opacity: [0, 1],
          },
          { 
            duration: 1, 
            easing: easeOut,
            onComplete: () => {
              removeWillChange(frameEl);
            }
          }
        );
      });

      /* Border radius for list wrapper */
      if (elements.listWrapper) {
        animate(
          elements.listWrapper,
          {
            borderRadius: ["0rem", radiusTo],
          },
          { 
            duration: 1, 
            easing: easeOut,
            onComplete: () => {
              removeWillChange(elements.listWrapper);
            }
          }
        );
      }

      /* Base-offset lets us schedule every other step exactly once */
      const t0 = 0; // Timeline start (phase 1 already playing)
      const tPhase2 = t0 + 0.2; // After frame animation ends

      /* ---------- PHASE 2 – Image wrapper & headers ---------------------- */
      // Phase 2 properties
      const imgDelay = isMobile ? 0.15 : 0.2;
      const imgDuration = isMobile ? 0.8 : 0.8;
      const headerDelay = tPhase2 + 0.1;
      const headerDuration = isMobile ? 0.8 : 0.6;
      const headerAnimation = isMobile
        ? {
            x: ["-7.5rem", "0rem"],
            opacity: [0, 1],
          }
        : {
            x: ["-7.5rem", "0rem"],
            opacity: [0, 1],
          };

      // Image wrapper
      if (elements.imgWrap) {
        animate(
          elements.imgWrap,
          { height: ["0%", "100%"] },
          {
            duration: imgDuration,
            easing: expoOut,
            delay: imgDelay,
            onComplete: () => {
              removeWillChange(elements.imgWrap);
            }
          }
        );
      }
      
      // Header
      if (elements.headers.length) {
        animate(elements.headers, headerAnimation, {
          duration: headerDuration,
          easing: expoOut,
          delay: headerDelay,
          onComplete: () => {
            removeWillChangeBatch(elements.headers);
          }
        });
      }

      /* ---------- PHASE 3 – Pointers, Sub copy, CTA (Desktop only) ---------------------- */
      if (isDesktop) {
        // Phase 3 properties
        const pointerLineDelay = tPhase2 - 0.2;
        const pointerLineDuration = 1.4;
        const pointerBulletDelay = tPhase2 + 0.95;
        const pointerBulletDuration = 0.75;
        const fadeDelay = tPhase2 + 1.8;
        const fadeDuration = 0.3;
        const commonFadeOpts = {
          duration: fadeDuration,
          easing: easeOut,
          delay: fadeDelay,
        };

        // Pointer line
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

        // Pointer bullet
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

        // Sub heading, description container, CTA
        elements.subHeading &&
          animate(elements.subHeading, { opacity: [0, 1] }, commonFadeOpts);
        elements.descContainer &&
          animate(elements.descContainer, { opacity: [0, 1] }, commonFadeOpts);

        // CTA
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
        buildHeroGeneralAnimation(hero);
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
