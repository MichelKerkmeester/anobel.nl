// Tab Menu
const tabMenuInit = () => {
  let activeTabIndex = 0;

  const tabMenu = document.querySelector(".tab--menu");
  if (!tabMenu) return;

  const tabButtons = tabMenu.querySelectorAll(".tab--menu-btn");
  if (!tabButtons.length) return;

  // Prevent layout shifting
  tabButtons.forEach((btn) => {
    const currentWidth = btn.offsetWidth;
    btn.style.minWidth = `${currentWidth}px`;
    btn.style.position = "relative";
  });

  // Find initially active tab
  tabButtons.forEach((btn, index) => {
    if (btn.classList.contains("is--set")) {
      activeTabIndex = index;
    }
  });

  // Apply initial styling
  if (tabButtons[activeTabIndex]) {
    applyActiveStyles(tabButtons[activeTabIndex]);
  }

  /**
   * @param {Element} tabButton
   */
  function applyActiveStyles(tabButton) {
    if (window.gsap) {
      gsap.to(tabButton, {
        color: "var(--_color-tokens---content-brand--base)",
        borderBottom: "2px solid var(--_color-tokens---border-brand--base)",
        duration: 0.3,
      });
    } else {
      tabButton.style.color = "var(--_color-tokens---content-brand--base)";
      tabButton.style.borderBottom =
        "2px solid var(--_color-tokens---border-brand--base)";
    }
  }

  /**
   * @param {Element} tabButton
   */
  function removeActiveStyles(tabButton) {
    if (window.gsap) {
      gsap.to(tabButton, {
        color: "",
        borderBottom: "",
        duration: 0.3,
      });
    } else {
      tabButton.style.color = "";
      tabButton.style.borderBottom = "";
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
