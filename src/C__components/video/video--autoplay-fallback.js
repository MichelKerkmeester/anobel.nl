// ───────────────────────────────────────────────────────────────
// Video: Autoplay Fallback
// User Interaction Fallback for Autoplay Prevention
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     Module State Management
  ────────────────────────────────────────────────────────────────*/
  // Namespaced initialization flag to prevent conflicts
  const moduleState = {
    autoplayInitialized: false,
  };

  /* ─────────────────────────────────────────────────────────────
     Autoplay Fallback with User Interaction
  ────────────────────────────────────────────────────────────────*/
  function initAutoplayFallback() {
    // Prevent multiple initializations
    if (moduleState.autoplayInitialized) return;
    moduleState.autoplayInitialized = true;

    const startAutoplay = () => {
      // Wait 3 seconds before trying to play the video
      setTimeout(() => {
        const videos = document.querySelectorAll(
          "video.hero--video-element, video.blog--video-element"
        );

        // If no video elements exist, return
        if (!videos.length) return;

        videos.forEach((vid) => {
          // Type guard for video element
          if (!(vid instanceof HTMLVideoElement)) return;

          // Set attributes for autoplay and looping
          vid.loop = true;
          vid.muted = true;
          vid.playsInline = true;

          // Attempt to play the video
          const promise = vid.play();

          if (promise !== undefined) {
            promise.catch((error) => {
              // Autoplay was prevented. Set up one-time listener for user interaction
              const playOnFirstInteraction = () => {
                if (vid instanceof HTMLVideoElement) {
                  vid.play().catch(() => {
                    // Silently fail if play on interaction also fails
                  });
                }
              };

              // Use { once: true } to automatically remove listeners after first use
              document.addEventListener("click", playOnFirstInteraction, {
                once: true,
              });
              document.addEventListener("touchstart", playOnFirstInteraction, {
                once: true,
              });
            });
          }
        });
      }, 3000); // 3-second delay
    };

    // @ts-ignore - Webflow global loaded externally
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(startAutoplay);
    } else {
      // Fallback if Webflow is not available
      startAutoplay();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     Initialize Autoplay Fallback
  ────────────────────────────────────────────────────────────────*/
  initAutoplayFallback();
})();
