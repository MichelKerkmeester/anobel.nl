// Hero
// Intro Animation - Performance Optimized

// Performance configuration
const PERF_CONFIG = {
  force3D: true, // Force GPU acceleration
  autoSleep: 60, // Auto-sleep inactive animations
  lagSmoothing: 0, // Disable for consistent performance
  nullTargetWarn: false
};

// Initial setup - Batched for performance
function initializeHeroStates() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    return false;
  }

  // Configure GSAP for performance
  gsap.config(PERF_CONFIG);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobileTall = vw < 480 && vh >= 650;

  // Batch all initial states into one timeline for better performance
  const initTL = gsap.timeline({ defaults: { immediateRender: true } });

  // Collect all elements first to minimize DOM queries
  const elements = {
    wrapper: document.querySelector(".page--wrapper"),
    heroContent: document.querySelector(".hero--content.is--video"),
    heroHeaders: document.querySelectorAll(".hero--header"),
    heroSection: document.querySelector(".hero--section.is--video"),
    videoContainer: document.querySelector(".hero--video-container"),
    video: document.querySelector(".hero--video")
  };

  // Exit if required elements don't exist
  if (!elements.heroSection) return false;

  // Apply will-change to animating elements
  const animatingElements = [elements.heroContent, ...elements.heroHeaders, elements.video].filter(Boolean);
  animatingElements.forEach(el => {
    if (el && el.style) el.style.willChange = "transform, opacity";
  });

  // Batch all set operations
  initTL
    .set(elements.wrapper, {
      opacity: 1,
      visibility: "visible",
      clearProps: "visibility"
    })
    .set(elements.heroContent, {
      opacity: 0,
      y: "100%",
      scale: 0.92,
      force3D: true
    })
    .set(elements.heroHeaders, {
      opacity: 0,
      y: isDesktop ? "10vh" : isTablet ? "2rem" : "1rem",
      force3D: true
    })
    .set(elements.heroSection, {
      height: isDesktop
        ? "100svh"
        : isTablet
        ? "97.5svh"
        : isMobileTall
        ? "97.5svh"
        : "92.5svh"
    })
    .set(elements.videoContainer, { padding: 0 })
    .set(elements.video, {
      borderRadius: 0,
      scale: 1.05,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      perspective: 1000,
      force3D: true
    });

  return { elements, animatingElements };
}

// GSAP Timeline 
function createHeroIntroTimeline({ phase1Delay, delayBetweenPhase1And2, elements, animatingElements }) {
  if (typeof gsap === "undefined") return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobileLarge = vw >= 480 && vw < 768;
  const isMobileTall = vw < 480 && vh >= 650;
  const isMobile = vw < 480;

  // Performance-optimized easing
  const easeOut = isDesktop ? "power4.out" : "expo.out";
  const easeInOut = isDesktop ? "power2.inOut" : "expo.inOut";

  // Duration helpers
  const durContainer = isMobile ? 1.3 : isDesktop ? 1.1 : 1;
  const durCollapse = isMobile ? 1.5 : isDesktop ? 1.2 : 1.2;
  const durContent = isMobile ? 1.1 : isDesktop ? 1.1 : 1.0;
  const durHeaders = isMobile ? 1.0 : isDesktop ? 0.9 : 0.9;

  // Offset helpers
  const offsetContent = isMobile ? "-=1.4" : "-=0.9";
  const offsetHeaders = isMobile ? "-=1.1" : "-=0.7";

  const tl = gsap.timeline({
    defaults: {
      ease: easeOut,
      duration: durContainer,
      force3D: true // Ensure all animations use GPU
    },
    onComplete: () => {
      // Clean up will-change after all animations complete
      animatingElements.forEach(el => {
        if (el && el.style) {
          el.style.willChange = "auto";
        }
      });
    }
  });

  // Use labels for better timeline management
  tl.addLabel("start", phase1Delay)
    
    // PHASE 1: Container animation
    .to(
      [elements.videoContainer, ".hero--video-w"],
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
        ease: easeOut
      },
      "start"
    )
    
    .addLabel("phase2", `start+=${durContainer + delayBetweenPhase1And2}`)
    
    // PHASE 2: Height reduction
    .to(
      elements.heroSection,
      {
        height: isDesktop
          ? vh <= 800
            ? "87.5svh"
            : vh <= 1049
            ? "85svh"
            : "82.5svh"
          : isTablet
          ? "87.5svh"
          : isMobileTall
          ? "82.5svh"
          : "87.5svh",
        duration: durCollapse,
        ease: easeInOut
      },
      "phase2-=0.7"
    )
    
    // Content entry - use fromTo for better control
    .fromTo(
      elements.heroContent,
      {
        opacity: 0,
        y: "100%",
        scale: 0.92
      },
      {
        opacity: 1,
        y: "0%",
        scale: 1,
        duration: durContent,
        ease: easeOut,
        clearProps: "scale" // Clean up scale after animation
      },
      `phase2${offsetContent}`
    )
    
    // Headers entry with optimized stagger
    .to(
      elements.heroHeaders,
      {
        opacity: 1,
        y: 0,
        duration: durHeaders,
        stagger: {
          each: 0.25,
          from: "start"
        },
        ease: easeOut,
        clearProps: "transform" // Clean up transforms after animation
      },
      `phase2${offsetHeaders}`
    );

  return tl;
}

// Optimized ScrollTrigger setup
function setupScrollAnimations(elements) {
  if (typeof ScrollTrigger === "undefined" || !elements.video) return;

  // Register plugin
  gsap.registerPlugin(ScrollTrigger);

  // Configure ScrollTrigger for performance
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40
  });

  // Set will-change for scroll animation
  elements.video.style.willChange = "transform";

  const scrollTrigger = ScrollTrigger.create({
    trigger: elements.heroSection,
    start: "top top",
    end: "bottom top",
    scrub: 1, // Use numeric value for smoother scrubbing
    animation: gsap.to(elements.video, {
      scale: 1.1,
      borderRadius: "2rem",
      ease: "none" // Linear easing for scroll-linked animations
    }),
    onLeave: () => {
      // Clean up will-change when element is out of view
      elements.video.style.willChange = "auto";
    },
    onEnterBack: () => {
      // Re-apply will-change when scrolling back
      elements.video.style.willChange = "transform";
    }
  });

  return scrollTrigger;
}

// Main initialization function with performance monitoring
function initHeroVideo() {
  // Performance timing
  const startTime = performance.now();

  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, cannot initialize hero animations");
    return;
  }

  // Initialize animations
  function initAnimations() {
    const heroData = initializeHeroStates();
    if (!heroData) return;

    const { elements, animatingElements } = heroData;

    // Create and play the animation
    const timeline = createHeroIntroTimeline({
      phase1Delay: 0,
      delayBetweenPhase1And2: 0.1,
      elements,
      animatingElements
    });

    if (!timeline) return;

    // Handle loader with optimized animation
    const loader = document.querySelector(".loader");
    if (loader && loader.style) {
      loader.style.willChange = "opacity";
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (loader.style) {
            loader.style.display = "none";
            loader.style.willChange = "auto";
          }
        }
      });
    }

    // Setup scroll animations after main timeline
    timeline.then(() => {
      setupScrollAnimations(elements);
    });

    // Log performance metrics in development
    if (window.location.hostname === "localhost") {
      const endTime = performance.now();
      console.log(`Hero animation initialized in ${(endTime - startTime).toFixed(2)}ms`);
    }
  }

  // Use requestAnimationFrame for optimal timing
  requestAnimationFrame(initAnimations);
}

// Ensure initialization runs after Webflow is ready
Webflow.push(() => {
  // Use requestIdleCallback if available for non-critical initialization
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => initHeroVideo(), { timeout: 100 });
  } else {
    initHeroVideo();
  }
});
