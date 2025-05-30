// Text link
// Animate on Hover - Desktop & Tablet Only
Webflow.push(() => {
  // Device detection
  const isDesktopOrTablet = window.matchMedia("(min-width: 768px)").matches;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Only proceed if desktop or tablet
  if (!isDesktopOrTablet) return;

  // Only select hover elements within links that have the data attribute
  document
    .querySelectorAll(
      '.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover'
    )
    .forEach(function (el) {
      el.style.width = "0%";
      el.style.visibility = "hidden";
    });

  document
    .querySelectorAll('.btn--text-link[data-text-link-hover="Underline"]')
    .forEach(function (link) {
      // Handle touch devices differently
      if (isTouchDevice) {
        // For touch devices, use touch events
        link.addEventListener("touchstart", function () {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "100%",
              visibility: "visible",
              ease: "power1.out",
            });
          }
        });

        link.addEventListener("touchend", function () {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "0%",
              visibility: "hidden",
              ease: "power1.out",
            });
          }
        });
      } else {
        // For non-touch devices, use mouse events
        link.addEventListener("mouseenter", function () {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "100%",
              visibility: "visible",
              ease: "power1.out",
            });
          }
        });

        link.addEventListener("mouseleave", function () {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "0%",
              visibility: "hidden",
              ease: "power1.out",
            });
          }
        });
      }
    });
});
