// Autoplay - JS Fallback
Webflow.push(() => {
  // Wait 3 seconds before trying to play the video
  setTimeout(() => {
    const vid = document.querySelector("video.hero--video-element");

    // If the video element exists, attempt to play it
    if (!vid) return;

    vid.play().catch((err) => {
      // If autoplay is blocked (e.g., user has Low Power Mode), log a warning
      console.warn("Autoplay blocked:", err);
    });
  }, 3000); // 3-second delay
});
