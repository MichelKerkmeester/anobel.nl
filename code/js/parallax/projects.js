// Projects
// GSAP Parallax
window.initProjectsParallax = function () {
  // Register the ScrollTrigger plugin for GSAP
  gsap.registerPlugin(ScrollTrigger);

  const projectListItems = document.querySelectorAll(".project--list-item");
  if (projectListItems.length === 0) return; // Exit if no items found

  // Linear interpolation function for smooth animations
  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  // Function to check if the device is mobile
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  projectListItems.forEach((item) => {
    // Select elements within each project item
    const card = item.querySelector(`[id^="project-card"]`);
    const imageWrapper = card.querySelector(`[id^="project-image-w"]`);
    const image = imageWrapper.querySelector(`[id^="project-image"]`);
    const illustration = item.querySelector(`[id^="project-bg"]`);

    // Initial states
    const initialStates = {
      card: { scale: 0.9, yPercent: 25 },
      image: {
        scale: isMobile() ? 1.2 : 1.4, // Different scale for mobile and desktop
      },
      illustration: { scale: 0.7, yPercent: 30, opacity: 0 },
    };

    // Set initial states using GSAP
    gsap.set(card, initialStates.card);
    gsap.set(image, initialStates.image);
    if (illustration) gsap.set(illustration, initialStates.illustration);

    // Animation progress variables
    let progress = 0;
    let targetProgress = 0;
    const speed = 0.075; // Determines how quickly the animation responds to scroll

    // Animation properties
    const animations = {
      card: {
        scale: () => initialStates.card.scale + 0.075 * progress,
        yPercent: () => initialStates.card.yPercent - 25 * progress,
      },
      image: {
        scale: () =>
          initialStates.image.scale - (isMobile() ? 0.2 : 0.4) * progress,
      },
      illustration: illustration
        ? {
            opacity: () => progress,
            scale: () => initialStates.illustration.scale + 0.3 * progress,
            yPercent: () => initialStates.illustration.yPercent - 30 * progress,
          }
        : null,
    };

    // Different start and end points for mobile and desktop
    const triggerSettings = isMobile()
      ? { start: "top 100%", end: "bottom 95%" } // Mobile settings
      : { start: "top 95%", end: "bottom 90%" }; // Desktop settings

    // Create a ScrollTrigger for each project item
    ScrollTrigger.create({
      trigger: item,
      start: triggerSettings.start,
      end: triggerSettings.end,
      onUpdate: (self) => {
        targetProgress = self.progress; // Update target progress based on scroll position
      },
    });

    // Animation function that runs every frame
    function animateItem() {
      // Smoothly interpolate between current and target progress
      progress = lerp(progress, targetProgress, speed);

      // Animate the card
      gsap.to(card, { ...animations.card, duration: 0 });

      // Animate the image
      gsap.to(image, { ...animations.image, duration: 0 });

      // Animate the illustration if it exists
      if (illustration && animations.illustration) {
        gsap.to(illustration, { ...animations.illustration, duration: 0 });
      }

      // Continue the animation loop
      requestAnimationFrame(animateItem);
    }

    // Start the animation loop
    animateItem();
  });
};

// Function to initialize parallax
function initializeParallax() {
  if (window.initProjectsParallax) {
    window.initProjectsParallax();
  }
}

// Check if the page has a preloader
if (document.querySelector(".page--loader")) {
  // If there's a preloader, wait for the preloaderFinished event
  document.addEventListener("preloaderFinished", initializeParallax);
} else {
  // If there's no preloader, initialize parallax on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", initializeParallax);
}
