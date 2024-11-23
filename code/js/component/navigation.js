// Navigation
// Hide/Show on scroll
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Select the nav bar element
  const navHeader = document.querySelector(".nav--bar"); // Adjust selector as per your nav header class

  // Store the initial scroll position
  let lastScrollY = window.scrollY;
  let handleScrollEnabled = true;
  const scrollThreshold = window.innerHeight * 0.1; // 10% of viewport height
  const extraMargin = 10; // Extra margin to move the nav header further out of view

  // Function to handle scroll for all devices
  function handleScroll() {
    if (!handleScrollEnabled) return;

    // Get the current scroll position
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // If scrolling down, hide the nav header with extra margin
      gsap.to(navHeader, {
        y: -(navHeader.offsetHeight + extraMargin),
        duration: 0.8,
        ease: "power2.out",
      });
      lastScrollY = currentScrollY;
    } else if (lastScrollY - currentScrollY > scrollThreshold) {
      // If scrolling up and scrolled more than the threshold, show the nav header
      gsap.to(navHeader, {
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      });
      lastScrollY = currentScrollY;
    }
  }

  // Disable scroll handling
  window.disableScrollHandling = function () {
    handleScrollEnabled = false;
  };

  // Enable scroll handling
  window.enableScrollHandling = function () {
    handleScrollEnabled = true;
  };

  // Attach the handleScroll function to the window's scroll event
  window.addEventListener("scroll", handleScroll);

  // Hide nav bar when an accordion item is opened on mobile
  function hideNavOnAccordionOpen() {
    if (window.innerWidth <= 991) {
      // Only on tablet or mobile devices
      gsap.to(navHeader, {
        y: -(navHeader.offsetHeight + extraMargin),
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }

  // Add event listener to accordion headers
  document.querySelectorAll(".accordion--header").forEach((header) => {
    header.addEventListener("click", hideNavOnAccordionOpen);
  });

  // Hide nav logo on mobile
  if (window.innerWidth <= 991) {
    // Only on tablet or mobile devices
    // Set the initial state of the button to be visible
    gsap.set(".btn--nav", { opacity: 1 });

    ScrollTrigger.create({
      trigger: ".section--hero",
      start: "top top", // Section top hits viewport top
      end: "bottom 20%", // Section bottom hits 20% viewport height
      onEnter: () =>
        gsap.to(".btn--nav", { opacity: 1, duration: 0.8, ease: "expo.out" }), // Show button
      onLeave: () =>
        gsap.to(".btn--nav", { opacity: 0, duration: 0.8, ease: "power2.out" }), // Hide button
      onEnterBack: () =>
        gsap.to(".btn--nav", { opacity: 1, duration: 0.8, ease: "expo.out" }), // Show button when scrolling up
      onLeaveBack: (self) => {
        if (self.direction === -1 && self.progress === 0) {
          gsap.to(".btn--nav", { opacity: 1, duration: 0.8, ease: "expo.out" }); // Ensure the button stays visible at the top
        } else {
          gsap.to(".btn--nav", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          }); // Hide button when scrolling back up
        }
      },
    });
  }
});
