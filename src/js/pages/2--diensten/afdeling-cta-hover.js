// Afdeling: CTA
// Hover Animation
document.addEventListener('DOMContentLoaded', () => {
  // Get all CTA cards
  const ctaCards = document.querySelectorAll('.afdeling--card.is--cta');

  // Add hover listeners to each card
  ctaCards.forEach((card) => {
    const btn = card.querySelector('.afdeling--btn');

    // Hover in
    card.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        backgroundColor: 'var(--secondary--darker)',
        duration: 0.2,
        ease: 'power1.out',
      });
    });

    // Hover out - return to original color
    card.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        backgroundColor: 'var(--secondary--base)',
        duration: 0.2,
        ease: 'power1.out',
      });
    });
  });
});
