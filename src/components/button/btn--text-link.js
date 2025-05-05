// Text link
// Animate line on Hover
Webflow.push(() => {
  // Only select hover elements within links that have the data attribute
  document
    .querySelectorAll(
      '.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover'
    )
    .forEach(function (el) {
      el.style.width = "0%";
      el.style.visibility = "hidden";
    });

  document
    .querySelectorAll('.btn--text-link[data-text-link-hover="Underline"]')
    .forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        const hoverElement = link.querySelector(".btn--text-link-hover");
        if (hoverElement && window.gsap) {
          window.gsap.to(hoverElement, {
            duration: 0.3,
            width: "100%",
            visibility: "visible",
            ease: "power1.out",
          });
        }
      });

      link.addEventListener("mouseleave", function () {
        const hoverElement = link.querySelector(".btn--text-link-hover");
        if (hoverElement && window.gsap) {
          window.gsap.to(hoverElement, {
            duration: 0.3,
            width: "0%",
            visibility: "hidden",
            ease: "power1.out",
          });
        }
      });
    });
});
