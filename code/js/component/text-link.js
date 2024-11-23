// Text link
// Animate line on Hover
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".btn--text-link-hover").forEach(function (el) {
    el.style.width = "0%";
    el.style.visibility = "hidden"; // Initially hide the line
  });

  document.querySelectorAll(".btn--text-link").forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      // Mouse enter animation
      gsap.to(link.querySelector(".btn--text-link-hover"), {
        duration: 0.3,
        width: "100%",
        visibility: "visible",
        ease: "power1.out",
      });
    });

    link.addEventListener("mouseleave", function () {
      // Mouse leave animation
      gsap.to(link.querySelector(".btn--text-link-hover"), {
        duration: 0.3,
        width: "0%",
        ease: "power1.out",
      });
    });
  });
});
