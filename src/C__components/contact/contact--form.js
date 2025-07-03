// ───────────────────────────────────────────────────────────────
// Contact: Form
// Live Validation & Modal Submission System
// ───────────────────────────────────────────────────────────────

(() => {
  "use strict";

  /* ─────────────────────────────────────────────────────────────
     1. Configuration & Constants
  ────────────────────────────────────────────────────────────────*/

  const CONFIG = {
    // CSS class names for validation states
    CLASSES: {
      FILLED: "is--filled", // Field has content
      SUCCESS: "is--success", // Field is valid
      ERROR: "is--error", // Field has validation error
      SUBMITTING: "form-submitting", // Form is being submitted
      FORM_SUCCESS: "form-success", // Form submitted successfully
    },

    // Timing configurations
    SPAM_THRESHOLD: 5000, // Minimum time before submission (5 seconds)

    // User-facing messages
    MESSAGES: {
      required: "This field is required",
      email: "Please enter a valid email address",
      minLength: "Too short",
      maxLength: "Too long",
      spamError: "Form submitted too quickly. Please try again.",
      submitError: "Something went wrong. Please try again.",
      submitSuccess: "Thank you! Your message has been sent.",
    },
  };

  /* ─────────────────────────────────────────────────────────────
     2. Modal Manager Class
     Handles success modal display with Motion.dev or instant show
  ────────────────────────────────────────────────────────────────*/

  class ModalManager {
    constructor() {
      this.activeModal = null;
      this.closeHandlers = new WeakMap(); // Store close handlers to prevent duplicates
    }

    /**
     * Show modal with animation or instant display
     * @param {string} modalSelector - CSS selector for the modal
     * @param {Function} onClose - Optional callback when modal closes
     */
    async show(modalSelector, onClose = null) {
      const modal = document.querySelector(modalSelector);
      if (!modal) return;

      this.activeModal = modal;
      this.onCloseCallback = onClose;

      // Check for Motion.dev library
      if (window.Motion && window.Motion.animate) {
        // Use Motion.dev for smooth animation
        modal.style.display = "flex";
        await window.Motion.animate(
          modal,
          {
            opacity: [0, 1],
            scale: [0.9, 1],
          },
          {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1], // Cubic bezier easing
          }
        ).finished;
      } else {
        // Instant show fallback
        modal.style.display = "flex";
        modal.style.opacity = "1";
      }

      // Attach close handlers
      this._attachCloseHandlers(modal);
    }

    /**
     * Hide modal with animation
     */
    async hide() {
      if (!this.activeModal) return;

      const modal = this.activeModal;

      // Animate out if Motion.dev is available
      if (window.Motion && window.Motion.animate) {
        await window.Motion.animate(
          modal,
          {
            opacity: [1, 0],
            scale: [1, 0.9],
          },
          {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }
        ).finished;
      }

      // Hide and cleanup
      modal.style.display = "none";
      this._removeCloseHandlers(modal);
      
      // Call the onClose callback if provided
      if (this.onCloseCallback) {
        this.onCloseCallback();
        this.onCloseCallback = null;
      }
      
      this.activeModal = null;
    }

    /**
     * Attach event handlers for closing the modal
     * @private
     */
    _attachCloseHandlers(modal) {
      // Close button handler
      const closeBtn = modal.querySelector("[data-modal-close]");
      if (closeBtn && !this.closeHandlers.has(closeBtn)) {
        const handler = () => this.hide();
        closeBtn.addEventListener("click", handler);
        this.closeHandlers.set(closeBtn, handler);
      }

      // Backdrop click handler
      if (!this.closeHandlers.has(modal)) {
        const handler = (e) => {
          if (e.target === modal) this.hide();
        };
        modal.addEventListener("click", handler);
        this.closeHandlers.set(modal, handler);
      }
    }

    /**
     * Remove event handlers from modal
     * @private
     */
    _removeCloseHandlers(modal) {
      // Remove close button handler
      const closeBtn = modal.querySelector("[data-modal-close]");
      if (closeBtn && this.closeHandlers.has(closeBtn)) {
        closeBtn.removeEventListener("click", this.closeHandlers.get(closeBtn));
        this.closeHandlers.delete(closeBtn);
      }

      // Remove backdrop handler
      if (this.closeHandlers.has(modal)) {
        modal.removeEventListener("click", this.closeHandlers.get(modal));
        this.closeHandlers.delete(modal);
      }
    }
  }

  // Create single modal manager instance
  const modalManager = new ModalManager();

  /* ─────────────────────────────────────────────────────────────
     3. Field Validation Functions
     Individual field validation logic
  ────────────────────────────────────────────────────────────────*/

  /**
   * Validate a single form field
   * @param {HTMLInputElement|HTMLTextAreaElement} field - Field to validate
   * @param {HTMLElement} parent - Parent element with data-validate
   * @returns {{isValid: boolean, message: string}} Validation result
   */
  function validateField(field, parent) {
    const value = field.value.trim();
    const minLength = parseInt(field.getAttribute("min") || "0") || 0;
    const maxLength = field.getAttribute("max") ? parseInt(field.getAttribute("max")) : Infinity;
    const type = field.getAttribute("type") || "text";
    const isRequired = field.hasAttribute("required");

    let isValid = true;
    let message = "";

    // Update filled state for CSS animations
    if (value !== "") {
      parent.classList.add(CONFIG.CLASSES.FILLED);
    } else {
      parent.classList.remove(CONFIG.CLASSES.FILLED);
    }

    // Check if field is required and empty
    if (isRequired && !value) {
      isValid = false;
      message = CONFIG.MESSAGES.required;
    }

    // Only validate further if field has content
    if (value && isValid) {
      // Min length validation
      if (minLength && value.length < minLength) {
        isValid = false;
        message = CONFIG.MESSAGES.minLength;
      }

      // Max length validation
      if (maxLength !== Infinity && value.length > maxLength) {
        isValid = false;
        message = CONFIG.MESSAGES.maxLength;
      }

      // Email format validation
      if (type === "email" && !/\S+@\S+\.\S+/.test(value)) {
        isValid = false;
        message = CONFIG.MESSAGES.email;
      }
    }

    // Apply validation CSS classes
    if (isValid) {
      parent.classList.remove(CONFIG.CLASSES.ERROR);
      parent.classList.add(CONFIG.CLASSES.SUCCESS);
    } else {
      parent.classList.remove(CONFIG.CLASSES.SUCCESS);
      parent.classList.add(CONFIG.CLASSES.ERROR);
    }

    return { isValid, message };
  }

  /* ─────────────────────────────────────────────────────────────
     4. Form Validator Class
     Main form validation and submission logic
     
     WEBFLOW INTEGRATION NOTES:
     - Hides Webflow's default .w-form-done and .w-form-fail messages
     - Manages Webflow form state classes (w--form-done, w--form-fail)
     - Properly resets form to prevent Webflow state conflicts
     - Compatible with Webflow's native form structure
  ────────────────────────────────────────────────────────────────*/

  class FormValidator {
    constructor(form) {
      this.form = form;
      this.fields = form.querySelectorAll(
        "[data-validate] input, [data-validate] textarea"
      );
      this.submitButtonDiv = form.querySelector("[data-submit]");
      this.submitInput = this.submitButtonDiv?.querySelector(
        'input[type="submit"]'
      );
      this.formLoadTime = Date.now(); // Track form load time for anti-spam
      this.isLiveValidating = false; // Track if live validation is active
      this.retryCount = 0; // Track submission retry attempts
      this.maxRetries = 3; // Maximum retry attempts

      this.init();
    }

    /**
     * Initialize form event handlers
     */
    init() {
      // Hide Webflow's default success/error messages
      this.hideWebflowMessages();

      // Handle custom submit button click
      if (this.submitButtonDiv) {
        this.submitButtonDiv.addEventListener("click", (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }

      // Handle Enter key submission (except in textareas)
      this.form.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
          this.handleSubmit();
        }
      });

      // Prevent default form submission
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    /**
     * Hide Webflow's default form messages to prevent conflicts
     */
    hideWebflowMessages() {
      // Find Webflow form wrapper - could be parent or ancestor
      const webflowForm = this.form.closest(".w-form") || 
                         this.form.parentElement?.closest(".w-form");
      
      if (webflowForm) {
        // Hide success message
        const successMsg = webflowForm.querySelector(".w-form-done");
        if (successMsg) {
          successMsg.style.display = "none";
        }

        // Hide error message
        const errorMsg = webflowForm.querySelector(".w-form-fail");
        if (errorMsg) {
          errorMsg.style.display = "none";
        }
      }
      
      // Also check if messages are siblings of the form
      const parentEl = this.form.parentElement;
      if (parentEl) {
        const siblingSuccess = parentEl.querySelector(".w-form-done");
        const siblingError = parentEl.querySelector(".w-form-fail");
        
        if (siblingSuccess) siblingSuccess.style.display = "none";
        if (siblingError) siblingError.style.display = "none";
      }
    }

    /**
     * Start live validation for a field after first submission attempt
     * @param {HTMLElement} field - Field to add live validation to
     */
    startLiveValidation(field) {
      if (!field._liveValidationStarted) {
        field._liveValidationStarted = true;
        field.addEventListener("input", () => {
          const parent = field.closest("[data-validate]");
          validateField(field, parent);
          // Update submit button state on input
          if (this.isLiveValidating) {
            this.updateSubmitButtonState();
          }
        });
      }
    }

    /**
     * Update submit button state based on validation
     * @param {boolean} forceEnable - Force enable the button
     */
    updateSubmitButtonState(forceEnable = false) {
      if (!this.submitInput) return;
      
      if (forceEnable) {
        this.submitInput.disabled = false;
        if (this.submitButtonDiv) {
          this.submitButtonDiv.classList.remove('submit-disabled');
        }
        return;
      }
      
      // Check if all required fields are valid
      let allValid = true;
      this.fields.forEach((field) => {
        if (field.hasAttribute('required')) {
          const parent = field.closest("[data-validate]");
          const result = validateField(field, parent);
          if (!result.isValid) {
            allValid = false;
          }
        }
      });
      
      // Update button state
      this.submitInput.disabled = !allValid;
      if (this.submitButtonDiv) {
        if (allValid) {
          this.submitButtonDiv.classList.remove('submit-disabled');
        } else {
          this.submitButtonDiv.classList.add('submit-disabled');
        }
      }
    }

    /**
     * Validate all form fields and start live validation
     * @returns {boolean} True if all fields are valid
     */
    validateAllAndStartLive() {
      let allValid = true;
      let firstInvalidField = null;

      // Validate each field
      this.fields.forEach((field) => {
        const parent = field.closest("[data-validate]");
        const result = validateField(field, parent);

        // Track first invalid field for focus
        if (!result.isValid && !firstInvalidField) {
          firstInvalidField = field;
        }

        if (!result.isValid) {
          allValid = false;
        }

        // Enable live validation for all fields
        this.startLiveValidation(field);
      });

      // Focus on first invalid field
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      this.isLiveValidating = true;
      
      // Update submit button state
      this.updateSubmitButtonState();
      
      return allValid;
    }

    /**
     * Check if form submission is potentially spam
     * @returns {boolean} True if submission is too quick
     */
    isSpam() {
      const timeDiff = Date.now() - this.formLoadTime;
      return timeDiff < CONFIG.SPAM_THRESHOLD;
    }

    /**
     * Handle form submission
     */
    async handleSubmit() {
      // Validate all fields first
      if (!this.validateAllAndStartLive()) {
        return;
      }

      // Check for spam submissions
      if (this.isSpam()) {
        alert(CONFIG.MESSAGES.spamError);
        return;
      }

      // Show loading state
      this.form.classList.add(CONFIG.CLASSES.SUBMITTING);
      if (this.submitButtonDiv) {
        this.submitButtonDiv.style.pointerEvents = "none";
      }

      // Ensure Webflow state is clean before submission
      this.resetWebflowState();

      try {
        // Get form action URL (supports multiple attributes)
        const formAction =
          this.form.getAttribute("action") ||
          this.form.getAttribute("data-formspark-url") ||
          this.form.getAttribute("data-form-action") ||
          "";

        if (!formAction) {
          throw new Error("No form action URL specified");
        }

        // Submit form data with retry logic
        await this.submitWithRetry(formAction);
        
      } catch (error) {
        console.error("Form submission error:", error);
        this.handleError(error);
      } finally {
        // Reset loading state
        this.form.classList.remove(CONFIG.CLASSES.SUBMITTING);
        if (this.submitButtonDiv) {
          this.submitButtonDiv.style.pointerEvents = "";
        }
      }
    }

    /**
     * Submit form with retry logic
     * @param {string} formAction - The form submission URL
     */
    async submitWithRetry(formAction) {
      const formData = new FormData(this.form);
      
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          const response = await fetch(formAction, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
          }

          // Reset retry count on success
          this.retryCount = 0;
          
          // Handle successful submission
          await this.handleSuccess();
          return;
          
        } catch (error) {
          this.retryCount = attempt + 1;
          
          // If it's the last attempt, throw the error
          if (attempt === this.maxRetries) {
            throw error;
          }
          
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          console.log(`Retry attempt ${attempt + 1} of ${this.maxRetries}`);
        }
      }
    }
    
    /**
     * Handle form submission errors
     * @param {Error} error - The error that occurred
     */
    handleError(error) {
      // Check if we have an error element to display the message
      const errorElement = this.form.querySelector('[data-form-error]') || 
                          this.form.parentElement.querySelector('[data-form-error]');
      
      if (errorElement) {
        errorElement.textContent = CONFIG.MESSAGES.submitError;
        errorElement.style.display = 'block';
        errorElement.classList.add('show');
        
        // Hide error after 5 seconds
        setTimeout(() => {
          errorElement.style.display = 'none';
          errorElement.classList.remove('show');
        }, 5000);
      } else {
        // Fallback to alert
        alert(CONFIG.MESSAGES.submitError);
      }
    }

    /**
     * Handle successful form submission
     */
    async handleSuccess() {
      // Add success class
      this.form.classList.add(CONFIG.CLASSES.FORM_SUCCESS);

      // Show success modal if configured
      const modalSelector = this.form.getAttribute("data-success-modal") || "";
      if (modalSelector) {
        // Pass callback to reset form when modal closes
        await modalManager.show(modalSelector, () => {
          this.resetForm();
        });
      } else {
        alert(CONFIG.MESSAGES.submitSuccess);
        // Reset form immediately if no modal
        this.resetForm();
      }
    }

    /**
     * Reset form and clear all validation states
     */
    resetForm() {
      // Reset form fields
      this.form.reset();

      // Clear all validation classes
      this.fields.forEach((field) => {
        const parent = field.closest("[data-validate]");
        parent.classList.remove(
          CONFIG.CLASSES.FILLED,
          CONFIG.CLASSES.SUCCESS,
          CONFIG.CLASSES.ERROR
        );
      });

      // Remove form success class
      this.form.classList.remove(CONFIG.CLASSES.FORM_SUCCESS);

      // Reset live validation flag
      this.isLiveValidating = false;

      // Clear live validation handlers
      this.fields.forEach((field) => {
        field._liveValidationStarted = false;
      });

      // Reset Webflow form state
      this.resetWebflowState();
      
      // Update submit button state
      this.updateSubmitButtonState(true);
    }

    /**
     * Reset Webflow's form state to prevent glitches
     */
    resetWebflowState() {
      // Find Webflow form wrapper - check multiple possible locations
      const webflowForm = this.form.closest(".w-form") || 
                         this.form.parentElement?.closest(".w-form");
      
      if (webflowForm) {
        // Ensure Webflow messages stay hidden
        const successMsg = webflowForm.querySelector(".w-form-done");
        const errorMsg = webflowForm.querySelector(".w-form-fail");

        if (successMsg) successMsg.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";

        // Remove any Webflow state classes
        webflowForm.classList.remove("w--form-done", "w--form-fail");
      }

      // Also handle sibling messages
      const parentEl = this.form.parentElement;
      if (parentEl) {
        const siblingSuccess = parentEl.querySelector(".w-form-done");
        const siblingError = parentEl.querySelector(".w-form-fail");
        
        if (siblingSuccess) siblingSuccess.style.display = "none";
        if (siblingError) siblingError.style.display = "none";
        
        // Remove state classes from parent if it has them
        parentEl.classList.remove("w--form-done", "w--form-fail");
      }

      // Trigger Webflow's form reset if available
      if (window.Webflow && typeof window.Webflow.reset === 'function') {
        try {
          window.Webflow.reset(this.form);
        } catch (e) {
          // Fail silently if Webflow reset doesn't work
          console.log('Webflow reset not available');
        }
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. Auto-initialization
     Find and initialize all forms on page load
  ────────────────────────────────────────────────────────────────*/

  function initForms() {
    // Find all forms with validation attribute
    const forms = document.querySelectorAll("[data-form-validate]");

    forms.forEach((form) => {
      // Skip if already initialized
      if (!form._validatorInitialized) {
        form._validatorInitialized = true;
        new FormValidator(form);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. Initialize on Load
     Support both Slater and Webflow environments
  ────────────────────────────────────────────────────────────────*/

  // Initialize immediately (Slater auto-loads)
  initForms();

  // Also support Webflow's deferred loading
  if (window.Webflow) {
    window.Webflow.push(initForms);
  }

  /* ─────────────────────────────────────────────────────────────
     7. Public API
     Export for manual initialization and access
  ────────────────────────────────────────────────────────────────*/

  window.ContactFormValidator = {
    init: initForms, // Manual initialization
    FormValidator, // Access to validator class
    modalManager, // Access to modal manager
    validateField, // Expose validation function
    CONFIG, // Access to configuration
  };
})();
