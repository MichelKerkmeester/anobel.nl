// Input field
// Custom placeholder & Focus states
document.addEventListener('DOMContentLoaded', function () {
  const inputs = document.querySelectorAll('input, textarea, select');
  let usingMouse = false;

  // Placeholder functionality
  function handlePlaceholders() {
    inputs.forEach((input) => {
      const placeholders = input.getAttribute('data-placeholder')?.split('|');
      if (placeholders) {
        const defaultPlaceholder = placeholders[0].trim();
        const hoverPlaceholder = placeholders[1]?.trim() || defaultPlaceholder;

        // Set initial placeholder
        input.placeholder = defaultPlaceholder;
        input.dataset.currentPlaceholder = defaultPlaceholder;

        // Change placeholder on mouseover
        input.addEventListener('mouseover', () => {
          input.dataset.currentPlaceholder = hoverPlaceholder;
          input.classList.add('hovered');
        });

        // Revert placeholder on mouseout
        input.addEventListener('mouseout', () => {
          input.dataset.currentPlaceholder = defaultPlaceholder;
          input.classList.remove('hovered');
        });
      }
    });
  }

  // Focus states
  function handleFocusStates() {
    // Track mouse vs keyboard usage
    document.body.addEventListener('mousedown', () => (usingMouse = true));
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') usingMouse = false;
    });

    inputs.forEach((input) => {
      // Apply appropriate focus styles
      input.addEventListener('focus', function () {
        if (usingMouse) {
          this.classList.remove('w--focus-visible');
          this.classList.add('w--focus');
        } else {
          this.classList.add('w--focus-visible');
        }
      });

      // Remove focus styles on blur
      input.addEventListener('blur', function () {
        this.classList.remove('w--focus', 'w--focus-visible');
      });
    });

    // Prevent default focus ring on mouse click, but allow textarea resizing
    document.addEventListener('mousedown', function (e) {
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')
      ) {
        e.preventDefault();
        e.target.focus();
      }
    });
  }

  // Initialize all functionalities
  handlePlaceholders();
  handleFocusStates();
});
