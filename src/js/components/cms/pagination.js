// CMS pagination
// Prev / Next
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll("[cmsnext-element='component']")
    .forEach((componentEl) => {
      const cmsListEl = componentEl.querySelector(".w-dyn-items");
      const cmsItemEl = Array.from(cmsListEl.children);

      let currentItemEl = cmsItemEl.find((item) =>
        item.querySelector(".w--current")
      );
      let nextItemEl = currentItemEl.nextElementSibling;
      let prevItemEl = currentItemEl.previousElementSibling;

      // Loop to the first item if the next item doesn't exist
      if (componentEl.getAttribute("cmsnext-loop") === "true") {
        if (!nextItemEl) nextItemEl = cmsItemEl[0];
        if (!prevItemEl) prevItemEl = cmsItemEl[cmsItemEl.length - 1];
      }

      let displayEl = nextItemEl;

      // Remove all items except the display element
      cmsItemEl.forEach((item) => {
        if (item !== displayEl) item.remove();
      });
    });

  // Card Hover
  const projectImages = document.querySelectorAll(".project--pgn-image");

  projectImages.forEach((image) => {
    const footer = image.querySelector(".project--pgn-footer");

    image.addEventListener("mouseenter", () => {
      gsap.to(footer, {
        duration: 0.2,
        backgroundColor: "rgba(9, 25, 29, 0.50)",
        borderTopColor: "#fefdfd",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        ease: "power1.in",
      });
    });

    image.addEventListener("mouseleave", () => {
      gsap.to(footer, {
        duration: 0.1,
        backgroundColor: "rgba(19, 51, 58, 0.95)",
        borderTopColor: "rgba(19, 51, 58, 0.95)",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        ease: "power1.in",
      });
    });
  });
});
