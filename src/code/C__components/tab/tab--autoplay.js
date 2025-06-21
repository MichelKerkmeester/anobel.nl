// Tab
// Autoplay: Webshop

function initTabSystem() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

  if (wrappers.length === 0) {
    console.warn(
      '⚠️ No tab wrappers found! Make sure elements have data-tabs="wrapper" attribute'
    );
    return;
  }

  wrappers.forEach((wrapper) => {
    // Cast wrapper to HTMLElement to access dataset
    const htmlWrapper = /** @type {HTMLElement} */ (wrapper);
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
    const clickButtons = wrapper.querySelectorAll('[data-tabs="button"]'); // Look for specific buttons
    const numberedButtons = wrapper.querySelectorAll("[data-tabs-index]"); // Numbered buttons

    // Combine all button types for easier management
    const allButtons = [...clickButtons, ...numberedButtons];

    if (visualItems.length === 0) {
      return;
    }

    const autoplay = htmlWrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(htmlWrapper.dataset.tabsAutoplayDuration || "1000") || 1000; // 1 second for testing

    // Look for a single progress bar to reuse
    let singleProgressBar = null;
    if (autoplay) {
      singleProgressBar = wrapper.querySelector('[data-tabs="item-progress"]');
      if (!singleProgressBar) {
        console.warn(
          '⚠️ Autoplay is enabled but no progress bar found! Add a single data-tabs="item-progress" element'
        );
      }
    }

    let activeVisual = null;
    let isAnimating = false;
    let progressBarTween = null;
    let currentIndex = 0;
    let autoplayTimer = null; // For non-GSAP fallback

    function resetProgressBar() {
      // Reset the single progress bar to 0
      if (singleProgressBar) {
        if (typeof gsap !== "undefined") {
          gsap.set(singleProgressBar, { scaleX: 0 });
        } else {
          singleProgressBar.style.transform = "scaleX(0)";
        }
      }
    }

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

    function startProgressBar(index) {
      // Clear any existing animations
      if (progressBarTween) {
        progressBarTween.kill();
        progressBarTween = null;
      }
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }

      // First reset the progress bar
      resetProgressBar();

      if (!singleProgressBar) {
        // Still continue with autoplay even without progress bar
        autoplayTimer = setTimeout(() => {
          if (!isAnimating && autoplay) {
            const nextIndex = (index + 1) % visualItems.length;
            switchTab(nextIndex);
          }
        }, autoplayDuration);
        return;
      }

      // Check if GSAP is available
      if (typeof gsap === "undefined") {
        // Fallback to setTimeout
        autoplayTimer = setTimeout(() => {
          if (!isAnimating && autoplay) {
            const nextIndex = (index + 1) % visualItems.length;
            switchTab(nextIndex);
          }
        }, autoplayDuration);
        return;
      }

      // GSAP animation on the single progress bar
      gsap.set(singleProgressBar, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      progressBarTween = gsap.to(singleProgressBar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "linear", // Linear for consistent timing
        onComplete: () => {
          if (!isAnimating && autoplay) {
            const nextIndex = (index + 1) % visualItems.length;
            switchTab(nextIndex);
          }
        },
      });
    }

    function switchTab(index) {
      if (
        isAnimating ||
        (visualItems[index] === activeVisual && currentIndex === index)
      )
        return;

      isAnimating = true;
      currentIndex = index;

      // Kill any running animations
      if (progressBarTween) {
        progressBarTween.kill();
        progressBarTween = null;
      }
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }

      // Reset the progress bar when switching
      resetProgressBar();

      const outgoingVisual = activeVisual;
      const incomingVisual = visualItems[index];

      // Batch DOM updates
      requestAnimationFrame(() => {
        // Update classes on visual items
        visualItems.forEach((item) => item.classList.remove("active"));
        incomingVisual.classList.add("active");

        // Update button states
        updateButtonStates(index);
      });

      // Simple transition without GSAP if not available
      if (typeof gsap === "undefined") {
        activeVisual = incomingVisual;
        isAnimating = false;
        if (autoplay) startProgressBar(index);
        return;
      }

      const tl = gsap.timeline({
        defaults: { duration: 0, ease: "power2.inOut" },
        onComplete: () => {
          activeVisual = incomingVisual;
          isAnimating = false;
          if (autoplay) startProgressBar(index);
        },
      });

      // Instant opacity transition
      if (outgoingVisual) {
        tl.to(outgoingVisual, { autoAlpha: 0 });
      }

      // Instant fade in incoming
      tl.fromTo(incomingVisual, { autoAlpha: 0 }, { autoAlpha: 1 });
    }

    // Initialize first tab
    if (visualItems.length > 0) {
      switchTab(0);
    }

    // Stop all animations helper
    function stopAllAnimations() {
      if (progressBarTween) {
        progressBarTween.kill();
        progressBarTween = null;
      }
      if (autoplayTimer) {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Click handlers for regular buttons
    clickButtons.forEach((item, i) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Map button index to visual item index
        const targetIndex = i % visualItems.length;

        if (currentIndex === targetIndex) return;

        // Stop autoplay when manually clicking
        stopAllAnimations();
        switchTab(targetIndex);
      });
    });

    // Click handlers for numbered buttons
    numberedButtons.forEach((btn) => {
      // Cast to HTMLElement to access dataset
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

    // Also allow clicking on visual items themselves if no buttons are present
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
  });
}

// Initialize
initTabSystem();
