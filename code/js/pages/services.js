// Services
// GSAP Animations

// Hero
// Animate on load
function animateHeroIntro() {
  const isMobileOrTablet = window.innerWidth < 992;
  const suffix = isMobileOrTablet ? "--mobile" : "";

  // Define the elements to animate
  const elements = `#hero-caption${suffix}, #hero-heading-1${suffix}, #hero-heading-2${suffix}, #hero-male${suffix}, #hero-female${suffix}, #hero-cursor${suffix}, #hero-other${suffix}, #hero-description${suffix}, #hero-marquee`;

  // Set initial state
  gsap.set(
    elements.split(",").map((s) => s.trim()),
    {
      opacity: 0,
      y: isMobileOrTablet ? "4rem" : "6rem",
      immediateRender: true,
    }
  );

  // Create animation timeline
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: isMobileOrTablet ? 1.4 : 1.2 },
  });

  // Animate elements
  tl.to(
    elements.split(",").map((s) => s.trim()),
    {
      opacity: 1,
      y: 0,
      stagger: isMobileOrTablet ? 0.09 : 0.11,
    }
  );

  return tl;
}

// Run animation when DOM is ready
document.addEventListener("DOMContentLoaded", animateHeroIntro);

// Venn Diagram
// Animate in view
function animateVennDiagram() {
  gsap.registerPlugin(ScrollTrigger);

  const isMobileOrTablet = window.innerWidth < 992;

  const diagramElements = [
    "#diagram-heading",
    "#diagram-image",
    "#diagram-subtitle",
    "#diagram-description",
  ];

  diagramElements.forEach((selector) => {
    const element = document.querySelector(selector);
    if (!element) return;

    // Set initial state for each element
    gsap.set(element, {
      opacity: 0,
      y: isMobileOrTablet ? "4rem" : "6rem",
    });

    // Create animation for each element
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: isMobileOrTablet ? 1.4 : 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 70%",
        end: "bottom 40%",
        toggleActions: "play none none none",
        // markers: true, // Uncomment for debugging
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", animateVennDiagram);
