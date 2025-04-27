// Navigation
// Mobile — Mega Menu

// Select all elements
const megaMenu = document.querySelector('.nav--mega-menu'); // The mega menu container
const menuButton = document.querySelector('.btn--hamburger'); // The hamburger button

// Function to open the menu
function openMenu() {
  megaMenu.style.display = 'flex'; // Set display to flex before animation
  gsap.to(megaMenu, {
    duration: 0.8, // Animation duration in seconds
    height: '100svh', // Animate to full screen height using small viewport height units
    width: '100%', // Full width
    ease: 'power2.out', // Easing function for smooth animation
    delay: 0.2, // Slight delay before animation starts
    onComplete: () => {
      megaMenu.style.borderRadius = '0rem'; // Remove border radius when fully open
    },
  });
}

// Function to close the menu
function closeMenu() {
  megaMenu.style.borderRadius = '0.75rem'; // Restore border radius before closing
  gsap.to(megaMenu, {
    duration: 0.4, // Faster closing animation
    height: '0svh', // Animate to zero height using small viewport height units
    width: '100%', // Maintain width during animation
    ease: 'power2.in', // Easing function for smooth animation
    onComplete: () => {
      megaMenu.style.display = 'none'; // Hide menu when animation completes
    },
  });
}

// Toggle menu on button click
let isOpen = false; // Track menu state
menuButton.addEventListener('click', () => {
  if (!isOpen) {
    openMenu(); // Open the menu if it's closed
  } else {
    closeMenu(); // Close the menu if it's open
  }
  isOpen = !isOpen; // Toggle the state
});
