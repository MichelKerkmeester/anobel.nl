// ───────────────────────────────────────────────────────────────
// Contact
// Unified Attribute System
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   UNIFIED CONTACT FORM ATTRIBUTE DEFINITIONS

   This file centralizes all data attribute definitions used across
   the contact form modules for consistency and maintainability.
   
   All modules support both new unified attributes and legacy 
   attributes for backward compatibility.
────────────────────────────────────────────────────────────────*/

(() => {
  
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
    PRESERVE_INVALID: 'data-contact-phone-preserve-invalid',
    
    // Legacy attributes (for backward compatibility)
    COUNTRY_LEGACY: 'data-phone-country',
    PRESERVE_INVALID_LEGACY: 'data-phone-preserve-invalid'
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
    FIELD_EXCLUDE: 'data-contact-memory-exclude-field',
    
    // Legacy attributes (for backward compatibility)
    ENABLED_LEGACY: 'data-memory',
    EXPIRE_LEGACY: 'data-memory-expire',
    EXCLUDE_LEGACY: 'data-memory-exclude',
    STORAGE_LEGACY: 'data-memory-storage',
    CLEAR_ON_SUBMIT_LEGACY: 'data-memory-clear-on-submit',
    FIELD_EXCLUDE_LEGACY: 'data-memory-exclude'
  };
  
  const MEMORY_SELECTORS = {
    FORM: `form[${MEMORY_ATTRIBUTES.ENABLED}="true"], form[${MEMORY_ATTRIBUTES.ENABLED_LEGACY}="true"], form[${CORE_SELECTORS.FORM_LIVE_VALIDATE.slice(1, -1)}]`,
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
    MESSAGE_PREFIX: 'data-contact-validate',
    
    // Legacy attributes (for backward compatibility)
    FORM_LEGACY: 'data-validation-form',
    GROUP_LEGACY: 'data-validation-group',
    FIELD_LEGACY: 'data-validate',
    ERROR_CONTAINER_LEGACY: 'data-error-container',
    SUCCESS_CONTAINER_LEGACY: 'data-success-container',
    SUBMIT_LEGACY: 'data-form-submit'
  };
  
  const VALIDATION_SELECTORS = {
    FORM: `[${VALIDATION_ATTRIBUTES.FORM}], [${VALIDATION_ATTRIBUTES.FORM_LEGACY}]`,
    GROUP: `[${VALIDATION_ATTRIBUTES.GROUP}], [${VALIDATION_ATTRIBUTES.GROUP_LEGACY}]`,
    FIELD: `[${VALIDATION_ATTRIBUTES.FIELD}], [${VALIDATION_ATTRIBUTES.FIELD_LEGACY}]`,
    ERROR_CONTAINER: `[${VALIDATION_ATTRIBUTES.ERROR_CONTAINER}], [${VALIDATION_ATTRIBUTES.ERROR_CONTAINER_LEGACY}]`,
    SUCCESS_CONTAINER: `[${VALIDATION_ATTRIBUTES.SUCCESS_CONTAINER}], [${VALIDATION_ATTRIBUTES.SUCCESS_CONTAINER_LEGACY}]`,
    SUBMIT: `input[type="submit"], button[type="submit"], [${VALIDATION_ATTRIBUTES.SUBMIT}], [${VALIDATION_ATTRIBUTES.SUBMIT_LEGACY}]`
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
    DISABLE: 'data-contact-submit-disable',
    
    // Legacy attributes (for backward compatibility)
    FORM_LEGACY: 'data-submit-form',
    TRIGGER_LEGACY: 'data-submit-trigger',
    RESET_BUTTON_LEGACY: 'data-submit-reset',
    SUBMIT_BUTTON_LEGACY: 'data-submit-button',
    AUTO_RESET_LEGACY: 'data-submit-auto-reset',
    DELAY_LEGACY: 'data-submit-delay',
    EXCLUDE_LEGACY: 'data-submit-exclude',
    REDIRECT_LEGACY: 'data-submit-redirect',
    RELOAD_LEGACY: 'data-submit-reload',
    DISABLE_LEGACY: 'data-submit-disable',
    
    // Finsweet legacy attributes (for backward compatibility)
    FORM_FINSWEET: 'fs-formsubmit-element="form"',
    TRIGGER_FINSWEET: 'fs-formsubmit-element="ix-trigger"',
    RESET_BUTTON_FINSWEET: 'fs-formsubmit-element="reset"',
    SUBMIT_BUTTON_FINSWEET: 'fs-formsubmit-element="submit"',
    AUTO_RESET_FINSWEET: 'fs-formsubmit-reset',
    DELAY_FINSWEET: 'fs-formsubmit-delay',
    EXCLUDE_FINSWEET: 'fs-formsubmit-exclude',
    REDIRECT_FINSWEET: 'fs-formsubmit-redirect',
    RELOAD_FINSWEET: 'fs-formsubmit-reload',
    DISABLE_FINSWEET: 'fs-formsubmit-disable'
  };
  
  const SUBMIT_SELECTORS = {
    FORM: `[${SUBMIT_ATTRIBUTES.FORM}], [${SUBMIT_ATTRIBUTES.FORM_LEGACY}], [${SUBMIT_ATTRIBUTES.FORM_FINSWEET}]`,
    TRIGGER: `[${SUBMIT_ATTRIBUTES.TRIGGER}], [${SUBMIT_ATTRIBUTES.TRIGGER_LEGACY}], [${SUBMIT_ATTRIBUTES.TRIGGER_FINSWEET}]`,
    RESET_BUTTON: `[${SUBMIT_ATTRIBUTES.RESET_BUTTON}], [${SUBMIT_ATTRIBUTES.RESET_BUTTON_LEGACY}], [${SUBMIT_ATTRIBUTES.RESET_BUTTON_FINSWEET}]`,
    SUBMIT_BUTTON: `[${SUBMIT_ATTRIBUTES.SUBMIT_BUTTON}], [${SUBMIT_ATTRIBUTES.SUBMIT_BUTTON_LEGACY}], [${SUBMIT_ATTRIBUTES.SUBMIT_BUTTON_FINSWEET}]`
  };
  
  // ─────────────────────────────────────────────────────────────
  // Form Setup Attributes (Formspark Integration)
  // ─────────────────────────────────────────────────────────────
  
  const SETUP_ATTRIBUTES = {
    // New unified attributes
    FORM_CONTAINER: 'data-contact-form-container',
    AUTO_RESET: 'data-contact-auto-reset',
    RESET_BUTTON: 'data-contact-form-reset',
    FORMSPARK_HANDLED: 'data-contact-formspark-handled',
    
    // Legacy attributes (for backward compatibility)
    FORM_CONTAINER_LEGACY: 'data-live-validate',
    AUTO_RESET_LEGACY: 'data-should-reset',
    RESET_BUTTON_LEGACY: 'data-form-reset',
    FORMSPARK_HANDLED_LEGACY: 'data-formspark-handled'
  };
  
  const SETUP_SELECTORS = {
    FORM_CONTAINER: `[${SETUP_ATTRIBUTES.FORM_CONTAINER}], [${SETUP_ATTRIBUTES.FORM_CONTAINER_LEGACY}]`,
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
  
  /**
   * Get attribute value supporting both new and legacy attributes
   * @param {HTMLElement} element - Element to check
   * @param {string} newAttr - New attribute name
   * @param {string} legacyAttr - Legacy attribute name
   * @returns {string|null} Attribute value
   */
  function getCompatibleAttribute(element, newAttr, legacyAttr) {
    return element.getAttribute(newAttr) || element.getAttribute(legacyAttr);
  }
  
  /**
   * Check if element has attribute (new or legacy)
   * @param {HTMLElement} element - Element to check
   * @param {string} newAttr - New attribute name
   * @param {string} legacyAttr - Legacy attribute name
   * @returns {boolean} Has attribute
   */
  function hasCompatibleAttribute(element, newAttr, legacyAttr) {
    return element.hasAttribute(newAttr) || element.hasAttribute(legacyAttr);
  }
  
  /**
   * Query elements supporting both new and legacy selectors
   * @param {HTMLElement|Document} container - Container to search
   * @param {string} newSelector - New selector
   * @param {string} legacySelector - Legacy selector
   * @returns {NodeList} Found elements
   */
  function queryCompatibleElements(container, newSelector, legacySelector) {
    const newElements = container.querySelectorAll(newSelector);
    const legacyElements = container.querySelectorAll(legacySelector);
    
    // Combine and deduplicate
    const allElements = [...newElements, ...legacyElements];
    return [...new Set(allElements)];
  }
  
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
    
    // Utility functions
    utils: {
      getCompatibleAttribute,
      hasCompatibleAttribute,
      queryCompatibleElements
    }
  };
  
  // ─────────────────────────────────────────────────────────────
  // Migration Helper
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Log migration warnings for deprecated attributes
   * @param {HTMLElement} element - Element with deprecated attributes
   * @param {string} oldAttr - Old attribute name
   * @param {string} newAttr - New attribute name
   * @param {string} moduleName - Module name for context
   */
  function logMigrationWarning(element, oldAttr, newAttr, moduleName) {
    if (element.hasAttribute(oldAttr) && !element.hasAttribute(newAttr)) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn(
        `[${moduleName}] Deprecated attribute "${oldAttr}" found. ` +
        `Please migrate to "${newAttr}" for future compatibility.`,
        element
      );
    }
  }
  
  // Add migration helper to exports
  window.ContactFormAttributes.utils.logMigrationWarning = logMigrationWarning;
  
  // Register with coordinator
  if (window.ContactFormCoordinator) {
    window.ContactFormCoordinator.register('attributes', AttributesModule);
  }
  
})();