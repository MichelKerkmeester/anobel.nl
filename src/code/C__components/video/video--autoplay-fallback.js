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

    videos.forEach((vid) => {
      // Set attributes for autoplay and looping
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;

      // Attempt to play the video
      const promise = vid.play();

      if (promise !== undefined) {
        promise.catch(error => {
          console.warn("Autoplay was prevented. Waiting for user interaction.", error);
          // Autoplay was prevented. We'll set up a one-time listener to play on interaction.
          const playOnFirstInteraction = () => {
            vid.play().catch(e => console.warn("Play on interaction also failed.", e));
            // Remove the listeners after the first interaction
            document.removeEventListener("click", playOnFirstInteraction);
            document.removeEventListener("touchstart", playOnFirstInteraction);
          };

          document.addEventListener("click", playOnFirstInteraction);
          document.addEventListener("touchstart", playOnFirstInteraction);
        });
      }
    });
  }, 3000); // 3-second delay
});
