// ───────────────────────────────────────────────────────────────
// Contact
// Unified Form Submission & Post-Action Handler
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   UNIFIED SUBMISSION FEATURES:
   
   - Formspark & Botpoison integration for secure submission
   - Modal popup triggers after successful submission
   - Form reset with excluded fields support
   - Delayed actions with configurable timing
   - Loading states and user feedback
   - Webflow interaction integration
   - Manual reset button support
   - Graceful error handling and cleanup
────────────────────────────────────────────────────────────────*/

/* ─────────────────────────────────────────────────────────────
     1. Configuration & Constants
  ────────────────────────────────────────────────────────────────*/

// API configuration - will be read from data attributes
let FORMSPARK_ACTION_URL = null;
let BOTPOISON_PUBLIC_KEY = null;

const SUBMISSION_CONFIG = {
    // Form selectors (unified from both modules)
    SELECTORS: {
      // Primary containers
      FORM_CONTAINER: "[data-live-validate]",
      FORM: "form",
      
      // Submit elements
      SUBMIT_BUTTON: 'input[type="submit"], [type="submit"], [data-form-submit]',
      
      // Post-submission elements
      FORM_SUBMIT: '[data-submit-form]',
      IX_TRIGGER: '[data-submit-trigger]',
      RESET_BUTTON: '[data-submit-reset]',
      SUBMIT_BUTTON_CUSTOM: '[data-submit-button]',
    },
    
    // Data attributes (unified)
    ATTRIBUTES: {
      // Post-submission behavior
      AUTO_RESET: 'data-submit-auto-reset',
      DELAY: 'data-submit-delay',
      EXCLUDE: 'data-submit-exclude',
      REDIRECT: 'data-submit-redirect',
      RELOAD: 'data-submit-reload',
      DISABLE: 'data-submit-disable',
      
      // Setup attributes
      FORM_CONTAINER: 'data-live-validate',
      SHOULD_RESET: 'data-should-reset',
      FORM_RESET: 'data-form-reset',
      FORMSPARK_HANDLED: 'data-formspark-handled'
    },
    
    // Default timing and settings
    DEFAULT_DELAY: 1000,
    BOTPOISON_TIMEOUT: 10000,
    MAX_VALUE_LENGTH: 10000,
    
    // CSS classes for state management
    CLASSES: {
      SUBMITTING: 'form-submitting',
      SUCCESS: 'form-success',
      RESETTING: 'form-resetting'
    }
  };

  // Form state tracking (unified)
  const FORM_STATES = new WeakMap();

  /**
   * Read API configuration from form data attributes
   * @param {HTMLFormElement} form - Form element
   */
  function readAPIConfig(form) {
    // Read Formspark URL from data attribute
    const formsparkUrl = form.getAttribute('data-formspark-url');
    if (formsparkUrl) {
      FORMSPARK_ACTION_URL = formsparkUrl;
    }
    
    // Read Botpoison key from data attribute
    const botpoisonKey = form.getAttribute('data-botpoison-key');
    if (botpoisonKey) {
      BOTPOISON_PUBLIC_KEY = botpoisonKey;
    }
    
    // Warn if API keys are missing
    if (!FORMSPARK_ACTION_URL || !BOTPOISON_PUBLIC_KEY) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn('Missing API configuration. Add data-formspark-url and data-botpoison-key to your form.');
    }
  }

  /* ─────────────────────────────────────────────────────────────
       2. Botpoison Integration
    ────────────────────────────────────────────────────────────────*/

  // Load Botpoison script dynamically
  function loadBotpoison() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Botpoison) {
        resolve(window.Botpoison);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@botpoison/browser@1.0.0";
      script.async = true;

      script.onload = () => {
        if (window.Botpoison) {
          resolve(window.Botpoison);
        } else {
          reject(new Error("Botpoison failed to load"));
        }
      };

      script.onerror = () =>
        reject(new Error("Failed to load Botpoison script"));

      document.head.appendChild(script);
    });
  }

  // Get Botpoison challenge solution with timeout
  async function getBotpoisonSolution() {
    try {
      // Skip Botpoison if no key is configured
      if (!BOTPOISON_PUBLIC_KEY) {
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.warn('Botpoison key not configured. Proceeding without bot protection.');
        return null;
      }
      
      const Botpoison = await loadBotpoison();

      // Add timeout for challenge
      const challengePromise = Botpoison.challenge(BOTPOISON_PUBLIC_KEY);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Botpoison timeout")), SUBMISSION_CONFIG.BOTPOISON_TIMEOUT)
      );

      const result = await Promise.race([
        challengePromise,
        timeoutPromise,
      ]);
      
      // Ensure we have a valid solution object
      if (!result || typeof result !== 'object' || !result.solution) {
        throw new Error('Invalid Botpoison response');
      }
      
      const { solution } = result;
      return solution;
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn("Botpoison challenge failed:", error);
      return null; // Continue without Botpoison if it fails
    }
  }

  /* ─────────────────────────────────────────────────────────────
       3. Form Data Processing
    ────────────────────────────────────────────────────────────────*/

  // Extract form data and prepare for submission
  function prepareFormData(form) {
    const formData = new FormData(form);
    const data = {};

    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes, multi-select)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Add timestamp for tracking
    data._timestamp = new Date().toISOString();

    // Add page information for context (sanitized)
    const url = new URL(window.location.href);
    data._page_url = `${url.origin}${url.pathname}`; // Remove query params and hash
    data._page_title = document.title.slice(0, 200); // Limit title length
    data._user_agent = navigator.userAgent.slice(0, 500); // Limit UA length

    return data;
  }

  /* ─────────────────────────────────────────────────────────────
       4. Formspark Submission
    ────────────────────────────────────────────────────────────────*/

  // Submit form data to Formspark
  async function submitToFormspark(formData, botpoisonSolution) {
    // Add Botpoison solution if available
    if (botpoisonSolution) {
      formData._botpoison = botpoisonSolution;
    }

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.error("Formspark submission failed:", error);
      return { success: false, error: error.message };
    }
  }

  /* ─────────────────────────────────────────────────────────────
       5. UI State Management
    ────────────────────────────────────────────────────────────────*/

  // Show loading state
  function showLoadingState(form, submitButton) {
    submitButton.disabled = true;
    
    // Handle different types of submit elements
    if (submitButton.tagName.toLowerCase() === 'input') {
      submitButton.value = "Sending...";
    } else {
      // For custom elements (div, button, etc.)
      submitButton.textContent = "Sending...";
    }
    
    form.style.opacity = "0.7";
    form.style.pointerEvents = "none";
    form.classList.add(SUBMISSION_CONFIG.CLASSES.SUBMITTING);
  }

  // Hide loading state
  function hideLoadingState(form, submitButton, originalButtonText) {
    submitButton.disabled = false;
    
    // Handle different types of submit elements
    if (submitButton.tagName.toLowerCase() === 'input') {
      submitButton.value = originalButtonText;
    } else {
      // For custom elements (div, button, etc.)
      submitButton.textContent = originalButtonText;
    }
    
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
    form.classList.remove(SUBMISSION_CONFIG.CLASSES.SUBMITTING);
  }

  // Show success message
  function showSuccessMessage(form) {
    // Check if form should reset after success
    const shouldReset = form.dataset.shouldReset === 'true';
    
    if (shouldReset) {
      // Prevent Webflow from hiding the form
      const formContainer = form.closest('.w-form');
      if (formContainer) {
        formContainer.style.display = 'block';
        form.style.display = 'block';
      }
      
      // Show success message while keeping form visible
      const successDiv = form.parentNode.querySelector(".contact--form-success");
      if (successDiv) {
        successDiv.style.display = "block";
        // Hide success message after 5 seconds
        setTimeout(() => {
          successDiv.style.display = "none";
        }, 5000);
      } else {
        // Create temporary success message above the form
        const successMsg = document.createElement("div");
        successMsg.className = "contact--form-success-temp";
        successMsg.style.cssText = "padding: 1rem; background: #10b981; color: white; border-radius: 8px; margin: 0 0 1rem 0; text-align: center;";
        
        // Create paragraph element safely
        const paragraph = document.createElement("p");
        paragraph.style.margin = "0";
        paragraph.textContent = "✅ Message sent successfully! Feel free to send another message.";
        successMsg.appendChild(paragraph);
        
        form.parentNode.insertBefore(successMsg, form.parentNode.firstChild);
        // Remove after 5 seconds
        setTimeout(() => {
          if (successMsg.parentNode) {
            successMsg.remove();
          }
        }, 5000);
      }
      
      // Trigger form reset via custom event (after brief delay)
      setTimeout(() => {
        form.dispatchEvent(new CustomEvent('form-reset-requested'));
        
        // Double-check form visibility after reset
        setTimeout(() => {
          const formContainer = form.closest('.w-form');
          if (formContainer) {
            formContainer.style.display = 'block';
            form.style.display = 'block';
          }
        }, 100);
      }, 1000);
      
    } else {
      // Hide the form and show success state
      form.style.display = "none";
      
      const successDiv = form.parentNode.querySelector(".contact--form-success");
      if (successDiv) {
        successDiv.style.display = "block";
      } else {
        // Fallback: check for Webflow default
        const webflowSuccess = form.parentNode.querySelector(".w-form-done");
        if (webflowSuccess) {
          webflowSuccess.style.display = "block";
        } else {
          // Create fallback success message
          const successMsg = document.createElement("div");
          successMsg.className = "contact--form-success";
          
          // Create elements safely
          const heading = document.createElement("h3");
          heading.textContent = "Thank you!";
          successMsg.appendChild(heading);
          
          const paragraph = document.createElement("p");
          paragraph.textContent = "Your message has been sent successfully. We'll get back to you soon.";
          successMsg.appendChild(paragraph);
          
          form.parentNode.appendChild(successMsg);
        }
      }
    }
  }

  // Show error message
  function showErrorMessage(form, errorMessage) {
    // Show custom error state
    const errorDiv = form.parentNode.querySelector(".contact--form-error");
    if (errorDiv) {
      errorDiv.style.display = "block";
      // Update error message if element exists
      const errorText = errorDiv.querySelector(".contact--form-error-message");
      if (errorText) {
        errorText.textContent =
          errorMessage || "Something went wrong. Please try again.";
      }
    } else {
      // Fallback: check for Webflow default
      const webflowError = form.parentNode.querySelector(".w-form-fail");
      if (webflowError) {
        webflowError.style.display = "block";
        const errorText = webflowError.querySelector(".w-form-fail-message");
        if (errorText) {
          errorText.textContent =
            errorMessage || "Something went wrong. Please try again.";
        }
      } else {
        // Fallback: show alert
        alert(errorMessage || "Something went wrong. Please try again.");
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
       6. Post-Submission Actions (Modal, Reset, Redirect)
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
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.log('Modal triggered via click:', triggerElement);
        return;
      }

      // Method 2: Dispatch click event
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      triggerElement.dispatchEvent(clickEvent);
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.log('Modal triggered via event dispatch:', triggerElement);

    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn('Failed to trigger modal:', error);
      
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
          const logger = window.ContactFormCoordinator?.Logger || console;
          logger.log('Modal triggered via IX:', ixAttr);
          return;
        }
      } catch (e) {
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.warn('IX trigger failed:', e);
      }
    }

    // Try IX2 if available
    if (ix2Attr && window.Webflow && window.Webflow.require) {
      try {
        const ix2 = window.Webflow.require('ix2');
        if (ix2) {
          // IX2 trigger logic would go here
          const logger = window.ContactFormCoordinator?.Logger || console;
          logger.log('Attempting IX2 trigger:', ix2Attr);
        }
      } catch (e) {
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.warn('IX2 trigger failed:', e);
      }
    }
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
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.warn('Failed to clear validation states:', error);
      }
    }

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
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.warn('Failed to clear form memory:', error);
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

  /**
   * Reset form to initial state
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function resetForm(form, state) {
    form.classList.add(SUBMISSION_CONFIG.CLASSES.RESETTING);

    // Reset form inputs (excluding specified fields)
    resetFormInputs(form, state.excludeFields);

    // Clear validation states if validation module is present
    clearValidationStates(form);

    // Clear form memory if memory module is present
    clearFormMemory(form);

    // Reset visual states
    form.classList.remove(SUBMISSION_CONFIG.CLASSES.SUCCESS, SUBMISSION_CONFIG.CLASSES.SUBMITTING);
    
    // Show form and hide success message (restore Webflow state)
    restoreWebflowFormState(form);

    // Reset form state
    state.hasSubmitted = false;
    state.isSubmitting = false;

    setTimeout(() => {
      form.classList.remove(SUBMISSION_CONFIG.CLASSES.RESETTING);
    }, 300);

    const logger = window.ContactFormCoordinator?.Logger || console;
    logger.log('Form reset completed:', form);

    // Dispatch custom event
    form.dispatchEvent(new CustomEvent('form-reset-requested', {
      bubbles: true,
      detail: { form }
    }));
  }

  /* ─────────────────────────────────────────────────────────────
       7. Main Submission Handler
    ────────────────────────────────────────────────────────────────*/

  // Handle form submission with Formspark & post-actions
  async function handleFormSubmission(event, form, submitButton, originalAction) {
    event.preventDefault(); // Prevent default Webflow submission

    const state = FORM_STATES.get(form);
    
    // Get original button text from the right property
    const originalButtonText = submitButton.tagName.toLowerCase() === 'input' 
      ? submitButton.value 
      : submitButton.textContent;

    try {
      // Validate API configuration before proceeding
      if (!FORMSPARK_ACTION_URL) {
        throw new Error('Formspark URL not configured. Add data-formspark-url attribute to your form.');
      }
      
      // 1. Show loading state
      showLoadingState(form, submitButton);

      // 2. Prepare form data
      const formData = prepareFormData(form);

      // 3. Get Botpoison solution (in parallel with UI updates)
      const botpoisonSolution = await getBotpoisonSolution();

      // 4. Submit to Formspark
      const result = await submitToFormspark(formData, botpoisonSolution);

      // 5. Handle response
      if (result.success) {
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.log("Form submitted successfully:", result.data);
        
        // Hide loading state before showing success message
        hideLoadingState(form, submitButton, originalButtonText);
        
        // Handle success actions
        handleSubmissionSuccess(form, state);

        // Optional: Track success with analytics
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: "Success",
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.error("Form submission failed:", error);

      // Fallback: try Webflow's original form action
      if (originalAction && originalAction !== window.location.href) {
        const logger = window.ContactFormCoordinator?.Logger || console;
        logger.log("Attempting Webflow fallback submission...");
        try {
          form.action = originalAction;
          form.method = "POST";
          hideLoadingState(form, submitButton, originalButtonText);
          form.submit(); // Let Webflow handle it
          return;
        } catch (fallbackError) {
          const logger = window.ContactFormCoordinator?.Logger || console;
          logger.error("Webflow fallback also failed:", fallbackError);
        }
      }

      hideLoadingState(form, submitButton, originalButtonText);
      showErrorMessage(
        form,
        "Form submission failed. Please try again or contact us directly."
      );

      // Optional: Track error with analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "form_error", {
          event_category: "Contact",
          event_label: error.message,
        });
      }
    }
  }

  /**
   * Handle successful form submission (post-submission actions)
   * @param {HTMLFormElement} form - Form element
   * @param {Object} state - Form state
   */
  function handleSubmissionSuccess(form, state) {
    if (state.hasSubmitted) return; // Prevent duplicate handling

    state.hasSubmitted = true;
    state.isSubmitting = false;
    
    form.classList.remove(SUBMISSION_CONFIG.CLASSES.SUBMITTING);
    form.classList.add(SUBMISSION_CONFIG.CLASSES.SUCCESS);

    // Show success message
    showSuccessMessage(form);

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

  /* ─────────────────────────────────────────────────────────────
       8. Form Detection & Initialization
    ────────────────────────────────────────────────────────────────*/

  /**
   * Initialize a form with unified submission handling
   * @param {HTMLFormElement} form - Form to initialize
   */
  function initializeForm(form) {
    // Skip if already initialized or disabled
    if (FORM_STATES.has(form) || 
        form.hasAttribute(SUBMISSION_CONFIG.ATTRIBUTES.DISABLE)) {
      return;
    }

    // Read API configuration from data attributes
    readAPIConfig(form);

    // Find submit button
    const submitButton = form.querySelector(SUBMISSION_CONFIG.SELECTORS.SUBMIT_BUTTON);
    if (!submitButton) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn("Contact form or submit button not found in:", form);
      return;
    }

    // Initialize form state
    const state = {
      isSubmitting: false,
      hasSubmitted: false,
      ixTrigger: form.querySelector(SUBMISSION_CONFIG.SELECTORS.IX_TRIGGER),
      resetButton: form.querySelector(SUBMISSION_CONFIG.SELECTORS.RESET_BUTTON),
      delay: parseInt(form.getAttribute(SUBMISSION_CONFIG.ATTRIBUTES.DELAY)) || SUBMISSION_CONFIG.DEFAULT_DELAY,
      autoReset: form.hasAttribute(SUBMISSION_CONFIG.ATTRIBUTES.AUTO_RESET),
      excludeFields: parseExcludeFields(form.getAttribute(SUBMISSION_CONFIG.ATTRIBUTES.EXCLUDE)),
      redirectUrl: form.getAttribute(SUBMISSION_CONFIG.ATTRIBUTES.REDIRECT),
      shouldReload: form.hasAttribute(SUBMISSION_CONFIG.ATTRIBUTES.RELOAD)
    };

    FORM_STATES.set(form, state);

    // Store original action for fallback
    const originalAction = form.action;

    // Store submit handler to avoid infinite loops
    let isSubmitting = false;

    // Use coordinator's submit handler if available
    if (window.ContactFormCoordinator) {
      window.ContactFormCoordinator.on('coordinator:pre-submit', (event) => {
        if (event.detail.form === form) {
          if (isSubmitting) return; // Prevent infinite loops
          isSubmitting = true;
          
          handleFormSubmission(event.detail.originalEvent, form, submitButton, originalAction).finally(
            () => {
              isSubmitting = false;
            }
          );
        }
      });
    } else {
      // Fallback: Override form submission with loop protection
      form.addEventListener("submit", (event) => {
        if (isSubmitting) return; // Prevent infinite loops
        isSubmitting = true;

        handleFormSubmission(event, form, submitButton, originalAction).finally(
          () => {
            isSubmitting = false;
          }
        );
      });
    }
    
    // Handle custom submit elements that might not trigger form submit event
    if (submitButton && submitButton.tagName.toLowerCase() !== 'input') {
      // Mark as handled by Formspark to prevent conflicts with validation script
      submitButton.setAttribute(SUBMISSION_CONFIG.ATTRIBUTES.FORMSPARK_HANDLED, 'true');
      
      submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        
        // Trigger form submission
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      });
    }
    
    // Setup manual reset button if present
    if (state.resetButton) {
      state.resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        resetForm(form, state);
      });
    }
    
    // Store reset preference for use by logic script  
    if (submitButton && submitButton.hasAttribute(SUBMISSION_CONFIG.ATTRIBUTES.FORM_RESET)) {
      form.dataset.shouldReset = "true";
    }

    // Listen for Webflow's success/error events
    form.addEventListener('webflow-success', () => {
      handleSubmissionSuccess(form, state);
    });

    form.addEventListener('webflow-error', () => {
      state.isSubmitting = false;
      form.classList.remove(SUBMISSION_CONFIG.CLASSES.SUBMITTING);
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn('Form submission error:', form);
    });

    const logger = window.ContactFormCoordinator?.Logger || console;
    logger.log("Unified submission handler initialized for form:", form);
  }

  /**
   * Initialize all forms with submission handling
   * @param {HTMLElement|Document} container - Container to search within
   */
  function initFormSubmission(container = document) {
    // Find all forms with live validation (main trigger)
    const formContainers = container.querySelectorAll(SUBMISSION_CONFIG.SELECTORS.FORM_CONTAINER);

    formContainers.forEach((formContainer) => {
      const form = formContainer.querySelector(SUBMISSION_CONFIG.SELECTORS.FORM);
      if (form && !FORM_STATES.has(form)) {
        initializeForm(form);
      }
    });
  }

  /**
   * Cleanup form when removed from DOM
   * @param {HTMLFormElement} form - Form element
   */
  function cleanupForm(form) {
    const state = FORM_STATES.get(form);
    if (state) {
      // Remove from state tracking
      FORM_STATES.delete(form);
    }
  }

  /* ─────────────────────────────────────────────────────────────
       9. Module Interface for Coordinator
    ────────────────────────────────────────────────────────────────*/
  
  const SubmissionModule = {
    name: 'submission',
    
    init: function(container = document) {
      initFormSubmission(container);
    },
    
    initForm: function(form) {
      // Check if form should have submission handling
      const formContainer = form.closest(SUBMISSION_CONFIG.SELECTORS.FORM_CONTAINER);
      if (formContainer && !FORM_STATES.has(form)) {
        initializeForm(form);
      }
    },
    
    cleanupForm: function(form) {
      cleanupForm(form);
    }
  };

  /* ─────────────────────────────────────────────────────────────
       10. Public API
    ────────────────────────────────────────────────────────────────*/

  window.FormSubmission = {
    init: initFormSubmission,
    reset: (form) => {
      const state = FORM_STATES.get(form);
      if (state) {
        resetForm(form, state);
      }
    },
    config: SUBMISSION_CONFIG
  };


  /* ─────────────────────────────────────────────────────────────
       11. Auto-initialization
    ────────────────────────────────────────────────────────────────*/
  
// Add initialization guard
if (!window.__ContactFormSubmissionInitialized) {
  window.__ContactFormSubmissionInitialized = true;
  
  try {
    // Register with coordinator
    if (window.ContactFormCoordinator) {
      window.ContactFormCoordinator.register('submission', SubmissionModule);
    } else {
      // Fallback if coordinator not available
      initFormSubmission();
    }
  } catch (error) {
    console.error('[Contact Form Submission] Initialization failed:', error);
  }
}