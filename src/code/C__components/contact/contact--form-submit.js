// ───────────────────────────────────────────────────────────────
// Contact
// Form Submit Handler (Finsweet Compatible)
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES:
   
   - Finsweet-compatible form submission handling
   - Modal popup after successful submission
   - Form reset with excluded fields support
   - Delayed actions with configurable timing
   - Integration with validation, memory, and formatting modules
   - Webflow interaction triggers
   - Manual reset button support
   - Graceful error handling and cleanup
────────────────────────────────────────────────────────────────*/

(() => {
  /* ─────────────────────────────────────────────────────────────
       1. Configuration & Constants
    ────────────────────────────────────────────────────────────────*/

  const CONFIG = {
    // Form submit selectors (updated for consistency)
    SELECTORS: {
      FORM: '[data-submit-form]',
      IX_TRIGGER: '[data-submit-trigger]',
      RESET_BUTTON: '[data-submit-reset]',
      SUBMIT_BUTTON: '[data-submit-button]',
      // Legacy Finsweet compatibility
      FORM_LEGACY: '[fs-formsubmit-element="form"]',
      IX_TRIGGER_LEGACY: '[fs-formsubmit-element="ix-trigger"]',
      RESET_BUTTON_LEGACY: '[fs-formsubmit-element="reset"]',
      SUBMIT_BUTTON_LEGACY: '[fs-formsubmit-element="submit"]'
    },
    
    // Data attributes
    ATTRIBUTES: {
      RESET: 'data-submit-auto-reset',
      DELAY: 'data-submit-delay',
      EXCLUDE: 'data-submit-exclude',
      REDIRECT: 'data-submit-redirect',
      RELOAD: 'data-submit-reload',
      DISABLE: 'data-submit-disable',
      // Legacy attributes for backward compatibility
      RESET_LEGACY: 'fs-formsubmit-reset',
      DELAY_LEGACY: 'fs-formsubmit-delay',
      EXCLUDE_LEGACY: 'fs-formsubmit-exclude',
      REDIRECT_LEGACY: 'fs-formsubmit-redirect',
      RELOAD_LEGACY: 'fs-formsubmit-reload',
      DISABLE_LEGACY: 'fs-formsubmit-disable'
    },
    
    // Default timing
    DEFAULT_DELAY: 1000,
    
    // CSS classes for state management
    CLASSES: {
      SUBMITTING: 'form-submitting',
      SUCCESS: 'form-success',
      RESETTING: 'form-resetting'
    }
  };

  // Form state tracking
  const FORM_STATES = new WeakMap();

  /* ─────────────────────────────────────────────────────────────
       2. Form Detection & Initialization
    ────────────────────────────────────────────────────────────────*/

  /**
   * Initialize a form with submit handling
   * @param {HTMLFormElement} form - Form to initialize
   */
  function initializeForm(form) {
    // Skip if already initialized or disabled
    if (FORM_STATES.has(form) || 
        form.hasAttribute(CONFIG.ATTRIBUTES.DISABLE) || 
        form.hasAttribute(CONFIG.ATTRIBUTES.DISABLE_LEGACY)) {
      return;
    }

    // Initialize form state (support both new and legacy attributes)
    const state = {
      isSubmitting: false,
      hasSubmitted: false,
      ixTrigger: form.querySelector(CONFIG.SELECTORS.IX_TRIGGER) || form.querySelector(CONFIG.SELECTORS.IX_TRIGGER_LEGACY),
      resetButton: form.querySelector(CONFIG.SELECTORS.RESET_BUTTON) || form.querySelector(CONFIG.SELECTORS.RESET_BUTTON_LEGACY),
      delay: parseInt(form.getAttribute(CONFIG.ATTRIBUTES.DELAY) || form.getAttribute(CONFIG.ATTRIBUTES.DELAY_LEGACY)) || CONFIG.DEFAULT_DELAY,
      autoReset: form.hasAttribute(CONFIG.ATTRIBUTES.RESET) || form.hasAttribute(CONFIG.ATTRIBUTES.RESET_LEGACY),
      excludeFields: parseExcludeFields(form.getAttribute(CONFIG.ATTRIBUTES.EXCLUDE) || form.getAttribute(CONFIG.ATTRIBUTES.EXCLUDE_LEGACY)),
      redirectUrl: form.getAttribute(CONFIG.ATTRIBUTES.REDIRECT) || form.getAttribute(CONFIG.ATTRIBUTES.REDIRECT_LEGACY),
      shouldReload: form.hasAttribute(CONFIG.ATTRIBUTES.RELOAD) || form.hasAttribute(CONFIG.ATTRIBUTES.RELOAD_LEGACY)
    };

    FORM_STATES.set(form, state);

    // Add event listeners
    setupFormListeners(form, state);
    
    // Setup manual reset button if present
    if (state.resetButton) {
      setupResetButton(form, state);
    }

    console.log('Form submit handler initialized:', form);
  }

  /**
   * Parse excluded field names from attribute
   * @param {string|null} excludeAttr - Comma-separated field names
   * @returns {string[]} Array of field names to exclude
   */
  function parseExcludeFields(excludeAttr) {
    if (!excludeAttr) return [];
    return excludeAttr.split(',').map(name => name.trim()).filter(Boolean);
  }

  /* ─────────────────────────────────────────────────────────────
       3. Submission Handler
    ────────────────────────────────────────────────────────────────*/

  /**
   * Setup form event listeners
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state object
   */
  function setupFormListeners(form, state) {
    // Intercept form submission
    form.addEventListener('submit', (event) => {
      handleFormSubmit(event, form, state);
    });

    // Listen for Webflow's success/error events
    form.addEventListener('webflow-success', () => {
      handleFormSuccess(form, state);
    });

    form.addEventListener('webflow-error', () => {
      handleFormError(form, state);
    });

    // Also listen for generic success indicators
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          checkForSuccessState(form, state);
        }
      });
    });

    observer.observe(form.parentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Store observer for cleanup
    state.observer = observer;
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function handleFormSubmit(event, form, state) {
    // Don't interfere with Webflow's submission
    state.isSubmitting = true;
    form.classList.add(CONFIG.CLASSES.SUBMITTING);

    console.log('Form submitting:', form);

    // Let Webflow handle the actual submission
    // Our success handler will be called via events or DOM observation
  }

  /**
   * Check for Webflow success state changes
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function checkForSuccessState(form, state) {
    if (state.hasSubmitted) return;

    // Check if form container shows success state
    const formContainer = form.closest('.w-form');
    if (!formContainer) return;

    const successDiv = formContainer.querySelector('.w-form-done');
    const formElement = formContainer.querySelector('form');

    // Webflow typically hides the form and shows success message
    if (successDiv && 
        getComputedStyle(successDiv).display !== 'none' &&
        formElement &&
        getComputedStyle(formElement).display === 'none') {
      
      handleFormSuccess(form, state);
    }
  }

  /**
   * Handle successful form submission
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function handleFormSuccess(form, state) {
    if (state.hasSubmitted) return; // Prevent duplicate handling

    state.hasSubmitted = true;
    state.isSubmitting = false;
    
    form.classList.remove(CONFIG.CLASSES.SUBMITTING);
    form.classList.add(CONFIG.CLASSES.SUCCESS);

    console.log('Form submission successful:', form);

    // Trigger modal via Webflow interaction
    if (state.ixTrigger) {
      triggerModal(state.ixTrigger, state);
    }

    // Handle post-submission actions with delay
    setTimeout(() => {
      // Auto-reset if configured
      if (state.autoReset) {
        resetForm(form, state);
      }

      // Handle redirect
      if (state.redirectUrl) {
        window.location.href = state.redirectUrl;
        return;
      }

      // Handle reload
      if (state.shouldReload) {
        window.location.reload();
        return;
      }
    }, state.delay);
  }

  /**
   * Handle form submission error
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function handleFormError(form, state) {
    state.isSubmitting = false;
    form.classList.remove(CONFIG.CLASSES.SUBMITTING);

    console.warn('Form submission error:', form);
  }

  /* ─────────────────────────────────────────────────────────────
       4. Modal Trigger System
    ────────────────────────────────────────────────────────────────*/

  /**
   * Trigger modal using Webflow interactions
   * @param {HTMLElement} triggerElement - Element with interaction
   * @param {Object} state - Form state
   */
  function triggerModal(triggerElement, state) {
    try {
      // Method 1: Try to trigger click event (most common)
      if (triggerElement.click) {
        triggerElement.click();
        console.log('Modal triggered via click:', triggerElement);
        return;
      }

      // Method 2: Dispatch click event
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      triggerElement.dispatchEvent(clickEvent);
      console.log('Modal triggered via event dispatch:', triggerElement);

    } catch (error) {
      console.warn('Failed to trigger modal:', error);
      
      // Fallback: Try to find and trigger any data-ix or ix2 interactions
      tryAlternativeModalTriggers(triggerElement);
    }
  }

  /**
   * Alternative modal trigger methods
   * @param {HTMLElement} triggerElement - Trigger element
   */
  function tryAlternativeModalTriggers(triggerElement) {
    // Look for Webflow IX attributes
    const ixAttr = triggerElement.getAttribute('data-ix');
    const ix2Attr = triggerElement.getAttribute('data-w-id');

    if (ixAttr && window.Webflow && window.Webflow.require) {
      try {
        const ix = window.Webflow.require('ix');
        if (ix && ix.run) {
          ix.run(ixAttr);
          console.log('Modal triggered via IX:', ixAttr);
          return;
        }
      } catch (e) {
        console.warn('IX trigger failed:', e);
      }
    }

    // Try IX2 if available
    if (ix2Attr && window.Webflow && window.Webflow.require) {
      try {
        const ix2 = window.Webflow.require('ix2');
        if (ix2) {
          // IX2 trigger logic would go here
          console.log('Attempting IX2 trigger:', ix2Attr);
        }
      } catch (e) {
        console.warn('IX2 trigger failed:', e);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
       5. Reset Functionality
    ────────────────────────────────────────────────────────────────*/

  /**
   * Setup manual reset button
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function setupResetButton(form, state) {
    state.resetButton.addEventListener('click', (event) => {
      event.preventDefault();
      resetForm(form, state);
    });
  }

  /**
   * Reset form to initial state
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function resetForm(form, state) {
    form.classList.add(CONFIG.CLASSES.RESETTING);

    // Reset form inputs (excluding specified fields)
    resetFormInputs(form, state.excludeFields);

    // Clear validation states if validation module is present
    clearValidationStates(form);

    // Clear form memory if memory module is present
    clearFormMemory(form);

    // Reset visual states
    form.classList.remove(CONFIG.CLASSES.SUCCESS, CONFIG.CLASSES.SUBMITTING);
    
    // Show form and hide success message (restore Webflow state)
    restoreWebflowFormState(form);

    // Reset form state
    state.hasSubmitted = false;
    state.isSubmitting = false;

    setTimeout(() => {
      form.classList.remove(CONFIG.CLASSES.RESETTING);
    }, 300);

    console.log('Form reset completed:', form);

    // Dispatch custom event
    form.dispatchEvent(new CustomEvent('form-reset-requested', {
      bubbles: true,
      detail: { form }
    }));
  }

  /**
   * Reset form inputs excluding specified fields
   * @param {HTMLFormElement} form - Form element
   * @param {string[]} excludeFields - Field names to exclude
   */
  function resetFormInputs(form, excludeFields) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Skip excluded fields
      if (excludeFields.includes(input.name)) {
        return;
      }

      // Skip certain input types
      if (['submit', 'button', 'hidden'].includes(input.type)) {
        return;
      }

      // Reset based on input type
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else if (input.tagName.toLowerCase() === 'select') {
        input.selectedIndex = 0;
      } else {
        input.value = '';
      }

      // Trigger input event for other modules to react
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  /**
   * Clear validation states if validation module is present
   * @param {HTMLFormElement} form - Form element
   */
  function clearValidationStates(form) {
    // Check if FormValidation module is available
    if (window.FormValidation) {
      try {
        // Clear validation classes
        const validationGroups = form.querySelectorAll('[data-validation-group]');
        validationGroups.forEach(group => {
          group.classList.remove(
            'validation-valid',
            'validation-invalid', 
            'validation-touched'
          );
          group.classList.add('validation-pristine');
        });

        // Clear validation messages
        const errorContainers = form.querySelectorAll('[data-error-container]');
        errorContainers.forEach(container => {
          container.textContent = '';
          container.classList.remove('validation-error');
        });

      } catch (error) {
        console.warn('Failed to clear validation states:', error);
      }
    }

    // Also clear legacy validation classes
    const legacyGroups = form.querySelectorAll('[data-field-validate]');
    legacyGroups.forEach(group => {
      group.classList.remove('live-filled', 'live-error');
    });
  }

  /**
   * Clear form memory if memory module is present
   * @param {HTMLFormElement} form - Form element
   */
  function clearFormMemory(form) {
    if (form._memory && form._memory.clearFormMemory) {
      try {
        form._memory.clearFormMemory();
      } catch (error) {
        console.warn('Failed to clear form memory:', error);
      }
    }
  }

  /**
   * Restore Webflow form state (show form, hide success)
   * @param {HTMLFormElement} form - Form element
   */
  function restoreWebflowFormState(form) {
    const formContainer = form.closest('.w-form');
    if (!formContainer) return;

    const successDiv = formContainer.querySelector('.w-form-done');
    const errorDiv = formContainer.querySelector('.w-form-fail');

    // Show form
    form.style.display = 'block';

    // Hide success/error messages
    if (successDiv) {
      successDiv.style.display = 'none';
    }
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  /* ─────────────────────────────────────────────────────────────
       6. Integration with Other Modules
    ────────────────────────────────────────────────────────────────*/

  /**
   * Check for integration with other form modules
   * @param {HTMLFormElement} form - Form element
   */
  function setupModuleIntegrations(form) {
    // Phone formatting integration
    if (window.PhoneFormat) {
      form.addEventListener('form-reset-requested', () => {
        // Re-initialize phone formatting after reset
        setTimeout(() => {
          window.PhoneFormat.init(form);
        }, 100);
      });
    }

    // Validation integration
    if (window.FormValidation) {
      form.addEventListener('form-reset-requested', () => {
        // Re-initialize validation after reset
        setTimeout(() => {
          window.FormValidation.init(form);
        }, 100);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
       7. Auto-initialization
    ────────────────────────────────────────────────────────────────*/

  /**
   * Initialize all forms with submit handling
   * @param {HTMLElement|Document} container - Container to search within
   */
  function initFormSubmit(container = document) {
    // Support both new and legacy selectors
    const newForms = container.querySelectorAll(CONFIG.SELECTORS.FORM);
    const legacyForms = container.querySelectorAll(CONFIG.SELECTORS.FORM_LEGACY);
    const allForms = [...newForms, ...legacyForms];
    
    // Remove duplicates
    const uniqueForms = [...new Set(allForms)];
    
    uniqueForms.forEach(form => {
      initializeForm(form);
      setupModuleIntegrations(form);
    });

    console.log(`Initialized ${uniqueForms.length} forms with submit handling`);
  }

  /**
   * Cleanup form when removed from DOM
   * @param {HTMLFormElement} form - Form element
   */
  function cleanupForm(form) {
    const state = FORM_STATES.get(form);
    if (state) {
      // Cleanup observer
      if (state.observer) {
        state.observer.disconnect();
      }
      
      // Remove from state tracking
      FORM_STATES.delete(form);
    }
  }

  /* ─────────────────────────────────────────────────────────────
       8. Public API
    ────────────────────────────────────────────────────────────────*/

  window.FormSubmit = {
    init: initFormSubmit,
    reset: (form) => {
      const state = FORM_STATES.get(form);
      if (state) {
        resetForm(form, state);
      }
    },
    config: CONFIG
  };

  /* ─────────────────────────────────────────────────────────────
       9. Auto-initialization
    ────────────────────────────────────────────────────────────────*/
  
  // Initialize on page load (Slater handles DOM ready)
  initFormSubmit();
  
  // Re-initialize when Webflow updates DOM
  if (typeof Webflow !== 'undefined' && Webflow.push) {
    Webflow.push(() => {
      initFormSubmit();
    });
  }
  
  // Observe for dynamically added forms
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // Handle added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && (node.matches(CONFIG.SELECTORS.FORM) || node.matches(CONFIG.SELECTORS.FORM_LEGACY))) {
            initializeForm(node);
            setupModuleIntegrations(node);
          } else if (node.querySelectorAll) {
            const newForms = node.querySelectorAll(CONFIG.SELECTORS.FORM);
            const legacyForms = node.querySelectorAll(CONFIG.SELECTORS.FORM_LEGACY);
            if (newForms.length > 0 || legacyForms.length > 0) {
              initFormSubmit(node);
            }
          }
        }
      });

      // Handle removed nodes
      mutation.removedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches && 
            (node.matches(CONFIG.SELECTORS.FORM) || node.matches(CONFIG.SELECTORS.FORM_LEGACY))) {
          cleanupForm(node);
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();