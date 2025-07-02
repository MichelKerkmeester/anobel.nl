// ───────────────────────────────────────────────────────────────
// Browser: Force Start at Top
// Scroll Position Management
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Configuration
  ────────────────────────────────────────────────────────────────*/
  const scrollPosition = { x: 0, y: 0 };

  /* ─────────────────────────────────────────────────────────────
     2. Event Handlers
  ────────────────────────────────────────────────────────────────*/
  const handleBeforeUnload = () => {
    window.scrollTo(scrollPosition.x, scrollPosition.y);
  };

  /* ─────────────────────────────────────────────────────────────
     3. Initialize
  ────────────────────────────────────────────────────────────────*/
  // Disable browser's automatic scroll restoration
  history.scrollRestoration = "manual";

  // Force scroll to top on page unload
  window.addEventListener("beforeunload", handleBeforeUnload);
})();
