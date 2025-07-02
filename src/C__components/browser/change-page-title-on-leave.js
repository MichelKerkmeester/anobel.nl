// ───────────────────────────────────────────────────────────────
// Browser
// Change Page Title on Leave
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Configuration
  ────────────────────────────────────────────────────────────────*/
  const documentTitleStore = document.title;
  const documentTitleOnBlur = "🚢 Mis de boot niet";

  /* ─────────────────────────────────────────────────────────────
     2. Event Handlers
  ────────────────────────────────────────────────────────────────*/
  const handleFocus = () => {
    document.title = documentTitleStore;
  };

  const handleBlur = () => {
    document.title = documentTitleOnBlur;
  };

  /* ─────────────────────────────────────────────────────────────
     3. Initialize Event Listeners
  ────────────────────────────────────────────────────────────────*/
  window.addEventListener("focus", handleFocus);
  window.addEventListener("blur", handleBlur);
})();
