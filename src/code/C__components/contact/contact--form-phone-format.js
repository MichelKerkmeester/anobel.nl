// Contact Form Phone Formatting
// Simple Dutch phone number formatter

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
    
    // Return original if no pattern matches
    return value;
  }
  
  // Initialize phone inputs
  function initPhoneFormat() {
    const inputs = document.querySelectorAll('input[type="tel"]');
    
    inputs.forEach(input => {
      if (input._phoneFormatted) return;
      input._phoneFormatted = true;
      
      input.addEventListener('input', () => {
        const formatted = formatPhone(input.value);
        if (formatted !== input.value) {
          input.value = formatted;
        }
      });
    });
  }
  
  // Auto-init
  initPhoneFormat();
  
  // Webflow integration
  if (typeof Webflow !== 'undefined' && Webflow.push) {
    Webflow.push(initPhoneFormat);
  }
  
  // Export
  window.PhoneFormat = { format: formatPhone };
})();