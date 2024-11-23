// Hero
// Animate on load
function animateHeroIntro() {
  const isMobileOrTablet = window.innerWidth < 992;
  const suffix = isMobileOrTablet ? "--mobile" : "";

  // Define the elements to animate
  const elements = `#hero-caption${suffix}, #hero-heading-1${suffix}, #hero-heading-2${suffix}, #hero-male${suffix}, #hero-female${suffix}`;
  const heroImage = `#hero-image${suffix}`;
  // Set initial state
  gsap.set(
    elements.split(",").map((s) => s.trim()),
    {
      opacity: 0,
      y: isMobileOrTablet ? "4rem" : "6rem",
      immediateRender: true,
    }
  );

  gsap.set(heroImage, {
    y: isMobileOrTablet ? "5rem" : "8rem",
    immediateRender: true,
  });

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
  // Animate hero image
  tl.to(
    heroImage,
    {
      y: 0,
      duration: isMobileOrTablet ? 1.6 : 1.4,
      ease: "power3.out",
    },
    "<"
  );

  return tl;
}

// Run animation when DOM is ready
document.addEventListener("DOMContentLoaded", animateHeroIntro);
