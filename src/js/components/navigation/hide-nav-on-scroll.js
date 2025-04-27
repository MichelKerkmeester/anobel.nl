// Navigation
// Hide Nav on Scroll
const initHideNavOnScroll = () => {
  let lastScrollTop = 0;
  const navbar = document.querySelector(".nav--bar");
  const scrollThreshold = 50; // Minimum scroll amount before hiding/showing
  const mobileBreakpoint = 768; // Adjust this based on your mobile breakpoint

  if (!navbar) {
    console.error("Navigation bar (.nav--bar) not found!");
    return;
  }

  function handleScroll() {
    // Only run on desktop
    if (window.innerWidth <= mobileBreakpoint) return;

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

  // Add smooth transition to the navbar
  navbar.style.transition = "transform 0.3s ease-in-out";

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll, { passive: true });
};

// Initialize immediately
initHideNavOnScroll();
