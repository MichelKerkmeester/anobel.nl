// Button: CTA
// Animate on Hover

// Check if device supports touch
const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Check if device is desktop or tablet (not mobile)
const isDesktopOrTablet = () => {
  const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
  const hasTouch = isTouchDevice();

  // Desktop (no touch, large screen) or Tablet (touch, large screen)
  return isLargeScreen;
};

const btnContainerAnimation = () => {
  // Only run on desktop and tablet
  if (!isDesktopOrTablet()) {
    return;
  }

  // Select all btn--cta containers
  const btnContainers = document.querySelectorAll(".btn--cta");

  btnContainers.forEach((container) => {
    // Find all btn elements within this container
    const buttons = container.querySelectorAll(".btn");

    // Create a collection of button animations
    const buttonAnimations = [];

    // Set up animations for each button
    buttons.forEach((btn) => {
      // Look for animated icons within each button
      const iconBase = btn.querySelector(".btn--icon.is--animated-base");
      const iconAbsolute = btn.querySelector(
        ".btn--icon.is--animated-absolute"
      );

      if (iconBase && iconAbsolute) {
        // Create animation timeline
        const timeline = gsap.timeline({ paused: true, reversed: true });

        // Determine button type to apply appropriate style changes
        const btnType = btn.getAttribute("data-btn-type");

        // Define the animation for icons only
        timeline
          // Set initial state for the absolute icon
          .set(iconAbsolute, { opacity: 0 })
          // Animate the icons
          .to(
            iconAbsolute,
            {
              x: "0%",
              opacity: 1,
              duration: 0.3,
              ease: "power1.out",
            },
            0
          )
          .to(
            iconBase,
            {
              x: "200%",
              opacity: 0,
              duration: 0.3,
              ease: "power0",
            },
            0
          );

        // Store the animation for this button
        buttonAnimations.push(timeline);
      }
    });

    // Add container-level hover events that trigger all button animations
    if (buttonAnimations.length > 0) {
      // Container mouseenter - play all animations
      container.addEventListener("mouseenter", () => {
        buttonAnimations.forEach((timeline) => timeline.play());
      });

      // Container mouseleave - reverse all animations
      container.addEventListener("mouseleave", () => {
        buttonAnimations.forEach((timeline) => timeline.reverse());
      });
    }
  });
};

// Override the original button animation
const btnAnimation = () => {
  // This is intentionally empty to override the original function
  // We're replacing its functionality with btnContainerAnimation
  console.log(
    "Original button animation disabled - using container animation instead"
  );
};

// Initialize immediately - Slater handles DOM ready timing
btnContainerAnimation();
