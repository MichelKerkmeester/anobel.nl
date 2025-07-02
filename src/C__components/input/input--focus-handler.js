// Input field
/**
 * Keyboard Focus Handler for Input Fields
 * Adds 'using-keyboard' class to body when Tab key is used
 * This allows CSS to show outline only for keyboard navigation
 */

// Track whether the user is using keyboard navigation
let usingKeyboard = false;

// Listen for Tab key press
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    usingKeyboard = true;
    document.body.classList.add("using-keyboard");
  }
});

// Listen for mouse click
document.addEventListener("mousedown", () => {
  usingKeyboard = false;
  document.body.classList.remove("using-keyboard");
});

// Also remove on touch for mobile
document.addEventListener(
  "touchstart",
  () => {
    usingKeyboard = false;
    document.body.classList.remove("using-keyboard");
  },
  { passive: true }
);
