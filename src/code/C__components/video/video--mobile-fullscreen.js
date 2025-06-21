// Video
// Enable fullscreen video playback on mobile devices

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  document.addEventListener(
    "click",
    (e) => {
      if (e.target.closest(".video--control-resize .video--control-btn")) {
        e.preventDefault();
        const video = e.target
          .closest(".rich-text--video-w")
          ?.querySelector("video");
        video?.webkitEnterFullscreen?.() || video?.requestFullscreen?.();
      }
    },
    true
  );
}
