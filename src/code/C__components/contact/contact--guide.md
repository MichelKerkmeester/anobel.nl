# Contact Form Setup Guide
**Enhanced Webflow Forms with Formspark & Botpoison Integration**

This guide walks you through setting up a complete contact form system with backend submission, real-time validation, and advanced features like form memory, phone formatting, and keyboard shortcuts.

---

## 🎯 Part 1: Form Logic Setup (Formspark & Botpoison)

### Step 1: Get Your API Keys

#### Formspark Setup
1. Visit [Formspark.io](https://formspark.io) and create account
2. Create new form and copy the action URL:
   ```
   https://submit-form.com/YOUR_FORM_ID
   ```

#### Botpoison Setup  
1. Visit [Botpoison.com](https://botpoison.com) and create account
2. Create new project and copy the public key:
   ```
   pk_your_public_key_here
   ```

### Step 2: Configure contact--setup.js

Update these lines in `contact--setup.js`:

```javascript
// Replace with your actual Formspark form URL
let FORMSPARK_ACTION_URL = "https://submit-form.com/YOUR_FORM_ID";

// Replace with your actual Botpoison public key  
let BOTPOISON_PUBLIC_KEY = "pk_your_public_key_here";
```

### Step 3: Add Core Form Attributes

**Required attributes for basic functionality:**

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `data-live-validate` | Form container div | *(no value)* | Enables live validation system |
| `name` | All inputs | `"fieldname"` | Required for form submission & memory |
| `required` | Required fields | *(no value)* | Makes field mandatory |

**Basic form structure:**
```html
<div data-live-validate>
  <form>
    <!-- Your form fields -->
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <input type="submit" value="Send">
  </form>
  
  <!-- Custom success/error states -->
  <div class="contact--form-success" style="display: none;">
    Thank you! Your message has been sent.
  </div>
  <div class="contact--form-error" style="display: none;">
    <div class="contact--form-error-message">Something went wrong. Please try again.</div>
  </div>
</div>
```

### Step 4: Include Setup Script in Slater

Add to your Slater dashboard as a new script:

```javascript
// Copy entire contents of contact--setup.js
```

Or load via Slater's module system if preferred.

### Step 5: Test Basic Submission

1. Fill out form and submit
2. Check browser console for submission logs
3. Verify form data appears in Formspark dashboard
4. Test Botpoison protection (should be invisible to users)

---

## 🎯 Part 2: Live Form Validation Setup

### Step 6: Add Advanced Validation Attributes

**Field validation attributes:**

| Attribute | Element | Value | Purpose | Required |
|-----------|---------|-------|---------|----------|
| `data-field-validate` | Field wrapper div | *(no value)* | Enables validation for this field | ✅ Yes |
| `min` | Input/textarea | `"2"` | Minimum character length | Optional |
| `max` | Input/textarea | `"50"` | Maximum character length | Optional |
| `type` | Input | `"email"` `"tel"` `"text"` | Input validation type | ✅ Yes |

**Radio/checkbox group attributes:**

| Attribute | Element | Value | Purpose | Required |
|-----------|---------|-------|---------|----------|
| `data-radiocheck-group` | Wrapper div | *(no value)* | Groups radio/checkbox inputs | ✅ Yes |
| `min` | Group wrapper | `"1"` | Minimum selections required | Optional |
| `max` | Group wrapper | `"3"` | Maximum selections allowed | Optional |

**Enhanced features attributes:**

| Attribute | Element | Value | Purpose | Required |
|-----------|---------|-------|---------|----------|
| `data-form-submit` | Custom button | *(no value)* | Makes button submit form | Optional |
| `data-form-reset` | Submit button | *(no value)* | Resets form after submission | Optional |

**Complete validation structure:**
```html
<div data-live-validate>
  <form>
    <!-- Text Field with length validation -->
    <div data-field-validate>
      <label>Name *</label>
      <input type="text" name="name" min="2" max="50" required>
      <div class="form-field-icon is--error">❌</div>
      <div class="form-field-icon is--success">✅</div>
    </div>
    
    <!-- Email Field -->
    <div data-field-validate>
      <label>Email *</label>
      <input type="email" name="email" required>
      <div class="form-field-icon is--error">❌</div>
      <div class="form-field-icon is--success">✅</div>
    </div>
    
    <!-- Phone Field (Auto-formatted to Dutch) -->
    <div data-field-validate>
      <label>Phone *</label>
      <input type="tel" name="phone" min="10" required>
      <div class="form-field-icon is--error">❌</div>
      <div class="form-field-icon is--success">✅</div>
    </div>
    
    <!-- Textarea with character limits -->
    <div data-field-validate>
      <label>Message *</label>
      <textarea name="message" min="10" max="1000" required></textarea>
      <div class="form-field-icon is--error">❌</div>
      <div class="form-field-icon is--success">✅</div>
    </div>
    
    <!-- Single Checkbox (Terms & Conditions) -->
    <div data-field-validate>
      <div data-radiocheck-group min="1">
        <div class="radiocheck-field">
          <input type="checkbox" name="consent" value="1" id="consent" required>
          <label for="consent">I agree to terms</label>
          <div class="radiocheck-custom"></div>
        </div>
      </div>
      <div class="radiocheck-field-icon is--error">❌</div>
      <div class="radiocheck-field-icon is--success">✅</div>
    </div>
    
    <!-- Multiple Checkboxes (Select 1-3 options) -->
    <div data-field-validate>
      <div data-radiocheck-group min="1" max="3">
        <div class="radiocheck-field">
          <input type="checkbox" name="interests" value="web" id="web">
          <label for="web">Web Development</label>
        </div>
        <div class="radiocheck-field">
          <input type="checkbox" name="interests" value="design" id="design">
          <label for="design">Design</label>
        </div>
        <div class="radiocheck-field">
          <input type="checkbox" name="interests" value="seo" id="seo">
          <label for="seo">SEO</label>
        </div>
      </div>
      <div class="radiocheck-field-icon is--error">❌</div>
      <div class="radiocheck-field-icon is--success">✅</div>
    </div>
    
    <!-- Radio Button Group -->
    <div data-field-validate>
      <div data-radiocheck-group>
        <div class="radiocheck-field">
          <input type="radio" name="budget" value="small" id="small">
          <label for="small">€1,000 - €5,000</label>
        </div>
        <div class="radiocheck-field">
          <input type="radio" name="budget" value="medium" id="medium">
          <label for="medium">€5,000 - €15,000</label>
        </div>
        <div class="radiocheck-field">
          <input type="radio" name="budget" value="large" id="large">
          <label for="large">€15,000+</label>
        </div>
      </div>
      <div class="radiocheck-field-icon is--error">❌</div>
      <div class="radiocheck-field-icon is--success">✅</div>
    </div>
    
    <!-- Submit button with reset feature -->
    <input type="submit" value="Send Message" data-form-reset>
    
    <!-- Optional: Custom submit button -->
    <button data-form-submit>Send Message</button>
  </form>
</div>
```

**Quick setup checklist:**
- [ ] Add `data-live-validate` to form container
- [ ] Wrap each field in `data-field-validate` div
- [ ] Add validation icons (error/success) to each field
- [ ] For radio/checkbox: wrap in `data-radiocheck-group`
- [ ] Set `min`/`max` values for length validation
- [ ] Add `data-form-reset` for form reset after submission
- [ ] Add `data-form-submit` for custom submit buttons

### Step 7: Include Form Logic Script in Slater

Add to your Slater dashboard as another script:

```javascript
// Copy entire contents of contact--form-logic.js
```

Both scripts are now Slater-compatible (no DOMContentLoaded listeners) and include all enhanced features.

### Step 8: Add Validation Styles

Create CSS for validation states:

```css
/* Field validation states */
[data-field-validate].live-error {
  border-color: #ef4444;
}

[data-field-validate].live-success {
  border-color: #10b981;
}

[data-field-validate].live-filled {
  /* Style for filled fields */
}

/* Validation icons */
.form-field-icon {
  display: none;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

[data-field-validate].live-error .form-field-icon.is--error,
[data-field-validate].live-success .form-field-icon.is--success {
  display: block;
}

/* Radio/checkbox group validation */
[data-radiocheck-group].live-error .radiocheck-field-icon.is--error,
[data-radiocheck-group].live-success .radiocheck-field-icon.is--success {
  display: block;
}
```

---

## 🎯 Part 3: Enhanced Features Configuration

### Step 9: Form Memory & Auto-Save

Forms automatically save user input as they type and restore it on page reload:

- **Automatic:** No configuration needed
- **Storage:** Uses localStorage with unique form IDs
- **Security:** Skips password, hidden, and file fields + XSS protection
- **Performance:** Debounced saves (300ms) prevent excessive writes
- **Limits:** 10,000 character limit per field prevents overflow
- **Sanitization:** HTML entities escaped before storage (XSS protection)
- **Expiration:** Auto-expires after 24 hours
- **Error handling:** Graceful fallback if localStorage fails
- **Memory management:** Timeouts cleared on reset to prevent leaks
- **Optimized:** Event delegation reduces listeners by ~90%
- **Clears:** Automatically on successful submission (if reset enabled)

### Step 10: Enhanced Email Validation

Email fields use strict validation rules for professional email addresses:

**Validation Rules:**
- Must follow format: `name@domain.com`
- Domain cannot contain numbers (e.g., `test@domain123.com` ❌)
- Top-level domain must be 2-3 characters (e.g., `.co`, `.com`, `.org`)
- No special characters at domain start/end
- Proper email structure validation

**Examples:**
- ✅ Valid: `john@company.com`, `info@business.org`, `hello@website.co.uk`
- ❌ Invalid: `test@domain123.com`, `user@site.c`, `bad@example.toolong`

```html
<input type="email" name="email" required>
```

### Step 11: Phone Number Formatting

Phone numbers are automatically formatted to Dutch format with smart formatting:

```html
<input type="tel" name="phone" min="10" required>
```

**Auto-formats to:** 
- Mobile: `(+31) 6 1234 5678`
- Landline: `(+31) 20 1234 5678` 
- International: `(+31) 6 1234 5678`

**Features:**
- Debounced formatting (100ms delay)
- Smart cursor position preservation
- Progressive formatting as user types
- Handles copy/paste and fast typing
- Only formats Dutch numbers (+31)
- Prevents formatting of invalid lengths

### Step 12: Keyboard Shortcuts

- **⌘ + Enter** (Mac) or **Ctrl + Enter** (PC): Submit form
- Smart targeting: Works in all form fields EXCEPT textareas
- Textareas preserve Enter for line breaks
- Maintains full Webflow compatibility by triggering submit button click
- Accessible error messages instead of browser alerts

### Step 13: Custom Submit Buttons

Use custom buttons instead of default Webflow submit:

```html
<!-- Keep default submit button (required for Webflow) -->
<input type="submit" value="Submit" style="display: none;">

<!-- Custom submit button -->
<button data-form-submit>Send Message</button>
```

**Webflow Compatibility:** Custom buttons trigger the actual submit button to maintain Webflow's form handling.

### Step 14: Form Reset After Submission

Add `data-form-reset` to submit button to reset form after successful submission:

```html
<input type="submit" value="Send" data-form-reset>
```

**Features:**
- Form resets and clears validation states
- Shows temporary success message
- Clears form memory
- Ready for new submission

---

## 🎯 Part 4: Anti-Spam Protection

### Step 15: Multi-Layer Spam Protection

The system includes **3 layers of anti-spam protection** that work seamlessly together:

#### **Layer 1: Client-Side Time Check (5 seconds)**
- Blocks automated submissions that fill and submit instantly
- Shows accessible error message: "Form submitted too quickly"
- Works independently of Formspark/Botpoison

#### **Layer 2: Botpoison Challenge**
- Advanced behavioral analysis (invisible to users)
- Generates unique solution for each submission
- Validates server-side through Formspark
- 10-second timeout with graceful fallback

#### **Layer 3: Formspark Protection**
- Rate limiting per IP address
- Duplicate submission prevention
- Email validation
- Honeypot field detection

**How they work together:**
1. User fills form → Timer starts (Layer 1)
2. User submits → Time check + Botpoison challenge
3. Data sent to Formspark with Botpoison solution
4. Formspark validates with Botpoison API (Layer 2 & 3)

---

## 🎯 Part 5: Attribute Reference & Customization

### Step 16: Attribute Reference & Customization

**Core attributes (copy & paste values):**

| Attribute + Value | Element | Copy This | What It Does |
|-------------------|---------|-----------|--------------|
| `data-live-validate` | Form container | `data-live-validate` | Activates entire form system |
| `data-field-validate` | Field wrapper | `data-field-validate` | Enables validation for this field |
| `data-radiocheck-group` | Radio/checkbox wrapper | `data-radiocheck-group` | Groups selection inputs |
| `name="fieldname"` | All inputs | `name="email"` | Required for submission & memory |
| `required` | Required fields | `required` | Makes field mandatory |

**Length validation (adjust numbers as needed):**

| Attribute + Value | Element | Copy This | What It Does |
|-------------------|---------|-----------|--------------|
| `min="2"` | Input/textarea | `min="2"` | Minimum 2 characters required |
| `max="50"` | Input/textarea | `max="500"` | Maximum 500 characters allowed |
| `min="1"` | Radio/checkbox group | `min="1"` | At least 1 selection required |
| `max="3"` | Radio/checkbox group | `max="3"` | Maximum 3 selections allowed |

**Input types (choose one per field):**

| Attribute + Value | Element | Copy This | What It Does |
|-------------------|---------|-----------|--------------|
| `type="text"` | Input | `type="text"` | Regular text input |
| `type="email"` | Input | `type="email"` | Email validation & formatting |
| `type="tel"` | Input | `type="tel"` | Phone input (auto-formats to Dutch) |
| `type="checkbox"` | Input | `type="checkbox"` | Checkbox selection |
| `type="radio"` | Input | `type="radio"` | Radio button selection |

**Enhanced features (optional):**

| Attribute + Value | Element | Copy This | What It Does |
|-------------------|---------|-----------|--------------|
| `data-form-submit` | Custom button | `data-form-submit` | Makes button submit the form |
| `data-form-reset` | Submit button | `data-form-reset` | Resets form after successful submission |

### Step 17: Quick Customization Examples

**Adjust field length requirements:**
```html
<!-- Text field: 5-100 characters -->
<input type="text" name="company" min="5" max="100" required>

<!-- Phone field: minimum 10 digits (auto-formats to Dutch) -->
<input type="tel" name="phone" min="10" required>

<!-- Message field: 20-2000 characters -->
<textarea name="message" min="20" max="2000" required></textarea>
```

**Adjust checkbox/radio group requirements:**
```html
<!-- Checkboxes: select 2-4 options -->
<div data-radiocheck-group min="2" max="4">
  <input type="checkbox" name="services" value="web">
  <input type="checkbox" name="services" value="design">
  <input type="checkbox" name="services" value="seo">
  <input type="checkbox" name="services" value="marketing">
</div>

<!-- Radio buttons: select exactly 1 (default behavior) -->
<div data-radiocheck-group>
  <input type="radio" name="budget" value="small">
  <input type="radio" name="budget" value="large">
</div>
```

**Common adjustments:**
- **Longer text**: Change `max="50"` to `max="200"`
- **Shorter text**: Change `min="2"` to `min="5"`
- **Optional field**: Remove `required` attribute
- **Multiple checkboxes**: Add `min="1" max="5"` to group
- **Auto-format phone**: Use `type="tel"` (formats to Dutch numbers)
- **Reset after submit**: Add `data-form-reset` to submit button

---

## 🎯 Part 6: Testing & Troubleshooting

### Step 18: Test Checklist

- [ ] Form submits to Formspark successfully
- [ ] Botpoison protection is working (invisible to users)
- [ ] Live validation shows errors in real-time
- [ ] Success/error states display properly
- [ ] Enhanced email validation rejects invalid domains
- [ ] Phone numbers auto-format to (+31)6 1234 5678
- [ ] Form memory saves and restores input on page reload
- [ ] ⌘ + Enter keyboard shortcut submits form
- [ ] Custom submit buttons work (if using data-form-submit)
- [ ] Form reset works after submission (if using data-form-reset)
- [ ] Fallback to Webflow works if Formspark fails

### Step 19: Debug Console

Check browser console for:
- `"Formspark integration initialized"` 
- `"Form submitted successfully"`
- Any error messages with troubleshooting info

### Step 20: Common Issues

**Form not submitting:**
- Check API keys are correct
- Verify `data-live-validate` is on form container

**Validation not showing:**  
- Ensure `data-field-validate` wraps each field
- Check validation CSS is included

**Email validation too strict:**
- Validation follows professional email standards
- Domains with numbers are intentionally blocked
- TLD must be 2-3 characters (.co, .com, .org, etc.)

**Phone formatting not working:**
- Ensure input has `type="tel"`
- Check for JavaScript errors in console

**Form memory not working:**
- Give form a unique `id` attribute
- Check localStorage is enabled in browser

**Keyboard shortcuts not working:**
- Ensure form has proper focus
- Check for conflicting keyboard event handlers

**Custom submit buttons not working:**
- Ensure you keep the default submit button (can be hidden)
- Custom buttons trigger the actual submit for Webflow compatibility

**Phone formatting interfering with typing:**
- Formatting is debounced (100ms delay) to prevent interruption
- Only formats numbers that match Dutch patterns

**Form memory storing sensitive data:**
- Password and hidden fields are automatically excluded
- Data expires after 24 hours
- Clear localStorage manually if needed: `localStorage.clear()`

---

## 🎯 Part 6: Production Configuration

### Step 21: Security Setup

Update configuration dynamically:

```javascript
// Update Formspark URL
window.ContactFormConfig.setFormspark("https://submit-form.com/NEW_FORM_ID");

// Update Botpoison key  
window.ContactFormConfig.setBotpoison("pk_new_public_key");
```

### Step 22: Analytics Integration

The system automatically tracks with Google Analytics:
- `form_submit` events for successful submissions
- `form_error` events for failed submissions

### Step 23: Enhanced Features Summary

✅ **Automatic spam protection** with Botpoison  
✅ **Real-time validation** with smart error timing  
✅ **Enhanced email validation** strict domain rules (no numbers, 2-3 char TLD)  
✅ **Phone number auto-formatting** to `(+31) 6 1234 5678`  
✅ **Form memory** saves/restores input on page reload (24hr expiry)  
✅ **Keyboard shortcuts** ⌘ + Enter to submit  
✅ **Custom submit buttons** via data-form-submit  
✅ **Form reset** functionality after submission  
✅ **Full Webflow compatibility** preserves all native behavior  
✅ **Fallback handling** if services fail  
✅ **Loading states** for better UX  
✅ **Analytics tracking** for insights  
✅ **Security features** XSS protection + exclude sensitive fields  
✅ **Performance optimized** with debounced formatting  
✅ **Memory leak prevention** proper timeout cleanup  
✅ **Accessible error messages** replace alerts with ARIA live regions

---

## 🔧 Compatibility & Integration Notes

### Webflow Integration
- ✅ Preserves all native Webflow form behavior
- ✅ Works with Webflow's success/error states
- ✅ Compatible with Webflow's form styling
- ✅ Maintains Webflow's spam protection
- ✅ Custom buttons trigger actual submit button

### Formspark Integration
- ✅ Full API compatibility
- ✅ Maintains all form data structure
- ✅ Preserves file upload functionality
- ✅ Handles all Formspark features
- ✅ Graceful fallback to Webflow if Formspark fails

### Botpoison Integration  
- ✅ Invisible to users (as intended)
- ✅ 10-second timeout prevents hanging
- ✅ Graceful degradation if service fails
- ✅ No impact on form functionality if disabled
- ✅ Compatible with all form types

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ localStorage fallback handling
- ✅ JavaScript disabled fallback (basic Webflow form)

---

## 📁 File Structure

```
/contact/
├── contact--setup.js          (Formspark & Botpoison)
├── contact--form-logic.js     (Live validation & features)
└── contact--guide.md          (This guide)
```

Your enhanced contact form system is now fully configured with backend submission, live validation, and all advanced features!