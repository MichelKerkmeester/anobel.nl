// Link: General
// Hover Animation
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.link--general');

  cards.forEach((card) => {
    // Create timeline for hover animation
    const tl = gsap.timeline({ paused: true });

    // Add animation for the divider line with power2.out for hover in
    tl.to(card.querySelector('.link--divider-line'), {
      width: '100%',
      duration: 0.6,
      ease: 'power2.out',
    }).reverse(); // Initialize in reversed state

    // Add hover listeners
    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());
  });
});
