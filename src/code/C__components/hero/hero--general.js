// Hero: General
// Intro Animation

// Initial setup for hero
function initializeHeroAnimationStates() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    return false;
  }

  const vw = window.innerWidth;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;

  // Don't make page wrapper visible yet - wait until animation is ready
  // This prevents the flicker

  // Set animation-ready states (CSS handles initial hidden state)
  gsap.set(".hero--content", {
    opacity: 0,
    y: "5rem", // Changed from 100% to 5rem for subtler entrance
    scale: 0.98, // Slightly increased from 0.92 for less dramatic scale
    willChange: "opacity, transform",
  });

  gsap.set([".hero--header"], {
    opacity: 0,
    y: isDesktop ? "3rem" : isTablet ? "2rem" : "1.5rem", // Reduced from 10vh for consistency
    willChange: "opacity, transform",
  });

  gsap.set(".hero--list-w", {
    height: "0%",
    overflow: "hidden", // Add overflow hidden to prevent content flash
  });

  gsap.set(".hero--frame", { padding: 0 });

  // Set initial states for hero container
  gsap.set(".hero--section", {
    opacity: 1, // Hero container stays visible but content hidden
  });

  return true;
}

// GSAP Timeline for hero
function createHeroAnimationTimeline({ initialDelay = 0.2 }) {
  if (typeof gsap === "undefined") return null;

  const vw = window.innerWidth;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobile = vw < 768;
  const isMobileLarge = vw >= 576 && vw < 768;

  // Smoother easing for content reveals
  const easeOut = isDesktop ? "power3.out" : "power2.out";
  const easeInOut = "power2.inOut";

  // Duration helpers
  const durContainer = 0.8; // Slightly faster for snappier feel
  const durCollapse = isMobile ? 1.2 : isDesktop ? 1.0 : 1.0; // Faster collapse
  const durContent = 0.8; // Faster content reveal
  const durHeaders = 0.8; // Match content speed

  // Delays and offsets
  const delayBetweenPhase1And2 = 0.1; // Reduced delay for smoother flow
  const offsetContent = "-=0.85"; // Start content earlier during collapse
  const offsetHeaders = "-=0.95"; // Headers come in almost immediately with content

  const tl = gsap.timeline({
    defaults: {
      ease: easeOut,
    },
  });

  // Initial delay
  tl.to({}, { duration: initialDelay });

  // PHASE 1: Initial container shape animation
  const heroFrames = gsap.utils.toArray(".hero--frame");

  heroFrames.forEach((frame, index) => {
    tl.to(
      frame,
      {
        duration: durContainer,
        borderRadius: index === 1 ? "1rem" : 0,
        padding:
          index === 0
            ? isDesktop
              ? "2rem"
              : isTablet
              ? "7rem 2rem 0 2rem"
              : isMobileLarge
              ? "6.5rem 1.5rem 0 1.5rem"
              : "5rem 1.5rem 0 1.5rem"
            : 0,
        scale: 1,
        opacity: 1,
        ease: easeOut,
      },
      "phase1"
    );
  });

  // Delay Between Phase 1 & Phase 2
  tl.to({}, { duration: delayBetweenPhase1And2 });

  // PHASE 2: Dramatic height reduction & content entry
  tl.to(
    ".hero--list-w",
    {
      height: "auto",
      duration: durCollapse,
      ease: "power2.inOut", // Smoother easing for height animation
      clearProps: "overflow", // Clear overflow after animation
    },
    "-=0.5" // Start slightly earlier for overlap with frame animation
  );

  // Content fades in slightly after the section begins collapsing
  tl.to(
    ".hero--content",
    {
      opacity: 1,
      y: "0%",
      scale: 1,
      duration: durContent,
      ease: "power2.out", // Consistent easing
    },
    offsetContent
  );

  // Headers follow the content a bit closer to keep everything in sync
  tl.to(
    [".hero--header"],
    {
      opacity: 1,
      y: 0,
      duration: durHeaders,
      stagger: 0.1, // Even faster stagger for snappier feel
      ease: "power2.out", // Match content easing
    },
    offsetHeaders
  );

  return tl;
}

// Main initialization function
function initHeroAnimation() {
  // Prevent multiple initializations (e.g., when CMS "Load More" injects new markup)
  if (window.__heroGeneralInitialized) return;
  window.__heroGeneralInitialized = true;
  // Exit early if GSAP is not available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    return;
  }

  // Function to initialize animations when ready
  function initAnimations() {
    // Check if hero exists
    if (!document.querySelector(".hero--section")) {
      console.log("No hero section with class .hero--section found");
      return;
    }

    // Initialize hero states
    if (!initializeHeroAnimationStates()) return;

    // Create and play the animation
    const timeline = createHeroAnimationTimeline({
      initialDelay: 0.1, // Minimal delay for immediate start
    });

    // Skip if timeline couldn't be created
    if (!timeline) return;

    // Now that animation is ready, reveal the page wrapper
    // Fade out loader first, then reveal page wrapper
    gsap.to(".loader", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(".loader", { display: "none" });
        // Now safely show page content without flicker
        gsap.set(".page--wrapper", {
          opacity: 1,
          visibility: "visible",
          clearProps: "visibility",
        });
      },
    });
  }

  // Initialize immediately
  initAnimations();
}

// Initialize directly - Slater handles DOM ready
initHeroAnimation();
