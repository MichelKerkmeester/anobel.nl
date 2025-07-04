# Contact Form Component

A production-ready contact form validation system for Webflow with real-time validation, error messaging, and modal support.

## Features

- **Real-time field validation** with inline error messages
- **Accessible error handling** with ARIA attributes
- **Email validation** with regex pattern matching
- **Min/max length validation** for text fields
- **Required field validation**
- **Anti-spam protection** (5-second submission threshold)
- **Retry logic** with exponential backoff
- **Modal support** for success messages (using Motion.dev)
- **Webflow compatibility** with proper state management
- **Slater-optimized** (no DOMContentLoaded required)
- **Memory-efficient** event handler cleanup
- **Performance optimized** with debounced validation (300ms)
- **Smart error lifecycle** - removes dynamic errors when fields become valid
- **Unique ID generation** - guaranteed unique IDs for accessibility
- **Flexible submit button** - specify custom submit button with data attribute

## Installation

### 1. Add JavaScript
Include `contact--form.js` in your Webflow project via Slater or custom code.

### 2. Add CSS
Include `contact--form.css` for validation states and error styling.

### 3. Style in Webflow
Create your modal and form styles directly in Webflow. The CSS only provides validation states.

## Usage

### Form Setup

Add these attributes to your form:

```html
<form data-form-validate 
      action="https://your-endpoint.com/submit"
      data-success-modal="#success-modal">
```

### Required Data Attributes

#### Form Attributes
- `data-form-validate` - Enables form validation on this form
- `action` or `data-form-action` - Form submission endpoint
- `data-success-modal` (optional) - Selector for success modal
- `data-submit-button` (optional) - Custom selector for submit button

#### Field Wrapper Attributes
- `data-validate` - Required wrapper for each field that needs validation

#### Submit Button Attributes
- `data-submit` - Default submit button wrapper (optional)
- Or use `data-submit-button=".my-submit"` on form for custom selector

### Field Structure

Each field must be wrapped in an element with `data-validate`:

```html
<div data-validate>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <!-- Error message will be inserted here automatically -->
</div>
```

### Custom Error Elements

You can provide custom error elements:

```html
<div data-validate>
  <input type="email" name="email" required>
  <div data-error><!-- Custom error will appear here --></div>
</div>
```

**Note**: Dynamic error elements (created by the script) are automatically removed when fields become valid, while custom error elements (with `data-error` attribute) are only hidden.

## HTML Example

```html
<div class="form-wrapper w-form">
  <form data-form-validate 
        action="https://submit-form.com/your-form-id"
        data-success-modal="#contact-success-modal">
    
    <!-- Name Field -->
    <div class="field-wrapper" data-validate>
      <label for="name">Name *</label>
      <input type="text" id="name" name="name" required>
    </div>
    
    <!-- Email Field -->
    <div class="field-wrapper" data-validate>
      <label for="email">Email *</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <!-- Phone Field (optional) -->
    <div class="field-wrapper" data-validate>
      <label for="phone">Phone</label>
      <input type="tel" id="phone" name="phone">
    </div>
    
    <!-- Message Field -->
    <div class="field-wrapper" data-validate>
      <label for="message">Message *</label>
      <textarea id="message" name="message" required min="10"></textarea>
    </div>
    
    <!-- Submit Button (Option 1: Default wrapper) -->
    <div data-submit>
      <input type="submit" value="Send Message">
    </div>
    
    <!-- Submit Button (Option 2: Custom selector) -->
    <!-- Add data-submit-button="#custom-submit" to form -->
    <!-- <button type="submit" id="custom-submit">Send Message</button> -->
  </form>
  
  <!-- Webflow default messages (will be hidden) -->
  <div class="w-form-done">
    <div>Thank you! Your submission has been received!</div>
  </div>
  <div class="w-form-fail">
    <div>Oops! Something went wrong while submitting the form.</div>
  </div>
</div>

<!-- Success Modal (styled in Webflow) -->
<div id="contact-success-modal" style="display: none;">
  <div class="modal-content">
    <button data-modal-close>×</button>
    <h2>Message Sent!</h2>
    <p>Thank you for contacting us. We'll get back to you soon.</p>
  </div>
</div>
```

## Validation Rules

### Built-in Validations
- **Required**: Add `required` attribute
- **Email**: Use `type="email"`
- **Min Length**: Add `min="5"` attribute
- **Max Length**: Add `max="100"` attribute

### Validation Messages
- Required: "This field is required"
- Email: "Please enter a valid email address"
- Min Length: "Too short"
- Max Length: "Too long"

## CSS Classes

The component automatically adds these classes:

### Field States
- `.is--filled` - Field has content
- `.is--success` - Field is valid
- `.is--error` - Field has validation error

### Form States
- `.form-submitting` - Form is being submitted
- `.form-success` - Form submitted successfully

### Error Display
- `.field-error` - Error message element
- `.error-visible` - Error is visible

## JavaScript API

The component exposes a public API:

```javascript
window.ContactFormValidator = {
  init: function,        // Re-initialize forms
  FormValidator: class,  // Access to validator class
  modalManager: object,  // Modal management instance
  validateField: function, // Manual field validation
  CONFIG: object        // Configuration object
};
```

### Configuration Options

```javascript
// Access configuration
window.ContactFormValidator.CONFIG = {
  SPAM_THRESHOLD: 5000,      // Anti-spam delay (ms)
  VALIDATION_DEBOUNCE: 300,  // Input validation delay (ms)
  MESSAGES: {                // Customize error messages
    required: "This field is required",
    email: "Please enter a valid email address",
    // ... etc
  }
};
```

### Manual Initialization

```javascript
// Initialize all forms
window.ContactFormValidator.init();

// Or initialize specific form
const form = document.querySelector('#my-form');
new window.ContactFormValidator.FormValidator(form);
```

## Webflow Integration

### Automatic Features
- Hides Webflow's default success/error messages
- Removes Webflow form state classes
- Compatible with Webflow's form structure
- Works with Collection Lists

### Modal Animations
If Motion.dev is available, modals will animate smoothly. Otherwise, they appear instantly.

## Best Practices

1. **Always wrap fields** in `data-validate` elements
2. **Use semantic HTML5 input types** for better validation
3. **Add `required` attribute** for mandatory fields
4. **Test with keyboard navigation** for accessibility
5. **Style error messages** to be clearly visible
6. **Provide clear labels** for all form fields
7. **Use custom error elements** for persistent error placement
8. **Specify submit button** if you have multiple buttons

## Troubleshooting

### Form not validating
- Check that form has `data-form-validate` attribute
- Ensure fields are wrapped in `data-validate` elements
- Verify JavaScript file is loaded

### Errors not showing
- Check CSS is loaded
- Inspect if `.field-error` elements are created
- Ensure no CSS conflicts hiding errors

### Modal not showing
- Verify modal selector in `data-success-modal`
- Check modal HTML exists on page
- Ensure Motion.dev is loaded (if using animations)

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses modern JavaScript features)

## Performance Notes

- Field validation is debounced by 300ms to prevent excessive validation
- Dynamic error elements are removed from DOM when not needed
- Event handlers are properly cleaned up to prevent memory leaks
- Form uses passive event listeners where appropriate