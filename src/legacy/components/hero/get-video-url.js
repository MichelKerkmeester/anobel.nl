// Hero Video URL Handler
// Updates video URL based on page attributes

document.addEventListener("DOMContentLoaded", function () {
  // Function to update video URL based on page attribute
  function updateVideoUrl() {
    // Get the video embed element
    const videoEmbed = document.querySelector(".hero--video-element");
    console.log("Video element found:", videoEmbed);
    if (!videoEmbed) {
      console.warn("Video embed element not found");
      return;
    }

    // Get the current page attribute from the page wrapper
    const pageWrapper = document.querySelector(".page--wrapper");
    console.log("Page wrapper found:", pageWrapper);
    if (!pageWrapper) {
      console.warn("Page wrapper not found");
      return;
    }

    const pageAttribute = pageWrapper.getAttribute("page-attribute");
    console.log("Page attribute found:", pageAttribute);
    if (!pageAttribute) {
      console.warn("No page attribute found on page wrapper");
      return;
    }

    // Video URL mapping
    const videoUrls = {
      home: "https://anobel.b-cdn.net/Video%20-%20Home%20-%20Hero%20-%20Background%20Scene%20-%201080p.mp4",
      locatie:
        "https://anobel.b-cdn.net/Video%20-%20Inspectie%20en%20Reiniging%20-%20Placeholder%20-%20720p.mov",
      nobel:
        "https://anobel.b-cdn.net/Video%20-%20Bunkering%20-%20Placeholder%20-%20720p.mov",
      // Add more page-to-video mappings as needed
    };

    // Get the video URL for the current page
    const videoUrl = videoUrls[pageAttribute.toLowerCase()];

    // Update video embed source if URL is found
    if (videoUrl) {
      videoEmbed.src = videoUrl;
      console.log(`Updated video URL to: ${videoUrl}`);
    } else {
      console.warn(`No video URL found for page attribute: ${pageAttribute}`);
    }
  }

  // Run the update function
  updateVideoUrl();
});
