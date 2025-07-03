// ───────────────────────────────────────────────────────────────
// Simplified Contact Form Handler
// Combines validation and submission in a single file
// Compatible with Webflow/Slater - Similar to Finsweet Form Submit
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';
  
  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────
  
  const CONFIG = {
  // Validation classes
  CLASSES: {
    VALID: 'validation-valid',
    INVALID: 'validation-invalid',
    SUBMITTING: 'form-submitting',
    SUCCESS: 'form-success',
    ERROR_VISIBLE: 'error-visible'
  },
  
  // Timing
  VALIDATION_DEBOUNCE: 300,
  BOTPOISON_TIMEOUT: 10000,
  
  // Default messages
  MESSAGES: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    submitError: 'Something went wrong. Please try again.',
    submitSuccess: 'Thank you! Your message has been sent.'
  }
};

// ─────────────────────────────────────────────────────────────
// Phone Number Formatting
// ─────────────────────────────────────────────────────────────

function formatDutchPhone(value) {
  if (!value) return '';
  
  // Extract digits only
  const digits = value.replace(/\D/g, '');
  
  // Don't format if too short
  if (digits.length < 3) return value;
  
  // Format Dutch mobile numbers (06...)
  if (digits.startsWith('06') && digits.length <= 10) {
    let formatted = '06';
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 6);
    if (digits.length > 6) formatted += ' ' + digits.slice(6);
    return formatted;
  }
  
  // Format international Dutch numbers (+31 6...)
  if (digits.startsWith('316') && digits.length <= 11) {
    let formatted = '+31 6';
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7);
    return formatted;
  }
  
  return value;
}

function validatePhone(value) {
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  
  // Dutch mobile numbers
  if (digits.startsWith('06') && digits.length === 10) return true;
  if (digits.startsWith('316') && digits.length === 11) return true;
  if (digits.startsWith('6') && digits.length === 9) return true;
  
  // International format (7-15 digits)
  return digits.length >= 7 && digits.length <= 15;
}

// ─────────────────────────────────────────────────────────────
// Field Validation
// ─────────────────────────────────────────────────────────────

function validateField(field) {
  const value = field.value.trim();
  const type = field.type || field.getAttribute('type');
  const isRequired = field.hasAttribute('required');
  
  // Check required
  if (isRequired && !value) {
    return { valid: false, message: CONFIG.MESSAGES.required };
  }
  
  // Skip validation if empty and not required
  if (!value) {
    return { valid: true };
  }
  
  // Email validation
  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: CONFIG.MESSAGES.email };
    }
  }
  
  // Phone validation
  if (type === 'tel' || field.name === 'phone') {
    if (!validatePhone(value)) {
      return { valid: false, message: CONFIG.MESSAGES.phone };
    }
  }
  
  return { valid: true };
}

function showFieldError(field, message) {
  field.classList.add(CONFIG.CLASSES.INVALID);
  field.classList.remove(CONFIG.CLASSES.VALID);
  
  // Find or create error element
  let errorEl = field.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    field.parentElement.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
  errorEl.classList.add(CONFIG.CLASSES.ERROR_VISIBLE);
}

function clearFieldError(field) {
  field.classList.remove(CONFIG.CLASSES.INVALID);
  field.classList.add(CONFIG.CLASSES.VALID);
  
  const errorEl = field.parentElement.querySelector('.field-error');
  if (errorEl) {
    errorEl.classList.remove(CONFIG.CLASSES.ERROR_VISIBLE);
  }
}

// ─────────────────────────────────────────────────────────────
// Form Validation
// ─────────────────────────────────────────────────────────────

function validateForm(form) {
  const fields = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  fields.forEach(field => {
    const result = validateField(field);
    if (!result.valid) {
      showFieldError(field, result.message);
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });
  
  // Update submit button state
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = !isValid;
  }
  
  return isValid;
}

// ─────────────────────────────────────────────────────────────
// Botpoison Integration
// ─────────────────────────────────────────────────────────────

async function loadBotpoison() {
  if (window.Botpoison) return window.Botpoison;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@botpoison/browser@1.0.0';
    script.async = true;
    script.onload = () => resolve(window.Botpoison);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function getBotpoisonSolution(publicKey) {
  if (!publicKey) return null;
  
  try {
    const Botpoison = await loadBotpoison();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), CONFIG.BOTPOISON_TIMEOUT)
    );
    
    const result = await Promise.race([
      Botpoison.challenge(publicKey),
      timeoutPromise
    ]);
    
    return result?.solution || null;
  } catch (error) {
    console.warn('Botpoison failed:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Form Submission
// ─────────────────────────────────────────────────────────────

async function submitForm(form) {
  // Read API configuration
  const formsparkUrl = form.getAttribute('data-formspark-url');
  const botpoisonKey = form.getAttribute('data-botpoison-key');
  
  if (!formsparkUrl) {
    console.error('Missing data-formspark-url attribute');
    return false;
  }
  
  // Show loading state
  form.classList.add(CONFIG.CLASSES.SUBMITTING);
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn?.value || submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    if (submitBtn.tagName === 'INPUT') {
      submitBtn.value = 'Sending...';
    } else {
      submitBtn.textContent = 'Sending...';
    }
  }
  
  try {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add metadata
    data._timestamp = new Date().toISOString();
    data._page_url = window.location.pathname;
    
    // Get Botpoison solution
    if (botpoisonKey) {
      const solution = await getBotpoisonSolution(botpoisonKey);
      if (solution) {
        data._botpoison = solution;
      }
    }
    
    // Submit to Formspark
    const response = await fetch(formsparkUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Submission failed: ${response.status}`);
    }
    
    // Success handling
    form.classList.remove(CONFIG.CLASSES.SUBMITTING);
    form.classList.add(CONFIG.CLASSES.SUCCESS);
    
    // Reset form after successful submission
    form.reset();
    // Clear validation states
    form.querySelectorAll('.' + CONFIG.CLASSES.VALID).forEach(field => {
      field.classList.remove(CONFIG.CLASSES.VALID);
    });
    form.querySelectorAll('.' + CONFIG.CLASSES.INVALID).forEach(field => {
      field.classList.remove(CONFIG.CLASSES.INVALID);
    });
    // Clear any visible error messages
    form.querySelectorAll('.field-error').forEach(error => {
      error.classList.remove(CONFIG.CLASSES.ERROR_VISIBLE);
    });
    
    // Show success message
    showSuccessMessage(form);
    
    // Trigger Webflow interactions for modal display
    const triggerSelector = form.getAttribute('data-success-trigger') || 
                           form.getAttribute('data-submit-trigger');
    if (triggerSelector) {
      const trigger = document.querySelector(triggerSelector);
      if (trigger) trigger.click();
    }
    
    // Also check for child trigger element (for backwards compatibility)
    const childTrigger = form.querySelector('[data-submit-trigger]');
    if (childTrigger) {
      childTrigger.click();
    }
    
    // Handle delayed actions (redirect, reload)
    const delay = parseInt(form.getAttribute('data-submit-delay')) || 0;
    const redirectUrl = form.getAttribute('data-submit-redirect');
    const shouldReload = form.hasAttribute('data-submit-reload');
    
    if (redirectUrl || shouldReload) {
      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else if (shouldReload) {
          window.location.reload();
        }
      }, delay);
    }
    
    return true;
    
  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(form, CONFIG.MESSAGES.submitError);
    return false;
    
  } finally {
    // Restore button state
    form.classList.remove(CONFIG.CLASSES.SUBMITTING);
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = originalText;
      } else {
        submitBtn.textContent = originalText;
      }
    }
  }
}

function showSuccessMessage(form) {
  // Look for custom success element
  const successEl = form.querySelector('[data-success-message]') || 
                    form.parentElement.querySelector('[data-success-message]');
  
  if (successEl) {
    successEl.style.display = 'block';
    successEl.classList.add('show');
  } else {
    // Fallback: show alert
    alert(CONFIG.MESSAGES.submitSuccess);
  }
}

function showErrorMessage(form, message) {
  // Look for custom error element
  const errorEl = form.querySelector('[data-error-message]') || 
                  form.parentElement.querySelector('[data-error-message]');
  
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    errorEl.classList.add('show');
  } else {
    // Fallback: show alert
    alert(message);
  }
}

// ─────────────────────────────────────────────────────────────
// Event Handlers
// ─────────────────────────────────────────────────────────────

function handleFieldInput(field) {
  const type = field.type || field.getAttribute('type');
  
  // Format phone numbers
  if (type === 'tel' || field.name === 'phone') {
    field.value = formatDutchPhone(field.value);
  }
  
  // Validate with debounce
  clearTimeout(field._validationTimer);
  field._validationTimer = setTimeout(() => {
    const result = validateField(field);
    if (result.valid) {
      clearFieldError(field);
    } else {
      showFieldError(field, result.message);
    }
  }, CONFIG.VALIDATION_DEBOUNCE);
}

function handleFieldBlur(field) {
  // Immediate validation on blur
  const result = validateField(field);
  if (result.valid) {
    clearFieldError(field);
  } else {
    showFieldError(field, result.message);
  }
}

// ─────────────────────────────────────────────────────────────
// Form Initialization
// ─────────────────────────────────────────────────────────────

function initContactForm(form) {
  // Skip if already initialized
  if (form._contactFormInitialized) return;
  form._contactFormInitialized = true;
  
  // Add validation to fields
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(field => {
    // Skip submit buttons
    if (field.type === 'submit') return;
    
    // Add input handler
    field.addEventListener('input', () => handleFieldInput(field));
    
    // Add blur handler
    field.addEventListener('blur', () => handleFieldBlur(field));
  });
  
  // Prevent Webflow's default form handling
  const webflowForm = form.closest('.w-form');
  if (webflowForm) {
    // Hide Webflow's success/error messages
    const successMsg = webflowForm.querySelector('.w-form-done');
    const errorMsg = webflowForm.querySelector('.w-form-fail');
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
  }
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate all fields
    if (!validateForm(form)) {
      return;
    }
    
    // Submit form
    await submitForm(form);
  });
  
  // Initial validation state
  validateForm(form);
  
  // Handle manual reset buttons
  const resetButtons = form.querySelectorAll('[data-submit-reset], [data-form-reset]');
  resetButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      // Clear all validation states
      form.querySelectorAll('.' + CONFIG.CLASSES.VALID).forEach(field => {
        field.classList.remove(CONFIG.CLASSES.VALID);
      });
      form.querySelectorAll('.' + CONFIG.CLASSES.INVALID).forEach(field => {
        field.classList.remove(CONFIG.CLASSES.INVALID);
      });
      form.querySelectorAll('.field-error').forEach(error => {
        error.classList.remove(CONFIG.CLASSES.ERROR_VISIBLE);
      });
      // Re-validate to update submit button state
      validateForm(form);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// Auto-initialization
// ─────────────────────────────────────────────────────────────

// Initialize on DOM ready (works with Slater)
function init() {
  // Find all forms with validation
  const forms = document.querySelectorAll('[data-live-validate] form, [data-validation-form], [data-contact-form], [data-submit-form]');
  forms.forEach(initContactForm);
  
  // Also check for Webflow-specific initialization
  if (window.Webflow) {
    window.Webflow.push(() => {
      const webflowForms = document.querySelectorAll('[data-live-validate] form, [data-validation-form], [data-contact-form], [data-submit-form]');
      webflowForms.forEach(initContactForm);
    });
  }
}

  // Initialize immediately (Slater auto-loads)
  init();
  
  // Export for manual use
  window.ContactForm = { init: initContactForm };
})();