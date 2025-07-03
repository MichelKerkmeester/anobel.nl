// ───────────────────────────────────────────────────────────────
// Contact
// Form Memory (Auto-save & Restore)
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES:
   
   - Auto-saves form data to localStorage
   - Auto-restores input values on page reload
   - Skips sensitive fields (password, hidden, file)
   - HTML entity escaping for security
   - 24-hour data expiration
   - Debounced saving for performance
   - Supports all input types
   - Configurable via data attributes
────────────────────────────────────────────────────────────────*/

// Configuration defaults
const MEMORY_CONFIG = {
  DEFAULT_EXPIRE_HOURS: 24,
  MAX_VALUE_LENGTH: 10000,
  SAVE_DEBOUNCE_MS: 300,
  STORAGE_PREFIX: "form_memory_",
};

// HTML entity escape map
const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

// Field types to skip
const SKIP_TYPES = [
  "password",
  "hidden",
  "file",
  "submit",
  "button",
  "reset",
];

  /* ──────────────────────────────────────────────────────────────
     Utility Functions
  ──────────────────────────────────────────────────────────────── */

  /**
   * Escape HTML entities for security
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
  }

  /**
   * Get storage key for form
   * @param {HTMLFormElement} form - Form element
   * @returns {string} Storage key
   */
  function getStorageKey(form) {
    const formId = form.getAttribute("id") || `form_${Date.now()}`;
    return MEMORY_CONFIG.STORAGE_PREFIX + formId;
  }

  /**
   * Get expiration time in hours
   * @param {HTMLFormElement} form - Form element
   * @returns {number} Hours until expiration
   */
  function getExpirationHours(form) {
    const hours = parseInt(form.dataset.memoryExpire);
    return isNaN(hours) ? MEMORY_CONFIG.DEFAULT_EXPIRE_HOURS : hours;
  }

  /**
   * Check if field should be excluded
   * @param {HTMLInputElement} input - Input element
   * @param {HTMLFormElement} form - Form element
   * @returns {boolean} Should exclude
   */
  function shouldExcludeField(input, form) {
    // Check field type
    if (SKIP_TYPES.includes(input.type)) return true;

    // Check if no name attribute
    if (!input.name || input.name.trim() === "") return true;

    // Check data-memory-exclude attribute
    if (input.dataset.memoryExclude === "true") return true;

    // Check form-level exclusion list
    const excludeList = form.dataset.memoryExclude;
    if (excludeList) {
      const excludedNames = excludeList.split(",").map((n) => n.trim());
      if (excludedNames.includes(input.name)) return true;
    }

    return false;
  }

  /**
   * Get storage backend
   * @param {HTMLFormElement} form - Form element
   * @returns {Storage} localStorage or sessionStorage
   */
  function getStorage(form) {
    return form.dataset.memoryStorage === "session"
      ? sessionStorage
      : localStorage;
  }

  /* ---------------------------------------------------------------
     Core Memory Functions
  --------------------------------------------------------------- */

  /**
   * Save form data to storage
   * @param {HTMLFormElement} form - Form to save
   */
  function saveFormData(form) {
    try {
      const storage = getStorage(form);
      const storageKey = getStorageKey(form);
      const formData = {};
      const inputs = form.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        if (shouldExcludeField(input, form)) return;

        const fieldName = input.name;

        if (input.type === "radio" || input.type === "checkbox") {
          if (!formData[fieldName]) {
            formData[fieldName] = [];
          }
          if (input.checked) {
            formData[fieldName].push(input.value);
          }
        } else {
          const value = input.value.trim();
          if (value && value.length <= MEMORY_CONFIG.MAX_VALUE_LENGTH) {
            formData[fieldName] = escapeHtml(value);
          }
        }
      });

      // Add metadata
      formData._timestamp = Date.now();
      formData._version = 1;

      storage.setItem(storageKey, JSON.stringify(formData));

      // Dispatch custom event
      form.dispatchEvent(
        new CustomEvent("form-memory-saved", {
          detail: {
            fields: Object.keys(formData).filter((k) => !k.startsWith("_")),
          },
        })
      );
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn("Failed to save form data:", error);
      try {
        const storage = getStorage(form);
        storage.removeItem(getStorageKey(form));
      } catch (e) {
        // Storage might be full or disabled
      }
    }
  }

  /**
   * Restore form data from storage
   * @param {HTMLFormElement} form - Form to restore
   */
  function restoreFormData(form) {
    try {
      const storage = getStorage(form);
      const storageKey = getStorageKey(form);
      const savedData = storage.getItem(storageKey);

      if (!savedData) return;

      const formData = JSON.parse(savedData);
      const expirationMs = getExpirationHours(form) * 60 * 60 * 1000;

      // Check if data is expired
      if (
        formData._timestamp &&
        Date.now() - formData._timestamp > expirationMs
      ) {
        clearFormMemory(form);
        return;
      }

      let restoredFields = [];

      Object.keys(formData).forEach((name) => {
        if (name.startsWith("_")) return;

        const inputs = form.querySelectorAll(`[name="${name}"]`);
        inputs.forEach((input) => {
          if (input.type === "radio" || input.type === "checkbox") {
            if (Array.isArray(formData[name])) {
              input.checked = formData[name].includes(input.value);
            }
          } else {
            input.value = formData[name] || "";
            // Trigger input event for other handlers
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
          restoredFields.push(name);
        });
      });

      // Dispatch custom event
      form.dispatchEvent(
        new CustomEvent("form-memory-restored", {
          detail: { fields: [...new Set(restoredFields)] },
        })
      );
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn("Failed to restore form data:", error);
      clearFormMemory(form);
    }
  }

  /**
   * Clear form memory from storage
   * @param {HTMLFormElement} form - Form to clear
   */
  function clearFormMemory(form) {
    try {
      const storage = getStorage(form);
      storage.removeItem(getStorageKey(form));

      // Dispatch custom event
      form.dispatchEvent(new CustomEvent("form-memory-cleared"));
    } catch (error) {
      const logger = window.ContactFormCoordinator?.Logger || console;
      logger.warn("Failed to clear form memory:", error);
    }
  }

  /* ---------------------------------------------------------------
     Form Memory Factory
  --------------------------------------------------------------- */

  /**
   * Create form memory instance
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Memory interface
   */
  function createFormMemory(form) {
    let saveTimeout = null;

    const save = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveFormData(form);
      }, MEMORY_CONFIG.SAVE_DEBOUNCE_MS);
    };

    const restore = () => restoreFormData(form);
    const clear = () => clearFormMemory(form);

    return {
      saveFormData: save,
      restoreFormData: restore,
      clearFormMemory: clear,
    };
  }

  /* ---------------------------------------------------------------
     Initialization
  --------------------------------------------------------------- */

  /**
   * Initialize form memory on forms
   * @param {HTMLElement|Document} container - Container to search within
   */
  function initFormMemory(container = document) {
    // Find forms with memory enabled
    const forms = container.querySelectorAll(
      'form[data-memory="true"], form[data-live-validate]'
    );

    forms.forEach((form) => {
      // Skip if already initialized
      if (form._memoryInitialized) return;

      // Skip if explicitly disabled
      if (form.dataset.memory === "false") return;

      // Mark as initialized
      form._memoryInitialized = true;

      // Create memory instance
      const memory = createFormMemory(form);

      // Store on form for external access
      form._memory = memory;

      // Auto-save on input/change
      form.addEventListener("input", memory.saveFormData);
      form.addEventListener("change", memory.saveFormData);

      // Clear on successful submit (if configured)
      if (form.dataset.memoryClearOnSubmit !== "false") {
        // Use coordinator's post-submit event if available
        if (window.ContactFormCoordinator) {
          window.ContactFormCoordinator.on('coordinator:post-submit', (event) => {
            if (event.detail.form === form) {
              // Clear after a delay to allow submission
              setTimeout(() => memory.clearFormMemory(), 100);
            }
          });
        } else {
          // Fallback: Use form submit event
          form.addEventListener("submit", () => {
            // Clear after a delay to allow submission
            setTimeout(() => memory.clearFormMemory(), 100);
          });
        }
      }

      // Clear on reset
      form.addEventListener("reset", memory.clearFormMemory);

      // Restore data on initialization
      memory.restoreFormData();

      // Listen for custom clear event
      form.addEventListener("form-reset-requested", () => {
        memory.clearFormMemory();
      });
    });
  }

  /* ---------------------------------------------------------------
     Storage Event Sync (Multi-tab support)
  --------------------------------------------------------------- */

  window.addEventListener("storage", (event) => {
    if (!event.key || !event.key.startsWith(MEMORY_CONFIG.STORAGE_PREFIX)) return;

    // Find matching form
    const forms = document.querySelectorAll(
      'form[data-memory="true"], form[data-live-validate]'
    );
    forms.forEach((form) => {
      if (getStorageKey(form) === event.key && form._memory) {
        // Another tab updated the data
        if (event.newValue) {
          form._memory.restoreFormData();
        }
      }
    });
  });

  /* ---------------------------------------------------------------
     Module Interface for Coordinator
  --------------------------------------------------------------- */
  
  const MemoryModule = {
    name: 'memory',
    
    init: function(container = document) {
      initFormMemory(container);
    },
    
    initForm: function(form) {
      // Check if this specific form should have memory
      const shouldInit = form.dataset.memory === "true" || form.hasAttribute('data-live-validate');
      
      if (shouldInit && !form._memoryInitialized) {
        // Skip if explicitly disabled
        if (form.dataset.memory === "false") return;

        // Mark as initialized
        form._memoryInitialized = true;

        // Create memory instance
        const memory = createFormMemory(form);

        // Store on form for external access
        form._memory = memory;

        // Auto-save on input/change
        form.addEventListener("input", memory.saveFormData);
        form.addEventListener("change", memory.saveFormData);

        // Clear on successful submit (if configured)
        if (form.dataset.memoryClearOnSubmit !== "false") {
          // Use coordinator's post-submit event if available
          if (window.ContactFormCoordinator) {
            window.ContactFormCoordinator.on('coordinator:post-submit', (event) => {
              if (event.detail.form === form) {
                // Clear after a delay to allow submission
                setTimeout(() => memory.clearFormMemory(), 100);
              }
            });
          } else {
            // Fallback: Use form submit event
            form.addEventListener("submit", () => {
              // Clear after a delay to allow submission
              setTimeout(() => memory.clearFormMemory(), 100);
            });
          }
        }

        // Clear on reset
        form.addEventListener("reset", memory.clearFormMemory);

        // Restore data on initialization
        memory.restoreFormData();

        // Listen for custom clear event
        form.addEventListener("form-reset-requested", () => {
          memory.clearFormMemory();
        });
      }
    },
    
    cleanupForm: function(form) {
      if (form._memory) {
        form._memory.clearFormMemory();
        form._memory = null;
        form._memoryInitialized = false;
      }
    }
  };

  /* ---------------------------------------------------------------
     Auto-initialization
  --------------------------------------------------------------- */
  
  // Export for manual use
  window.FormMemory = {
    init: initFormMemory,
    create: createFormMemory
  };

// Add initialization guard
if (!window.__ContactFormMemoryInitialized) {
  window.__ContactFormMemoryInitialized = true;
  
  try {
    // Register with coordinator
    if (window.ContactFormCoordinator) {
      window.ContactFormCoordinator.register('memory', MemoryModule);
    } else {
      // Fallback if coordinator not available
      initFormMemory();
    }
  } catch (error) {
    console.error('[Contact Form Memory] Initialization failed:', error);
  }
}
