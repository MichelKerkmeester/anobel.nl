// ===================================================================
// Contact
// Phone Number Formatting
// ===================================================================

/* -------------------------------------------------------------------
   FEATURES:
   
   - Progressive Dutch phone number formatting (+31 format)
   - Smart cursor positioning during formatting
   - Real-time formatting as user types (6 -> (+31) 6)
   - Support for mobile, landline, and international formats
   - Handles 06, 6, 31, and landline patterns (020, 030, etc)
   - Input debouncing for performance
   - Auto-initialization on all tel inputs
   - Dynamic form observation for Webflow compatibility
   - Validation function for form integration
   - Public API for external use
-------------------------------------------------------------------*/

(() => {
  // Simple phone formatting function
  function formatPhone(value) {
    if (!value) return '';
    
    // Extract digits only
    const digits = value.replace(/\D/g, '');
    
    // Don't format if too short or too long
    if (digits.length < 3 || digits.length > 11) return value;
    
    // Format based on pattern
    if (digits.startsWith('31')) {
      // International: 31612345678 -> (+31) 6 1234 5678
      const rest = digits.slice(2);
      if (rest.length >= 1) {
        let formatted = '(+31) ' + rest.charAt(0);
        if (rest.length > 1) formatted += ' ' + rest.slice(1, 5);
        if (rest.length > 5) formatted += ' ' + rest.slice(5);
        return formatted;
      }
    }
    
    if (digits.startsWith('6') || digits.startsWith('06')) {
      // Mobile: 612345678 -> (+31) 6 1234 5678
      const clean = digits.startsWith('06') ? digits.slice(1) : digits;
      let formatted = '(+31) ' + clean.charAt(0);
      if (clean.length > 1) formatted += ' ' + clean.slice(1, 5);
      if (clean.length > 5) formatted += ' ' + clean.slice(5);
      return formatted;
    }
    
    // Landline patterns: 020, 030, 070, etc.
    if (digits.startsWith('0') && digits.length >= 3) {
      const areaCode = digits.slice(1, 3); // Get 2-digit area code
      if (/^[1-578]/.test(areaCode)) {
        let formatted = '(+31) ' + areaCode;
        if (digits.length > 3) formatted += ' ' + digits.slice(3, 7);
        if (digits.length > 7) formatted += ' ' + digits.slice(7);
        return formatted;
      }
    }
    
    // Direct area codes without leading 0
    if (/^[1-578]/.test(digits) && digits.length >= 2) {
      let formatted = '(+31) ' + digits.slice(0, 2);
      if (digits.length > 2) formatted += ' ' + digits.slice(2, 6);
      if (digits.length > 6) formatted += ' ' + digits.slice(6);
      return formatted;
    }
    
    // Return original if no pattern matches
    return value;
  }
  
  // Validate phone number
  function validatePhone(value) {
    if (!value) return false;
    
    const digits = value.replace(/\D/g, '');
    
    // Check valid Dutch patterns
    if (digits.startsWith('31') && digits.length === 11) return true; // International
    if (digits.startsWith('6') && digits.length === 9) return true;   // Mobile
    if (digits.startsWith('06') && digits.length === 10) return true; // Mobile with 0
    if (digits.length >= 9 && digits.length <= 10 && /^0[1-578]/.test(digits)) return true; // Landline
    
    return false;
  }
  
  // Calculate cursor position after formatting
  function calculateCursor(oldValue, newValue, oldCursor) {
    // Count digits before cursor in old value
    const digitsBefore = oldValue.slice(0, oldCursor).replace(/\D/g, '').length;
    
    // Find position after same number of digits in new value
    let newCursor = 0;
    let digitCount = 0;
    
    for (let i = 0; i < newValue.length; i++) {
      if (/\d/.test(newValue[i])) {
        digitCount++;
        if (digitCount === digitsBefore) {
          newCursor = i + 1;
          break;
        }
      }
    }
    
    // If couldn't match digit count, put cursor at end
    if (digitCount < digitsBefore || newCursor === 0) {
      newCursor = newValue.length;
    }
    
    return newCursor;
  }

  // Initialize phone inputs
  function initPhoneFormat() {
    const inputs = document.querySelectorAll('input[type="tel"]');
    
    inputs.forEach(input => {
      if (input._phoneFormatted) return;
      input._phoneFormatted = true;
      
      input.addEventListener('input', () => {
        // Clear existing timeout
        if (input._formatTimeout) {
          clearTimeout(input._formatTimeout);
        }
        
        // Debounce formatting
        input._formatTimeout = setTimeout(() => {
          const cursorPos = input.selectionStart;
          const oldValue = input.value;
          const formatted = formatPhone(oldValue);
          
          if (formatted !== oldValue) {
            input.value = formatted;
            
            // Restore cursor position
            const newCursor = calculateCursor(oldValue, formatted, cursorPos);
            input.setSelectionRange(newCursor, newCursor);
          }
        }, 100);
      });
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // Module Interface for Coordinator
  // ─────────────────────────────────────────────────────────────
  
  const PhoneFormatModule = {
    name: 'phone',
    
    init: function(container = document) {
      initPhoneFormat(container);
    },
    
    initForm: function(form) {
      const phoneInputs = form.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach(input => {
        if (!input._phoneFormatInitialized) {
          input._phoneFormatInitialized = true;
          
          input.addEventListener('input', () => {
            // Clear existing timeout
            if (input._formatTimeout) {
              clearTimeout(input._formatTimeout);
            }
            
            // Debounce formatting
            input._formatTimeout = setTimeout(() => {
              const cursorPos = input.selectionStart;
              const oldValue = input.value;
              const formatted = formatPhone(oldValue);
              
              if (formatted !== oldValue) {
                input.value = formatted;
                
                // Restore cursor position
                const newCursor = calculateCursor(oldValue, formatted, cursorPos);
                input.setSelectionRange(newCursor, newCursor);
              }
            }, 100);
          });
        }
      });
    },
    
    cleanupForm: function(form) {
      const phoneInputs = form.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach(input => {
        input._phoneFormatInitialized = false;
      });
    }
  };

  // Export
  window.PhoneFormat = { 
    format: formatPhone,
    validate: validatePhone,
    init: initPhoneFormat
  };
  
  // Register with coordinator
  if (window.ContactFormCoordinator) {
    window.ContactFormCoordinator.register('phone', PhoneFormatModule);
  } else {
    // Fallback if coordinator not available
    initPhoneFormat();
    
    if (typeof Webflow !== 'undefined' && Webflow.push) {
      Webflow.push(initPhoneFormat);
    }
  }
})();