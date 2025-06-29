// ───────────────────────────────────────────────────────────────
// Hero: Blog Article
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

      // Hide image wrapper initially
      const imageWrappers = heroEl.querySelectorAll(".hero--image");
      imageWrappers.forEach((imageW) => {
        const imageWEl = /** @type {HTMLElement} */ (imageW);
        imageWEl.style.transform = "translateY(100%) translateZ(0)";
        imageWEl.style.willChange = "transform";
      });

      // Hide image overlays
      const imageOverlays = heroEl.querySelectorAll(".hero--image-overlay");
      imageOverlays.forEach((overlay) => {
        const overlayEl = /** @type {HTMLElement} */ (overlay);
        overlayEl.style.opacity = "0";
      });

      // Hide content with initial transform
      const heroContent = heroEl.querySelectorAll(".hero--content");
      heroContent.forEach((content) => {
        const contentEl = /** @type {HTMLElement} */ (content);
        contentEl.style.opacity = "0";
        contentEl.style.transform = "translateY(7.5rem) translateZ(0)";
        contentEl.style.willChange = "transform, opacity";
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
      console.warn("Motion.dev not ready, retrying&");
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
      if (
        !cachedViewport ||
        now - viewportCacheTime > VIEWPORT_CACHE_DURATION
      ) {
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
      Array.from(nodeList).forEach((el) => {
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
    function buildHeroBlogArticleAnimation(/** @type {HTMLElement} */ hero) {
      const { isMobile } = getViewportType();

      // Cache DOM elements for performance (single query pass)
      const elements = {
        imageWrappers: hero.querySelectorAll(".hero--image"),
        imageOverlays: hero.querySelectorAll(".hero--image-overlay"),
        heroContent: hero.querySelectorAll(".hero--content"),
      };

      /* ---------- PHASE 1 - Image wrapper --------------------- */
      // Phase 1 properties - similar to hero--cards
      const imageWrapperDuration = isMobile ? 0.8 : 0.8;
      const imageWrapperEasing = isMobile ? expoOut : easeOut;
      const imageWrapperDelay = isMobile ? 0.15 : 0;

      // Image wrappers - Y transform animation
      if (elements.imageWrappers.length) {
        animate(
          elements.imageWrappers,
          {
            y: ["100%", "0%"],
          },
          {
            duration: imageWrapperDuration,
            easing: imageWrapperEasing,
            delay: imageWrapperDelay,
            onComplete: () => {
              removeWillChangeBatch(elements.imageWrappers);
            },
          }
        );
      }

      /* ---------- PHASE 2 - Image overlays and content --------------------- */
      // Phase 2 properties - similar timing to hero--cards overlays/containers
      const overlayDuration = 0.6;
      const overlayDelay = 0.25;
      const contentDuration = 0.6;
      const contentDelay = 0.15;

      // Image overlays - opacity animation
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

      // Hero content - transform and opacity animation
      if (elements.heroContent.length) {
        animate(
          elements.heroContent,
          {
            y: ["7.5rem", "0rem"],
            opacity: [0, 1],
          },
          {
            duration: contentDuration,
            easing: easeIn,
            delay: contentDelay,
            onComplete: () => {
              removeWillChangeBatch(elements.heroContent);
            },
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
        buildHeroBlogArticleAnimation(hero);
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
