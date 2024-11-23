// CMS Marquee
function initializeMarquee() {
  const marqueeWrapper = document.querySelector(".marquee--w");
  const marqueeList = marqueeWrapper.querySelector(".marquee--list-w");

  // Configuration
  const desktopDuration = 20; // seconds
  const mobileDuration = 30; // seconds
  const mobileBreakpoint = 992;

  function setupMarquee() {
    const isDesktop = window.innerWidth >= mobileBreakpoint;
    const duration = isDesktop ? desktopDuration : mobileDuration;

    // Clear existing content and animation
    marqueeList.innerHTML = "";
    marqueeList.style.animation = "none";

    // Clone the original items
    const originalItems = Array.from(
      marqueeWrapper.querySelectorAll(".marquee--list-w > *")
    );
    originalItems.forEach((item) =>
      marqueeList.appendChild(item.cloneNode(true))
    );
    originalItems.forEach((item) =>
      marqueeList.appendChild(item.cloneNode(true))
    );

    // Set up the CSS animation
    marqueeList.style.setProperty("--marquee-duration", `${duration}s`);
    marqueeList.style.animation =
      "marquee var(--marquee-duration) linear infinite";

    // Add necessary styles
    marqueeWrapper.style.overflow = "hidden";
    marqueeList.style.display = "flex";
    marqueeList.style.width = "max-content";
  }

  function handleResize() {
    setupMarquee();
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedHandleResize = debounce(handleResize, 250);

  // Listen for window resize events
  window.addEventListener("resize", debouncedHandleResize);

  // Initialize the marquee
  setupMarquee();

  // Add the CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize marquee when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializeMarquee();
});

// Listen for preloader finished event (for home page)
document.addEventListener("preloaderFinished", function () {
  initializeMarquee();
});
