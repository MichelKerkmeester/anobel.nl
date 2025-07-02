// ───────────────────────────────────────────────────────────────
// Video: Controls
// Fullscreen Support, Control Panel Animation & Autoplay Fallback
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Autoplay Fallback with User Interaction
  ────────────────────────────────────────────────────────────────*/
  function initAutoplayFallback() {
    // @ts-ignore - Webflow global loaded externally
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(() => {
        // Wait 3 seconds before trying to play the video
        setTimeout(() => {
          const videos = document.querySelectorAll(
            "video.hero--video-element, video.blog--video-element"
          );

          // If no video elements exist, return
          if (!videos.length) return;

          videos.forEach((vid) => {
            // Set attributes for autoplay and looping
            vid.loop = true;
            vid.muted = true;
            vid.playsInline = true;

            // Attempt to play the video
            const promise = vid.play();

            if (promise !== undefined) {
              promise.catch((error) => {
                console.warn(
                  "Autoplay was prevented. Waiting for user interaction.",
                  error
                );
                // Autoplay was prevented. We'll set up a one-time listener to play on interaction.
                const playOnFirstInteraction = () => {
                  vid
                    .play()
                    .catch((e) =>
                      console.warn("Play on interaction also failed.", e)
                    );
                  // Remove the listeners after the first interaction
                  document.removeEventListener("click", playOnFirstInteraction);
                  document.removeEventListener(
                    "touchstart",
                    playOnFirstInteraction
                  );
                };

                document.addEventListener("click", playOnFirstInteraction);
                document.addEventListener("touchstart", playOnFirstInteraction);
              });
            }
          });
        }, 3000); // 3-second delay
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. Mobile Fullscreen Support
  ────────────────────────────────────────────────────────────────*/
  function setupMobileFullscreen() {
    // Enable fullscreen video playback on mobile devices
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      document.addEventListener(
        "click",
        (e) => {
          const target = /** @type {HTMLElement|null} */ (e.target);
          if (target?.closest(".video--control-resize .video--control-btn")) {
            e.preventDefault();
            const video = /** @type {any} */ (
              target.closest(".rich-text--video-w")?.querySelector("video")
            );
            video?.webkitEnterFullscreen?.() || video?.requestFullscreen?.();
          }
        },
        true
      );
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. Import Motion.dev
  ────────────────────────────────────────────────────────────────*/
  function initControlPanelAnimation() {
    // @ts-ignore - Motion.dev library loaded externally
    const { animate } = window.Motion || {};
    if (!animate) {
      console.warn("Motion.dev not ready for control panel, retrying…");
      setTimeout(initControlPanelAnimation, 100);
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       4. Element Detection & Viewport Check
    ────────────────────────────────────────────────────────────────*/
    const controlPanel = /** @type {HTMLElement|null} */ (
      document.querySelector("#control-panel")
    );

    // Debug logging for development
    console.log("Control panel found:", !!controlPanel);
    console.log("Window width:", window.innerWidth);

    if (!controlPanel) {
      console.warn("Control panel (#control-panel) not found");
      return;
    }

    // Skip animation on mobile/tablet
    if (window.innerWidth <= 768) {
      console.log("Skipping control panel animation on mobile");
      return;
    }

    const videoContainer = /** @type {HTMLElement|null} */ (
      controlPanel.closest(".rich-text--video-w") ||
        controlPanel.closest('[class*="video"]')
    );

    console.log("Video container found:", !!videoContainer);

    if (!videoContainer) {
      console.warn("Video container not found for control panel");
      return;
    }

    /* ─────────────────────────────────────────────────────────────
       5. Animation Configuration & Performance Setup
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
       6. Initial State Setup (Prevent Flickering)
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
       7. Show Animation (Mouse Enter)
    ────────────────────────────────────────────────────────────────*/
    videoContainer.addEventListener("mouseenter", () => {
      console.log("Mouse entered video container, isVisible:", isVisible);

      if (isVisible) return;

      // Clear any pending hide animation
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      console.log("Starting control panel show animation");
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
          onStart: () => {
            console.log("Control panel animation started");
          },
          onComplete: () => {
            console.log("Control panel animation completed");
            controlPanel.style.willChange = "auto";
          },
        }
      );
    });

    /* ─────────────────────────────────────────────────────────────
       8. Hide Animation (Mouse Leave)
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
     9. Initialize Everything
  ────────────────────────────────────────────────────────────────*/
  // Initialize autoplay fallback
  initAutoplayFallback();

  // Set up mobile fullscreen support immediately
  setupMobileFullscreen();

  // Initialize control panel animation
  initControlPanelAnimation();
})();
