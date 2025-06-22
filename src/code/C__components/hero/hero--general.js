// ───────────────────────────────────────────────────────────────
// Hero: General
// Intro Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
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
       2. Helpers
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
       3. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    const easeOut = [0.22, 1, 0.36, 1]; // "Ease Out"
    const easeIn = [0.55, 0, 0.55, 0.2]; // "Ease In"
    const expoOut = [0.16, 1, 0.3, 1]; // "Out Expo"

    /* ─────────────────────────────────────────────────────────────
       4. Build one timeline per hero
    ────────────────────────────────────────────────────────────────*/
    function buildHeroTL(hero) {
      const { isDesktop, isMobile } = vp();

      /* ---------- PHASE 1 – .hero--frame.is--general --------------------- */
      hero.querySelectorAll(".hero--frame.is--general").forEach((frame) => {
        const pad = isDesktop ? "2rem" : "0rem";

        animate(
          frame,
          {
            borderRadius: ["0rem", "1rem"],
            padding: ["0rem", pad],
            opacity: [0, 1],
          },
          { duration: 1, easing: easeOut }
        );
      });

      /* base-offset lets us schedule every other step exactly once */
      const t0 = 0; // timeline start (phase 1 already playing)
      const tPhase2 = t0 + 1.0; // after frame animation ends

      /* ---------- PHASE 2 – image wrapper & headers ---------------------- */
      const imgWrap = hero.querySelector(".hero--image-w");
      if (imgWrap) {
        animate(
          imgWrap,
          { height: ["0%", "100%"] },
          { duration: 1.6, easing: expoOut, delay: tPhase2 }
        );
      }

      const headers = hero.querySelectorAll(".hero--header");
      if (headers.length) {
        animate(
          headers,
          {
            opacity: [0, 1],
            translateX: ["-5rem", "0rem"],
          },
          {
            duration: 1,
            easing: easeOut,
            delay: tPhase2 + 0.1, // 0.1 s after image starts
            /* small stagger looks nicer when multiple <h*> exist */
            ...(headers.length > 1
              ? { delay: stagger(0.08, { start: tPhase2 + 0.1 }) }
              : {}),
          }
        );
      }

      /* ---------- PHASE 3 – pointers, sub copy, CTA ---------------------- */
      const pointerLine = hero.querySelector(".hero--pointer-line");
      const pointerBullet = hero.querySelector(".hero--pointer-bullet");

      if (pointerLine) {
        if (isDesktop) {
          /* ensure line grows downward on desktop */
          pointerLine.style.transformOrigin = "top";
          animate(
            pointerLine,
            { height: ["0%", "100%"] },
            { duration: 1.6, easing: "linear", delay: tPhase2 + 0.2 }
          );
        } else {
          /* grow horizontally on tablet & mobile */
          pointerLine.style.transformOrigin = "left";
          animate(
            pointerLine,
            { width: ["0%", "100%"] },
            { duration: 1.6, easing: "linear", delay: tPhase2 + 0.2 }
          );
        }
      }

      if (pointerBullet) {
        animate(
          pointerBullet,
          { scale: [0, 1] },
          { duration: 0.75, easing: expoOut, delay: tPhase2 + 1.8 }
        );
      }

      /* shared fade–in bits starting at 2.1 s */
      const commonFadeOpts = {
        duration: 0.3,
        easing: easeIn,
        delay: tPhase2 + 2.1,
      };

      const subHeading = hero.querySelector(".hero--sub-heading");
      subHeading && animate(subHeading, { opacity: [0, 1] }, commonFadeOpts);

      const descContainer = hero.querySelector(".hero--description .container");
      descContainer &&
        animate(descContainer, { opacity: [0, 1] }, commonFadeOpts);

      const cta = hero.querySelector(".hero--btn-w");
      if (cta) {
        animate(
          cta,
          {
            opacity: [0, 1],
          },
          commonFadeOpts
        );
      }
    }

    /* ─────────────────────────────────────────────────────────────
       5. One-time init per hero block (skips WF stub)
    ────────────────────────────────────────────────────────────────*/
    inView(
      HERO_SEL,
      (hero) => {
        if (hero.dataset.hAnim === "done") return;
        hero.dataset.hAnim = "done";
        buildHeroTL(hero);
      },
      { amount: 0.1 }
    );
  }

  /* ─────────────────────────────────────────────────────────────
     6. Kick-off
  ────────────────────────────────────────────────────────────────*/
  initHeroAnimation();
})();
