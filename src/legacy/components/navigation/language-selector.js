// Navigation
// Language Selector
document.addEventListener('DOMContentLoaded', () => {
  // Selectors for the language button, dropdown, and rotating icon
  const languageBtn = document.querySelector('[class*="language--btn-w"]');
  const languageDropdown = document.querySelector('[class*="language--dropdown-w"]');
  const languageIcon = document.querySelector('.icon--svg.is--language');

  // Safety check to ensure required elements exist
  if (!languageBtn || !languageDropdown || !languageIcon) {
    console.error('Required elements not found!');
    return;
  }

  // Function to open or close the dropdown
  const toggleDropdown = (isOpen) => {
    // Rotate the language icon (0° closed, 180° open)
    gsap.to(languageIcon, {
      rotation: isOpen ? 180 : 0,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Toggle the button's background color based on state
    gsap.to(languageBtn, {
      backgroundColor: isOpen
        ? 'var(--secondary--darkest)'
        : 'var(--secondary--darker)',
      duration: 0.3,
    });

    if (isOpen) {
      // First set initial state
      gsap.set(languageDropdown, {
        visibility: 'visible',
        height: 0,
        opacity: 0,
      });

      // Animate to final state
      gsap.to(languageDropdown, {
        opacity: 1,
        height: 'auto',
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      // Animate back to closed state
      gsap.to(languageDropdown, {
        opacity: 0,
        height: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(languageDropdown, { visibility: 'hidden' });
        },
      });
    }
  };

  // Hover effect: expand button width on hover in
  languageBtn.addEventListener('mouseenter', () => {
    if (!languageBtn.classList.contains('clicked')) {
      gsap.to(languageBtn, {
        width: '4.75rem',
        backgroundColor: 'var(--secondary--darker)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  });

  // Hover effect: collapse button width on hover out
  languageBtn.addEventListener('mouseleave', () => {
    if (!languageBtn.classList.contains('clicked')) {
      gsap.to(languageBtn, {
        width: '2rem',
        backgroundColor: 'var(--secondary--darker)',
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  });

  // Click event: toggle dropdown open/close
  languageBtn.addEventListener('click', () => {
    const isClicked = languageBtn.classList.toggle('clicked');
    toggleDropdown(isClicked);
  });

  // Close dropdown if clicking outside the button or dropdown, or on another dropdown trigger
  document.addEventListener('click', (event) => {
    const isInside = languageBtn.contains(event.target) || languageDropdown.contains(event.target);
    const isDropdownTrigger = event.target.closest('.btn--nav-dropdown');

    if (
      (!isInside && languageBtn.classList.contains('clicked')) ||
      (isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger))
    ) {
      languageBtn.classList.remove('clicked');
      toggleDropdown(false);

      // Perform the hover-out action to reset the button width
      gsap.to(languageBtn, {
        width: '2rem',
        backgroundColor: 'var(--secondary--darker)',
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  });
});
