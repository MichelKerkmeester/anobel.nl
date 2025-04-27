// Afdeling: CTA
// Hover Animation
function initAfdelingCtaHover() {
  // Get all CTA cards
  const ctaCards = document.querySelectorAll(".afdeling--card.is--cta");

  // Add hover listeners to each card
  ctaCards.forEach((card) => {
    const btn = card.querySelector(".afdeling--btn");

    // Hover in
    card.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        backgroundColor: "var(--secondary--darker)",
        duration: 0.2,
        ease: "power1.out",
      });
    });

    // Hover out - return to original color
    card.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        backgroundColor: "var(--secondary--base)",
        duration: 0.2,
        ease: "power1.out",
      });
    });
  });
}

// Run the function immediately if document is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initAfdelingCtaHover();
} else {
  // Otherwise wait for Slater to handle DOM loading
  window.slaterCallbacks = window.slaterCallbacks || [];
  window.slaterCallbacks.push(initAfdelingCtaHover);
}
