// Hero
// Intro Animation

// Pre-load optimization - hide content immediately
(function preventFlicker() {
  // Create a style element to hide page content until JS initializes animations
  const style = document.createElement("style");
  style.textContent = `
    .page--wrapper {
      opacity: 0 !important;
      visibility: hidden !important;
    }
    .hero--video {
      transform: scale(1.05);
      backface-visibility: hidden;
    }
  `;
  style.id = "hero-prevent-flicker";
  document.head.appendChild(style);
})();

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
  var isMobileTall = vw < 480 && vh >= 650; // New breakpoint

  // Remove the flicker prevention style to show the page
  const flickerStyle = document.getElementById("hero-prevent-flicker");
  if (flickerStyle) flickerStyle.remove();

  // Make page wrapper visible with a smooth fade
  gsap.set(".page--wrapper", {
    opacity: 1,
    visibility: "visible",
    clearProps: "visibility", // Clean up the visibility property after setting
  });

  gsap.set(".hero--content.is--video", {
    opacity: 0,
    y: "100%",
    scale: 0.92,
    willChange: "opacity, transform", // Optimize for performance
  });

  gsap.set([".hero--header.is--video"], {
    opacity: 0,
    y: isDesktop ? "10vh" : isTablet ? "2rem" : "1rem",
    willChange: "opacity, transform", // Optimize for performance
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
    willChange: "transform", // Optimize for performance
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

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  // Start Phase 1 after "phase1Delay"
  tl.to({}, { duration: phase1Delay });

  // PHASE 1: Initial container shape animation
  tl.to(
    [".hero--video-container", ".hero--video-w"],
    {
      duration: 1,
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
      ease: "power2.out",
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
          : "77.5svh"
        : isTablet
        ? "85svh"
        : isMobileTall
        ? "80svh"
        : "85svh",
      duration: 1.8,
      ease: "power4.inOut",
    },
    "-=0.8"
  );

  tl.to(
    ".hero--content.is--video",
    {
      opacity: 1,
      y: "0%",
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
    },
    "-=2"
  );

  // Increased stagger for content animation
  tl.to(
    [".hero--header.is--video"],
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2, // Adjusted stagger for better flow
      ease: "power2.out",
    },
    "-=2"
  );

  return tl;
}

// Main initialization function
function initHeroVideo() {
  // Exit early if GSAP is not available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    // Remove the flicker style to at least show the page even if animations won't work
    const flickerStyle = document.getElementById("hero-prevent-flicker");
    if (flickerStyle) flickerStyle.remove();
    return;
  }

  // Function to initialize animations when ready
  function initAnimations() {
    // Check if hero elements exist before initializing
    if (!document.querySelector(".hero--section.is--video")) {
      // Exit if no hero video section exists, but still make page visible
      const flickerStyle = document.getElementById("hero-prevent-flicker");
      if (flickerStyle) flickerStyle.remove();
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

// Try to run immediately if possible
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initHeroVideo();
}

// Always register with Slater for safe initialization
window.slaterCallbacks = window.slaterCallbacks || [];
window.slaterCallbacks.unshift(initHeroVideo);
