// ───────────────────────────────────────────────────────────────
// Tab: Menu
// Blog Tab Menu System
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initTabMenu() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initTabMenu, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       2. Main tab menu logic
    ────────────────────────────────────────────────────────────────*/
    const tabMenuInit = () => {
  let activeTabIndex = 0;

  const tabMenu = document.querySelector(".tab--menu");
  if (!tabMenu) return;

  const tabButtons = tabMenu.querySelectorAll(".tab--menu-btn");
  if (!tabButtons.length) return;

  // Prevent layout shifting from font weight changes
  tabButtons.forEach((btn) => {
    const htmlBtn = /** @type {HTMLElement} */ (btn);

    // Temporarily apply semi-bold to measure widest state
    const originalFontWeight = htmlBtn.style.fontWeight;
    htmlBtn.style.fontWeight = "600";
    const maxWidth = htmlBtn.offsetWidth;

    // Restore original weight and set fixed width
    htmlBtn.style.fontWeight = originalFontWeight;
    htmlBtn.style.minWidth = `${maxWidth}px`;
  });

  // Find initially active tab
  tabButtons.forEach((btn, index) => {
    if (btn.classList.contains("is--set")) {
      activeTabIndex = index;
      applyActiveStyles(btn);
    }
  });

      /* ─────────────────────────────────────────────────────────────
         3. Style animation functions
      ────────────────────────────────────────────────────────────────*/
      /**
       * @param {Element} tabButton
       */
      function applyActiveStyles(tabButton) {
        const htmlBtn = /** @type {HTMLElement} */ (tabButton);

        animate(
          tabButton,
          {
            fontWeight: ["400", "600"],
            color: [
              "var(--_color-tokens---content-brand--base)",
              "var(--_color-tokens---content-neutral--white)",
            ],
            backgroundColor: [
              "transparent",
              "var(--_color-tokens---bg-brand--base)",
            ],
            borderColor: [
              "var(--_color-tokens---border-neutral--dark)",
              "var(--_color-tokens---border-brand--base)",
            ],
          },
          {
            duration: 0.3,
            easing: [0.25, 0.46, 0.45, 0.94], // power1.out
          }
        );
      }

      /**
       * @param {Element} tabButton
       */
      function removeActiveStyles(tabButton) {
        const htmlBtn = /** @type {HTMLElement} */ (tabButton);

        animate(
          tabButton,
          {
            fontWeight: ["600", "400"],
            color: [
              "var(--_color-tokens---content-neutral--white)",
              "var(--_color-tokens---content-brand--base)",
            ],
            backgroundColor: [
              "var(--_color-tokens---bg-brand--base)",
              "transparent",
            ],
            borderColor: [
              "var(--_color-tokens---border-brand--base)",
              "var(--_color-tokens---border-neutral--dark)",
            ],
          },
          {
            duration: 0.3,
            easing: [0.25, 0.46, 0.45, 0.94], // power1.out
          }
        );
      }

  // Handle tab clicks
  tabMenu.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const clickedButton = e.target.closest(".tab--menu-btn");
    if (!clickedButton) return;

    const newIndex = Array.from(tabButtons).indexOf(clickedButton);
    if (newIndex === activeTabIndex) return;

    // Update active tab
    if (tabButtons[activeTabIndex]) {
      tabButtons[activeTabIndex].classList.remove("is--set");
      removeActiveStyles(tabButtons[activeTabIndex]);
    }

    clickedButton.classList.add("is--set");
    applyActiveStyles(clickedButton);

    activeTabIndex = newIndex;
  });
  }

    // Initialize tab menu
    tabMenuInit();
  }

  /* ─────────────────────────────────────────────────────────────
     4. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  initTabMenu();
})();
