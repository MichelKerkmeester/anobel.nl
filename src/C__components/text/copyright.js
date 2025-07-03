// ───────────────────────────────────────────────────────────────
// Copyright: Year
// Dynamic Year Update
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Dynamic Copyright Year Update
  ────────────────────────────────────────────────────────────────*/
  function updateCopyrightYear() {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Update all copyright year elements
    document.querySelectorAll('.copyright--year').forEach((element) => {
      element.textContent = currentYear; // Update the text content of each element
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  updateCopyrightYear();
})();
