// ───────────────────────────────────────────────────────────────
// Navigation: Dropdown Menu (Optimized)
// Multi-dropdown navigation system
// ───────────────────────────────────────────────────────────────

// Import centralized utilities
import { EASING } from '../utils/motion-config.js';

(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initDropdownMenu() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initDropdownMenu, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       2. Find and validate elements
    ────────────────────────────────────────────────────────────────*/
    const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));

    if (!dropdowns.length) {
      console.error("No dropdown elements found in the DOM!");
      return;
    }

    const navigation = document.querySelector(".nav--bar");

    if (!navigation) {
      console.error("Navigation container (.nav--bar) not found!");
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Initialize dropdown data
    ────────────────────────────────────────────────────────────────*/
    const dropdownData = dropdowns
      .map((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
        const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
        const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");

        if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
          console.warn(
            "Some required elements (dropdownToggle, dropdownMenu, dropdownIcon) are missing in a .nav--dropdown!"
          );
          return null;
        }

        return {
          dropdown,
          toggle: dropdownToggle,
          dropdownMenu: dropdownMenu,
          icon: dropdownIcon,
          isOpen: false,
          animating: false,
        };
      })
      .filter((d) => d !== null);

    /* ─────────────────────────────────────────────────────────────
       4. Easing maps – Webflow ≈ Motion.dev
    ────────────────────────────────────────────────────────────────*/
    // Use centralized easing curves
    const power2Out = EASING.power2Out;
    const power2In = EASING.power2In;

    /* ─────────────────────────────────────────────────────────────
       5. Animation functions
    ────────────────────────────────────────────────────────────────*/
    /**
     * Opens a specific dropdown with Motion.dev
     */
    const openDropdown = (d) => {
      d.animating = true;

      // Check if we're on desktop (window width > 768px)
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // Get the natural height for height animation
      const menuEl = /** @type {HTMLElement} */ (d.dropdownMenu);
      menuEl.style.height = "auto";
      const naturalHeight = menuEl.offsetHeight;
      menuEl.style.height = "0px";

      // Animate dropdown menu
      animate(
        d.dropdownMenu,
        {
          opacity: [0, 1],
          height: ["0px", `${naturalHeight}px`],
        },
        {
          duration: 0.3,
          easing: power2Out,
        }
      );

      // Animate icon rotation
      animate(
        d.icon,
        {
          rotate: ["0deg", "180deg"],
        },
        {
          duration: 0.3,
          easing: power2Out,
        }
      );

      // Animate toggle background
      animate(
        d.toggle,
        {
          backgroundColor: [
            "transparent",
            "var(--secondary--darkest)",
          ],
        },
        {
          duration: 0.3,
          easing: power2Out,
        }
      );

      // Only animate navigation border radius on desktop
      if (isDesktop) {
        animate(
          navigation,
          {
            borderBottomLeftRadius: ["1rem", "0rem"],
            borderBottomRightRadius: ["1rem", "0rem"],
          },
          {
            duration: 0.3,
            easing: power2Out,
            onComplete: () => {
              d.animating = false;
            },
          }
        );
      } else {
        setTimeout(() => {
          d.animating = false;
        }, 300);
      }

      d.isOpen = true;
    };

    /**
     * Closes a specific dropdown with Motion.dev
     */
    const closeDropdown = (d) => {
      d.animating = true;

      // Check if we're on desktop
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // Get current height for animation
      const menuEl = /** @type {HTMLElement} */ (d.dropdownMenu);
      const currentHeight = menuEl.scrollHeight;

      // Animate dropdown menu
      animate(
        d.dropdownMenu,
        {
          opacity: [1, 0],
          height: [`${currentHeight}px`, "0px"],
        },
        {
          duration: 0.3,
          easing: power2In,
        }
      );

      // Animate icon rotation
      animate(
        d.icon,
        {
          rotate: ["180deg", "0deg"],
        },
        {
          duration: 0.3,
          easing: power2In,
        }
      );

      // Animate toggle background
      animate(
        d.toggle,
        {
          backgroundColor: [
            "var(--secondary--darkest)",
            "transparent",
          ],
        },
        {
          duration: 0.3,
          easing: power2In,
        }
      );

      // Only animate navigation border radius on desktop
      if (isDesktop) {
        animate(
          navigation,
          {
            borderBottomLeftRadius: ["0rem", "1rem"],
            borderBottomRightRadius: ["0rem", "1rem"],
          },
          {
            duration: 0.3,
            easing: power2In,
            onComplete: () => {
              d.animating = false;
            },
          }
        );
      } else {
        setTimeout(() => {
          d.animating = false;
        }, 300);
      }

      d.isOpen = false;
    };

    /**
     * Closes all open dropdowns except the specified one
     */
    const closeAllDropdowns = (except = null) => {
      dropdownData.forEach((d) => {
        if (d !== except && d.isOpen && !d.animating) {
          closeDropdown(d);
        }
      });
    };

    /* ─────────────────────────────────────────────────────────────
       6. Event listeners
    ────────────────────────────────────────────────────────────────*/
    // Attach click listeners to each dropdown toggle
    dropdownData.forEach((d) => {
      d.toggle.addEventListener("click", () => {
        if (d.animating) return; // Prevent action if animating

        // Toggle the dropdown
        if (d.isOpen) {
          closeDropdown(d);
        } else {
          closeAllDropdowns(d); // Close others before opening
          openDropdown(d);
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside =
            d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            closeDropdown(d);
          }
        }
      });
    });

    // Close dropdowns when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
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
      initDropdownMenu();
    });
  } else {
    // Fallback if Webflow is not available
    initDropdownMenu();
  }
})();