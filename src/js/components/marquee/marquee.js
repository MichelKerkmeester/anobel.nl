// Marquee: Clients
// Swiper
const swiper = new Swiper('.marquee--track', {
  wrapperClass: 'marquee--container', // Wrapper container class
  slideClass: 'marquee--item', // Individual slide class
  spaceBetween: 0, // No spacing (handled by CSS)
  allowTouchMove: false, // Disable touch/drag
  a11y: false, // Disable a11y for decorative content
  speed: 5000, // Animation duration in ms
  loop: true, // Enable infinite loop
  slidesPerView: 'auto', // Auto-fit slides
  autoplay: {
    delay: 0, // No transition delay
    disableOnInteraction: false, // Keep running after interaction
  },
});
