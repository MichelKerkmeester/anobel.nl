// ───────────────────────────────────────────────────────────────
// Navigation: Language Selector (Optimized)
// Animated dropdown language selection
// ───────────────────────────────────────────────────────────────

// Import centralized utilities
import { EASING } from '../utils/motion-config.js';

(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initLanguageSelector() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initLanguageSelector, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       2. Find and validate elements
    ────────────────────────────────────────────────────────────────*/
    const languageBtn = document.querySelector('[class*="language--btn-w"]');
    const languageDropdown = document.querySelector(
      '[class*="language--dropdown-w"]'
    );
    const languageIcon = document.querySelector(".icon--svg.is--language");

    // Safety check to ensure required elements exist
    if (!languageBtn || !languageDropdown || !languageIcon) {
      console.error("Required language selector elements not found!");
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    // Use centralized easing curves
    const { power2Out, power2In, power3Out, power3In } = EASING;

    /* ─────────────────────────────────────────────────────────────
       4. Animation functions
    ────────────────────────────────────────────────────────────────*/
    /**
     * Function to open or close the dropdown
     */
    const toggleDropdown = (isOpen) => {
      // Rotate the language icon (0° closed, 180° open)
      animate(
        languageIcon,
        {
          rotate: [isOpen ? "0deg" : "180deg", isOpen ? "180deg" : "0deg"],
        },
        {
          duration: 0.4,
          easing: power2Out,
        }
      );

      // Toggle the button's background color based on state
      animate(
        languageBtn,
        {
          backgroundColor: [
            isOpen
              ? "var(--_color-tokens---bg-brand--dark)"
              : "var(--_color-tokens---bg-brand--darkest)",
            isOpen
              ? "var(--_color-tokens---bg-brand--darkest)"
              : "var(--_color-tokens---bg-brand--dark)",
          ],
        },
        {
          duration: 0.3,
          easing: power2Out,
        }
      );

      if (isOpen) {
        // Get natural height for animation
        const dropdownEl = /** @type {HTMLElement} */ (languageDropdown);
        dropdownEl.style.visibility = "visible";
        dropdownEl.style.height = "auto";
        const naturalHeight = dropdownEl.offsetHeight;
        dropdownEl.style.height = "0px";

        // Animate to open state
        animate(
          languageDropdown,
          {
            opacity: [0, 1],
            height: ["0px", `${naturalHeight}px`],
          },
          {
            duration: 0.5,
            easing: power3Out,
          }
        );
      } else {
        // Get current height for animation
        const dropdownEl = /** @type {HTMLElement} */ (languageDropdown);
        const currentHeight = dropdownEl.scrollHeight;

        // Animate to closed state
        animate(
          languageDropdown,
          {
            opacity: [1, 0],
            height: [`${currentHeight}px`, "0px"],
          },
          {
            duration: 0.5,
            easing: power3In,
            onComplete: () => {
              dropdownEl.style.visibility = "hidden";
            },
          }
        );
      }
    };

    /* ─────────────────────────────────────────────────────────────
       5. Hover animations
    ────────────────────────────────────────────────────────────────*/
    // Hover effect: expand button width on hover in
    languageBtn.addEventListener("mouseenter", () => {
      if (!languageBtn.classList.contains("clicked")) {
        animate(
          languageBtn,
          {
            width: ["2rem", "4.75rem"],
            backgroundColor: [
              "var(--_color-tokens---bg-brand--dark)",
              "var(--_color-tokens---bg-brand--dark)",
            ],
          },
          {
            duration: 0.3,
            easing: power2Out,
          }
        );
      }
    });

    // Hover effect: collapse button width on hover out
    languageBtn.addEventListener("mouseleave", () => {
      if (!languageBtn.classList.contains("clicked")) {
        animate(
          languageBtn,
          {
            width: ["4.75rem", "2rem"],
            backgroundColor: [
              "var(--_color-tokens---bg-brand--dark)",
              "var(--_color-tokens---bg-brand--dark)",
            ],
          },
          {
            duration: 0.3,
            easing: power2In,
          }
        );
      }
    });

    /* ─────────────────────────────────────────────────────────────
       6. Click and outside click handling
    ────────────────────────────────────────────────────────────────*/
    // Click event: toggle dropdown open/close
    languageBtn.addEventListener("click", () => {
      const isClicked = languageBtn.classList.toggle("clicked");
      toggleDropdown(isClicked);
    });

    // Close dropdown if clicking outside or on another dropdown trigger
    document.addEventListener("click", (event) => {
      const isInside =
        languageBtn.contains(event.target) ||
        languageDropdown.contains(event.target);
      const isDropdownTrigger = event.target.closest(".btn--nav-dropdown");

      if (
        (!isInside && languageBtn.classList.contains("clicked")) ||
        (isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger))
      ) {
        languageBtn.classList.remove("clicked");
        toggleDropdown(false);

        // Perform the hover-out action to reset the button width
        animate(
          languageBtn,
          {
            width: ["4.75rem", "2rem"],
            backgroundColor: [
              "var(--_color-tokens---bg-brand--darkest)",
              "var(--_color-tokens---bg-brand--dark)",
            ],
          },
          {
            duration: 0.3,
            easing: power2In,
          }
        );
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     7. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  // Initialize when Webflow is ready
  // @ts-ignore - Webflow global loaded externally
  if (typeof window.Webflow !== "undefined") {
    window.Webflow.push(() => {
      initLanguageSelector();
    });
  } else {
    // Fallback if Webflow is not available
    initLanguageSelector();
  }
})();