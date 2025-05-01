// Hero
// Intro Animation

// Initial setup
function initializeHeroStates() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobileTall = vw < 480 && vh >= 650; // New breakpoint

  gsap.set('.hero--content', {
    opacity: 0,
    y: '100%',
    scale: 0.92,
    willChange: 'opacity, transform', // Optimize for performance
  });

  gsap.set(['.hero--header', '.hero--service-list'], {
    opacity: 0,
    y: isDesktop ? '2rem' : isTablet ? '1.5rem' : '1rem',
    willChange: 'opacity, transform', // Optimize for performance
  });

  gsap.set('.hero--section.is--video', {
    height: isDesktop ? '100svh' : isTablet ? '95svh' : isMobileTall ? '95svh' : '90svh',
  });

  gsap.set('.hero--video-container', { padding: 0 });

  gsap.set('.hero--video', {
    borderRadius: 0,
    scale: 1.05,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    perspective: 1000,
    willChange: 'transform', // Optimize for performance
  });
}

// GSAP Timeline
function createHeroIntroTimeline({ phase1Delay, delayBetweenPhase1And2 }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 992;
  const isTablet = vw >= 768 && vw < 992;
  const isMobileLarge = vw >= 480 && vw < 768;
  const isMobileTall = vw < 480 && vh >= 650;
  const isMobile = vw < 480;

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out',
    },
  });

  // Start Phase 1 after "phase1Delay"
  tl.to({}, { duration: phase1Delay });

  // PHASE 1: Initial container shape animation
  tl.to(
    ['.hero--video-container', '.hero--video-w'],
    {
      duration: 1,
      borderRadius: (index) => (index === 1 ? '1rem' : 0),
      padding: (index) => {
        if (index === 0) {
          return isDesktop
            ? '2rem'
            : isTablet
              ? '7rem 2rem 0 2rem'
              : isMobileLarge
                ? '6.5rem 1.5rem 0 1.5rem'
                : '5rem 1.5rem 0 1.5rem';
        }
        return 0;
      },
      scale: 1,
      opacity: 1,
      ease: 'power2.out',
    },
    'phase1'
  );

  // Delay Between Phase 1 & Phase 2
  tl.to({}, { duration: delayBetweenPhase1And2 });

  // PHASE 2: Dramatic height reduction & content entry
  tl.to(
    '.hero--section.is--video',
    {
      height: isDesktop
        ? vh <= 800
          ? '87.5svh'
          : vh <= 1049
            ? '85svh'
            : '77.5svh'
        : isTablet
          ? '85svh'
          : isMobileTall
            ? '80svh'
            : '85svh',
      duration: 1.8,
      ease: 'power4.inOut',
    },
    '-=0.8'
  );

  tl.to(
    '.hero--content',
    {
      opacity: 1,
      y: '0%',
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
    },
    '-=0.9'
  );

  // Increased stagger for content animation
  tl.to(
    ['.hero--header', '.hero--service-list'],
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2, // Adjusted stagger for better flow
      ease: 'power2.out',
    },
    '-=1.4'
  );

  return tl;
}

// Initialize and play animation when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initializeHeroStates();

  createHeroIntroTimeline({
    phase1Delay: 0,
    delayBetweenPhase1And2: 0.2,
  });

  // Optional: Add ScrollTrigger for interactive animations
  gsap.to('.hero--video', {
    scrollTrigger: {
      trigger: '.hero--section.is--video',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    scale: 1.1,
    borderRadius: '2rem',
  });
});
