// Swiper
// Timeline

function safeInit() {
  try {
    initTimelineSwiper();
  } catch (error) {
    console.error("Timeline initialization failed:", error);
  }
}

function initTimelineSwiper() {
  const contentContainer = document.querySelector("#swiper-timeline");

  if (!contentContainer) {
    console.error("Timeline Swiper container not found.");
    return;
  }

  // Check if Swiper is available
  if (typeof Swiper === 'undefined') {
    console.error("Swiper library not loaded.");
    return;
  }

  // Check number of slides for loop functionality
  const slides = contentContainer.querySelectorAll(".swiper-slide");
  const slidesCount = slides.length;

  const mainSwiper = new Swiper(contentContainer, {
    speed: 1200,
    autoHeight: true,
    loop: slidesCount > 1, // Only loop if there's more than one slide
    navigation: {
      nextEl: '[timeline-pagination="next"]',
      prevEl: '[timeline-pagination="previous"]',
    },
    keyboard: {
      enabled: true,
    },
  });

  console.log("Timeline swiper initialized successfully.");
}

// Initialize the Swiper component using Webflow's recommended pattern
if (window.Webflow) {
  window.Webflow.push(() => {
    safeInit();
  });
} else {
  // Fallback if Webflow object is not available
  safeInit();

