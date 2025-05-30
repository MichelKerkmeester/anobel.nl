// Tab Menu
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

  /**
   * @param {Element} tabButton
   */
  function applyActiveStyles(tabButton) {
    const htmlBtn = /** @type {HTMLElement} */ (tabButton);

    if (window.gsap) {
      gsap.to(tabButton, {
        fontWeight: "600",
        color: "var(--_color-tokens---content-neutral--white)",
        backgroundColor: "var(--_color-tokens---bg-brand--base)",
        border: "2px solid var(--_color-tokens---border-brand--base)",
        duration: 0.3,
      });
    } else {
      htmlBtn.style.fontWeight = "600";
      htmlBtn.style.color = "var(--_color-tokens---content-neutral--white)";
      htmlBtn.style.backgroundColor = "var(--_color-tokens---bg-brand--base)";
      htmlBtn.style.border =
        "2px solid var(--_color-tokens---border-brand--base)";
    }
  }

  /**
   * @param {Element} tabButton
   */
  function removeActiveStyles(tabButton) {
    const htmlBtn = /** @type {HTMLElement} */ (tabButton);

    if (window.gsap) {
      gsap.to(tabButton, {
        fontWeight: "",
        color: "",
        backgroundColor: "",
        border: "",
        duration: 0.3,
      });
    } else {
      htmlBtn.style.fontWeight = "";
      htmlBtn.style.color = "";
      htmlBtn.style.backgroundColor = "";
      htmlBtn.style.border = "";
    }
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
};

// Initialize
tabMenuInit();
