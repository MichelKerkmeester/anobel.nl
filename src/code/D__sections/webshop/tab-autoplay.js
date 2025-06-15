// Tab w/ Autoplay
// Initializes an automated tab system with visual transitions and progress bars

function initTabSystem() {
  // Find all tab system containers on the page
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

  wrappers.forEach((wrapper) => {
    // Get all content tabs and corresponding visual elements within this wrapper
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');

    // Read autoplay settings from data attributes
    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000; // Default 5 seconds

    // State management variables
    let activeContent = null; // Track currently active content tab
    let activeVisual = null;  // Track currently active visual element
    let isAnimating = false;  // Prevent overlapping animations
    let progressBarTween = null; // GSAP animation for progress bar

    // Animates the progress bar for the active tab during autoplay
    function startProgressBar(index) {
      // Stop any existing progress bar animation
      if (progressBarTween) progressBarTween.kill();
      
      // Find the progress bar element for this tab
      const bar = contentItems[index].querySelector(
        '[data-tabs="item-progress"]'
      );
      if (!bar) return;

      // Reset progress bar to empty state (scale from left to right)
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      
      // Animate progress bar from 0 to 100% over the autoplay duration
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000, // Convert milliseconds to seconds
        ease: "power1.inOut",
        onComplete: () => {
          // When progress bar completes, switch to next tab
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length; // Loop back to first after last
            switchTab(nextIndex);
          }
        },
      });
    }

    // Main function to switch between tabs with animations
    function switchTab(index) {
      // Prevent switching if already animating or if target tab is already active
      if (isAnimating || contentItems[index] === activeContent) return;

      // Set animation flag and stop any running progress bar
      isAnimating = true;
      if (progressBarTween) progressBarTween.kill();

      // Reference the elements that are transitioning out
      const outgoingContent = activeContent;
      const outgoingVisual = activeVisual;
      const outgoingBar = outgoingContent?.querySelector(
        '[data-tabs="item-progress"]'
      );

      // Reference the elements that are transitioning in
      const incomingContent = contentItems[index];
      const incomingVisual = visualItems[index];
      const incomingBar = incomingContent.querySelector(
        '[data-tabs="item-progress"]'
      );

      // Update CSS classes for styling (before animations)
      outgoingContent?.classList.remove("active");
      outgoingVisual?.classList.remove("active");
      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");

      // Create GSAP timeline for coordinated animations
      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power3" },
        onComplete: () => {
          // Update state when all animations complete
          activeContent = incomingContent;
          activeVisual = incomingVisual;
          isAnimating = false;
          // Start progress bar if autoplay is enabled
          if (autoplay) startProgressBar(index);
        },
      });

      // Animate outgoing elements (skip on first load when no active tab exists)
      if (outgoingContent) {
        // Remove active classes
        outgoingContent.classList.remove("active");
        outgoingVisual?.classList.remove("active");
        
        // Animate outgoing elements: progress bar shrinks from right, visual fades and slides, content collapses
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)  // Progress bar shrinks
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)  // Visual fades and slides right
          .to(
            outgoingContent.querySelector('[data-tabs="item-details"]'),
            { height: 0 },  // Content details collapse
            0
          );
      }

      // Add active classes to incoming elements
      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");
      
      // Animate incoming elements: visual fades in and slides to position, content expands
      tl.fromTo(
        incomingVisual,
        { autoAlpha: 0, xPercent: 3 },  // Start: invisible and offset right
        { autoAlpha: 1, xPercent: 0 },  // End: visible and in position
        0.3  // Start at 0.3 seconds into timeline
      )
        .fromTo(
          incomingContent.querySelector('[data-tabs="item-details"]'),
          { height: 0 },      // Start: collapsed
          { height: "auto" }, // End: natural height
          0  // Start immediately
        )
        .set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);  // Reset progress bar
    }

    // Initialize first tab as active on page load
    switchTab(0);

    // Add click handlers to all content items for manual tab switching
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // Ignore clicks on already active tab
        switchTab(i);
      })
    );
  });
}

// Initialize the tab system when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initTabSystem();
});
