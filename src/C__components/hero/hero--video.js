// ───────────────────────────────────────────────────────────────
// Hero: Video
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

    // Set initial video container state with performance optimizations
    const videoContainer = heroSection.querySelector(".hero--video-container");
    if (videoContainer) {
      const containerEl = /** @type {HTMLElement} */ (videoContainer);
      containerEl.style.padding = "0";
      containerEl.style.opacity = "0";
      containerEl.style.willChange = "padding, opacity";
    }

    // Set initial video wrapper state
    const videoWrapper = heroSection.querySelector(".hero--video-w");
    if (videoWrapper) {
      const wrapperEl = /** @type {HTMLElement} */ (videoWrapper);
      wrapperEl.style.borderRadius = "0rem";
      wrapperEl.style.willChange = "border-radius";
    }

    // Set initial video state with hardware acceleration
    const heroVideo = heroSection.querySelector(".hero--video");
    if (heroVideo) {
      const videoEl = /** @type {HTMLElement} */ (heroVideo);
      videoEl.style.transform = "scale(1.05) translateZ(0)";
      videoEl.style.transformStyle = "preserve-3d";
      videoEl.style.backfaceVisibility = "hidden";
      videoEl.style.willChange = "transform";
      // Force hardware acceleration
      videoEl.style.transform3d = "translateZ(0)";
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

    // Viewport caching for performance
    let cachedViewport = null;
    let viewportCacheTime = 0;
    const VIEWPORT_CACHE_DURATION = 100; // ms

    const getViewportType = () => {
      const now = performance.now();
      if (!cachedViewport || (now - viewportCacheTime) > VIEWPORT_CACHE_DURATION) {
        const vw = innerWidth;
        const vh = innerHeight;
        cachedViewport = {
          isDesktop: vw >= 992,
          isTablet: vw >= 768 && vw < 992,
          isMobileLarge: vw >= 480 && vw < 768,
          isMobileTall: vw < 480 && vh >= 650,
          isMobile: vw < 480,
          vh,
        };
        viewportCacheTime = now;
      }
      return cachedViewport;
    };

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    const expoOut = [0.16, 1, 0.3, 1]; // "Out Expo"
    const power3Out = [0.215, 0.61, 0.355, 1]; // "Power3 Out"
    const power2InOut = [0.45, 0, 0.55, 1]; // "Power2 In Out"
    const circOut = [0, 0.55, 0.45, 1]; // "Circ Out" - smoother for video scaling

    /* ─────────────────────────────────────────────────────────────
       5. Performance utilities
    ────────────────────────────────────────────────────────────────*/
    // willChange management
    const removeWillChange = (element) => {
      if (element && element.style) {
        element.style.willChange = "auto";
      }
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
       6. Build hero video animation
    ────────────────────────────────────────────────────────────────*/
    function buildHeroVideoAnimation(/** @type {HTMLElement} */ hero) {
      const { isDesktop, isTablet, isMobileLarge, isMobileTall, isMobile, vh } =
        getViewportType();

      // Cache DOM elements for performance
      const elements = {
        videoContainer: hero.querySelector(".hero--video-container"),
        videoWrapper: hero.querySelector(".hero--video-w"),
        heroVideo: hero.querySelector(".hero--video"),
        heroContent: hero.querySelector(".hero--content.is--video"),
        headers: hero.querySelectorAll(".hero--header"),
        heroSection: hero,
      };

      // Smoother easing curves for better performance
      const containerEase = circOut; // Smooth container animation
      const heightEase = power2InOut; // Smooth height transitions
      const contentEase = expoOut; // Content entry
      const headerEase = power3Out; // Header animations

      // Optimized durations for smoother playback
      const durContainer = isMobile ? 1.0 : 0.8;
      const durCollapse = isMobile ? 1.2 : 1.0;
      const durContent = isMobile ? 0.9 : 0.8;
      const durHeaders = isMobile ? 0.8 : 0.7;

      // Better coordinated timing for smoother transitions
      const phase1Delay = 0;
      const heightStartDelay = 0.3; // Start height reduction earlier
      const contentStartDelay = 0.2; // Content enters during height animation
      const headerStartDelay = 0.6; // Headers follow content smoothly

      /* ---------- PHASE 1 – Container shape animation --------------------- */
      // Video container padding and opacity - smooth entry
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
            easing: containerEase,
            delay: phase1Delay,
          }
        );
      }

      // Video wrapper border radius - synchronized with container
      if (elements.videoWrapper) {
        animate(
          elements.videoWrapper,
          {
            borderRadius: ["0rem", "1rem"],
          },
          {
            duration: durContainer,
            easing: containerEase,
            delay: phase1Delay,
          }
        );
      }

      // Video scaling - smoother with circOut easing
      if (elements.heroVideo) {
        animate(
          elements.heroVideo,
          {
            scale: [1.05, 1],
          },
          {
            duration: durContainer,
            easing: containerEase,
            delay: phase1Delay,
          }
        );
      }

      /* ---------- PHASE 2 – Height reduction & content entry --------------------- */
      // Hero section height reduction - smooth transition
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
          easing: heightEase,
          delay: heightStartDelay,
        }
      );

      // Content animation - enters during height transition for smoothness
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
            easing: contentEase,
            delay: contentStartDelay,
          }
        );
      }

      // Headers animation - reduced stagger for smoother flow
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
              easing: headerEase,
              delay: headerStartDelay + index * 0.1, // Reduced stagger for smoother flow
            }
          );
        });
      }

      // Fade out loader
      animateLoader(0.1);
    }

    /* ─────────────────────────────────────────────────────────────
       7. One-time init per hero video section
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
     8. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Set up initial states immediately to prevent flickering
  setupInitialStates();

  // Then initialize animations
  initHeroVideoAnimation();
})();
