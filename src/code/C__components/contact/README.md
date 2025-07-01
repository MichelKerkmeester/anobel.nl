# Contact Form System 🚀

**Easy-to-use contact forms for Webflow with auto-save, validation, and smart features.**

Perfect for designers who want powerful forms without complex coding!

---

## 🎯 What You Get

✅ **Smart Validation** - Real-time error checking as users type  
✅ **Auto-Save** - Never lose form data again  
✅ **Phone Formatting** - Automatically formats phone numbers  
✅ **Keyboard Shortcuts** - Power-user shortcuts (Ctrl+Enter to submit)  
✅ **Modal Popups** - Show thank you modals on form submission  
✅ **Spam Protection** - Built-in protection with Botpoison  

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Add the Scripts
Copy these scripts to your Webflow project (in order):

```html
<!-- Required: Core system -->
<script src="contact--form-attributes.js"></script>
<script src="contact--form-validation.js"></script>

<!-- Optional: Pick what you need -->
<script src="contact--form-memory.js"></script>     <!-- Auto-save -->
<script src="contact--form-phone-format.js"></script> <!-- Phone formatting -->
<script src="contact--form-submit.js"></script>    <!-- Modal popups -->
<script src="contact--form-shortcuts.js"></script> <!-- Keyboard shortcuts -->
<script src="contact--form-setup.js"></script>     <!-- Spam protection -->

<!-- Required: Styling -->
<link rel="stylesheet" href="contact--form-logic.css">
```

### Step 2: Update Your HTML
Add these attributes to your existing Webflow form:

```html
<form data-validation-form>
  <!-- Email field -->
  <div data-validation-group>
    <input name="email" type="email" data-validate="required,email" required>
    <div data-error-container></div>
  </div>
  
  <!-- Phone field -->
  <div data-validation-group>
    <input name="phone" type="tel" data-validate="phone">
    <div data-error-container></div>
  </div>
  
  <!-- Message field -->
  <div data-validation-group>
    <textarea name="message" data-validate="required" required></textarea>
    <div data-error-container></div>
  </div>
  
  <button type="submit">Send Message</button>
</form>
```

### Step 3: Done! 🎉
Your form now has validation, auto-save, and phone formatting!

---

## 📝 Copy-Paste Examples

### Basic Contact Form
```html
<form data-validation-form>
  
  <!-- Name Field -->
  <div data-validation-group>
    <label>Your Name</label>
    <input name="name" type="text" data-validate="required" required>
    <div data-error-container></div>
  </div>
  
  <!-- Email Field -->
  <div data-validation-group>
    <label>Email Address</label>
    <input name="email" type="email" data-validate="required,email" required>
    <div data-error-container></div>
  </div>
  
  <!-- Phone Field (auto-formats) -->
  <div data-validation-group>
    <label>Phone Number</label>
    <input name="phone" type="tel" data-validate="phone">
    <div data-error-container></div>
  </div>
  
  <!-- Message Field -->
  <div data-validation-group>
    <label>Message</label>
    <textarea name="message" data-validate="required,minLength:10" required></textarea>
    <div data-error-container></div>
  </div>
  
  <button type="submit">Send Message</button>
</form>
```

### Form with Modal Popup
```html
<form data-validation-form data-submit-form>
  <!-- Your form fields here -->
  
  <button type="submit">Send Message</button>
  
  <!-- This element triggers the modal -->
  <div data-submit-trigger style="display: none;"></div>
</form>
```

### Form with Auto-Reset
```html
<form data-validation-form 
      data-submit-form 
      data-submit-auto-reset="true">
  <!-- Your form fields here -->
</form>
```

---

## 🛠 Common Customizations

### Custom Error Messages
```html
<input name="email" 
       data-validate="required,email" 
       data-validate-email-message="Please enter a valid email address">
```

### Field Length Limits
```html
<textarea name="message" 
          data-validate="required,minLength:10,maxLength:500">
</textarea>
```

### File Upload Validation
```html
<input type="file" 
       name="attachment" 
       data-validate="fileSize:max=2MB,fileType:types=pdf,doc,docx">
```

### Phone Country Settings
```html
<input type="tel" 
       name="phone" 
       data-phone-country="NL"
       data-validate="phone">
```

### Exclude Fields from Auto-Save
```html
<form data-validation-form data-memory="true" data-memory-exclude="password,credit_card">
  <input name="password" type="password">
  <input name="credit_card" type="text">
</form>
```

---

## ⚡ Pro Tips

### 💡 **Tip 1: Error Messages**
Create a `<div data-error-container></div>` under each input to show validation errors.

### 💡 **Tip 2: Success Messages**  
Add `<div data-success-container></div>` to show green checkmarks for valid fields.

### 💡 **Tip 3: Phone Formatting**
Just use `type="tel"` on any input - phone formatting works automatically!

### 💡 **Tip 4: Keyboard Shortcuts**
Users can press:
- **Ctrl+Enter** to submit forms
- **Ctrl+S** to save form data
- **Ctrl+Shift+R** to reset forms
- **Escape** to clear current field

### 💡 **Tip 5: Modal Integration**
Create a Webflow interaction on the element with `data-submit-trigger` to show your modal.

---

## 🎨 Styling Your Forms

The system automatically adds CSS classes you can style:

```css
/* Style error states */
.validation-invalid input {
  border-color: red;
  background-color: #ffeaea;
}

/* Style success states */
.validation-valid input {
  border-color: green;
}

/* Style error messages */
.validation-error {
  color: red;
  font-size: 14px;
}

/* Style submit button when form is invalid */
.submit-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 🔧 Validation Rules

Add these to any input's `data-validate` attribute:

| Rule | Example | What it does |
|------|---------|--------------|
| `required` | `data-validate="required"` | Field must be filled |
| `email` | `data-validate="email"` | Must be valid email |
| `phone` | `data-validate="phone"` | Must be valid phone number |
| `url` | `data-validate="url"` | Must be valid website URL |
| `number` | `data-validate="number"` | Must be a number |
| `minLength:5` | `data-validate="minLength:5"` | At least 5 characters |
| `maxLength:100` | `data-validate="maxLength:100"` | Max 100 characters |
| `min:18` | `data-validate="min:18"` | Number must be 18+ |
| `max:100` | `data-validate="max:100"` | Number must be under 100 |

### Combine Multiple Rules
```html
<input data-validate="required,email,minLength:5">
<textarea data-validate="required,minLength:10,maxLength:500"></textarea>
```

---

## 🐛 Troubleshooting

### ❌ **Form not validating?**
✅ Make sure your form has `data-validation-form`  
✅ Each field group needs `data-validation-group`  
✅ Add `data-error-container` divs for error messages  

### ❌ **Phone formatting not working?**
✅ Use `type="tel"` on phone inputs  
✅ Check browser console for JavaScript errors  

### ❌ **Auto-save not working?**
✅ Make sure your form has an `id` attribute  
✅ Check if localStorage is enabled in browser  

### ❌ **Modal not showing?**
✅ Create a Webflow interaction on `data-submit-trigger` element  
✅ Make sure the trigger element exists in your form  

### ❌ **Styles not working?**
✅ Include the `contact--form-logic.css` file  
✅ Check that CSS classes are being applied in browser inspector  

---

## 🚨 Need Help?

1. **Check the browser console** for error messages
2. **Start with a simple form** and add features one by one
3. **Copy the examples exactly** first, then customize
4. **Test in a clean Webflow project** to isolate issues

---

## 📋 Files Explained

| File | What it does | Required? |
|------|--------------|-----------|
| `contact--form-attributes.js` | Core system setup | ✅ Required |
| `contact--form-validation.js` | Form validation | ✅ Required |
| `contact--form-logic.css` | Styling | ✅ Required |
| `contact--form-memory.js` | Auto-save feature | Optional |
| `contact--form-phone-format.js` | Phone formatting | Optional |
| `contact--form-submit.js` | Modal popups | Optional |
| `contact--form-shortcuts.js` | Keyboard shortcuts | Optional |
| `contact--form-setup.js` | Spam protection | Optional |

---

## 🎯 Quick Checklist

- [ ] Added required scripts to Webflow
- [ ] Added CSS file 
- [ ] Added `data-validation-form` to form
- [ ] Added `data-validation-group` to field containers
- [ ] Added `data-validate` rules to inputs
- [ ] Added `data-error-container` divs
- [ ] Tested form submission
- [ ] Checked browser console for errors

**That's it! Your form is now powered up! 🚀**