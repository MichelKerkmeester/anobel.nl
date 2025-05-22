// Hero
// Intro Animation

// Initial setup
function initializeHeroStates() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    return false;
  }

  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var isDesktop = vw >= 992;
  var isTablet = vw >= 768 && vw < 992;
  var isMobileTall = vw < 480 && vh >= 650;

  // Make page wrapper visible
  gsap.set(".page--wrapper", {
    opacity: 1,
    visibility: "visible",
    clearProps: "visibility", // Clean up the visibility property after setting
  });

  gsap.set(".hero--content.is--video", {
    opacity: 0,
    y: "100%",
    scale: 0.92,
    willChange: "opacity, transform",
  });

  gsap.set([".hero--header.is--video"], {
    opacity: 0,
    y: isDesktop ? "10vh" : isTablet ? "2rem" : "1rem",
    willChange: "opacity, transform",
  });

  gsap.set(".hero--section.is--video", {
    height: isDesktop
      ? "100svh"
      : isTablet
      ? "95svh"
      : isMobileTall
      ? "95svh"
      : "90svh",
  });

  gsap.set(".hero--video-container", { padding: 0 });

  gsap.set(".hero--video", {
    borderRadius: 0,
    scale: 1.05,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    perspective: 1000,
    willChange: "transform",
  });

  return true;
}

// GSAP Timeline
function createHeroIntroTimeline({ phase1Delay, delayBetweenPhase1And2 }) {
  if (typeof gsap === "undefined") return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobileLarge = vw >= 480 && vw < 768;
  const isMobileTall = vw < 480 && vh >= 650;
  const isMobile = vw < 480;

  // Custom easing presets for a smoother, less "snappy" desktop feel
  const easeOut = isDesktop ? "power4.out" : "expo.out";
  const easeInOut = isDesktop ? "power2.inOut" : "expo.inOut";

  // Duration helpers (mobile needs to be a touch slower)
  const durContainer = isMobile ? 1.4 : isDesktop ? 1.1 : 1;
  const durCollapse = isMobile ? 1.6 : isDesktop ? 1.2 : 1.2;
  const durContent = isMobile ? 1.2 : isDesktop ? 1.1 : 1.0;
  const durHeaders = isMobile ? 1.1 : isDesktop ? 0.9 : 0.9;

  // Offset helpers so content kicks in earlier on mobile
  const offsetContent = isMobile ? "-=1.1" : "-=0.9";
  const offsetHeaders = isMobile ? "-=0.8" : "-=0.7";

  const tl = gsap.timeline({
    // Provide a slightly longer default duration to make transitions feel more fluid on larger screens
    defaults: {
      ease: easeOut,
      duration: durContainer,
    },
  });

  // Start Phase 1 after "phase1Delay"
  tl.to({}, { duration: phase1Delay });

  // PHASE 1: Initial container shape animation
  tl.to(
    [".hero--video-container", ".hero--video-w"],
    {
      duration: durContainer,
      borderRadius: (index) => (index === 1 ? "1rem" : 0),
      padding: (index) => {
        if (index === 0) {
          return isDesktop
            ? "2rem"
            : isTablet
            ? "7rem 2rem 0 2rem"
            : isMobileLarge
            ? "6.5rem 1.5rem 0 1.5rem"
            : "5rem 1.5rem 0 1.5rem";
        }
        return 0;
      },
      scale: 1,
      opacity: 1,
      ease: easeOut,
    },
    "phase1"
  );

  // Delay Between Phase 1 & Phase 2
  tl.to({}, { duration: delayBetweenPhase1And2 });

  // PHASE 2: Dramatic height reduction & content entry
  tl.to(
    ".hero--section.is--video",
    {
      height: isDesktop
        ? vh <= 800
          ? "87.5svh"
          : vh <= 1049
          ? "85svh"
          : "82.5svh"
        : isTablet
        ? "85svh"
        : isMobileTall
        ? "80svh"
        : "85svh",
      duration: durCollapse,
      ease: easeInOut,
    },
    "-=0.7"
  );

  // Content fades in slightly after the section begins collapsing
  tl.to(
    ".hero--content.is--video",
    {
      opacity: 1,
      y: "0%",
      scale: 1,
      duration: durContent,
      ease: easeOut,
    },
    offsetContent
  );

  // Headers follow the content a bit closer to keep everything in sync
  tl.to(
    [".hero--header.is--video"],
    {
      opacity: 1,
      y: 0,
      duration: durHeaders,
      stagger: 0.25,
      ease: easeOut,
    },
    offsetHeaders
  );

  return tl;
}

// Main initialization function
function initHeroVideo() {
  // Exit early if GSAP is not available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    // Remove the flicker style to at least show the page even if animations won't work
    return;
  }

  // Function to initialize animations when ready
  function initAnimations() {
    // Check if hero elements exist before initializing
    if (!document.querySelector(".hero--section.is--video")) {
      // Exit if no hero video section exists, but still make page visible
      return;
    }

    // Initialize hero states
    if (!initializeHeroStates()) return;

    // Create and play the animation immediately
    const timeline = createHeroIntroTimeline({
      phase1Delay: 0, // No delay to start immediately
      delayBetweenPhase1And2: 0.1, // Reduced delay between phases
    });

    // Skip if timeline couldn't be created
    if (!timeline) return;

    // Fade out loader now that setup is complete
    gsap.to(".loader", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        gsap.set(".loader", { display: "none" });
      },
    });

    // Optional: Add ScrollTrigger for interactive animations
    if (typeof ScrollTrigger !== "undefined") {
      gsap.to(".hero--video", {
        scrollTrigger: {
          trigger: ".hero--section.is--video",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 1.1,
        borderRadius: "2rem",
      });
    }
  }

  // High priority initialization
  initAnimations();
}

// Ensure initialization runs after Webflow is ready
Webflow.push(() => {
  initHeroVideo();
});
