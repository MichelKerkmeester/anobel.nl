// ───────────────────────────────────────────────────────────────
// Contact
// Unified Attribute System
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   UNIFIED CONTACT FORM ATTRIBUTE DEFINITIONS

   This file centralizes all data attribute definitions used across
   the contact form modules for consistency and maintainability.
   
   All modules support unified attributes for consistency.
────────────────────────────────────────────────────────────────*/

// ─────────────────────────────────────────────────────────────
// Core Form Identification
// ─────────────────────────────────────────────────────────────
const CORE_SELECTORS = {
  // Primary form containers
  FORM: '[data-contact-form]',
  FORM_VALIDATION: '[data-validation-form]',
  FORM_SUBMIT: '[data-submit-form]',
  FORM_LIVE_VALIDATE: '[data-live-validate]',
  
  // Form elements
  FIELD_GROUP: '[data-contact-field-group]',
  FIELD: '[data-contact-field]',
  SUBMIT_BUTTON: '[data-contact-submit]',
  RESET_BUTTON: '[data-contact-reset]',
  
  // Messages
  ERROR_CONTAINER: '[data-contact-error]',
  SUCCESS_CONTAINER: '[data-contact-success]',
  MODAL_TRIGGER: '[data-contact-modal-trigger]'
};
  
// ─────────────────────────────────────────────────────────────
// Phone Formatting Attributes
// ─────────────────────────────────────────────────────────────
  
const PHONE_ATTRIBUTES = {
  // New unified attributes
  COUNTRY: 'data-contact-phone-country',
  PRESERVE_INVALID: 'data-contact-phone-preserve-invalid'
};
  
const PHONE_SELECTORS = {
  INPUT: 'input[type="tel"]',
  ENABLED: `input[type="tel"]:not([${PHONE_ATTRIBUTES.PRESERVE_INVALID}="false"])`
};
  
// ─────────────────────────────────────────────────────────────
// Form Memory Attributes
// ─────────────────────────────────────────────────────────────
  
const MEMORY_ATTRIBUTES = {
  // New unified attributes
  ENABLED: 'data-contact-memory',
  EXPIRE: 'data-contact-memory-expire',
  EXCLUDE: 'data-contact-memory-exclude',
  STORAGE: 'data-contact-memory-storage',
  CLEAR_ON_SUBMIT: 'data-contact-memory-clear-on-submit',
  FIELD_EXCLUDE: 'data-contact-memory-exclude-field'
};
  
const MEMORY_SELECTORS = {
  FORM: `form[${MEMORY_ATTRIBUTES.ENABLED}="true"], form[${CORE_SELECTORS.FORM_LIVE_VALIDATE.slice(1, -1)}]`,
  FORM_AUTO: CORE_SELECTORS.FORM_LIVE_VALIDATE
};
  
// ─────────────────────────────────────────────────────────────
// Validation Attributes
// ─────────────────────────────────────────────────────────────
  
const VALIDATION_ATTRIBUTES = {
  // New unified attributes
  FORM: 'data-contact-validation-form',
  GROUP: 'data-contact-field-group',
  FIELD: 'data-contact-validate',
  ERROR_CONTAINER: 'data-contact-error',
  SUCCESS_CONTAINER: 'data-contact-success',
  SUBMIT: 'data-contact-submit',
  
  // Rule-specific messages
  MESSAGE_PREFIX: 'data-contact-validate'
};
  
const VALIDATION_SELECTORS = {
  FORM: `[${VALIDATION_ATTRIBUTES.FORM}]`,
  GROUP: `[${VALIDATION_ATTRIBUTES.GROUP}]`,
  FIELD: `[${VALIDATION_ATTRIBUTES.FIELD}]`,
  ERROR_CONTAINER: `[${VALIDATION_ATTRIBUTES.ERROR_CONTAINER}]`,
  SUCCESS_CONTAINER: `[${VALIDATION_ATTRIBUTES.SUCCESS_CONTAINER}]`,
  SUBMIT: `input[type="submit"], button[type="submit"], [${VALIDATION_ATTRIBUTES.SUBMIT}]`
};
  
// ─────────────────────────────────────────────────────────────
// Form Submit Attributes
// ─────────────────────────────────────────────────────────────
  
const SUBMIT_ATTRIBUTES = {
  // New unified attributes
  FORM: 'data-contact-submit-form',
  TRIGGER: 'data-contact-submit-trigger',
  RESET_BUTTON: 'data-contact-submit-reset',
  SUBMIT_BUTTON: 'data-contact-submit-button',
  AUTO_RESET: 'data-contact-submit-auto-reset',
  DELAY: 'data-contact-submit-delay',
  EXCLUDE: 'data-contact-submit-exclude',
  REDIRECT: 'data-contact-submit-redirect',
  RELOAD: 'data-contact-submit-reload',
  DISABLE: 'data-contact-submit-disable'
};
  
const SUBMIT_SELECTORS = {
  FORM: `[${SUBMIT_ATTRIBUTES.FORM}]`,
  TRIGGER: `[${SUBMIT_ATTRIBUTES.TRIGGER}]`,
  RESET_BUTTON: `[${SUBMIT_ATTRIBUTES.RESET_BUTTON}]`,
  SUBMIT_BUTTON: `[${SUBMIT_ATTRIBUTES.SUBMIT_BUTTON}]`
};
  
// ─────────────────────────────────────────────────────────────
// Form Setup Attributes (Formspark Integration)
// ─────────────────────────────────────────────────────────────
  
const SETUP_ATTRIBUTES = {
  // New unified attributes
  FORM_CONTAINER: 'data-contact-form-container',
  AUTO_RESET: 'data-contact-auto-reset',
  RESET_BUTTON: 'data-contact-form-reset',
  FORMSPARK_HANDLED: 'data-contact-formspark-handled'
};
  
const SETUP_SELECTORS = {
  FORM_CONTAINER: `[${SETUP_ATTRIBUTES.FORM_CONTAINER}]`,
  FORM: 'form',
  SUBMIT_BUTTON: 'input[type="submit"], [type="submit"], [data-form-submit]'
};
  
// ─────────────────────────────────────────────────────────────
// Keyboard Shortcuts (no specific attributes - works universally)
// ─────────────────────────────────────────────────────────────
  
const SHORTCUTS_SELECTORS = {
  FORM: 'form',
  SUBMIT_BUTTON: 'input[type="submit"], [type="submit"], [data-form-submit]',
  VALIDATION_CONTAINER: '[data-live-validate]'
};
  
// ─────────────────────────────────────────────────────────────
// Unified Configuration
// ─────────────────────────────────────────────────────────────
  
const CONTACT_FORM_CONFIG = {
  // Module prefixes for future expansion
  PREFIXES: {
    CORE: 'data-contact',
    PHONE: 'data-contact-phone',
    MEMORY: 'data-contact-memory',
    VALIDATION: 'data-contact-validate',
    SUBMIT: 'data-contact-submit',
    SETUP: 'data-contact-form'
  },
  
  // Common CSS classes
  CSS_CLASSES: {
    INITIALIZED: 'contact-form-initialized',
    SUBMITTING: 'contact-form-submitting',
    SUCCESS: 'contact-form-success',
    ERROR: 'contact-form-error',
    LOADING: 'contact-form-loading'
  },
  
  // Common events
  EVENTS: {
    FORM_INITIALIZED: 'contact:form:initialized',
    VALIDATION_PASSED: 'contact:validation:passed',
    VALIDATION_FAILED: 'contact:validation:failed',
    FORM_SUBMITTED: 'contact:form:submitted',
    FORM_RESET: 'contact:form:reset',
    MEMORY_SAVED: 'contact:memory:saved',
    MEMORY_RESTORED: 'contact:memory:restored',
    PHONE_FORMATTED: 'contact:phone:formatted'
  }
};
  
// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────
  

// ─────────────────────────────────────────────────────────────
// Export Configuration
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Module Interface for Coordinator
// ─────────────────────────────────────────────────────────────
  
const AttributesModule = {
  name: 'attributes',
  
  init: function() {
    // Attributes module doesn't need initialization
    // It just provides configuration
    return true;
  },
  
  initForm: function(form) {
    // No per-form initialization needed
    return true;
  },
  
  cleanupForm: function(form) {
    // No cleanup needed
    return true;
  }
};
  
// Export to window for use by all modules
window.ContactFormAttributes = {
  CORE: CORE_SELECTORS,
  PHONE: {
    ATTRIBUTES: PHONE_ATTRIBUTES,
    SELECTORS: PHONE_SELECTORS
  },
  MEMORY: {
    ATTRIBUTES: MEMORY_ATTRIBUTES,
    SELECTORS: MEMORY_SELECTORS
  },
  VALIDATION: {
    ATTRIBUTES: VALIDATION_ATTRIBUTES,
    SELECTORS: VALIDATION_SELECTORS
  },
  SUBMIT: {
    ATTRIBUTES: SUBMIT_ATTRIBUTES,
    SELECTORS: SUBMIT_SELECTORS
  },
  SETUP: {
    ATTRIBUTES: SETUP_ATTRIBUTES,
    SELECTORS: SETUP_SELECTORS
  },
  SHORTCUTS: {
    SELECTORS: SHORTCUTS_SELECTORS
  },
  CONFIG: CONTACT_FORM_CONFIG,
};
  
  
// Add initialization guard  
if (!window.__ContactFormAttributesInitialized) {
  window.__ContactFormAttributesInitialized = true;
  
  try {
    // Register with coordinator
    if (window.ContactFormCoordinator) {
      window.ContactFormCoordinator.register('attributes', AttributesModule);
    }
  } catch (error) {
    console.error('[Contact Form Attributes] Initialization failed:', error);
  }
}