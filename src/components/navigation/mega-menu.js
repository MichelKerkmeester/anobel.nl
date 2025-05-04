// Navigation
// Mobile — Mega Menu

Webflow.push(() => {
  // Select all elements
  const megaMenu = document.querySelector(".nav--mega-menu"); // The mega menu container
  const menuButton = document.querySelector(".btn--hamburger"); // The hamburger button

  // Safety check if elements exist
  if (!megaMenu || !menuButton) {
    console.error("Mega menu or menu button not found!");
    return;
  }

  // Function to open the menu
  function openMenu() {
    megaMenu.style.display = "flex"; // Set display to flex before animation
    gsap.to(megaMenu, {
      duration: 0.8,
      height: "100svh",
      width: "100%",
      ease: "power2.out",
      delay: 0.2,
      onComplete: () => {
        megaMenu.style.borderRadius = "0rem"; // Remove border radius when fully open
      },
    });
  }

  // Function to close the menu
  function closeMenu() {
    megaMenu.style.borderRadius = "0.75rem"; // Restore border radius before closing
    gsap.to(megaMenu, {
      duration: 0.4,
      height: "0svh",
      width: "100%",
      ease: "power2.in",
      onComplete: () => {
        megaMenu.style.display = "none"; // Hide menu when animation completes
      },
    });
  }

  // Toggle menu on button click
  let isOpen = false; // Track menu state
  menuButton.addEventListener("click", () => {
    if (!isOpen) {
      openMenu(); // Open the menu if it's closed
    } else {
      closeMenu(); // Close the menu if it's open
    }
    isOpen = !isOpen; // Toggle the state
  });
});
