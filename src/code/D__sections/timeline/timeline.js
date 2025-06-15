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
  if (typeof Swiper === "undefined") {
    console.error("Swiper library not loaded.");
    return;
  }

  // Check number of slides for loop functionality
  const slides = contentContainer.querySelectorAll(".swiper--slide");
  const slidesCount = slides.length;

  // Get pagination elements
  const currentSlideEl = document.querySelector("#timeline-current");
  const totalSlidesEl = document.querySelector("#timeline-total");

  // Update total slides display
  if (totalSlidesEl) {
    totalSlidesEl.textContent = slidesCount.toString();
  }

  const mainSwiper = new Swiper(contentContainer, {
    // Basic settings
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    autoHeight: true,
    loop: slidesCount > 1,
    grabCursor: true,

    // Classes
    wrapperClass: "swiper--wrapper",
    slideClass: "swiper--slide",

    // Navigation
    navigation: {
      nextEl: '[timeline-navigation="next"]',
      prevEl: '[timeline-navigation="previous"]',
    },

    // Pagination - custom fraction
    pagination: {
      el: ".swiper-pagination",
      type: "custom",
      renderCustom: function (swiper, current, total) {
        // Update custom elements
        if (currentSlideEl) {
          currentSlideEl.textContent = current.toString();
        }
        if (totalSlidesEl) {
          totalSlidesEl.textContent = total.toString();
        }
        return "";
      },
    },

    // Autoplay
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Touch settings
    simulateTouch: true,
    touchEventsTarget: "container",

    // Accessibility
    a11y: {
      enabled: true,
    },

    // Events
    on: {
      init: function (swiper) {
        // Update pagination on init
        if (currentSlideEl) {
          currentSlideEl.textContent = (swiper.realIndex + 1).toString();
        }
        if (totalSlidesEl) {
          totalSlidesEl.textContent = slidesCount.toString();
        }
      },
      slideChange: function (swiper) {
        // Update current slide display
        if (currentSlideEl) {
          currentSlideEl.textContent = (swiper.realIndex + 1).toString();
        }
      },
    },
  });

  console.log(
    "Timeline swiper initialized successfully with custom pagination."
  );
}

// Initialize the Swiper component using Webflow's recommended pattern
if (window.Webflow) {
  window.Webflow.push(() => {
    safeInit();
  });
} else {
  // Fallback if Webflow object is not available
  safeInit();
}
