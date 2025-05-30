// Link: Blog
// Hover Animation
Webflow.push(() => {
  // Check if device is tablet/desktop (not mobile) and not a touch device
  const isTabletOrDesktop = window.matchMedia(
    "(min-width: 768px) and (hover: hover)"
  ).matches;

  if (!isTabletOrDesktop) return; // Exit early if mobile or touch device

  const cards = document.querySelectorAll(".link--blog");

  cards.forEach((card) => {
    // Create timeline for hover animation
    const tl = gsap.timeline({ paused: true });

    // Animation
    tl.to(card.querySelector(".link--blog-line"), {
      width: "100%",
      duration: 0.6,
      ease: "power2.out",
    })
      .to(
        card.querySelector(".link--blog-icon.is--arrow"),
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.2
      ) // Start 200ms after the line animation
      .reverse(); // Initialize in reversed state

    // Add hover listeners
    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());
  });
});
