// ───────────────────────────────────────────────────────────────
// Video: Controls
// Fullscreen Support & Control Panel Animation
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     Module State Management
  ────────────────────────────────────────────────────────────────*/
  // Namespaced initialization flags to prevent conflicts
  const moduleState = {
    fullscreenInitialized: false,
    controlPanelInitialized: false
  };

  /* ─────────────────────────────────────────────────────────────
     1. Mobile Fullscreen Support
  ────────────────────────────────────────────────────────────────*/
  function setupMobileFullscreen() {
    // Prevent multiple initializations
    if (moduleState.fullscreenInitialized) return;
    moduleState.fullscreenInitialized = true;

    // Enable fullscreen video playback on mobile devices
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      document.addEventListener(
        "click",
        (e) => {
          const target = /** @type {HTMLElement|null} */ (e.target);
          if (target?.closest(".video--control-resize .video--control-btn")) {
            e.preventDefault();
            const video = target.closest(".rich-text--video-w")?.querySelector("video");
            
            // Type guard and method availability check
            if (video instanceof HTMLVideoElement) {
              if (typeof video.webkitEnterFullscreen === 'function') {
                video.webkitEnterFullscreen();
              } else if (typeof video.requestFullscreen === 'function') {
                video.requestFullscreen();
              }
            }
          }
        },
        true
      );
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initControlPanelAnimation() {
    // Prevent multiple initializations
    if (moduleState.controlPanelInitialized) return;
    moduleState.controlPanelInitialized = true;

    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate || typeof animate !== 'function') {
      console.warn("Motion.dev not ready for control panel, retrying…");
      // Reset flag to allow retry
      moduleState.controlPanelInitialized = false;
      setTimeout(initControlPanelAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       3. Element Detection & Viewport Check
    ────────────────────────────────────────────────────────────────*/
    const controlPanel = /** @type {HTMLElement|null} */ (
      document.querySelector("#control-panel")
    );

    if (!controlPanel) {
      return;
    }

    // Skip animation on mobile/tablet
    if (window.innerWidth <= 768) {
      return;
    }

    const videoContainer = /** @type {HTMLElement|null} */ (
      controlPanel.closest(".rich-text--video-w") ||
        controlPanel.closest('[class*="video"]')
    );

    if (!videoContainer) {
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       4. Animation Configuration & Performance Setup
    ────────────────────────────────────────────────────────────────*/
    // Cache reduced motion preference for accessibility
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Easing curves for smooth control panel animation
    const expoOut = [0.16, 1, 0.3, 1]; // Smooth entry
    const power2Out = [0.25, 0.46, 0.45, 0.94]; // Smooth exit

    // Animation timing settings
    const duration = prefersReducedMotion ? 0.1 : 0.3;
    const easing = prefersReducedMotion ? [0, 0, 1, 1] : expoOut;

    // State management for hover interactions
    let isVisible = false;
    /** @type {ReturnType<typeof setTimeout>|null} */
    let hoverTimeout = null;

    /* ─────────────────────────────────────────────────────────────
       5. Initial State Setup (Prevent Flickering)
    ────────────────────────────────────────────────────────────────*/
    // Set initial hidden state with hardware acceleration
    Object.assign(controlPanel.style, {
      opacity: "0",
      transform: "translateY(100%) translateZ(0)",
      pointerEvents: "none",
      willChange: "opacity, transform",
      backfaceVisibility: "hidden",
      perspective: "1000px",
    });

    /* ─────────────────────────────────────────────────────────────
       6. Show Animation (Mouse Enter)
    ────────────────────────────────────────────────────────────────*/
    videoContainer.addEventListener("mouseenter", () => {
      if (isVisible) return;

      // Clear any pending hide animation
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      isVisible = true;
      controlPanel.style.pointerEvents = "auto";

      // Show control panel with slide-up animation
      animate(
        controlPanel,
        {
          opacity: [0, 1],
          y: ["100%", "0%"],
        },
        {
          duration,
          easing,
          onComplete: () => {
            controlPanel.style.willChange = "auto";
          },
        }
      );
    });

    /* ─────────────────────────────────────────────────────────────
       7. Hide Animation (Mouse Leave)
    ────────────────────────────────────────────────────────────────*/
    videoContainer.addEventListener("mouseleave", () => {
      if (!isVisible) return;

      // Add slight delay to prevent flickering on quick mouse movements
      hoverTimeout = setTimeout(() => {
        if (!isVisible) return;

        isVisible = false;
        controlPanel.style.willChange = "opacity, transform";

        // Hide control panel with slide-down animation
        animate(
          controlPanel,
          {
            opacity: [1, 0],
            y: ["0%", "100%"],
          },
          {
            duration,
            easing: prefersReducedMotion ? [0, 0, 1, 1] : power2Out,
            onComplete: () => {
              controlPanel.style.pointerEvents = "none";
              controlPanel.style.willChange = "auto";
            },
          }
        );
      }, 50); // Small delay prevents rapid on/off flickering
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Initialize Everything
  ────────────────────────────────────────────────────────────────*/
  // Set up mobile fullscreen support immediately
  setupMobileFullscreen();

  // Initialize control panel animation
  initControlPanelAnimation();
})();
