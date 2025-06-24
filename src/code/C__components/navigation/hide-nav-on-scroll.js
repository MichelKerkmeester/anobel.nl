// ───────────────────────────────────────────────────────────────
// Navigation: Hide Nav on Scroll
// Desktop-only scroll-based navigation hiding
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initHideNavOnScroll() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initHideNavOnScroll, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       2. Main navigation scroll logic
    ────────────────────────────────────────────────────────────────*/
    const initHideNavOnScrollLogic = () => {
  let lastScrollTop = 0;
  const navbar = document.querySelector(".nav--bar");
  const scrollThreshold = 50; // Minimum scroll amount before hiding/showing
  const tabletBreakpoint = 1200; // Increased to include iPad Pro and other tablets

  if (!navbar) {
    console.error("Navigation bar (.nav--bar) not found!");
    return;
  }

  function handleScroll() {
    // Check for touch devices or smaller screens
    if (isMobileOrTablet()) return;

    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    // Check if user has scrolled more than threshold
    if (Math.abs(lastScrollTop - currentScroll) <= scrollThreshold) return;

      // Scrolling down & not at the top
      if (currentScroll > lastScrollTop && currentScroll > 50) {
        animate(
          navbar,
          {
            y: [navbar.style.transform.includes("translateY") ? "0%" : "0%", "-200%"],
          },
          {
            duration: 0.3,
            easing: [0.25, 0.46, 0.45, 0.94], // ease-in-out
          }
        );
      }
      // Scrolling up
      else {
        animate(
          navbar,
          {
            y: [navbar.style.transform.includes("translateY") ? "-200%" : "-200%", "0%"],
          },
          {
            duration: 0.3,
            easing: [0.25, 0.46, 0.45, 0.94], // ease-in-out
          }
        );
      }

    lastScrollTop = currentScroll;
  }

  // Function to detect mobile or tablet devices
  function isMobileOrTablet() {
    const touchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const smallScreen = window.innerWidth <= tabletBreakpoint;

    return touchDevice || smallScreen;
  }

      // Add scroll event listener
      window.addEventListener("scroll", handleScroll, { passive: true });
    };

    // Initialize navigation scroll logic
    initHideNavOnScrollLogic();
  }

  /* ─────────────────────────────────────────────────────────────
     3. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Initialize with Webflow
  // @ts-ignore - Webflow global loaded externally
  if (typeof window.Webflow !== "undefined") {
    window.Webflow.push(() => {
      initHideNavOnScroll();
    });
  } else {
    // Fallback if Webflow is not available
    initHideNavOnScroll();
  }
})();
