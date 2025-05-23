// Navigation
// Hide Nav on Scroll

const initHideNavOnScroll = () => {
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
      navbar.style.transform = "translateY(-200%)";
    }
    // Scrolling up
    else {
      navbar.style.transform = "translateY(0)";
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

  // Add smooth transition to the navbar
  navbar.style.transition = "transform 0.3s ease-in-out";

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll, { passive: true });
};

// Initialize with Webflow (Slater already handles DOM ready)
window.Webflow = window.Webflow || [];
window.Webflow.push(function () {
  initHideNavOnScroll();
});
