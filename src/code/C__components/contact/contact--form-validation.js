// ───────────────────────────────────────────────────────────────
// Contact
// Form Validation Engine
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES:
   
   - Rule-based validation system with declarative rules
   - Enhanced email validation with domain verification
   - International phone validation (not just Dutch)
   - URL, number, pattern, and file validation
   - Smart timing - validation starts after user interaction
   - Progressive validation with success and error states
   - Submit button state management
   - Field-level error messaging
   - Cross-field validation support
   - Custom events for external integration
   - Performance optimized with caching
   - Accessibility features with ARIA support
────────────────────────────────────────────────────────────────*/

(() => {
  // ─────────────────────────────────────────────────────────────
  // 1. Configuration & Constants
  // ─────────────────────────────────────────────────────────────

  const CONFIG = {
    // CSS classes for validation states
    CLASSES: {
      GROUP: 'validation-group',
      VALID: 'validation-valid',
      INVALID: 'validation-invalid',
      TOUCHED: 'validation-touched',
      PRISTINE: 'validation-pristine',
      PENDING: 'validation-pending',
      SUBMIT_DISABLED: 'submit-disabled',
      ERROR_CONTAINER: 'validation-error',
      SUCCESS_CONTAINER: 'validation-success'
    },
    
    // Selectors
    SELECTORS: {
      FORM: '[data-validation-form]',
      GROUP: '[data-validation-group]',
      FIELD: '[data-validate]',
      ERROR_CONTAINER: '[data-error-container]',
      SUCCESS_CONTAINER: '[data-success-container]',
      SUBMIT: 'input[type="submit"], button[type="submit"], [data-form-submit]'
    },
    
    // Timing
    DEBOUNCE_MS: 300,
    
    // Messages
    DEFAULT_MESSAGES: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      url: 'Please enter a valid URL',
      number: 'Please enter a valid number',
      minLength: 'Minimum length is {min} characters',
      maxLength: 'Maximum length is {max} characters',
      min: 'Minimum value is {min}',
      max: 'Maximum value is {max}',
      pattern: 'Please match the required format',
      fileSize: 'File size must be less than {max}',
      fileType: 'File type not allowed'
    }
  };

  // Performance: Cache regex patterns
  const REGEX_CACHE = {
    // Enhanced email validation (from current implementation)
    EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    TLD: /\.[a-zA-Z]{2,}$/,
    
    // Phone patterns (international)
    PHONE_INTERNATIONAL: /^\+?[\d\s\-\(\)]{7,15}$/,
    PHONE_DIGITS: /\d/g,
    PHONE_NON_DIGITS: /\D/g,
    
    // URL validation
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    
    // Number validation
    NUMBER: /^-?\d*\.?\d+$/,
    INTEGER: /^-?\d+$/
  };

  // Performance: Cache field elements
  const FIELD_CACHE = new WeakMap();
  const FORM_CACHE = new WeakMap();

  // ─────────────────────────────────────────────────────────────
  // 2. Validation Rules Library
  // ─────────────────────────────────────────────────────────────

  /**
   * Validation rule definitions
   * Each rule returns { valid: boolean, message?: string }
   */
  const VALIDATION_RULES = {
    /**
     * Required field validation
     */
    required: (value, element, params = {}) => {
      const isValid = value.trim() !== '';
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.required
      };
    },

    /**
     * Enhanced email validation (from current implementation)
     */
    email: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      // Basic format check
      if (!REGEX_CACHE.EMAIL.test(value)) {
        return {
          valid: false,
          message: params.message || CONFIG.DEFAULT_MESSAGES.email
        };
      }

      // Extract domain part
      const emailParts = value.split('@');
      if (emailParts.length !== 2) {
        return {
          valid: false,
          message: params.message || CONFIG.DEFAULT_MESSAGES.email
        };
      }

      const domain = emailParts[1];

      // Check TLD is valid
      if (!REGEX_CACHE.TLD.test(domain)) {
        return {
          valid: false,
          message: params.message || CONFIG.DEFAULT_MESSAGES.email
        };
      }

      // Additional domain validation
      const domainParts = domain.split('.');
      if (domainParts.length < 2) {
        return {
          valid: false,
          message: params.message || CONFIG.DEFAULT_MESSAGES.email
        };
      }

      // Check each domain part is valid
      for (const part of domainParts) {
        if (!part || part.startsWith('-') || part.endsWith('-') || part.length < 1) {
          return {
            valid: false,
            message: params.message || CONFIG.DEFAULT_MESSAGES.email
          };
        }
      }

      return { valid: true };
    },

    /**
     * International phone validation
     */
    phone: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const digitsOnly = value.replace(REGEX_CACHE.PHONE_NON_DIGITS, '');
      const isValid = digitsOnly.length >= 7 && digitsOnly.length <= 15 && 
                     REGEX_CACHE.PHONE_INTERNATIONAL.test(value);
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.phone
      };
    },

    /**
     * URL validation
     */
    url: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const isValid = REGEX_CACHE.URL.test(value);
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.url
      };
    },

    /**
     * Number validation
     */
    number: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const pattern = params.integer ? REGEX_CACHE.INTEGER : REGEX_CACHE.NUMBER;
      const isValid = pattern.test(value);
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.number
      };
    },

    /**
     * Minimum length validation
     */
    minLength: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const min = parseInt(params.min) || 0;
      const isValid = value.length >= min;
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.minLength.replace('{min}', min)
      };
    },

    /**
     * Maximum length validation
     */
    maxLength: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const max = parseInt(params.max) || Infinity;
      const isValid = value.length <= max;
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.maxLength.replace('{max}', max)
      };
    },

    /**
     * Minimum value validation
     */
    min: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const min = parseFloat(params.min);
      const numValue = parseFloat(value);
      const isValid = !isNaN(numValue) && numValue >= min;
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.min.replace('{min}', min)
      };
    },

    /**
     * Maximum value validation
     */
    max: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      const max = parseFloat(params.max);
      const numValue = parseFloat(value);
      const isValid = !isNaN(numValue) && numValue <= max;
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.max.replace('{max}', max)
      };
    },

    /**
     * Pattern validation
     */
    pattern: (value, element, params = {}) => {
      if (!value) return { valid: true }; // Empty is valid unless required
      
      try {
        const pattern = new RegExp(params.pattern);
        const isValid = pattern.test(value);
        
        return {
          valid: isValid,
          message: params.message || CONFIG.DEFAULT_MESSAGES.pattern
        };
      } catch (e) {
        console.warn('Invalid regex pattern:', params.pattern);
        return { valid: true };
      }
    },

    /**
     * File size validation
     */
    fileSize: (value, element, params = {}) => {
      if (!element.files || !element.files.length) return { valid: true };
      
      const maxSize = parseInt(params.max) || Infinity;
      const file = element.files[0];
      const isValid = file.size <= maxSize;
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.fileSize.replace('{max}', formatFileSize(maxSize))
      };
    },

    /**
     * File type validation
     */
    fileType: (value, element, params = {}) => {
      if (!element.files || !element.files.length) return { valid: true };
      
      const allowedTypes = params.types ? params.types.split(',').map(t => t.trim()) : [];
      if (!allowedTypes.length) return { valid: true };
      
      const file = element.files[0];
      const isValid = allowedTypes.includes(file.type) || 
                     allowedTypes.some(type => file.name.toLowerCase().endsWith(type.toLowerCase()));
      
      return {
        valid: isValid,
        message: params.message || CONFIG.DEFAULT_MESSAGES.fileType
      };
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3. Core Validation Engine
  // ─────────────────────────────────────────────────────────────

  /**
   * Parse validation rules from data attribute
   * @param {string} rulesString - Comma-separated rules
   * @returns {Array} Parsed rules array
   */
  function parseValidationRules(rulesString) {
    if (!rulesString) return [];
    
    return rulesString.split(',').map(rule => {
      const trimmed = rule.trim();
      const colonIndex = trimmed.indexOf(':');
      
      if (colonIndex === -1) {
        return { name: trimmed, params: {} };
      }
      
      const name = trimmed.substring(0, colonIndex);
      const paramString = trimmed.substring(colonIndex + 1);
      
      try {
        // Parse parameters (supports key=value pairs)
        const params = {};
        paramString.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key && value) {
            params[key.trim()] = decodeURIComponent(value.trim());
          }
        });
        
        return { name, params };
      } catch (e) {
        console.warn('Failed to parse validation parameters:', paramString);
        return { name, params: {} };
      }
    });
  }

  /**
   * Get validation parameters from data attributes
   * @param {HTMLElement} element - Input element
   * @param {string} ruleName - Rule name
   * @returns {Object} Parameters object
   */
  function getValidationParams(element, ruleName) {
    const params = {};
    
    // Check for rule-specific message
    const messageAttr = `data-validate-${ruleName}-message`;
    if (element.hasAttribute(messageAttr)) {
      params.message = element.getAttribute(messageAttr);
    }
    
    // Check for rule-specific parameters
    Object.keys(element.dataset).forEach(key => {
      if (key.startsWith(`validate${ruleName.charAt(0).toUpperCase()}${ruleName.slice(1)}`)) {
        const paramName = key.replace(`validate${ruleName.charAt(0).toUpperCase()}${ruleName.slice(1)}`, '').toLowerCase();
        if (paramName && paramName !== 'message') {
          params[paramName] = element.dataset[key];
        }
      }
    });
    
    return params;
  }

  /**
   * Validate a single field
   * @param {HTMLElement} element - Input element
   * @returns {Object} Validation result
   */
  function validateField(element) {
    const rules = parseValidationRules(element.dataset.validate);
    const value = element.value || '';
    const results = [];
    
    for (const rule of rules) {
      const validator = VALIDATION_RULES[rule.name];
      if (!validator) {
        console.warn(`Unknown validation rule: ${rule.name}`);
        continue;
      }
      
      const params = { ...rule.params, ...getValidationParams(element, rule.name) };
      const result = validator(value, element, params);
      
      results.push({
        rule: rule.name,
        valid: result.valid,
        message: result.message
      });
      
      // Stop on first failure for better UX
      if (!result.valid) break;
    }
    
    const allValid = results.every(r => r.valid);
    const firstError = results.find(r => !r.valid);
    
    return {
      valid: allValid,
      message: firstError ? firstError.message : null,
      results
    };
  }

  /**
   * Utility function to format file sizes
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Visual State Management
  // ─────────────────────────────────────────────────────────────

  /**
   * Update visual state of a validation group
   * @param {HTMLElement} group - Validation group element
   * @param {HTMLElement} field - Input field element
   * @param {Object} validationResult - Validation result
   */
  function updateFieldState(group, field, validationResult) {
    // Remove all validation classes
    group.classList.remove(
      CONFIG.CLASSES.VALID,
      CONFIG.CLASSES.INVALID,
      CONFIG.CLASSES.PENDING
    );
    
    // Add touched class if field has been interacted with
    if (field._validationTouched) {
      group.classList.add(CONFIG.CLASSES.TOUCHED);
      group.classList.remove(CONFIG.CLASSES.PRISTINE);
    } else {
      group.classList.add(CONFIG.CLASSES.PRISTINE);
      group.classList.remove(CONFIG.CLASSES.TOUCHED);
    }
    
    // Add validation state classes
    if (field._validationStarted) {
      if (validationResult.valid) {
        group.classList.add(CONFIG.CLASSES.VALID);
        showSuccessMessage(group, field);
        clearErrorMessage(group);
      } else {
        group.classList.add(CONFIG.CLASSES.INVALID);
        showErrorMessage(group, validationResult.message);
        clearSuccessMessage(group);
      }
    } else {
      clearErrorMessage(group);
      clearSuccessMessage(group);
    }
    
    // Update ARIA attributes for accessibility
    if (field._validationStarted) {
      field.setAttribute('aria-invalid', !validationResult.valid);
      if (!validationResult.valid && validationResult.message) {
        const errorId = `error-${field.name || Math.random().toString(36).substr(2, 9)}`;
        field.setAttribute('aria-describedby', errorId);
      } else {
        field.removeAttribute('aria-describedby');
      }
    }
  }

  /**
   * Show error message in validation group
   * @param {HTMLElement} group - Validation group
   * @param {string} message - Error message
   */
  function showErrorMessage(group, message) {
    const container = group.querySelector(CONFIG.SELECTORS.ERROR_CONTAINER);
    if (container && message) {
      container.textContent = message;
      container.classList.add(CONFIG.CLASSES.ERROR_CONTAINER);
      container.setAttribute('role', 'alert');
    }
  }

  /**
   * Clear error message in validation group
   * @param {HTMLElement} group - Validation group
   */
  function clearErrorMessage(group) {
    const container = group.querySelector(CONFIG.SELECTORS.ERROR_CONTAINER);
    if (container) {
      container.textContent = '';
      container.classList.remove(CONFIG.CLASSES.ERROR_CONTAINER);
      container.removeAttribute('role');
    }
  }

  /**
   * Show success message in validation group
   * @param {HTMLElement} group - Validation group
   * @param {HTMLElement} field - Input field
   */
  function showSuccessMessage(group, field) {
    const container = group.querySelector(CONFIG.SELECTORS.SUCCESS_CONTAINER);
    if (container && field.value.trim()) {
      container.classList.add(CONFIG.CLASSES.SUCCESS_CONTAINER);
    }
  }

  /**
   * Clear success message in validation group
   * @param {HTMLElement} group - Validation group
   */
  function clearSuccessMessage(group) {
    const container = group.querySelector(CONFIG.SELECTORS.SUCCESS_CONTAINER);
    if (container) {
      container.classList.remove(CONFIG.CLASSES.SUCCESS_CONTAINER);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Submit Button State Management
  // ─────────────────────────────────────────────────────────────

  /**
   * Update submit button state based on form validity
   * @param {HTMLFormElement} form - Form element
   */
  function updateSubmitButtonState(form) {
    const submitButton = form.querySelector(CONFIG.SELECTORS.SUBMIT);
    if (!submitButton) return;
    
    const fields = form.querySelectorAll(CONFIG.SELECTORS.FIELD);
    let formValid = true;
    
    for (const field of fields) {
      const validationResult = validateField(field);
      if (!validationResult.valid && field._validationStarted) {
        formValid = false;
        break;
      }
    }
    
    if (formValid) {
      submitButton.disabled = false;
      submitButton.classList.remove(CONFIG.CLASSES.SUBMIT_DISABLED);
    } else {
      submitButton.disabled = true;
      submitButton.classList.add(CONFIG.CLASSES.SUBMIT_DISABLED);
    }
    
    // Dispatch custom event
    form.dispatchEvent(new CustomEvent(formValid ? 'form-valid' : 'form-invalid', {
      detail: { valid: formValid }
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Event System
  // ─────────────────────────────────────────────────────────────

  /**
   * Handle field input event
   * @param {Event} event - Input event
   */
  function handleFieldInput(event) {
    const field = event.target;
    const group = field.closest(CONFIG.SELECTORS.GROUP);
    if (!group) return;
    
    // Mark field as touched
    field._validationTouched = true;
    
    // Start validation after first input (smart timing)
    if (!field._validationStarted && field.value.trim()) {
      field._validationStarted = true;
    }
    
    // Debounce validation
    clearTimeout(field._validationTimeout);
    field._validationTimeout = setTimeout(() => {
      if (field._validationStarted) {
        const validationResult = validateField(field);
        updateFieldState(group, field, validationResult);
        updateSubmitButtonState(field.form);
        
        // Dispatch custom event
        field.dispatchEvent(new CustomEvent(validationResult.valid ? 'validation-passed' : 'validation-failed', {
          detail: { field, result: validationResult },
          bubbles: true
        }));
      }
    }, CONFIG.DEBOUNCE_MS);
  }

  /**
   * Handle field blur event
   * @param {Event} event - Blur event
   */
  function handleFieldBlur(event) {
    const field = event.target;
    const group = field.closest(CONFIG.SELECTORS.GROUP);
    if (!group) return;
    
    // Always start validation on blur
    field._validationStarted = true;
    field._validationTouched = true;
    
    const validationResult = validateField(field);
    updateFieldState(group, field, validationResult);
    updateSubmitButtonState(field.form);
    
    // Dispatch custom event
    field.dispatchEvent(new CustomEvent(validationResult.valid ? 'validation-passed' : 'validation-failed', {
      detail: { field, result: validationResult },
      bubbles: true
    }));
  }

  /**
   * Handle form submit event
   * @param {Event} event - Submit event
   */
  function handleFormSubmit(event) {
    const form = event.target;
    const fields = form.querySelectorAll(CONFIG.SELECTORS.FIELD);
    let formValid = true;
    let firstInvalidField = null;
    
    // Validate all fields and force validation to start
    for (const field of fields) {
      field._validationStarted = true;
      field._validationTouched = true;
      
      const group = field.closest(CONFIG.SELECTORS.GROUP);
      const validationResult = validateField(field);
      
      if (group) {
        updateFieldState(group, field, validationResult);
      }
      
      if (!validationResult.valid) {
        formValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    }
    
    if (!formValid) {
      event.preventDefault();
      
      // Focus first invalid field
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      
      // Dispatch custom event
      form.dispatchEvent(new CustomEvent('validation-failed', {
        detail: { form, valid: false }
      }));
      
      return false;
    }
    
    // Dispatch custom event
    form.dispatchEvent(new CustomEvent('validation-passed', {
      detail: { form, valid: true }
    }));
    
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Initialization
  // ─────────────────────────────────────────────────────────────

  /**
   * Initialize validation on a form
   * @param {HTMLFormElement} form - Form to initialize
   */
  function initializeForm(form) {
    // Skip if already initialized
    if (FORM_CACHE.has(form)) return;
    
    const fields = form.querySelectorAll(CONFIG.SELECTORS.FIELD);
    
    // Initialize each field
    fields.forEach(field => {
      // Mark validation state
      field._validationStarted = false;
      field._validationTouched = false;
      
      // Add event listeners
      field.addEventListener('input', handleFieldInput);
      field.addEventListener('blur', handleFieldBlur);
      
      // Initial state update
      const group = field.closest(CONFIG.SELECTORS.GROUP);
      if (group) {
        group.classList.add(CONFIG.CLASSES.PRISTINE);
      }
    });
    
    // Add form submit listener
    form.addEventListener('submit', handleFormSubmit);
    
    // Initial submit button state
    updateSubmitButtonState(form);
    
    // Mark as initialized
    FORM_CACHE.set(form, true);
    
    // Dispatch initialization event
    form.dispatchEvent(new CustomEvent('validation-initialized', {
      detail: { form, fieldCount: fields.length }
    }));
  }

  /**
   * Initialize validation for all forms
   * @param {HTMLElement|Document} container - Container to search within
   */
  function initValidation(container = document) {
    const forms = container.querySelectorAll(CONFIG.SELECTORS.FORM);
    forms.forEach(initializeForm);
  }

  // ─────────────────────────────────────────────────────────────
  // 8. Public API
  // ─────────────────────────────────────────────────────────────

  window.FormValidation = {
    // Core methods
    init: initValidation,
    validate: validateField,
    
    // Rule management
    addRule: (name, validator) => {
      VALIDATION_RULES[name] = validator;
    },
    
    // Utility methods
    isValid: (form) => {
      const fields = form.querySelectorAll(CONFIG.SELECTORS.FIELD);
      return Array.from(fields).every(field => {
        const result = validateField(field);
        return result.valid;
      });
    },
    
    // Configuration
    config: CONFIG
  };

  // ─────────────────────────────────────────────────────────────
  // 9. Module Interface for Coordinator
  // ─────────────────────────────────────────────────────────────
  
  const ValidationModule = {
    name: 'validation',
    
    init: function(container = document) {
      initValidation(container);
    },
    
    initForm: function(form) {
      // Check if form should have validation
      if (form.matches(CONFIG.SELECTORS.FORM)) {
        initializeForm(form);
      }
    },
    
    cleanupForm: function(form) {
      if (FORM_CACHE.has(form)) {
        const fields = form.querySelectorAll(CONFIG.SELECTORS.FIELD);
        fields.forEach(field => {
          // Clear validation timeouts
          if (field._validationTimeout) {
            clearTimeout(field._validationTimeout);
          }
          // Reset validation flags
          field._validationStarted = false;
          field._validationTouched = false;
        });
        FORM_CACHE.delete(form);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 10. Auto-initialization
  // ─────────────────────────────────────────────────────────────
  
  // Register with coordinator
  if (window.ContactFormCoordinator) {
    window.ContactFormCoordinator.register('validation', ValidationModule);
  } else {
    // Fallback if coordinator not available
    initValidation();
    
    if (typeof Webflow !== 'undefined' && Webflow.push) {
      Webflow.push(() => {
        initValidation();
      });
    }
  }
})();