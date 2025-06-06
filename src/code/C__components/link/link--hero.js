// Link: Hero
// Hover Animation
Webflow.push(() => {
  // Check if device is tablet/desktop (not mobile) and not a touch device
  const isTabletOrDesktop = window.matchMedia(
    "(min-width: 768px) and (hover: hover)"
  ).matches;

  if (!isTabletOrDesktop) return; // Exit early if mobile or touch device

  const cards = document.querySelectorAll(".link--hero");

  cards.forEach((card) => {
    // Create timeline for hover animations with paused state
    const tl = gsap.timeline({ paused: true });

    // Select required elements
    const description = card.querySelector(".link--description-w");
    const icon = card.querySelector(".link--icon");

    // Get natural height of description
    // We temporarily set it to auto, measure it, then reset to 0
    gsap.set(description, { height: "auto" });
    const naturalHeight = description.offsetHeight;
    gsap.set(description, { height: 0 });

    tl.to(card.querySelector(".link--divider-line"), {
      width: "100%",
      duration: 0.5,
      ease: "power2.out", // Smooth acceleration out
    })
      .to(
        description,
        {
          height: naturalHeight,
          duration: 0.45,
          ease: "power2.out",
        },
        "<"
      ) // Start at same time as line animation
      .to(
        icon,
        {
          rotation: 180,
          duration: 0.45,
          ease: "power2.out",
        },
        "<"
      ) // Start at same time as description animation
      .reverse(); // Initialize timeline in reversed state

    // Add hover event listeners
    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());
  });
});
