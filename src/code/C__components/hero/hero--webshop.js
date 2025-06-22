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

      // Hide frames initially
      const frames = heroEl.querySelectorAll(".hero--frame.is--general");
      frames.forEach((frame) => {
        const frameEl = /** @type {HTMLElement} */ (frame);
        frameEl.style.opacity = "0";
        frameEl.style.padding = "0rem";
      });

      // Hide list wrapper border radius
      const listWrapper = heroEl.querySelector(".hero--list-w.is--general");
      if (listWrapper) {
        /** @type {HTMLElement} */ (listWrapper).style.borderRadius = "0rem";
      }

      // Hide image wrapper
      const imgWrap = heroEl.querySelector(".hero--image-w");
      if (imgWrap) {
        /** @type {HTMLElement} */ (imgWrap).style.height = "0%";
      }

      // Hide headers
      const headers = heroEl.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = /** @type {HTMLElement} */ (header);
        headerEl.style.opacity = "0";
        if (window.innerWidth < 992) {
          headerEl.style.transform = "translateX(-50%)";
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
    const HERO_SEL =
      ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";

    const vp = () => {
      const vw = innerWidth;
      return {
        isDesktop: vw >= 992,
        isMobile: vw < 992,
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
    function buildHeroTL(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isMobile } = vp();

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
      elements.frames.forEach((frame) => {
        const frameEl = /** @type {HTMLElement} */ (frame);
        const padFrom = "0rem";
        const padTo = isDesktop ? "2rem" : "0rem";

        animate(
          frameEl,
          {
            padding: [padFrom, padTo],
            opacity: [0, 1],
          },
          { duration: 1, easing: easeOut }
        );
      });

      /* Border radius for list wrapper */
      if (elements.listWrapper) {
        const radiusTo = isDesktop ? "1rem" : "0rem";

        animate(
          elements.listWrapper,
          {
            borderRadius: ["0rem", radiusTo],
          },
          { duration: 1, easing: easeOut }
        );
      }

      /* Base-offset lets us schedule every other step exactly once */
      const t0 = 0; // Timeline start (phase 1 already playing)
      const tPhase2 = t0 + 0.2; // After frame animation ends

      /* ---------- PHASE 2 – Image wrapper & headers ---------------------- */
      if (elements.imgWrap) {
        const imgDelay = isMobile ? tPhase2 + 0.2 : tPhase2;

        animate(
          elements.imgWrap,
          { height: ["0%", "100%"] },
          {
            duration: isMobile ? 1.2 : 1,
            easing: expoOut,
            delay: imgDelay,
          }
        );
      }

      if (elements.heroImage) {
        const imgDelay = isMobile ? tPhase2 + 0.2 : tPhase2;

        animate(
          elements.heroImage,
          { scale: [isMobile ? 1.25 : 1.5, 1] },
          {
            duration: isMobile ? 1.2 : 1,
            easing: expoOut,
            delay: imgDelay,
          }
        );
      }

      if (elements.headers.length) {
        // Build animation object based on device
        const headerAnimation = isMobile
          ? {
              opacity: [0, 1],
              x: ["-50%", "0%"],
            }
          : {
              opacity: [0, 1],
            };

        animate(elements.headers, headerAnimation, {
          duration: isMobile ? 0.8 : 0.6,
          easing: expoOut,
          delay: tPhase2 + 0.1, // Start before image animation
        });
      }

      /* ---------- PHASE 3 – pointers, sub copy, CTA (Desktop only) ---------------------- */
      if (isDesktop) {
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
              delay: tPhase2 + 0.2,
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
              delay: tPhase2 + 1.6,
            }
          );
        }

        /* Shared fade–in bits starting at 1.9 s */
        const commonFadeOpts = {
          duration: 0.3,
          easing: easeIn,
          delay: tPhase2 + 1.9,
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
        animate(
          loader,
          { opacity: [1, 0] },
          {
            duration: 0.5,
            delay: 0.1, // Small delay to ensure setup is complete
            onComplete: () => {
              /** @type {HTMLElement} */ loader.style.display = "none";
            },
          }
        );
      }
    }

    /* ─────────────────────────────────────────────────────────────
       6. One-time init per hero block (skips WF stub)
    ────────────────────────────────────────────────────────────────*/
    inView(
      HERO_SEL,
      (/** @type {HTMLElement} */ hero) => {
        if (hero.dataset.hAnim === "done") return;
        hero.dataset.hAnim = "done";
        buildHeroTL(hero);
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
