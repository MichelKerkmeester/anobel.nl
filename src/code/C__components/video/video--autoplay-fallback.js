// Vdeo
// Autoplay - JS Fallback
Webflow.push(() => {
  // Wait 3 seconds before trying to play the video
  setTimeout(() => {
    const videos = document.querySelectorAll(
      "video.hero--video-element, video.blog--video-element"
    );

    // If no video elements exist, return
    if (!videos.length) return;

    // Attempt to play all matching videos
    videos.forEach((vid) => {
      vid.play().catch((err) => {
        // If autoplay is blocked (e.g., user has Low Power Mode), log a warning
        console.warn("Autoplay blocked:", err);
      });
    });
  }, 3000); // 3-second delay
});
