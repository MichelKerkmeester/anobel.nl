# Cookie Consent Component

A modern, GDPR-compliant cookie consent solution with category-based management and accessibility-first design.

## Features

- ✅ **GDPR Compliant** - Granular consent management with audit trails
- ✅ **Accessibility First** - Pure CSS animations, respects `prefers-reduced-motion`
- ✅ **Category-Based** - Separate consent for analytics, marketing, preferences
- ✅ **Auto-Expiration** - Automatic consent renewal and version tracking
- ✅ **Memory Safe** - Proper event listener cleanup and DOM caching
- ✅ **Webflow Integrated** - Follows project patterns and conventions
- ✅ **Zero Dependencies** - No external libraries required

## Quick Setup

### 1. HTML Structure

Add the cookie consent banner to your page:

```html
<!-- Cookie Consent Banner -->
<div id="cookie-consent" class="cookie-banner cookie-banner--hidden">
  <div class="cookie-banner__content">
    <h3>We use cookies</h3>
    <p>We use cookies to enhance your experience and analyze our traffic. Choose your preferences below.</p>
    
    <!-- Basic Accept/Decline -->
    <div class="cookie-banner__actions">
      <button id="cookie-accept" class="btn btn--primary">Accept All</button>
      <button id="cookie-decline" class="btn btn--secondary">Decline</button>
      <button id="cookie-settings" class="btn btn--text">Settings</button>
    </div>
  </div>
</div>

<!-- Optional: Settings Panel -->
<div id="cookie-settings-panel" class="cookie-settings" style="display: none;">
  <div class="cookie-settings__content">
    <h3>Cookie Preferences</h3>
    
    <!-- Category Toggles -->
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-necessary" checked disabled>
        <span>Necessary Cookies</span>
        <small>Required for basic site functionality</small>
      </label>
    </div>
    
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-analytics">
        <span>Analytics Cookies</span>
        <small>Help us understand how you use our site</small>
      </label>
    </div>
    
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-marketing">
        <span>Marketing Cookies</span>
        <small>Used to show you relevant ads</small>
      </label>
    </div>
    
    <div class="cookie-category">
      <label>
        <input type="checkbox" id="cookie-preferences">
        <span>Preference Cookies</span>
        <small>Remember your settings and preferences</small>
      </label>
    </div>
    
    <div class="cookie-settings__actions">
      <button id="cookie-save-preferences" class="btn btn--primary">Save Preferences</button>
      <button id="cookie-close-settings" class="btn btn--secondary">Close</button>
    </div>
  </div>
</div>
```

### 2. CSS Styles

Add the required CSS classes:

```css
/* Cookie Banner Base Styles */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 1rem;
  z-index: 10000;
  transform: translateY(100%);
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.cookie-banner--hidden {
  transform: translateY(100%);
}

.cookie-banner--visible {
  transform: translateY(0);
}

.cookie-banner--hiding {
  transform: translateY(100%);
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .cookie-banner {
    transition: none;
  }
  
  .cookie-banner--hidden {
    display: none;
  }
  
  .cookie-banner--visible {
    display: block;
    transform: translateY(0);
  }
}

/* Cookie Banner Content */
.cookie-banner__content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  align-items: center;
}

.cookie-banner__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Cookie Settings Panel */
.cookie-settings {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.cookie-settings--visible {
  opacity: 1;
  visibility: visible;
}

.cookie-settings__content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.cookie-category {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.cookie-category label {
  display: block;
  cursor: pointer;
}

.cookie-category small {
  display: block;
  color: #666;
  margin-top: 0.25rem;
}

.cookie-settings__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (min-width: 768px) {
  .cookie-banner__content {
    grid-template-columns: 1fr auto;
  }
}
```

### 3. JavaScript Integration

The JavaScript is already included in the component. No additional setup required.

## Configuration

### Basic Configuration

Modify the `COOKIE_CONFIG` object in `cookie-consent.js`:

```javascript
const COOKIE_CONFIG = {
  // Cookie names
  consentCookieName: "cookieConsent",
  declineCookieName: "cookieDecline", 
  categoryPrefix: "cookieCategory_",
  
  // Your Google Analytics tracking ID
  gaTrackingId: "G-XXXXXXXXXX",
  
  // Timing
  showDelay: 10000, // Show banner after 10 seconds
  cookieExpiration: 365, // Expire after 1 year
  
  // Cookie categories
  categories: {
    necessary: { name: "Necessary", required: true },
    analytics: { name: "Analytics", required: false },
    marketing: { name: "Marketing", required: false },
    preferences: { name: "Preferences", required: false }
  },
  
  // Version for consent tracking
  version: "2.0"
};
```

### Custom Categories

Add your own cookie categories:

```javascript
categories: {
  necessary: { name: "Necessary", required: true },
  analytics: { name: "Analytics", required: false },
  marketing: { name: "Marketing", required: false },
  social: { name: "Social Media", required: false },
  personalization: { name: "Personalization", required: false }
}
```

## Usage

### Check Consent Status

```javascript
// Check if user has consented
if (CookieConsentManager.checkConsent()) {
  // User has given consent
  initializeTracking();
}

// Check specific category consent
if (CookieConsentManager.checkConsent('analytics')) {
  // Analytics cookies allowed
  gtag('config', 'GA_TRACKING_ID');
}
```

### Listen for Consent Events

```javascript
// Listen for consent acceptance
window.addEventListener('cookieConsentAccepted', (event) => {
  console.log('Consent accepted for categories:', event.detail.categories);
  // Initialize tracking scripts
});

// Listen for consent withdrawal
window.addEventListener('cookieConsentWithdrawn', (event) => {
  console.log('Consent withdrawn for:', event.detail.category);
  // Disable tracking
});
```

### Programmatic Control

```javascript
// Withdraw consent
CookieConsentManager.withdrawConsent(); // All consent
CookieConsentManager.withdrawConsent('analytics'); // Specific category

// Get consent history (GDPR audit trail)
const history = CookieConsentManager.getConsentHistory();
console.log('Consent history:', history);

// Development: Reset all consent
if (window.resetCookieConsent) {
  window.resetCookieConsent();
}
```

## Integration Examples

### Google Analytics 4

```javascript
// Initialize GA4 only with consent
window.addEventListener('cookieConsentAccepted', (event) => {
  if (event.detail.categories.includes('analytics')) {
    gtag('config', 'G-XXXXXXXXXX', {
      anonymize_ip: true,
      cookie_expires: 63072000 // 2 years
    });
  }
});

// Check existing consent on page load
if (CookieConsentManager.checkConsent('analytics')) {
  gtag('config', 'G-XXXXXXXXXX');
}
```

### Facebook Pixel

```javascript
window.addEventListener('cookieConsentAccepted', (event) => {
  if (event.detail.categories.includes('marketing')) {
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  }
});
```

### Custom Tracking

```javascript
// Your custom analytics
function initCustomTracking() {
  if (CookieConsentManager.checkConsent('analytics')) {
    // Initialize your analytics
    customAnalytics.start();
  }
}

// Check on page load
initCustomTracking();

// Listen for consent changes
window.addEventListener('cookieConsentAccepted', initCustomTracking);
```

## GDPR Compliance

### Right to Withdraw

Users can withdraw consent at any time:

```html
<!-- Add a "Manage Cookies" link in your footer -->
<a href="#" onclick="window.cookieConsentManager.showBanner(); return false;">
  Manage Cookie Preferences
</a>
```

### Consent Records

The system automatically maintains consent records:

```javascript
// Get full consent history for GDPR compliance
const auditTrail = CookieConsentManager.getConsentHistory();

// Example response:
[
  {
    type: 'main',
    status: true,
    timestamp: 1640995200000,
    version: '2.0'
  },
  {
    type: 'category',
    category: 'analytics',
    status: true,
    timestamp: 1640995200000,
    version: '2.0'
  }
]
```

## Development & Testing

### Local Development

```javascript
// Reset all consent (available in dev mode)
window.resetCookieConsent();

// Manually trigger banner
window.cookieConsentManager.showBanner();

// Check current consent state
console.log('Current consent:', CookieConsentManager.getConsentHistory());
```

### Testing Scenarios

1. **First visit**: Banner shows after 10 seconds
2. **Consent given**: Banner hidden, tracking enabled
3. **Consent declined**: Banner hidden, tracking disabled
4. **Consent expired**: Banner shows again for renewal
5. **Version updated**: Banner shows for re-consent

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Accessibility Features

- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Respects `prefers-reduced-motion`
- ✅ High contrast mode support
- ✅ Focus management

## Troubleshooting

### Banner Not Showing

1. Check console for JavaScript errors
2. Verify HTML element IDs match (`#cookie-consent`, `#cookie-accept`, `#cookie-decline`)
3. Ensure CSS classes are properly defined
4. Check if consent was already given (clear localStorage)

### Tracking Not Working

1. Verify consent was given: `CookieConsentManager.checkConsent('analytics')`
2. Check if consent events are firing
3. Ensure tracking scripts are loaded after consent

### Styling Issues

1. Check CSS classes are properly applied
2. Verify z-index values don't conflict
3. Test responsive behavior on different screen sizes

## Best Practices

1. **Test thoroughly** across different browsers and devices
2. **Customize styling** to match your brand
3. **Keep content clear** and concise
4. **Provide easy withdrawal** options
5. **Monitor consent rates** and adjust messaging if needed
6. **Regular audits** of consent records for GDPR compliance

## Support

For issues or questions, check the component code in `legal/cookie-consent.js` or refer to the project documentation.