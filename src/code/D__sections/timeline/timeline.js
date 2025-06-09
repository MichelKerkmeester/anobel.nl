// Timeline Swiper - Year Button Active State Management

// Function to initialize timeline swiper
function initTimelineSwiper() {
  const timelineContainer = document.querySelector(".timeline--swiper");

  if (!timelineContainer) {
    return; // Exit if the swiper container doesn't exist
  }

  const slides = timelineContainer.querySelectorAll(".timeline--swiper-slide");
  const slidesCount = slides.length;
  const yearButtons = document.querySelectorAll('[data-btn-type="Year"]');

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
        updateYearButtonActiveState(this);
      },
      slideChangeTransitionEnd: function () {
        updateYearButtonActiveState(this);
      },
    },
  };

  // Initialize Swiper
  const timelineSwiper = new Swiper(timelineContainer, swiperConfig);

  // Create a map of year values to their slide index
  const yearToSlideMap = new Map();
  slides.forEach((slide, index) => {
    const year = slide.getAttribute("timeline-year");
    if (year) {
      yearToSlideMap.set(year, index);
    }
  });

  // Add click handlers to year buttons
  yearButtons.forEach((button) => {
    // Get the year from the button - assuming it has a timeline-year attribute or text content
    const year = button.getAttribute("timeline-year") || button.textContent?.trim();
    
    if (year && yearToSlideMap.has(year)) {
      button.addEventListener("click", () => {
        const slideIndex = yearToSlideMap.get(year);
        if (slidesCount > 1) {
          timelineSwiper.slideToLoop(slideIndex, 1200);
        } else {
          timelineSwiper.slideTo(slideIndex, 1200);
        }
      });
    }
  });

  // Function to update active state on year buttons
  function updateYearButtonActiveState(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;
    
    const activeYear = activeSlide.getAttribute("timeline-year");
    if (!activeYear) return;

    // Remove is--active class from all year buttons
    yearButtons.forEach((button) => {
      button.classList.remove("is--active");
    });

    // Add is--active class to the matching year button
    yearButtons.forEach((button) => {
      const buttonYear = button.getAttribute("timeline-year") || button.textContent?.trim();
      if (buttonYear === activeYear) {
        button.classList.add("is--active");
      }
    });
  }

  // Remove hidden attributes from slides to make them visible
  slides.forEach((slide) => {
    slide.removeAttribute("hidden");
  });
}

// Initialize the swiper
initTimelineSwiper();
