// Tab Menu
const tabMenuInit = () => {
  // Store the active tab index
  let activeTabIndex = 0;

  // Get the tab menu container
  const tabMenu = document.querySelector(".tab--menu");
  if (!tabMenu) return;

  // Get all tab buttons
  const tabButtons = tabMenu.querySelectorAll(".tab--menu-btn");
  if (!tabButtons.length) return;

  // Find initially active tab
  tabButtons.forEach((btn, index) => {
    if (btn.classList.contains("is--set")) {
      activeTabIndex = index;
    }
  });

  // Apply initial styling to active tab
  if (tabButtons[activeTabIndex]) {
    applyActiveStyles(tabButtons[activeTabIndex]);
  }

  // Function to apply active styles using GSAP
  /**
   * @param {HTMLElement} tabButton - The tab button element to style
   */
  function applyActiveStyles(tabButton) {
    if (window.gsap) {
      gsap.to(tabButton, {
        color: "var(--_color-tokens---content-brand--base)",
        borderBottom: "2px solid var(--_color-tokens---border-brand--base)",
        duration: 0.3,
      });
    } else {
      // Fallback if GSAP is not available
      tabButton.style.color = "var(--_color-tokens---content-brand--base)";
      tabButton.style.borderBottom =
        "2px solid var(--_color-tokens---border-brand--base)";
    }
  }

  // Function to remove active styles using GSAP
  /**
   * @param {HTMLElement} tabButton - The tab button element to remove styles from
   */
  function removeActiveStyles(tabButton) {
    if (window.gsap) {
      gsap.to(tabButton, {
        color: "",
        borderBottom: "",
        duration: 0.3,
      });
    } else {
      // Fallback if GSAP is not available
      tabButton.style.color = "";
      tabButton.style.borderBottom = "";
    }
  }

  // Add click event listener to tab menu container (event delegation)
  tabMenu.addEventListener("click", (e) => {
    // Check if e.target exists and is an Element
    if (!(e.target instanceof Element)) return;

    // Find the closest button if clicking on child element
    const clickedButton = e.target.closest(".tab--menu-btn");

    if (!clickedButton) return;

    // Get the index of the clicked button
    const newIndex = Array.from(tabButtons).indexOf(clickedButton);

    // Do nothing if clicking on already active tab
    if (newIndex === activeTabIndex) return;

    // Update active tab
    if (tabButtons[activeTabIndex]) {
      tabButtons[activeTabIndex].classList.remove("is--set");
      removeActiveStyles(tabButtons[activeTabIndex]);
    }

    clickedButton.classList.add("is--set");
    applyActiveStyles(clickedButton);

    // Update active index
    activeTabIndex = newIndex;
  });
};

// Initialize tab menu
tabMenuInit();
