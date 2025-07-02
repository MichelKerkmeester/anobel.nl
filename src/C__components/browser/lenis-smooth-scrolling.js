// ───────────────────────────────────────────────────────────────
// Browser: Lenis Smooth Scrolling
// Dynamic Script Loader
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Lenis Configuration
  ────────────────────────────────────────────────────────────────*/
  const lenisConfig = {
    duration: "1.25",
    orientation: "vertical",
    smoothWheel: "true",
    smoothTouch: "false",
    touchMultiplier: "1.5",
    easing: "(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))",
    useOverscroll: "true",
    useControls: "true",
    useAnchor: "true",
    useRaf: "true",
    infinite: "false"
  };

  const scriptSrc = "https://uploads-ssl.webflow.com/645e0e1ff7fdb6dc8c85f3a2/653b82ecf87f552a98ac66b9_lenis-master-offbrand.02.txt";

  /* ─────────────────────────────────────────────────────────────
     2. Script Creation & Configuration
  ────────────────────────────────────────────────────────────────*/
  function createLenisScript() {
    const script = document.createElement("script");
    
    // Set core attributes
    script.setAttribute("data-id-scroll", "");
    script.setAttribute("data-autoinit", "true");
    script.setAttribute("defer", "");
    script.src = scriptSrc;

    // Apply configuration
    Object.entries(lenisConfig).forEach(([key, value]) => {
      script.setAttribute(`data-${key}`, value);
    });

    return script;
  }

  /* ─────────────────────────────────────────────────────────────
     3. Initialize
  ────────────────────────────────────────────────────────────────*/
  const lenisScript = createLenisScript();
  document.head.appendChild(lenisScript);
})();
