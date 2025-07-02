# Cookie Consent System 🍪

**GDPR-compliant cookie consent with category management and accessibility-first design.**

Perfect for designers who need legal compliance without complex coding!

---

## 🎯 What You Get

✅ **GDPR Compliant** - Granular consent management with audit trails  
✅ **Category-Based** - Separate consent for analytics, marketing, preferences  
✅ **Accessibility First** - Respects `prefers-reduced-motion` and keyboard navigation  
✅ **Auto-Expiration** - Automatic consent renewal and version tracking  
✅ **Memory Safe** - Proper cleanup and performance optimization  
✅ **Zero Dependencies** - No external libraries required  

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Add the Scripts
Copy these to your Webflow project:

```html
<!-- Required: Cookie consent system -->
<script src="cookie-consent.js"></script>

<!-- Required: Styling -->
<link rel="stylesheet" href="cookie-consent.css">
```

### Step 2: Add the HTML
Add this cookie banner to your page:

```html
<!-- Cookie Consent Banner -->
<div id="cookie-consent" class="cookie-banner cookie-banner--hidden">
  <div class="cookie-banner__content">
    <h3>We use cookies</h3>
    <p>We use cookies to enhance your experience and analyze our traffic.</p>
    
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="btn btn--primary">Accept All</button>
      <button id="cookie-decline" class="btn btn--secondary">Decline</button>
      <button id="cookie-settings" class="btn btn--text">Settings</button>
    </div>
  </div>
</div>
```

### Step 3: Configure (Optional)
Update the config in `cookie-consent.js`:

```javascript
const COOKIE_CONFIG = {
  gaTrackingId: "G-YOUR-ID-HERE",
  showDelay: 10000, // Show after 10 seconds
  cookieExpiration: 365 // Expire after 1 year
};
```

### Step 4: Done! 🎉
Your site now has GDPR-compliant cookie consent!

---

## 📝 Copy-Paste Examples

### Basic Cookie Banner
```html
<div id="cookie-consent" class="cookie-banner cookie-banner--hidden">
  <div class="cookie-banner__content">
    <h3>We use cookies</h3>
    <p>We use cookies to enhance your experience and analyze our traffic. Choose your preferences below.</p>
    
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="btn btn--primary">Accept All</button>
      <button id="cookie-decline" class="btn btn--secondary">Decline</button>
      <button id="cookie-settings" class="btn btn--text">Settings</button>
    </div>
  </div>
</div>
```

### Full Settings Panel
```html
<!-- Settings Panel -->
<div id="cookie-settings-panel" class="cookie-settings" style="display: none;">
  <div class="cookie-settings__content">
    <h3>Cookie Preferences</h3>
    
    <!-- Necessary Cookies (always required) -->
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-necessary" checked disabled>
        <span>Necessary Cookies</span>
        <small>Required for basic site functionality</small>
      </label>
    </div>
    
    <!-- Analytics Cookies -->
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-analytics">
        <span>Analytics Cookies</span>
        <small>Help us understand how you use our site</small>
      </label>
    </div>
    
    <!-- Marketing Cookies -->
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-marketing">
        <span>Marketing Cookies</span>
        <small>Used to show you relevant ads</small>
      </label>
    </div>
    
    <div class="cookie-settings__actions">
      <button id="cookie-save-preferences" class="btn btn--primary">Save Preferences</button>
      <button id="cookie-close-settings" class="btn btn--secondary">Close</button>
    </div>
  </div>
</div>
```

### Footer "Manage Cookies" Link
```html
<!-- Add this to your footer -->
<a href="#" onclick="window.cookieConsentManager.showBanner(); return false;">
  Manage Cookie Preferences
</a>
```

### Custom Styling Example
```css
/* Custom brand colors */
.cookie-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cookie-banner .btn--primary {
  background: #48bb78;
  border: none;
}

.cookie-banner .btn--secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}
```

---

## 🛠 Common Customizations

### Change Display Timing
```javascript
const COOKIE_CONFIG = {
  showDelay: 5000, // Show after 5 seconds instead of 10
  cookieExpiration: 180 // Expire after 6 months instead of 1 year
};
```

### Custom Cookie Categories
```javascript
categories: {
  necessary: { name: "Necessary", required: true },
  analytics: { name: "Analytics", required: false },
  marketing: { name: "Marketing", required: false },
  social: { name: "Social Media", required: false },
  personalization: { name: "Personalization", required: false }
}
```

### Google Analytics Integration
```javascript
// Check consent before loading GA
if (CookieConsentManager.checkConsent('analytics')) {
  gtag('config', 'G-XXXXXXXXXX');
}

// Listen for consent changes
window.addEventListener('cookieConsentAccepted', (event) => {
  if (event.detail.categories.includes('analytics')) {
    gtag('config', 'G-XXXXXXXXXX');
  }
});
```

### Facebook Pixel Integration
```javascript
window.addEventListener('cookieConsentAccepted', (event) => {
  if (event.detail.categories.includes('marketing')) {
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  }
});
```

---

## ⚡ Pro Tips

### 💡 **Tip 1: Consent Checking**
Always check consent before loading tracking scripts:
```javascript
if (CookieConsentManager.checkConsent('analytics')) {
  // Load Google Analytics
}
```

### 💡 **Tip 2: Event Listeners**  
Listen for consent changes to load/unload scripts dynamically:
```javascript
window.addEventListener('cookieConsentAccepted', (event) => {
  console.log('Consent given for:', event.detail.categories);
});
```

### 💡 **Tip 3: GDPR Compliance**
Get consent history for GDPR audit trails:
```javascript
const auditTrail = CookieConsentManager.getConsentHistory();
```

### 💡 **Tip 4: Development Testing**
Reset consent during development:
```javascript
window.resetCookieConsent(); // Clear all consent
```

### 💡 **Tip 5: Mobile Optimization**
The banner automatically adapts to mobile screens and respects `prefers-reduced-motion`.

### 💡 **Tip 6: Programmatic Control**
Show/hide banner programmatically:
```javascript
window.cookieConsentManager.showBanner(); // Show banner
CookieConsentManager.withdrawConsent(); // Withdraw all consent
```

---

## 🎨 Styling Your Banner

The system uses these CSS classes you can customize:

```css
/* Banner positioning and animation */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.cookie-banner--visible {
  transform: translateY(0);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .cookie-banner {
    transition: none;
  }
  .cookie-banner--hidden {
    display: none;
  }
}

/* Settings panel overlay */
.cookie-settings {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10001;
}

.cookie-settings--visible {
  opacity: 1;
  visibility: visible;
}
```

---

## 🔧 Available API Methods

Use these methods to control the cookie consent system:

| Method | Example | What it does |
|--------|---------|--------------|
| `checkConsent()` | `CookieConsentManager.checkConsent()` | Check if user has any consent |
| `checkConsent(category)` | `CookieConsentManager.checkConsent('analytics')` | Check specific category consent |
| `withdrawConsent()` | `CookieConsentManager.withdrawConsent()` | Withdraw all consent |
| `withdrawConsent(category)` | `CookieConsentManager.withdrawConsent('analytics')` | Withdraw specific category |
| `getConsentHistory()` | `CookieConsentManager.getConsentHistory()` | Get GDPR audit trail |
| `showBanner()` | `window.cookieConsentManager.showBanner()` | Show banner manually |

### Event Listeners
```javascript
// Consent accepted
window.addEventListener('cookieConsentAccepted', (event) => {
  console.log('Categories:', event.detail.categories);
});

// Consent withdrawn
window.addEventListener('cookieConsentWithdrawn', (event) => {
  console.log('Withdrawn:', event.detail.category);
});
```

---

## 🐛 Troubleshooting

### ❌ **Banner not showing?**
✅ **Check HTML IDs:** Make sure you have `#cookie-consent`, `#cookie-accept`, `#cookie-decline`  
✅ **Clear storage:** Open DevTools → Application → Storage → Clear All  
✅ **Check console:** Look for JavaScript errors (F12 → Console)  
✅ **Verify timing:** Banner shows after 10 seconds by default  

### ❌ **Styles not working?**
✅ **Include CSS file:** Make sure `cookie-consent.css` is loaded  
✅ **Check z-index:** Banner uses `z-index: 10000`  
✅ **Verify classes:** Check if CSS classes are applied in browser inspector  
✅ **Test responsive:** Check mobile styles and `prefers-reduced-motion`  

### ❌ **Tracking not working?**
✅ **Check consent:** Use `CookieConsentManager.checkConsent('analytics')`  
✅ **Listen for events:** Use `cookieConsentAccepted` event listener  
✅ **Verify scripts:** Ensure tracking scripts load after consent  
✅ **Check category:** Make sure you're checking the right category name  

### ❌ **Settings panel not showing?**
✅ **Add HTML:** Include the settings panel HTML in your page  
✅ **Check element ID:** Verify `#cookie-settings-panel` exists  
✅ **Test button:** Make sure settings button has `#cookie-settings` ID  
✅ **Check CSS:** Verify settings panel CSS is included  

### ❌ **Consent not persisting?**
✅ **Check localStorage:** Ensure localStorage is enabled in browser  
✅ **Look for cookies:** Check for `cookieConsent` cookie in DevTools  
✅ **Verify expiration:** Default is 365 days  
✅ **Check version:** Version changes require re-consent  

### ❌ **GDPR compliance issues?**
✅ **Audit trail:** Use `getConsentHistory()` to verify records  
✅ **Withdrawal option:** Ensure users can withdraw consent easily  
✅ **Category details:** Provide clear descriptions for each category  
✅ **Record keeping:** Consent records include timestamps and versions  

---

## 🚨 Need Help?

1. **Check the browser console** for error messages
2. **Test with a simple setup** first, then add features
3. **Copy the examples exactly** before customizing
4. **Clear browser storage** to reset consent state

---

## 📋 Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `consentCookieName` | `"cookieConsent"` | Name of main consent cookie |
| `declineCookieName` | `"cookieDecline"` | Name of decline cookie |
| `categoryPrefix` | `"cookieCategory_"` | Prefix for category cookies |
| `gaTrackingId` | `""` | Your Google Analytics ID |
| `showDelay` | `10000` | Delay before showing banner (ms) |
| `cookieExpiration` | `365` | Cookie expiration in days |
| `version` | `"2.0"` | Consent version for tracking |

---

## 🎯 Quick Checklist

- [ ] Added `cookie-consent.js` script to Webflow
- [ ] Added `cookie-consent.css` styles
- [ ] Added cookie banner HTML with correct IDs
- [ ] Configured Google Analytics ID (if using)
- [ ] Added settings panel HTML (if using categories)
- [ ] Added "Manage Cookies" link in footer
- [ ] Tested banner appearance and functionality
- [ ] Tested consent persistence across page loads
- [ ] Verified tracking scripts load only with consent
- [ ] Checked mobile responsiveness
- [ ] Tested accessibility features

**That's it! Your site is now GDPR compliant! 🍪**

---

## 📖 Quick Reference

### **Essential Banner Setup**
```html
<div id="cookie-consent" class="cookie-banner cookie-banner--hidden">
  <div class="cookie-banner__content">
    <h3>We use cookies</h3>
    <p>Description here</p>
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="btn btn--primary">Accept All</button>
      <button id="cookie-decline" class="btn btn--secondary">Decline</button>
    </div>
  </div>
</div>
```

### **Essential JavaScript Check**
```javascript
// Check before loading tracking
if (CookieConsentManager.checkConsent('analytics')) {
  // Load Google Analytics, etc.
}
```

### **Required HTML Elements**
- `#cookie-consent` - Main banner container
- `#cookie-accept` - Accept all button
- `#cookie-decline` - Decline button
- `#cookie-settings` - Settings button (optional)
- `#cookie-settings-panel` - Settings panel (optional)