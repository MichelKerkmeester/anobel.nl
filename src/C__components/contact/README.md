# Contact Form Component

A simplified, single-file contact form handler for Webflow with built-in validation and Formspark/Botpoison integration.

## Features

- **Real-time field validation** with error messages
- **Dutch phone number formatting** (06 numbers)
- **Email validation**
- **Required field validation**
- **Formspark submission** with Botpoison bot protection
- **Success/error handling** with custom messages
- **Automatic form reset** after successful submission
- **Webflow interaction triggers** for modals/animations
- **Webflow form compatibility** (hides default success/error states)
- **Finsweet-style features** (delayed actions, manual reset buttons)
- **Slater-optimized** (no DOMContentLoaded, dual initialization)

## Usage

### Basic Setup

1. Add these data attributes to your form:
   ```html
   <form data-live-validate 
         data-formspark-url="https://submit-form.com/your-form-id"
         data-botpoison-key="your-public-key">
   ```

2. The form will automatically initialize when the page loads.

### Required Data Attributes

- `data-live-validate` or `data-validation-form` - Enables form validation
- `data-formspark-url` - Your Formspark endpoint URL
- `data-botpoison-key` - Your Botpoison public key (optional but recommended)

### Optional Data Attributes

- `data-success-trigger` or `data-submit-trigger` - CSS selector for element to click on success (for Webflow interactions)
- `data-success-message` - Element to show on success
- `data-error-message` - Element to show on error
- `data-submit-delay` - Delay in milliseconds before redirect/reload (default: 0)
- `data-submit-redirect` - URL to redirect to after successful submission
- `data-submit-reload` - Reload page after successful submission
- `data-submit-reset` or `data-form-reset` - Button to manually reset the form

### Field Validation

Fields are validated based on their HTML5 attributes:
- `required` - Field must have a value
- `type="email"` - Valid email format
- `type="tel"` or `name="phone"` - Valid phone number

### CSS Classes

The component adds these classes for styling:
- `.validation-valid` - Field is valid
- `.validation-invalid` - Field has errors
- `.field-error` - Error message container
- `.error-visible` - Error is shown
- `.form-submitting` - Form is being submitted
- `.form-success` - Form submitted successfully

## Webflow/Slater Compatibility

This form handler is designed to work seamlessly with Webflow and Slater:

- **No DOMContentLoaded** - Follows Slater best practices
- **Dual initialization** - Works with both immediate load and Webflow.push()
- **Webflow form wrapper support** - Automatically hides Webflow's success/error divs
- **Interaction triggers** - Click elements to trigger Webflow interactions on success
- **Collection List compatible** - Re-initializes when Webflow updates the DOM

## Example HTML

```html
<div class="contact-form-wrapper w-form">
  <form data-live-validate 
        data-formspark-url="https://submit-form.com/ABC123"
        data-botpoison-key="pk_abc123">
    
    <!-- Name field -->
    <div class="form-field">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required>
    </div>
    
    <!-- Email field -->
    <div class="form-field">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <!-- Phone field -->
    <div class="form-field">
      <label for="phone">Phone</label>
      <input type="tel" id="phone" name="phone">
    </div>
    
    <!-- Message field -->
    <div class="form-field">
      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    
    <!-- Submit button -->
    <button type="submit">Send Message</button>
    
    <!-- Optional: Manual reset button -->
    <button type="button" data-form-reset>Clear Form</button>
  </form>
  
  <!-- Optional: Webflow interaction trigger (hidden) -->
  <div data-submit-trigger=".success-modal" style="display: none;"></div>
  
  <!-- Success message (hidden by default) -->
  <div data-success-message style="display: none;">
    Thank you! Your message has been sent.
  </div>
  
  <!-- Error message (hidden by default) -->
  <div data-error-message style="display: none;">
    Something went wrong. Please try again.
  </div>
</div>
```

## Files

- `contact-form.js` - Main JavaScript file with all functionality
- `contact--form-validation.css` - Styling for validation states
- `README.md` - This documentation

## Manual Initialization

If you need to manually initialize a form:

```javascript
window.ContactForm.init(formElement);
```