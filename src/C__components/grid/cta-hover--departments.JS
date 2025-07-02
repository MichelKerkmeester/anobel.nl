// ───────────────────────────────────────────────────────────────
// CTA: Departments
// Hover Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initCTAAnimation() {
    const { animate } = window.Motion || {};
    if (!animate) {
      setTimeout(initCTAAnimation, 100);
      return;
    }

    // Only apply on desktop & tablet with hover capability
    const isPointerHover = matchMedia(
      "(min-width:768px) and (hover:hover)"
    ).matches;
    if (!isPointerHover) return;

    /* ─────────────────────────────────────────────────────────────
       2. Animation Properties
    ────────────────────────────────────────────────────────────────*/
    const duration = 0.05;
    const easing = "ease-out";
    const colorHover = "var(--_color-tokens---bg-brand--dark)";
    const colorDefault = "var(--_color-tokens---bg-brand--base)";

    /* ─────────────────────────────────────────────────────────────
       3. Build Animations
    ────────────────────────────────────────────────────────────────*/
    const cards = document.querySelectorAll(".grid--card-department.is--cta");

    cards.forEach((card) => {
      // Prevent duplicate event listeners
      if (card.dataset.ctaDepartmentAnimated === "true") return;
      card.dataset.ctaDepartmentAnimated = "true";

      const btn = card.querySelector("#cta");
      if (!btn) return;

      // Hover in animation
      const hoverIn = () => {
        animate(
          btn,
          { backgroundColor: colorHover },
          {
            duration,
            easing,
            fill: "forwards",
          }
        );
      };

      // Hover out animation
      const hoverOut = () => {
        animate(
          btn,
          { backgroundColor: colorDefault },
          {
            duration,
            easing,
            fill: "forwards",
          }
        );
      };

      // Add event listeners
      card.addEventListener("pointerenter", hoverIn);
      card.addEventListener("pointerleave", hoverOut);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. Initialize
  ────────────────────────────────────────────────────────────────*/
  initCTAAnimation();
})();
