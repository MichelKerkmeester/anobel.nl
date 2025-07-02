// ───────────────────────────────────────────────────────────────
// Tab: Autoplay
// Webshop Tab System with Progress Bar
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initTabSystem() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(initTabSystem, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       2. Find and validate tab wrappers
    ────────────────────────────────────────────────────────────────*/
    const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

    if (wrappers.length === 0) {
      console.warn(
        '⚠️ No tab wrappers found! Make sure elements have data-tabs="wrapper" attribute'
      );
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Process each tab wrapper
    ────────────────────────────────────────────────────────────────*/
    wrappers.forEach((wrapper) => {
      const htmlWrapper = /** @type {HTMLElement} */ (wrapper);
      const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
      const clickButtons = wrapper.querySelectorAll('[data-tabs="button"]');
      const numberedButtons = wrapper.querySelectorAll("[data-tabs-index]");

      // Combine all button types for easier management
      const allButtons = [...clickButtons, ...numberedButtons];

      if (visualItems.length === 0) {
        return;
      }

      // Get autoplay settings
      const autoplay = htmlWrapper.dataset.tabsAutoplay === "true";
      const autoplayDuration =
        parseInt(htmlWrapper.dataset.tabsAutoplayDuration || "1000") || 1000;

      // Find progress bar
      let singleProgressBar = null;
      if (autoplay) {
        singleProgressBar = wrapper.querySelector('[data-tabs="item-progress"]');
        if (!singleProgressBar) {
          console.warn(
            '⚠️ Autoplay is enabled but no progress bar found! Add a single data-tabs="item-progress" element'
          );
        }
      }

      // State variables
      let activeVisual = null;
      let isAnimating = false;
      let progressBarAnimation = null;
      let currentIndex = 0;
      let autoplayTimer = null;

      /* ─────────────────────────────────────────────────────────────
         4. Progress bar control functions
      ────────────────────────────────────────────────────────────────*/
      function resetProgressBar() {
        if (singleProgressBar) {
          const progressEl = /** @type {HTMLElement} */ (singleProgressBar);
          progressEl.style.transform = "scaleX(0)";
          progressEl.style.transformOrigin = "left center";
        }
      }

      function startProgressBar(index) {
        // Clear any existing animations
        if (progressBarAnimation) {
          progressBarAnimation = null;
        }
        if (autoplayTimer) {
          clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }

        // Reset the progress bar first
        resetProgressBar();

        if (!singleProgressBar) {
          // Continue with autoplay even without progress bar
          autoplayTimer = setTimeout(() => {
            if (!isAnimating && autoplay) {
              const nextIndex = (index + 1) % visualItems.length;
              switchTab(nextIndex);
            }
          }, autoplayDuration);
          return;
        }

        const progressEl = /** @type {HTMLElement} */ (singleProgressBar);

        // Motion.dev progress bar animation
        progressBarAnimation = animate(
          progressEl,
          {
            scaleX: [0, 1],
          },
          {
            duration: autoplayDuration / 1000,
            easing: "linear",
            onComplete: () => {
              if (!isAnimating && autoplay) {
                const nextIndex = (index + 1) % visualItems.length;
                switchTab(nextIndex);
              }
            },
          }
        );
      }

      /* ─────────────────────────────────────────────────────────────
         5. Button state management
      ────────────────────────────────────────────────────────────────*/
      function updateButtonStates(activeIndex) {
        // Update regular buttons
        clickButtons.forEach((btn, i) => {
          btn.classList.toggle("active", i === activeIndex);
        });

        // Update numbered buttons
        numberedButtons.forEach((btn) => {
          const htmlBtn = /** @type {HTMLElement} */ (btn);
          const btnIndex = parseInt(htmlBtn.dataset.tabsIndex || "-1");
          btn.classList.toggle("active", btnIndex === activeIndex);
        });
      }

      /* ─────────────────────────────────────────────────────────────
         6. Tab switching function
      ────────────────────────────────────────────────────────────────*/
      function switchTab(index) {
        if (
          isAnimating ||
          (visualItems[index] === activeVisual && currentIndex === index)
        )
          return;

        isAnimating = true;
        currentIndex = index;

        // Stop any running animations
        if (progressBarAnimation) {
          progressBarAnimation = null;
        }
        if (autoplayTimer) {
          clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }

        // Reset progress bar when switching
        resetProgressBar();

        const outgoingVisual = activeVisual;
        const incomingVisual = visualItems[index];

        // Update DOM classes immediately
        requestAnimationFrame(() => {
          // Update visual item classes
          visualItems.forEach((item) => item.classList.remove("active"));
          incomingVisual.classList.add("active");

          // Update button states
          updateButtonStates(index);
        });

        // Motion.dev transition animations
        const performTransition = async () => {
          // Hide outgoing visual
          if (outgoingVisual) {
            await animate(
              outgoingVisual,
              {
                opacity: [1, 0],
              },
              {
                duration: 0,
                onComplete: () => {
                  /** @type {HTMLElement} */ (outgoingVisual).style.visibility = "hidden";
                },
              }
            );
          }

          // Show incoming visual
          const incomingEl = /** @type {HTMLElement} */ (incomingVisual);
          incomingEl.style.visibility = "visible";
          
          await animate(
            incomingVisual,
            {
              opacity: [0, 1],
            },
            {
              duration: 0,
            }
          );

          // Complete transition
          activeVisual = incomingVisual;
          isAnimating = false;
          
          if (autoplay) {
            startProgressBar(index);
          }
        };

        performTransition();
      }

      /* ─────────────────────────────────────────────────────────────
         7. Animation control helpers
      ────────────────────────────────────────────────────────────────*/
      function stopAllAnimations() {
        if (progressBarAnimation) {
          progressBarAnimation = null;
        }
        if (autoplayTimer) {
          clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }
      }

      /* ─────────────────────────────────────────────────────────────
         8. Event listeners
      ────────────────────────────────────────────────────────────────*/
      // Click handlers for regular buttons
      clickButtons.forEach((item, i) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const targetIndex = i % visualItems.length;

          if (currentIndex === targetIndex) return;

          // Stop autoplay when manually clicking
          stopAllAnimations();
          switchTab(targetIndex);
        });
      });

      // Click handlers for numbered buttons
      numberedButtons.forEach((btn) => {
        const htmlBtn = /** @type {HTMLElement} */ (btn);
        const targetIndex = parseInt(htmlBtn.dataset.tabsIndex || "");

        if (
          !isNaN(targetIndex) &&
          targetIndex >= 0 &&
          targetIndex < visualItems.length
        ) {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (currentIndex === targetIndex) return;

            // Stop autoplay when manually clicking
            stopAllAnimations();
            switchTab(targetIndex);
          });
        }
      });

      // Allow clicking on visual items if no buttons are present
      if (allButtons.length === 0) {
        visualItems.forEach((item, i) => {
          item.addEventListener("click", (e) => {
            e.stopPropagation();

            if (currentIndex === i) return;

            // Stop autoplay when manually clicking
            stopAllAnimations();
            switchTab(i);
          });
        });
      }

      /* ─────────────────────────────────────────────────────────────
         9. Initialize first tab
      ────────────────────────────────────────────────────────────────*/
      if (visualItems.length > 0) {
        switchTab(0);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     10. Initialize everything
  ────────────────────────────────────────────────────────────────*/
  initTabSystem();
})();