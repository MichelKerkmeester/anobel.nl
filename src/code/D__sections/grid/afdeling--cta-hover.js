// Afdeling: CTA
// Hover Animation
function initAfdelingCtaHover() {
  // Check if device is tablet/desktop (not mobile) and not a touch device
  const isTabletOrDesktop = window.matchMedia(
    "(min-width: 768px) and (hover: hover)"
  ).matches;

  if (!isTabletOrDesktop) return; // Exit early if mobile or touch device

  // Get all CTA cards
  const ctaCards = document.querySelectorAll(".afdeling--card.is--cta");

  // Add hover listeners to each card
  ctaCards.forEach((card) => {
    const btn = card.querySelector(".afdeling--btn");

    // Hover in
    card.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        backgroundColor: "var(--_color-tokens---bg-brand--darker)",
        duration: 0.2,
        ease: "power1.out",
      });
    });

    // Hover out - return to original color
    card.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        backgroundColor: "var(--_color-tokens---bg-brand--base)",
        duration: 0.2,
        ease: "power1.out",
      });
    });
  });
}

// Initialize when Webflow is ready
Webflow.push(() => {
  initAfdelingCtaHover();
});
