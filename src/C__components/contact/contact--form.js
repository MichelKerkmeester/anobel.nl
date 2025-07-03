// ───────────────────────────────────────────────────────────────
// Contact: Form
// Live Validation & Modal Submission System
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';
  
  /* ─────────────────────────────────────────────────────────────
     1. Configuration & Constants
  ────────────────────────────────────────────────────────────────*/
  
  const CONFIG = {
    // CSS class names for validation states
    CLASSES: {
      FILLED: 'is--filled',      // Field has content
      SUCCESS: 'is--success',    // Field is valid
      ERROR: 'is--error',        // Field has validation error
      SUBMITTING: 'form-submitting',  // Form is being submitted
      FORM_SUCCESS: 'form-success'    // Form submitted successfully
    },
    
    // Timing configurations
    SPAM_THRESHOLD: 5000, // Minimum time before submission (5 seconds)
    
    // User-facing messages
    MESSAGES: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minLength: 'Too short',
      maxLength: 'Too long',
      spamError: 'Form submitted too quickly. Please try again.',
      submitError: 'Something went wrong. Please try again.',
      submitSuccess: 'Thank you! Your message has been sent.'
    }
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
     */
    async show(modalSelector) {
      const modal = document.querySelector(modalSelector);
      if (!modal) return;
      
      this.activeModal = modal;
      
      // Check for Motion.dev library
      if (window.Motion && window.Motion.animate) {
        // Use Motion.dev for smooth animation
        modal.style.display = 'flex';
        await window.Motion.animate(modal, {
          opacity: [0, 1],
          scale: [0.9, 1]
        }, {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] // Cubic bezier easing
        }).finished;
      } else {
        // Instant show fallback
        modal.style.display = 'flex';
        modal.style.opacity = '1';
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
        await window.Motion.animate(modal, {
          opacity: [1, 0],
          scale: [1, 0.9]
        }, {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }).finished;
      }
      
      // Hide and cleanup
      modal.style.display = 'none';
      this._removeCloseHandlers(modal);
      this.activeModal = null;
    }
    
    /**
     * Attach event handlers for closing the modal
     * @private
     */
    _attachCloseHandlers(modal) {
      // Close button handler
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn && !this.closeHandlers.has(closeBtn)) {
        const handler = () => this.hide();
        closeBtn.addEventListener('click', handler);
        this.closeHandlers.set(closeBtn, handler);
      }
      
      // Backdrop click handler
      if (!this.closeHandlers.has(modal)) {
        const handler = (e) => {
          if (e.target === modal) this.hide();
        };
        modal.addEventListener('click', handler);
        this.closeHandlers.set(modal, handler);
      }
    }
    
    /**
     * Remove event handlers from modal
     * @private
     */
    _removeCloseHandlers(modal) {
      // Remove close button handler
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn && this.closeHandlers.has(closeBtn)) {
        closeBtn.removeEventListener('click', this.closeHandlers.get(closeBtn));
        this.closeHandlers.delete(closeBtn);
      }
      
      // Remove backdrop handler
      if (this.closeHandlers.has(modal)) {
        modal.removeEventListener('click', this.closeHandlers.get(modal));
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
    const minLength = parseInt(field.getAttribute('min')) || 0;
    const maxLength = parseInt(field.getAttribute('max')) || Infinity;
    const type = field.getAttribute('type');
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let message = '';
    
    // Update filled state for CSS animations
    if (value !== '') {
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
      if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
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
  ────────────────────────────────────────────────────────────────*/
  
  class FormValidator {
    constructor(form) {
      this.form = form;
      this.fields = form.querySelectorAll('[data-validate] input, [data-validate] textarea');
      this.submitButtonDiv = form.querySelector('[data-submit]');
      this.submitInput = this.submitButtonDiv?.querySelector('input[type="submit"]');
      this.formLoadTime = Date.now(); // Track form load time for anti-spam
      this.isLiveValidating = false;  // Track if live validation is active
      
      this.init();
    }
    
    /**
     * Initialize form event handlers
     */
    init() {
      // Handle custom submit button click
      if (this.submitButtonDiv) {
        this.submitButtonDiv.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }
      
      // Handle Enter key submission (except in textareas)
      this.form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.handleSubmit();
        }
      });
      
      // Prevent default form submission
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
    
    /**
     * Start live validation for a field after first submission attempt
     * @param {HTMLElement} field - Field to add live validation to
     */
    startLiveValidation(field) {
      if (!field._liveValidationStarted) {
        field._liveValidationStarted = true;
        field.addEventListener('input', () => {
          const parent = field.closest('[data-validate]');
          validateField(field, parent);
        });
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
      this.fields.forEach(field => {
        const parent = field.closest('[data-validate]');
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
        this.submitButtonDiv.style.pointerEvents = 'none';
      }
      
      try {
        // Get form action URL (supports multiple attributes)
        const formAction = this.form.getAttribute('action') || 
                          this.form.getAttribute('data-formspark-url') ||
                          this.form.getAttribute('data-form-action');
        
        if (!formAction) {
          throw new Error('No form action URL specified');
        }
        
        // Submit form data
        const formData = new FormData(this.form);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Submission failed: ${response.status}`);
        }
        
        // Handle successful submission
        this.handleSuccess();
        
      } catch (error) {
        console.error('Form submission error:', error);
        alert(CONFIG.MESSAGES.submitError);
      } finally {
        // Reset loading state
        this.form.classList.remove(CONFIG.CLASSES.SUBMITTING);
        if (this.submitButtonDiv) {
          this.submitButtonDiv.style.pointerEvents = '';
        }
      }
    }
    
    /**
     * Handle successful form submission
     */
    async handleSuccess() {
      // Add success class
      this.form.classList.add(CONFIG.CLASSES.FORM_SUCCESS);
      
      // Show success modal if configured
      const modalSelector = this.form.getAttribute('data-success-modal');
      if (modalSelector) {
        await modalManager.show(modalSelector);
      } else {
        alert(CONFIG.MESSAGES.submitSuccess);
      }
      
      // Reset form and validation states
      this.resetForm();
    }
    
    /**
     * Reset form and clear all validation states
     */
    resetForm() {
      // Reset form fields
      this.form.reset();
      
      // Clear all validation classes
      this.fields.forEach(field => {
        const parent = field.closest('[data-validate]');
        parent.classList.remove(
          CONFIG.CLASSES.FILLED, 
          CONFIG.CLASSES.SUCCESS, 
          CONFIG.CLASSES.ERROR
        );
      });
      
      // Reset live validation flag
      this.isLiveValidating = false;
      
      // Clear live validation handlers
      this.fields.forEach(field => {
        field._liveValidationStarted = false;
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. Auto-initialization
     Find and initialize all forms on page load
  ────────────────────────────────────────────────────────────────*/
  
  function initForms() {
    // Find all forms with validation attribute
    const forms = document.querySelectorAll('[data-form-validate]');
    
    forms.forEach(form => {
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
    init: initForms,          // Manual initialization
    FormValidator,            // Access to validator class
    modalManager,             // Access to modal manager
    validateField,            // Expose validation function
    CONFIG                    // Access to configuration
  };
  
})();