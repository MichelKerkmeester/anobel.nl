// Lenis.js - Smooth Scrolling
(() => {
  // Create script element
  const script = document.createElement("script");

  // Set attributes
  script.setAttribute("data-id-scroll", "");
  script.setAttribute("data-autoinit", "true");
  script.setAttribute("data-duration", "1");
  script.setAttribute("data-orientation", "vertical");
  script.setAttribute("data-smoothWheel", "true");
  script.setAttribute("data-smoothTouch", "false");
  script.setAttribute("data-touchMultiplier", "1.5");
  script.setAttribute(
    "data-easing",
    "(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))"
  );
  script.setAttribute("data-useOverscroll", "true");
  script.setAttribute("data-useControls", "true");
  script.setAttribute("data-useAnchor", "true");
  script.setAttribute("data-useRaf", "true");
  script.setAttribute("data-infinite", "false");
  script.setAttribute("defer", "");
  script.src =
    "https://uploads-ssl.webflow.com/645e0e1ff7fdb6dc8c85f3a2/653b82ecf87f552a98ac66b9_lenis-master-offbrand.02.txt";

  // Append to document
  document.head.appendChild(script);
})();
