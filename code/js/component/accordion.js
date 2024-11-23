//  Services
//  GSAP Accordion

// Accordion
// Animate in view
function animateAccordionItems() {
  gsap.registerPlugin(ScrollTrigger);

  const isMobileOrTablet = window.innerWidth < 992;

  // Select all accordion items with the specified attribute
  const accordionItems = document.querySelectorAll(
      ".accordion--list-item[services--attribute]"
  );

  // Create a timeline for all accordion items
  const tl = gsap.timeline({
      scrollTrigger: {
          trigger: accordionItems[0], // Use the first item as the trigger
          start: "bottom 100%",
          end: "bottom 40%",
          toggleActions: "play none none none",
      },
  });

  // Set initial state
  accordionItems.forEach((item, index) => {
      gsap.set(item, {
          opacity: 0,
          y: isMobileOrTablet ? "4rem" : "6rem",
      });

      // Animate each item to its final state
      tl.to(
          item,
          {
              opacity: 1,
              y: 0,
              duration: isMobileOrTablet ? 1.2 : 1,
              ease: "power3.out",
          },
          index * 0.2 // Stagger each item's animation by 0.2 seconds
      );
  });
}

// Initialize animation on page load
document.addEventListener("DOMContentLoaded", () => {
  animateAccordionItems();
  initializeAccordion();
});

// Accordion logic
function initializeAccordion() {
  const accordions = document.querySelectorAll(".accordion--list-item"); // Select all accordion items
  let lastHoveredHeader = null; // Track the last hovered header
  let openAccordionHeader = null; // Track the currently open accordion header

  // Function to check if the device is mobile/tablet
  function isMobileOrTablet() {
      return window.innerWidth <= 991; // Breakpoint for tablets and below
  }

  // Loop through each accordion item
  accordions.forEach((accordion) => {
      const header = accordion.querySelector(".accordion--header"); // Select the header
      const content = accordion.querySelector(".accordion--content"); // Select the content
      const divider = header.querySelector(".accordion--divider"); // Select the divider
      const btnLine1 = header.querySelector(".accordion--btn-line-1"); // Select the first line of the button
      const btnLine2 = header.querySelector(".accordion--btn-line-2"); // Select the second line of the button

      // Set the initial state for content (collapsed)
      gsap.set(content, {
          height: "0px",
          opacity: 0,
          scale: 0.95,
          y: 10,
          overflow: "hidden",
      });

      // Function to handle color change on hover
      const handleHoverColorChange = (headingElement, isIn) => {
          gsap.killTweensOf(headingElement); // Kill ongoing animations
          gsap.to(headingElement, {
              color: isIn ? "#2f7f90" : "#13333a",
              duration: 0.5,
              ease: "power1.out",
          }); // Animate text color change
      };

      // Function to handle line animation on click
      const handleLineClick = (line, isOpen) => {
          gsap.killTweensOf(line); // Kill ongoing animations
          gsap.to(line, {
              width: isOpen ? "100%" : "0%",
              duration: 0.5,
              ease: "power1.out",
          }); // Animate line width
      };

      // Add hover animations if not on mobile/tablet
      if (!isMobileOrTablet()) {
          header.addEventListener("mouseenter", () => {
              // Hover on header
              if (header !== openAccordionHeader) {
                  lastHoveredHeader = header; // Update last hovered header
                  const heading = header.querySelector("#accordion--heading");
                  handleHoverColorChange(heading, true); // Change heading color on hover
              }
          });

          header.addEventListener("mouseleave", () => {
              // Hover off header
              if (lastHoveredHeader === header && openAccordionHeader !== header) {
                  const heading = header.querySelector("#accordion--heading");
                  handleHoverColorChange(heading, false); // Reset heading color on hover out
                  lastHoveredHeader = null; // Reset last hovered header
              }
          });
      }

      // Click event for the accordion header
      header.addEventListener("click", () => {
          const isOpen = parseFloat(gsap.getProperty(content, "height")) > 0; // Check if content is open

          // Disable scroll handling
          window.disableScrollHandling();

          // Close all other accordion contents
          accordions.forEach((item) => {
              const itemContent = item.querySelector(".accordion--content");
              const itemHeader = item.querySelector(".accordion--header");
              const itemDivider = itemHeader.querySelector(".accordion--divider");
              const itemBtnLine1 = itemHeader.querySelector(".accordion--btn-line-1");
              const itemBtnLine2 = itemHeader.querySelector(".accordion--btn-line-2");

              if (itemContent !== content) {
                  gsap.to(itemContent, {
                      height: "0px",
                      opacity: 0,
                      scale: 0.95,
                      y: 10,
                      duration: 0.5,
                      ease: "power1.inOut",
                      onComplete: () => {
                          gsap.set(itemContent, { height: "0px" }); // Ensure height is 0px after closing
                      },
                  }); // Close other contents

                  gsap.to(itemDivider, {
                      width: "0%",
                      duration: 0.5,
                      ease: "power1.out",
                  }); // Close divider line

                  // Close button animation
                  gsap.to(itemBtnLine1, {
                      rotation: 0,
                      duration: 0.75,
                      ease: "expo.out",
                  }); // Rotate line 1 to 0 degrees
                  gsap.to([itemBtnLine1, itemBtnLine2], {
                      backgroundColor: "#13333a",
                      duration: 0.75,
                      delay: 0.25,
                      ease: "ease.out",
                  }); // Change BG color of button lines
              }
          });

          if (!isOpen) {
              // Open the clicked content if not already open
              gsap.to(content, {
                  height: "auto",
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power1.out",
                  onComplete: () => {
                      gsap.set(content, { height: "auto" }); // Ensure height is auto after opening
                      if (isMobileOrTablet()) {
                          header.scrollIntoView({ behavior: "smooth", block: "start" });
                          setTimeout(() => {
                              window.scrollBy(0, -32); // Add padding (32px)
                          }, 300); // Delay to ensure scrollIntoView completes first
                      }
                      // Enable scroll handling after animation
                      setTimeout(window.enableScrollHandling, 1000); // Re-enable scroll handling after 1 second

                      // Hide navigation when accordion is opened
                      if (isMobileOrTablet()) {
                          gsap.to(navHeader, {
                              y: -navHeader.offsetHeight,
                              duration: 0.8,
                              ease: "power2.out",
                          });
                      }
                  },
              });

              handleLineClick(divider, true); // Animate divider line on open

              // Open button animation
              gsap.to(btnLine1, {
                  rotation: -90,
                  duration: 1,
                  ease: "bounce.out",
              }); // Rotate line 1 to -90 degrees
              gsap.to([btnLine1, btnLine2], {
                  backgroundColor: "#2f7f90",
                  duration: 1.5,
                  delay: 0.25,
                  ease: "bounce.out",
              }); // Change BG color of button lines
          } else {
              // Close the clicked content if already open
              gsap.to(content, {
                  height: "0px",
                  opacity: 0,
                  scale: 0.95,
                  y: 10,
                  duration: 0.5,
                  ease: "power1.inOut",
                  onComplete: () => {
                      gsap.set(content, { height: "0px" }); // Ensure height is 0px after closing
                      handleLineClick(divider, false); // Close divider line
                      // Enable scroll handling after animation
                      setTimeout(window.enableScrollHandling, 1000); // Re-enable scroll handling after 1 second
                  },
              });

              openAccordionHeader = null; // Reset the opened accordion header

              // Close button animation
              gsap.to(btnLine1, { rotation: 0, duration: 0.75, ease: "expo.out" }); // Rotate line 1 to 0 degrees
              gsap.to([btnLine1, btnLine2], {
                  backgroundColor: "#13333a",
                  duration: 0.75,
                  delay: 0.25,
                  ease: "ease.out",
              }); // Change BG color of button lines
          }
      });
  });
}