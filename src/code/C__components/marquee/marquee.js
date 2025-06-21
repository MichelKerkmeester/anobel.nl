// Marquee: Clients
// Swiper
function initMarquee() {
  // Check if Swiper is loaded
  if (typeof Swiper === "undefined") {
    // Create and load Swiper script
    const swiperScript = document.createElement("script");
    swiperScript.src =
      "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js";
    swiperScript.onload = initSwiperMarquee;
    document.head.appendChild(swiperScript);
  } else {
    // Swiper already loaded, initialize directly
    initSwiperMarquee();
  }
}

function initSwiperMarquee() {
  // Check if the marquee element exists
  const marqueeTrack = document.querySelector(".marquee--track");
  if (!marqueeTrack) return;

  const swiper = new Swiper(".marquee--track", {
    wrapperClass: "marquee--container", // Wrapper container class
    slideClass: "marquee--item", // Individual slide class
    spaceBetween: 0, // No spacing (handled by CSS)
    allowTouchMove: false, // Disable touch/drag
    a11y: false, // Disable a11y for decorative content
    speed: 8000, // Animation duration in ms
    loop: true, // Enable infinite loop
    slidesPerView: "auto", // Auto-fit slides
    autoplay: {
      delay: 0, // No transition delay
      disableOnInteraction: false, // Keep running after interaction
    },
  });
}

// Initialize when Webflow is ready
Webflow.push(() => {
  initMarquee();
});
