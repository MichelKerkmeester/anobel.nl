// Timeline Swiper - Plain JavaScript with Year Button Navigation

// Function to initialize timeline swiper
function initTimelineSwiper() {
  const timelineContainer = document.querySelector(".timeline--swiper");

  if (!timelineContainer) {
    return; // Exit if the swiper container doesn't exist
  }

  const slides = timelineContainer.querySelectorAll(".timeline--swiper-slide");
  const slidesCount = slides.length;
  const yearButtons = document.querySelectorAll("[timeline-year]");
  let currentActiveYear = null; // Variable to track the currently active year

  // Swiper configuration
  const swiperConfig = {
    slideClass: "timeline--swiper-slide",
    wrapperClass: "timeline--swiper-wrapper",
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 32,
    grabCursor: true,
    loop: slidesCount > 1, // Only loop if there's more than one slide
    speed: 1200,
    autoHeight: true,
    // parallax: { enabled: true }, // Disabled to prevent background color transitions
    watchSlidesProgress: true,
    lazy: { loadOnTransitionStart: true },
    a11y: { enabled: false },
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '[timeline-pagination="next"]',
      prevEl: '[timeline-pagination="previous"]',
    },
    on: {
      init: function () {
        updateYearButtons(this);
      },
      slideChangeTransitionEnd: function () {
        updateYearButtons(this);
      },
    },
  };

  // Initialize Swiper
  const timelineSwiper = new Swiper(timelineContainer, swiperConfig);

  // Create a map of slide names to their original index
  const slideNameMap = new Map();
  slides.forEach((slide, index) => {
    // Assumes each slide has a `timeline-year` attribute with the year (e.g., timeline-year="1953")
    const name = slide.getAttribute("timeline-year");
    if (name) {
      slideNameMap.set(name, index);
    }
  });

  // Add click handlers to year buttons
  yearButtons.forEach((button) => {
    const name = button.getAttribute("timeline-year");
    // Ensure it's a year button, not a nav button
    if (name && name !== "next" && name !== "previous") {
      button.addEventListener("click", () => {
        if (slideNameMap.has(name)) {
          const index = slideNameMap.get(name);
          // Use slideTo instead of slideToLoop for more reliable navigation
          if (slidesCount > 1) {
            timelineSwiper.slideToLoop(index, 1200); // 1200ms duration to match speed
          } else {
            timelineSwiper.slideTo(index, 1200);
          }
        }
      });
    }
  });

  // Function to update year button active states
  function updateYearButtons(swiperInstance) {
    if (!swiperInstance.slides[swiperInstance.activeIndex]) return;
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const newActiveYear = activeSlide.getAttribute("timeline-year");

    if (newActiveYear === currentActiveYear) {
      return; // No change, do nothing
    }

    // Deactivate the previously active button, if there was one
    if (currentActiveYear) {
      const oldActiveButton = document.querySelector(
        `[timeline-year="${currentActiveYear}"]`
      );
      if (oldActiveButton) {
        oldActiveButton.classList.remove("is-active");
      }
    }

    // Activate the new button
    const newActiveButton = document.querySelector(
      `[timeline-year="${newActiveYear}"]`
    );
    if (newActiveButton) {
      newActiveButton.classList.add("is-active");
    }

    // Update the tracker for the next change
    currentActiveYear = newActiveYear;
  }

  // Remove hidden attributes from slides to make them visible
  slides.forEach((slide) => {
    slide.removeAttribute("hidden");
  });
}

// Initialize the swiper
initTimelineSwiper();
