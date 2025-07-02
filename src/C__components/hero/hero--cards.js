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
        cardWEl.style.willChange = "height";
      });

      // Hide card content with initial scale
      const cardContents = heroEl.querySelectorAll(".hero--card-content");
      cardContents.forEach((content) => {
        const contentEl = /** @type {HTMLElement} */ (content);
        // Removed scale transform
      });

      // Hide headers with initial state
      const headers = heroEl.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = /** @type {HTMLElement} */ (header);
        headerEl.style.opacity = "0";
        if (window.innerWidth < 992) {
          headerEl.style.transform = "translateX(-7.5rem) translateZ(0)";
        } else {
          headerEl.style.transform = "scale(0.9) translateZ(0)";
        }
        headerEl.style.willChange = "transform, opacity";
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
        containerEl.style.transform = "translateY(100%) translateZ(0)";
        containerEl.style.willChange = "transform";
      });
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
    function buildHeroCardsAnimation(/** @type {HTMLElement} */ hero) {
      const { isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        cardWrappers: hero.querySelectorAll(".hero--card-w"),
        cardContents: hero.querySelectorAll(".hero--card-content"),
        headers: hero.querySelectorAll(".hero--header"),
        imageOverlays: hero.querySelectorAll(".hero--card-image-overlay"),
        cardContainers: hero.querySelectorAll(".hero--card-container"),
      };

      /* ---------- PHASE 1 – Card wrapper, content, and headers --------------------- */
      // Phase 1 properties
      const cardWrapperDuration = isMobile ? 0.8 : 0.8;
      const cardWrapperEasing = isMobile ? expoOut : easeOut;
      const cardWrapperDelay = isMobile ? 0.15 : 0;
      const cardContentDuration = isMobile ? 1.0 : 1;
      const cardContentDelay = isMobile ? 1.4 : 0;
      const headerDuration = isMobile ? 0.8 : 1.1;
      const headerEasing = isMobile ? expoOut : easeOut;
      const headerDelay = isMobile ? 0.1 : 0;
      const headerAnimation = isMobile
        ? {
            opacity: [0, 1],
            x: ["-7.5rem", "0rem"],
          }
        : {
            scale: [0.9, 1],
            opacity: [0, 1],
          };

      // Card wrappers (match imgWrap from general for mobile)
      if (elements.cardWrappers.length) {
        animate(
          elements.cardWrappers,
          {
            height: ["0%", "100%"],
          },
          {
            duration: cardWrapperDuration,
            easing: cardWrapperEasing,
            delay: cardWrapperDelay,
            onComplete: () => {
              removeWillChangeBatch(elements.cardWrappers);
            }
          }
        );
      }

      // Card content
      if (elements.cardContents.length) {
        animate(
          elements.cardContents,
          {
            opacity: [1, 1],
          },
          {
            duration: cardContentDuration,
            easing: expoOut,
            delay: cardContentDelay,
          }
        );
      }

      // Header (match header from general for mobile)
      if (elements.headers.length) {
        animate(elements.headers, headerAnimation, {
          duration: headerDuration,
          easing: headerEasing,
          delay: headerDelay,
          onComplete: () => {
            removeWillChangeBatch(elements.headers);
          }
        });
      }

      /* ---------- PHASE 2 – Image overlays and Card containers --------------------- */
      // Phase 2 properties
      const overlayDuration = isMobile ? 0.7 : 0.9;
      const overlayDelay = 0.25;
      const containerDuration = isMobile ? 0.7 : 0.9;
      const containerDelay = 0.25;

      // Image overlays
      if (elements.imageOverlays.length) {
        animate(
          elements.imageOverlays,
          {
            opacity: [0, 1],
          },
          {
            duration: overlayDuration,
            easing: easeIn,
            delay: overlayDelay,
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
            duration: containerDuration,
            easing: easeIn,
            delay: containerDelay,
          }
        );
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
        buildHeroCardsAnimation(hero);
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
