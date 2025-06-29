// ───────────────────────────────────────────────────────────────
// Contact
// Form Logic
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES SUMMARY:

   - Live form validation with smart error timing
   - Enhanced email validation with strict domain rules
   - Anti-spam protection and comprehensive validation
   - Form memory: auto-saves and restores user input on page reload
   - Custom Webflow submit button support via [data-form-submit]
   - Keyboard shortcut: ⌘/Ctrl + Enter to submit forms
   - Auto-formatting phone numbers to (+31)6 1234 5678 format
   - Form reset functionality with [data-form-reset] attribute
────────────────────────────────────────────────────────────────*/

(() => {
  // Performance: Cache regex patterns
  const DIGIT_REGEX = /\D/g;
  const DIGIT_TEST = /\d/;
  
  // Enhanced email validation patterns
  const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,3}$/;
  const DOMAIN_NO_NUMBERS = /^[a-zA-Z.-]+$/;
  const TLD_PATTERN = /\.[a-zA-Z]{2,3}$/;
  
  // Performance: Cache selectors
  const FIELD_CACHE = new WeakMap();
  
  /* ─────────────────────────────────────────────────────────────
     1. Core Validation Functions
  ────────────────────────────────────────────────────────────────*/
  
  // Enhanced email validation with strict domain rules
  function isValidEmail(email) {
    // Basic format check
    if (!EMAIL_PATTERN.test(email)) {
      return false;
    }
    
    // Extract domain part
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      return false;
    }
    
    const domain = emailParts[1];
    
    // Check domain doesn't contain numbers
    if (!DOMAIN_NO_NUMBERS.test(domain)) {
      return false;
    }
    
    // Check TLD is 2-3 characters
    if (!TLD_PATTERN.test(domain)) {
      return false;
    }
    
    // Additional domain validation
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
      return false;
    }
    
    // Check each domain part is valid (no empty parts, no special chars at start/end)
    for (const part of domainParts) {
      if (!part || part.startsWith('-') || part.endsWith('-') || part.length < 1) {
        return false;
      }
    }
    
    return true;
  }

  // Field validation logic
  function isValid(/** @type {HTMLElement} */ fieldGroup) {
    // Validate regular input fields (text, email, textarea, select)
    const input =
      /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} */ (
        fieldGroup.querySelector("input, textarea, select")
      );
    if (!input) return false;

    let valid = true;

    // Get min/max length requirements from attributes
    const minAttr = input.getAttribute("min");
    const maxAttr = input.getAttribute("max");
    const min = minAttr ? parseInt(minAttr) : 0;
    const max = maxAttr ? parseInt(maxAttr) : Infinity;

    const value = input.value.trim();
    const length = value.length;

    // Check Webflow's required attribute first
    if (input.hasAttribute("required") && !value) {
      valid = false;
    } else if (input.tagName.toLowerCase() === "select") {
      // Select dropdown validation - check for invalid placeholder values
      if (
        value === "" ||
        value === "disabled" ||
        value === "null" ||
        value === "false"
      ) {
        valid = false;
      }
    } else if (
      input instanceof HTMLInputElement &&
      input.type === "email"
    ) {
      // Enhanced email validation with strict domain rules
      if (value) {
        valid = isValidEmail(value);
      } else {
        valid = !input.hasAttribute("required");
      }
    } else if (
      input instanceof HTMLInputElement &&
      (input.type === "checkbox" || input.type === "radio")
    ) {
      // Simple checkbox/radio validation
      if (input.hasAttribute("required")) {
        valid = input.checked;
      } else {
        valid = true; // Not required = always valid
      }
    } else {
      // Text/textarea validation - check length requirements
      if (minAttr && length < min) valid = false;
      if (maxAttr && length > max) valid = false;
    }

    return valid;
  }

  // Anti-spam protection
  function isSpam(startTime) {
    const currentTime = new Date().getTime();
    return currentTime - startTime < 5000; // Must wait 5 seconds minimum
  }

  /* ─────────────────────────────────────────────────────────────
     2. Form Memory (Auto-save & Restore)
  ────────────────────────────────────────────────────────────────*/
  
  function createFormMemory(form) {
    const formId = form.getAttribute("id") || `form_${Date.now()}`;
    const memoryKey = `form_memory_${formId}`;

    function saveFormData() {
      try {
        const formData = {};
        const inputs = form.querySelectorAll("input, textarea, select");

        inputs.forEach((input) => {
          // Skip sensitive fields, empty values, and inputs without names
          if (
            input.type === "password" ||
            input.type === "hidden" ||
            input.type === "file" ||
            !input.name ||
            input.name.trim() === ""
          )
            return;

          const fieldName = input.name;

          if (input.type === "radio" || input.type === "checkbox") {
            if (!formData[fieldName]) {
              formData[fieldName] = [];
            }
            if (input.checked) {
              formData[fieldName].push(input.value);
            }
          } else {
            // Only save non-empty values and limit length
            const value = input.value.trim();
            if (value && value.length <= 10000) {
              // Prevent localStorage overflow
              // Basic XSS prevention by escaping HTML entities
              const sanitizedValue = value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#x27;");
              formData[fieldName] = sanitizedValue;
            }
          }
        });

        // Add metadata
        formData._timestamp = Date.now();
        formData._version = 1; // For future compatibility

        localStorage.setItem(memoryKey, JSON.stringify(formData));
      } catch (error) {
        console.warn("Failed to save form data:", error);
        // Clear corrupted data
        try {
          localStorage.removeItem(memoryKey);
        } catch (e) {
          // localStorage might be full or disabled
        }
      }
    }

    function restoreFormData() {
      try {
        const savedData = localStorage.getItem(memoryKey);
        if (savedData) {
          const formData = JSON.parse(savedData);

          // Check if data is expired (24 hours)
          if (
            formData._timestamp &&
            Date.now() - formData._timestamp > 24 * 60 * 60 * 1000
          ) {
            clearFormMemory();
            return;
          }

          Object.keys(formData).forEach((name) => {
            if (name.startsWith("_")) return; // Skip metadata

            const inputs = form.querySelectorAll(`[name="${name}"]`);
            inputs.forEach((input) => {
              if (input.type === "radio" || input.type === "checkbox") {
                if (Array.isArray(formData[name])) {
                  input.checked = formData[name].includes(input.value);
                }
              } else {
                input.value = formData[name] || "";
                // Format phone numbers on restore
                if (input.type === "tel") {
                  input.value = formatPhoneNumber(input.value);
                }
              }
            });
          });
        }
      } catch (error) {
        console.warn("Failed to restore form data:", error);
        clearFormMemory();
      }
    }

    function clearFormMemory() {
      localStorage.removeItem(memoryKey);
    }

    return { saveFormData, restoreFormData, clearFormMemory };
  }

  /* ─────────────────────────────────────────────────────────────
     3. Visual State Management
  ────────────────────────────────────────────────────────────────*/
  
  function updateFieldStatus(/** @type {HTMLElement} */ fieldGroup) {
    // Handle visual states for regular input fields
    const input =
      /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null} */ (
        fieldGroup.querySelector("input, textarea, select")
      );
    if (!input) return;

    const value = input.value.trim();

    // Manage "filled" state (when input has content)
    if (value) {
      fieldGroup.classList.add("live-filled");
    } else {
      fieldGroup.classList.remove("live-filled");
    }

    // Manage validation states (error only)
    const valid = isValid(fieldGroup);
    if (valid) {
      fieldGroup.classList.remove("live-error");
    } else {
      // Only show error if user has started interacting with this field
      if (input.validationStarted) {
        fieldGroup.classList.add("live-error");
      } else {
        fieldGroup.classList.remove("live-error");
      }
    }
  }

  function validateAndStartLiveValidationForAll(validateFields) {
    // Validate entire form at once (called on submit attempt)
    let allValid = true;
    /** @type {HTMLElement|null} */
    let firstInvalidField = null;

    // Loop through all field groups and force validation to start
    validateFields.forEach(function (fieldGroup) {
      const input = fieldGroup.querySelector("input, textarea, select");

      if (!input) return;

      // Force validation to start for all fields (even if user hasn't interacted)
      input.validationStarted = true;

      // Update visual state (will now show errors for invalid fields)
      updateFieldStatus(fieldGroup);

      // Track validity and remember first invalid field for focusing
      if (!isValid(fieldGroup)) {
        allValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      }
    });

    // Focus first invalid field for better user experience
    if (!allValid && firstInvalidField && "focus" in firstInvalidField) {
      firstInvalidField.focus();
    }

    return allValid;
  }

  /* ─────────────────────────────────────────────────────────────
     4. Event Handlers
  ────────────────────────────────────────────────────────────────*/
  
  function handleInputEvent(input, fieldGroup, { saveFormData }) {
    const value = input.value.trim();
    const length = value.length;
    const minAttr = input.getAttribute("min");
    const maxAttr = input.getAttribute("max");
    const min = minAttr ? parseInt(minAttr) : 0;
    const max = maxAttr ? parseInt(maxAttr) : Infinity;
    
    // Phone number auto-formatting with debounce
    if (input.type === 'tel') {
      if (input.formatTimeout) {
        clearTimeout(input.formatTimeout);
      }
      input.formatTimeout = setTimeout(() => {
        const cursorPos = input.selectionStart;
        const oldValue = input.value;
        const formattedValue = formatPhoneNumber(input.value);
        
        if (formattedValue !== oldValue) {
          input.value = formattedValue;
          
          // Smart cursor position
          const digitsBeforeCursor = oldValue
            .slice(0, cursorPos)
            .replace(DIGIT_REGEX, "").length;
          let newCursorPos = 0;
          let digitCount = 0;
          
          for (let i = 0; i < formattedValue.length; i++) {
            if (DIGIT_TEST.test(formattedValue[i])) {
              digitCount++;
              if (digitCount === digitsBeforeCursor) {
                newCursorPos = i + 1;
                break;
              }
            }
          }
          
          if (digitCount < digitsBeforeCursor || newCursorPos === 0) {
            newCursorPos = formattedValue.length;
          }
          
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 100);
    }
    
    // Save form data with debounce
    if (input.form.saveTimeout) {
      clearTimeout(input.form.saveTimeout);
    }
    input.form.saveTimeout = setTimeout(() => {
      saveFormData();
    }, 300);
    
    // Validation logic
    if (!input.validationStarted) {
      if (input.type === "email") {
        if (isValid(fieldGroup)) {
          input.validationStarted = true;
        }
      } else {
        if ((minAttr && length >= min) || (maxAttr && length <= max)) {
          input.validationStarted = true;
        }
      }
    }
    
    if (input.validationStarted) {
      updateFieldStatus(fieldGroup);
    }
  }
  
  function handleChangeEvent(input, fieldGroup, { saveFormData }) {
    // Save form data on change
    saveFormData();
    
    // For checkbox and radio inputs, start validation immediately when clicked
    if ((input.type === "checkbox" || input.type === "radio") && !input.validationStarted) {
      input.validationStarted = true;
    }
    
    // Handle select dropdowns
    if (input instanceof HTMLSelectElement && !input.validationStarted) {
      input.validationStarted = true;
    }
    
    if (input.validationStarted) {
      updateFieldStatus(fieldGroup);
    }
  }
  
  function handleBlurEvent(input, fieldGroup) {
    input.validationStarted = true;
    updateFieldStatus(fieldGroup);
  }

  /* ─────────────────────────────────────────────────────────────
     5. Helper Functions
  ────────────────────────────────────────────────────────────────*/
  
  // Performance: Reusable spam error function
  function showSpamError(form, realSubmitInput) {
    // Check if error already exists
    const existingError = form.querySelector('.form-spam-error');
    if (existingError) return;
    
    const errorMsg = document.createElement("div");
    errorMsg.className = "form-spam-error";
    errorMsg.setAttribute("role", "alert");
    errorMsg.style.cssText =
      "padding: 0.5rem; background: #ef4444; color: white; border-radius: 4px; margin: 0.5rem 0;";
    errorMsg.textContent = "Form submitted too quickly. Please try again.";

    // Insert before form or after submit button
    const submitBtn = realSubmitInput;
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(errorMsg, submitBtn.nextSibling);
    } else {
      form.insertBefore(errorMsg, form.firstChild);
    }

    // Remove error message after 5 seconds
    setTimeout(() => {
      if (errorMsg.parentNode) {
        errorMsg.parentNode.removeChild(errorMsg);
      }
    }, 5000);
  }

  // Phone number formatting
  function formatPhoneNumber(value) {
    // Performance: Use cached regex
    const digits = value.replace(DIGIT_REGEX, "");

    // Don't format if too short or too long
    if (digits.length < 3 || digits.length > 11) return value;

    // Handle full international format starting with 31
    if (digits.startsWith("31") && digits.length >= 5) {
      const withoutCountry = digits.slice(2);
      if (withoutCountry.length <= 9) {
        // Format based on length: (+31) 6 1234 5678
        let formatted = `(+31) ${withoutCountry.charAt(0)}`;
        if (withoutCountry.length > 1) {
          const middle = withoutCountry.slice(1, 5);
          const end = withoutCountry.slice(5);
          if (middle) formatted += ` ${middle}`;
          if (end) formatted += ` ${end}`;
        }
        return formatted;
      }
    }

    // Handle Dutch mobile numbers starting with 6
    if (digits.startsWith("6") && digits.length <= 9) {
      // Format progressively: (+31) 6 → (+31) 6 1234 → (+31) 6 1234 5678
      let formatted = `(+31) ${digits.charAt(0)}`;
      if (digits.length > 1) {
        const middle = digits.slice(1, 5);
        const end = digits.slice(5);
        if (middle) formatted += ` ${middle}`;
        if (end) formatted += ` ${end}`;
      }
      return formatted;
    }

    // Handle other Dutch numbers (landline, etc.)
    if (
      digits.length >= 9 &&
      digits.length <= 10 &&
      !digits.startsWith("31")
    ) {
      // Format as (+31) XX XXXX XXXX
      let formatted = `(+31) ${digits.slice(0, 2)}`;
      if (digits.length > 2) {
        const middle = digits.slice(2, 6);
        const end = digits.slice(6);
        if (middle) formatted += ` ${middle}`;
        if (end) formatted += ` ${end}`;
      }
      return formatted;
    }

    // Return original if doesn't match Dutch patterns
    return value;
  }

  /* ─────────────────────────────────────────────────────────────
     6. Form Initialization
  ────────────────────────────────────────────────────────────────*/
  
  function initFormValidation() {
    // Find all forms marked with our validation attribute
    const forms = document.querySelectorAll("[data-live-validate]");

    // Process each form that needs live validation
    forms.forEach((formContainer) => {
      // Record start time for anti-spam protection
      const startTime = new Date().getTime();

      // Find the actual form element inside the container
      const form = /** @type {HTMLFormElement|null} */ (
        formContainer.querySelector("form")
      );
      if (!form) return; // Skip if no form found

      // Find all field groups that need validation
      const validateFields = form.querySelectorAll("[data-field-validate]");

      // Look for custom submit button or fall back to regular Webflow submit
      let customSubmitBtn = form.querySelector("[data-form-submit]");
      let realSubmitInput = /** @type {HTMLInputElement|HTMLElement|null} */ (
        form.querySelector('input[type="submit"], [type="submit"], [data-form-submit]')
      );

      if (!realSubmitInput) return; // No submit button found

      // Initialize form memory
      const formMemory = createFormMemory(form);

      // Set up initial validation state for each field
      validateFields.forEach(function (fieldGroup) {
        const inputs = fieldGroup.querySelectorAll("input, textarea, select");
        inputs.forEach(input => {
          // Initially, validation hasn't started
          input.validationStarted = false;
        });
      });

      // Performance: Use event delegation instead of individual listeners
      form.addEventListener('input', function(event) {
        const target = event.target;
        if (!target.matches('input, textarea, select')) return;
        
        const fieldGroup = target.closest('[data-field-validate]');
        if (!fieldGroup) return;
        
        handleInputEvent(target, fieldGroup, formMemory);
      });
      
      form.addEventListener('change', function(event) {
        const target = event.target;
        if (!target.matches('input[type="radio"], input[type="checkbox"], select')) return;
        
        const fieldGroup = target.closest('[data-field-validate]');
        if (!fieldGroup) return;
        
        handleChangeEvent(target, fieldGroup, formMemory);
      });
      
      form.addEventListener('blur', function(event) {
        const target = event.target;
        if (!target.matches('input, textarea, select')) return;
        
        const fieldGroup = target.closest('[data-field-validate]');
        if (!fieldGroup) return;
        
        handleBlurEvent(target, fieldGroup);
      }, true); // Use capture for blur

      // Restore form data on page load
      formMemory.restoreFormData();

      // CMD/CTRL + Enter to submit form (exclude textareas)
      form.addEventListener("keydown", function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          // Don't trigger in textareas where Enter is needed for line breaks
          if (event.target && event.target.tagName === "TEXTAREA") {
            return;
          }

          event.preventDefault();
          if (validateAndStartLiveValidationForAll(validateFields) && !isSpam(startTime)) {
            // Trigger submit button click instead of form.submit() to maintain Webflow compatibility
            const submitBtn = realSubmitInput;
            if (submitBtn) {
              submitBtn.click();
            }
          } else if (isSpam(startTime)) {
            showSpamError(form, realSubmitInput);
          }
        }
      });

      // Custom submit button support (only if not handled by Formspark setup)
      if (customSubmitBtn && !customSubmitBtn.hasAttribute('data-formspark-handled')) {
        customSubmitBtn.addEventListener("click", function (event) {
          event.preventDefault();
          if (validateAndStartLiveValidationForAll(validateFields) && !isSpam(startTime)) {
            // Trigger actual submit button to maintain Webflow flow
            const submitBtn = realSubmitInput;
            if (submitBtn) {
              submitBtn.click();
            }
          } else if (isSpam(startTime)) {
            showSpamError(form, realSubmitInput);
          }
        });
      }

      // Store reset preference for use by logic script
      if (realSubmitInput && realSubmitInput.hasAttribute("data-form-reset")) {
        form.dataset.shouldReset = "true";
      }

      // Listen for custom reset event from logic script
      form.addEventListener("form-reset-requested", function () {
        formMemory.clearFormMemory();
        form.reset();

        // Clear timeouts to prevent memory leaks
        if (form.saveTimeout) {
          clearTimeout(form.saveTimeout);
          form.saveTimeout = null;
        }

        // Clear validation states
        validateFields.forEach((fieldGroup) => {
          fieldGroup.classList.remove(
            "live-filled",
            "live-error"
          );
          const inputs = fieldGroup.querySelectorAll("input, textarea, select");
          inputs.forEach((input) => {
            if (input.validationStarted !== undefined) {
              input.validationStarted = false;
            }
            if (input.formatTimeout) {
              clearTimeout(input.formatTimeout);
              input.formatTimeout = null;
            }
          });
        });

        // Override Webflow's default behavior: keep form visible when reset is requested
        const formContainer = form.closest('.w-form');
        if (formContainer) {
          // Force form to stay visible (override Webflow's hide)
          formContainer.style.display = 'block';
          
          // Find the actual form element and make sure it's visible
          const formElement = formContainer.querySelector('form');
          if (formElement) {
            formElement.style.display = 'block';
          }
        }
      });

      // Universal form submit handler for final validation
      form.addEventListener("submit", function (event) {
        if (!validateAndStartLiveValidationForAll(validateFields)) {
          event.preventDefault();
          return false;
        }
        if (isSpam(startTime)) {
          event.preventDefault();
          showSpamError(form, realSubmitInput);
          return false;
        }
        // Clear form memory on successful submission if reset is enabled
        if (
          realSubmitInput &&
          realSubmitInput.hasAttribute("data-form-reset")
        ) {
          formMemory.clearFormMemory();
        }
        return true;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     8. Initialization
  ────────────────────────────────────────────────────────────────*/
  initFormValidation();
})();