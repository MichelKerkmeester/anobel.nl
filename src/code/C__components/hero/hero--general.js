// Hero Animation
// Motion.dev timeline with viewport-responsive animations
(() => {
  /* Wait for Motion.dev to be available */
  function initHeroAnimation() {
    const { animate, inView, stagger } = window.Motion || {};
    if (!animate || !inView || !stagger) {
      console.warn('Motion.dev not ready, retrying...');
      setTimeout(initHeroAnimation, 100);
      return;
    }

  /* ─────────────────────────────────────────────────────────────
     1. Helper – pick the visible CMS item, ignore Webflow's stub
  ────────────────────────────────────────────────────────────────*/
  const HERO_SEL =
    ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";

  /* ─────────────────────────────────────────────────────────────
     2. Viewport flags → same break‑points GSAP used
  ────────────────────────────────────────────────────────────────*/
  const vp = () => {
    const vw = innerWidth;
    return {
      isDesktop: vw >= 992,
      isTablet: vw >= 768 && vw < 992,
      isMobileL: vw >= 576 && vw < 768,
      isMobile: vw < 768
    };
  };

  /* ─────────────────────────────────────────────────────────────
     3. Build the Motion One timeline (all original values)
  ────────────────────────────────────────────────────────────────*/
  function buildHeroTL(hero) {
    const { isDesktop, isTablet, isMobile, isMobileL } = vp();

    /* Easing parity – GSAP power3.out ≈ cubic‑bezier(.22,1,.36,1) */
    const easeOut = [0.22, 1, 0.36, 1];
    const tFrameDur = 0.8;
    const tCollapseDur = isMobile ? 1.2 : 1.0;

    /* ---------- measure dynamic things first ---------- */
    const listW = hero.querySelector(".hero--list-w");
    const endH = listW ? `${listW.scrollHeight}px` : null;

    /* ---------- Create sequential animations instead of complex timeline ---------- */
    
    // Start with initial delay
    setTimeout(() => {
      // PHASE 1 - frames grow / fade in
      hero.querySelectorAll(".hero--frame").forEach((frame, i) => {
        const [pT, pR, pB, pL] = i === 0 ?
          (isDesktop ? [32, 32, 0, 32] // 2rem ⇒ px
            :
            isTablet ? [112, 32, 0, 32] // 7rem 2rem 0 2rem
            :
            isMobileL ? [104, 24, 0, 24] : [80, 24, 0, 24]) : [0, 0, 0, 0];

        animate(frame, {
          opacity: [0, 1],
          scale: [0.95, 1],
          borderRadius: i === 1 ? ["0rem", "1rem"] : "0rem",
          paddingTop: [pT + "px", pT + "px"],
          paddingRight: [pR + "px", pR + "px"],
          paddingBottom: [pB + "px", pB + "px"],
          paddingLeft: [pL + "px", pL + "px"]
        }, { 
          duration: tFrameDur, 
          easing: easeOut 
        });
      });

      // List wrapper height animation
      if (listW) {
        setTimeout(() => {
          animate(listW, {
            height: ["0px", endH]
          }, { 
            duration: tCollapseDur, 
            easing: "ease-in-out" 
          });
        }, 500);
      }

      // Content container
      setTimeout(() => {
        const content = hero.querySelector(".hero--content");
        if (content) {
          animate(content, {
            opacity: [0, 1], 
            translateY: ["5rem", "0rem"], 
            scale: [0.98, 1]
          }, { 
            duration: 0.8, 
            easing: "ease-out" 
          });
        }
      }, 150);

      // Headings with stagger
      setTimeout(() => {
        const headers = hero.querySelectorAll(".hero--header");
        if (headers.length > 0) {
          animate(headers, {
            opacity: [0, 1],
            translateY: [isDesktop ? "3rem" : isTablet ? "2rem" : "1.5rem", "0rem"]
          }, { 
            duration: 0.8, 
            easing: "ease-out", 
            delay: stagger(0.1) 
          });
        }
      }, 50);

    }, 100);


  }



    /* ─────────────────────────────────────────────────────────────
       5. One‑time init via inView()  – never hits Webflow's stub
    ────────────────────────────────────────────────────────────────*/
    inView(HERO_SEL, (hero) => {
      if (hero.dataset.hAnim === "done") return; // sentinel
      hero.dataset.hAnim = "done";
      buildHeroTL(hero);
    }, { amount: 0.1 }); // tiny root‑margin so it also fires above the fold
  }

  // Start the initialization
  initHeroAnimation();
})();
