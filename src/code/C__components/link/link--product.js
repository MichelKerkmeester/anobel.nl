// Link: Blog
// Hover Animation
Webflow.push(() => {
  const cards = document.querySelectorAll(".link--blog");

  cards.forEach((card) => {
    // Create timeline for hover animation
    const tl = gsap.timeline({ paused: true });

    // Animation
    tl.to(card.querySelector(".link--blog-line"), {
      width: "100%",
      duration: 0.6,
      ease: "power2.out",
    }).reverse(); // Initialize in reversed state

    // Add hover listeners
    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());
  });
});
