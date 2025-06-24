// ───────────────────────────────────────────────────────────────
// Hero: Video (Optimized)
// Intro Animation
// ───────────────────────────────────────────────────────────────

// Import centralized utilities
import { EASING } from '../utils/motion-config.js';

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

    // Check if hero video elements exist
    const heroSection = /** @type {HTMLElement|null} */ (
      document.querySelector(".hero--section.is--video")
    );
    if (!heroSection) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isDesktop = vw >= 992;
    const isTablet = vw >= 768 && vw < 992;
    const isMobileTall = vw < 480 && vh >= 650;

    // Set initial hero section height
    heroSection.style.height = isDesktop
      ? "100svh"
      : isTablet
      ? "97.5svh"
      : isMobileTall
      ? "97.5svh"
      : "92.5svh";

    // Hide content initially
    const heroContent = heroSection.querySelector(".hero--content.is--video");
    if (heroContent) {
      const contentEl = /** @type {HTMLElement} */ (heroContent);
      contentEl.style.opacity = "0";
      contentEl.style.transform = "translateY(100%) scale(0.92)";
      contentEl.style.willChange = "opacity, transform";
    }

    // Hide headers
    const headers = heroSection.querySelectorAll(".hero--header");
    headers.forEach((header) => {
      const headerEl = /** @type {HTMLElement} */ (header);
      headerEl.style.opacity = "0";
      headerEl.style.transform = isDesktop 
        ? "translateY(10vh)" 
        : isTablet 
        ? "translateY(2rem)" 
        : "translateY(1rem)";
      headerEl.style.willChange = "opacity, transform";
    });

    // Set initial video container state
    const videoContainer = heroSection.querySelector(".hero--video-container");
    if (videoContainer) {
      /** @type {HTMLElement} */ (videoContainer).style.padding = "0";
    }

    // Set initial video state
    const heroVideo = heroSection.querySelector(".hero--video");
    if (heroVideo) {
      const videoEl = /** @type {HTMLElement} */ (heroVideo);
      videoEl.style.borderRadius = "0";
      videoEl.style.transform = "scale(1.05)";
      videoEl.style.transformStyle = "preserve-3d";
      videoEl.style.backfaceVisibility = "hidden";
      videoEl.style.perspective = "1000px";
      videoEl.style.willChange = "transform";
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initHeroVideoAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate, inView } = window.Motion || {};
    if (!animate || !inView) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initHeroVideoAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Helpers
    ────────────────────────────────────────────────────────────────*/
    const HERO_VIDEO_SELECTOR = ".hero--section.is--video";

    const getViewportType = () => {
      const vw = innerWidth;
      const vh = innerHeight;
      return {
        isDesktop: vw >= 992,
        isTablet: vw >= 768 && vw < 992,
        isMobileLarge: vw >= 480 && vw < 768,
        isMobileTall: vw < 480 && vh >= 650,
        isMobile: vw < 480,
        vh,
      };
    };

    /* ─────────────────────────────────────────────────────────────
       4. Easing configuration (using centralized values)
    ────────────────────────────────────────────────────────────────*/
    // Use centralized easing curves (maintains exact same values)
    const easeOut = [0.22, 1, 0.36, 1]; // Custom "Ease Out" - not in standard set
    const easeInOut = EASING.easeInOut; // [0.25, 0.46, 0.45, 0.94]
    const expoOut = EASING.expoOut; // [0.19, 1, 0.22, 1]
    const expoInOut = EASING.expoInOut; // [0.87, 0, 0.13, 1]
    const power3Out = EASING.power3Out; // [0.215, 0.61, 0.355, 1]
    const power4Out = EASING.power4Out; // [0.165, 0.84, 0.44, 1]
    const power2InOut = [0.45, 0, 0.55, 1]; // Custom "Power2 In Out" - not in standard set

    /* ─────────────────────────────────────────────────────────────
       5. Build hero video animation
    ────────────────────────────────────────────────────────────────*/
    function buildHeroVideoAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isTablet, isMobileLarge, isMobileTall, isMobile, vh } = getViewportType();

      // Cache DOM elements for performance
      const elements = {
        videoContainer: hero.querySelector(".hero--video-container"),
        videoWrapper: hero.querySelector(".hero--video-w"),
        heroVideo: hero.querySelector(".hero--video"),
        heroContent: hero.querySelector(".hero--content.is--video"),
        headers: hero.querySelectorAll(".hero--header"),
        heroSection: hero,
      };

      // Custom easing based on device (match GSAP original)
      const primaryEase = isDesktop ? power3Out : expoOut; // power4.out → power3.out
      const secondaryEase = isDesktop ? power2InOut : expoInOut; // Match GSAP expo.inOut

      // Duration helpers (mobile optimized timing)
      const durContainer = isMobile ? 1.3 : isDesktop ? 1.1 : 1;
      const durCollapse = isMobile ? 1.5 : isDesktop ? 1.2 : 1.2;
      const durContent = isMobile ? 1.1 : isDesktop ? 1.1 : 1.0;
      const durHeaders = isMobile ? 1.0 : isDesktop ? 0.9 : 0.9;

      // Phase timing (match GSAP timeline coordination)
      const phase1Delay = 0;
      const delayBetweenPhases = 0.1;
      
      // Corrected timing to match GSAP's relative positioning
      const heightStartDelay = phase1Delay + durContainer + delayBetweenPhases - 0.7; // Match "-=0.7"
      const contentStartDelay = phase1Delay + durContainer - (isMobile ? 1.4 : 0.9); // Match offsetContent timing
      const headerStartDelay = phase1Delay + durContainer - (isMobile ? 1.1 : 0.7); // Match offsetHeaders timing

      /* ---------- PHASE 1 – Container shape animation --------------------- */
      if (elements.videoContainer) {
        const paddingTo = isDesktop
          ? "2rem"
          : isTablet
          ? "7rem 2rem 0 2rem"
          : isMobileLarge
          ? "6.5rem 1.5rem 0 1.5rem"
          : "5rem 1.5rem 0 1.5rem";

        animate(
          elements.videoContainer,
          {
            padding: ["0", paddingTo],
            opacity: [0, 1],
          },
          {
            duration: durContainer,
            easing: primaryEase,
            delay: phase1Delay,
          }
        );
      }

      if (elements.videoWrapper) {
        animate(
          elements.videoWrapper,
          {
            borderRadius: ["0rem", "1rem"],
          },
          {
            duration: durContainer,
            easing: primaryEase,
            delay: phase1Delay,
          }
        );
      }

      if (elements.heroVideo) {
        animate(
          elements.heroVideo,
          {
            scale: [1.05, 1],
          },
          {
            duration: durContainer,
            easing: primaryEase,
            delay: phase1Delay,
          }
        );
      }

      /* ---------- PHASE 2 – Height reduction & content entry --------------------- */
      const finalHeight = isDesktop
        ? vh <= 800
          ? "87.5svh"
          : vh <= 1049
          ? "85svh"
          : "82.5svh"
        : isTablet
        ? "87.5svh"
        : isMobileTall
        ? "82.5svh"
        : "87.5svh";

      animate(
        elements.heroSection,
        {
          height: [
            isDesktop
              ? "100svh"
              : isTablet
              ? "97.5svh"
              : isMobileTall
              ? "97.5svh"
              : "92.5svh",
            finalHeight,
          ],
        },
        {
          duration: durCollapse,
          easing: secondaryEase,
          delay: heightStartDelay,
        }
      );

      // Content animation
      if (elements.heroContent) {
        animate(
          elements.heroContent,
          {
            opacity: [0, 1],
            y: ["100%", "0%"],
            scale: [0.92, 1],
          },
          {
            duration: durContent,
            easing: primaryEase,
            delay: contentStartDelay,
          }
        );
      }

      // Headers animation
      if (elements.headers.length) {
        const headerY = isDesktop ? "10vh" : isTablet ? "2rem" : "1rem";
        
        elements.headers.forEach((header, index) => {
          animate(
            header,
            {
              opacity: [0, 1],
              y: [headerY, "0px"],
            },
            {
              duration: durHeaders,
              easing: primaryEase,
              delay: headerStartDelay + (index * 0.2), // Match GSAP's 0.2s stagger
            }
          );
        });
      }

      // Fade out loader
      const loader = document.querySelector(".loader");
      if (loader) {
        const loaderEl = /** @type {HTMLElement} */ (loader);

        animate(
          loaderEl,
          {
            opacity: [1, 0],
          },
          {
            duration: 0.5,
            easing: [0.76, 0, 0.24, 1],
            delay: 0.1,
            onStart: () => {
              document.dispatchEvent(new Event("preloaderFinished"));
            },
            onComplete: () => {
              loaderEl.style.display = "none";
            },
          }
        );
      }

      // Optional: Add scroll-triggered animation
      if (elements.heroVideo && window.Motion && window.Motion.scroll) {
        const { scroll } = window.Motion;
        
        scroll(
          animate(
            elements.heroVideo,
            {
              scale: [1, 1.1],
              borderRadius: ["1rem", "2rem"],
            }
          ),
          {
            target: elements.heroSection,
            offset: ["start start", "bottom start"], // Match GSAP's "bottom top"
          }
        );
      }
    }

    /* ─────────────────────────────────────────────────────────────
       6. One-time init per hero video section
    ────────────────────────────────────────────────────────────────*/
    const heroVideoSection = document.querySelector(HERO_VIDEO_SELECTOR);
    if (heroVideoSection) {
      const heroEl = /** @type {HTMLElement} */ (heroVideoSection);
      if (heroEl.dataset.hVideoAnim !== "done") {
        heroEl.dataset.hVideoAnim = "done";
        buildHeroVideoAnimation(heroEl);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     7. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations
  initHeroVideoAnimation();
})();
