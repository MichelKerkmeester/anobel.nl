// Cookie Consent - Enhanced Implementation
// ──────────────────────────────────────────────────────────────────────────────
// Modern cookie consent management with category-based control
// Following Finsweet patterns and project conventions
// ──────────────────────────────────────────────────────────────────────────────

// Configuration object for easy customization
const COOKIE_CONFIG = {
  // Cookie names
  consentCookieName: "cookieConsent",
  declineCookieName: "cookieDecline",
  categoryPrefix: "cookieCategory_",
  
  // Tracking configuration
  gaTrackingId: "G-KGZWBC07S1",
  
  // Timing configuration
  showDelay: 10000, // 10 seconds
  cookieExpiration: 7, // 7 days
  
  // Cookie categories
  categories: {
    necessary: { name: "Necessary", required: true },
    analytics: { name: "Analytics", required: false },
    marketing: { name: "Marketing", required: false },
    preferences: { name: "Preferences", required: false }
  },
  
  // Version for consent tracking
  version: "1.0"
};

// Enhanced consent management system
class CookieConsentManager {
  constructor(config = COOKIE_CONFIG) {
    this.config = config;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.domCache = new Map();
    this.eventListeners = [];
    this.animationManager = null;
    
    // Bind methods to preserve context
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleCategoryToggle = this.handleCategoryToggle.bind(this);
    this.showBanner = this.showBanner.bind(this);
    this.hideBanner = this.hideBanner.bind(this);
    
    this.init();
  }

  init() {
    try {
      // Use Webflow integration if available
      if (typeof window.Webflow !== "undefined") {
        window.Webflow.push(() => {
          this.bindEvents();
          this.checkExistingConsent();
        });
      } else {
        this.bindEvents();
        this.checkExistingConsent();
      }
    } catch (error) {
      console.error('Cookie consent initialization failed:', error);
    }
  }

  // DOM caching utility
  getCachedElement(selector) {
    if (!this.domCache.has(selector)) {
      const element = document.querySelector(selector);
      this.domCache.set(selector, element);
    }
    return this.domCache.get(selector);
  }

  // Clear DOM cache when needed
  clearDOMCache() {
    this.domCache.clear();
  }

  // Event listener management
  addEventListenerTracked(element, event, handler, options = {}) {
    if (element) {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler, options });
    }
  }

  // Cleanup method
  destroy() {
    // Remove all tracked event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];
    
    // Clear DOM cache
    this.clearDOMCache();
    
    // Cancel any ongoing animations
    if (this.animationManager) {
      this.animationManager.cleanup();
    }
  }

  // Enhanced storage utilities with expiration
  setConsentData(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: this.config.version,
        expiresAt: Date.now() + (this.config.cookieExpiration * 24 * 60 * 60 * 1000) // Convert days to ms
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting consent data:', error);
      // Fallback to document.cookie
      this.setCookie(key, JSON.stringify(value), this.config.cookieExpiration);
    }
  }

  getConsentData(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const data = JSON.parse(item);
      
      // Check if consent has expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        console.log(`Consent for ${key} has expired, removing...`);
        localStorage.removeItem(key);
        return null;
      }
      
      // Check if version is outdated
      if (data.version !== this.config.version) {
        console.log(`Consent version outdated for ${key}, requiring renewal...`);
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting consent data:', error);
      // Fallback to document.cookie
      const cookieValue = this.getCookie(key);
      return cookieValue ? { value: cookieValue, timestamp: Date.now() } : null;
    }
  }

  // Check if consent needs renewal
  isConsentExpiringSoon(key, daysBeforeExpiry = 1) {
    const data = this.getConsentData(key);
    if (!data || !data.expiresAt) return false;
    
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const expiryThreshold = Date.now() + (daysBeforeExpiry * oneDayInMs);
    
    return data.expiresAt < expiryThreshold;
  }

  // Fallback cookie utilities
  setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  }

  // Check consent status
  hasConsented() {
    const data = this.getConsentData(this.config.consentCookieName);
    return data && data.value;
  }

  hasDeclined() {
    const data = this.getConsentData(this.config.declineCookieName);
    return data && data.value;
  }

  // Category-based consent checking
  hasCategoryConsent(category) {
    const data = this.getConsentData(`${this.config.categoryPrefix}${category}`);
    return data && data.value;
  }

  // Enhanced tracking disable function
  disableTracking() {
    try {
      // Disable Google Analytics
      if (this.config.gaTrackingId) {
        window[`ga-disable-${this.config.gaTrackingId}`] = true;
      }
      
      // Set decline cookie
      this.setConsentData(this.config.declineCookieName, true);
      
      // Clear any existing tracking cookies
      this.setCookie("tracking", "disabled", -1);
      
      // Disable category-based tracking
      Object.keys(this.config.categories).forEach(category => {
        if (!this.config.categories[category].required) {
          this.setConsentData(`${this.config.categoryPrefix}${category}`, false);
        }
      });
    } catch (error) {
      console.error('Error disabling tracking:', error);
    }
  }

  // Pure CSS banner animation - always accessible
  hideBanner() {
    const bannerElement = this.getCachedElement("#cookie-consent");
    if (!bannerElement) return;

    try {
      // Add hiding class for CSS transition
      bannerElement.classList.add('cookie-banner--hiding');
      
      // Wait for animation to complete before hiding
      const transitionDuration = this.reducedMotion ? 0 : 600; // 0.6s in CSS
      
      setTimeout(() => {
        bannerElement.style.display = "none";
        bannerElement.classList.remove('cookie-banner--hiding');
        bannerElement.classList.remove('cookie-banner--visible');
      }, transitionDuration);
      
    } catch (error) {
      console.error('Error hiding banner:', error);
      // Fallback to instant hide
      bannerElement.style.display = "none";
    }
  }

  showBanner() {
    const bannerElement = this.getCachedElement("#cookie-consent");
    if (!bannerElement) return;

    try {
      // Ensure banner is displayed
      bannerElement.style.display = "block";
      
      // Force reflow before adding animation class
      bannerElement.offsetHeight;
      
      // Add visible class for CSS transition
      bannerElement.classList.add('cookie-banner--visible');
      
    } catch (error) {
      console.error('Error showing banner:', error);
      // Fallback to instant show
      bannerElement.style.display = "block";
    }
  }

  // Enhanced event binding with DOM caching and tracking
  bindEvents() {
    const acceptBtn = this.getCachedElement("#cookie-accept");
    const declineBtn = this.getCachedElement("#cookie-decline");

    // Bind main consent buttons
    this.addEventListenerTracked(acceptBtn, "click", this.handleAccept);
    this.addEventListenerTracked(declineBtn, "click", this.handleDecline);

    // Optional: Handle category-specific buttons if they exist
    Object.keys(this.config.categories).forEach(category => {
      const categoryBtn = this.getCachedElement(`#cookie-${category}`);
      if (categoryBtn) {
        this.addEventListenerTracked(categoryBtn, "click", () => this.handleCategoryToggle(category));
      }
    });

    // Optional: Handle settings/preferences button
    const settingsBtn = this.getCachedElement("#cookie-settings");
    if (settingsBtn) {
      this.addEventListenerTracked(settingsBtn, "click", () => this.showSettings());
    }
  }

  // Enhanced acceptance handler
  handleAccept() {
    try {
      console.log("Cookies accepted");
      
      // Set main consent
      this.setConsentData(this.config.consentCookieName, true);
      
      // Set all categories as accepted
      Object.keys(this.config.categories).forEach(category => {
        this.setConsentData(`${this.config.categoryPrefix}${category}`, true);
      });
      
      // Enable tracking
      this.enableTracking();
      
      // Hide banner
      this.hideBanner();
      
    } catch (error) {
      console.error('Error handling accept:', error);
    }
  }

  // Enhanced decline handler
  handleDecline() {
    try {
      console.log("Cookies declined");
      
      // Disable tracking and set decline status
      this.disableTracking();
      
      // Hide banner
      this.hideBanner();
      
    } catch (error) {
      console.error('Error handling decline:', error);
    }
  }

  // Category-specific toggle handler
  handleCategoryToggle(category) {
    try {
      const currentStatus = this.hasCategoryConsent(category);
      const newStatus = !currentStatus;
      
      this.setConsentData(`${this.config.categoryPrefix}${category}`, newStatus);
      
      console.log(`Cookie category '${category}' ${newStatus ? 'enabled' : 'disabled'}`);
      
      // Update UI if toggle elements exist
      const toggleElement = document.querySelector(`#cookie-${category}`);
      if (toggleElement) {
        toggleElement.classList.toggle('active', newStatus);
        toggleElement.setAttribute('aria-pressed', newStatus.toString());
      }
      
    } catch (error) {
      console.error(`Error toggling category '${category}':`, error);
    }
  }

  // Enable tracking function
  enableTracking() {
    try {
      // Re-enable Google Analytics if it was disabled
      if (this.config.gaTrackingId) {
        window[`ga-disable-${this.config.gaTrackingId}`] = false;
      }
      
      // Custom event for other scripts to listen to
      window.dispatchEvent(new CustomEvent('cookieConsentAccepted', {
        detail: { categories: this.getAcceptedCategories() }
      }));
      
    } catch (error) {
      console.error('Error enabling tracking:', error);
    }
  }

  // Get list of accepted categories
  getAcceptedCategories() {
    const accepted = [];
    Object.keys(this.config.categories).forEach(category => {
      if (this.hasCategoryConsent(category)) {
        accepted.push(category);
      }
    });
    return accepted;
  }

  // Optional: Show settings/preferences panel
  showSettings() {
    const settingsPanel = this.getCachedElement("#cookie-settings-panel");
    if (settingsPanel) {
      settingsPanel.style.display = "block";
      settingsPanel.classList.add('cookie-settings--visible');
    }
  }

  hideSettings() {
    const settingsPanel = this.getCachedElement("#cookie-settings-panel");
    if (settingsPanel) {
      settingsPanel.classList.remove('cookie-settings--visible');
      setTimeout(() => {
        settingsPanel.style.display = "none";
      }, this.reducedMotion ? 0 : 300);
    }
  }

  // Check existing consent and show banner if needed
  checkExistingConsent() {
    try {
      // Check if consent is expiring soon
      const isExpiring = this.isConsentExpiringSoon(this.config.consentCookieName);
      
      if ((!this.hasConsented() && !this.hasDeclined()) || isExpiring) {
        // Initially hide the banner
        const bannerElement = this.getCachedElement("#cookie-consent");
        if (bannerElement) {
          bannerElement.style.display = "none";
          // Add initial positioning class
          bannerElement.classList.add('cookie-banner--hidden');
        }

        // Show banner after delay
        setTimeout(() => {
          if (isExpiring) {
            console.log('Cookie consent expiring soon, showing renewal banner');
          }
          this.showBanner();
        }, this.config.showDelay);
      } else {
        // Keep banner hidden if consent already given and not expiring
        const bannerElement = this.getCachedElement("#cookie-consent");
        if (bannerElement) {
          bannerElement.style.display = "none";
          bannerElement.classList.add('cookie-banner--hidden');
        }
      }
    } catch (error) {
      console.error('Error checking existing consent:', error);
    }
  }

  // GDPR Compliance: Withdraw consent
  withdrawConsent(category = null) {
    try {
      if (category) {
        // Withdraw specific category
        this.setConsentData(`${this.config.categoryPrefix}${category}`, false);
        console.log(`Consent withdrawn for category: ${category}`);
      } else {
        // Withdraw all consent
        localStorage.removeItem(this.config.consentCookieName);
        Object.keys(this.config.categories).forEach(cat => {
          if (!this.config.categories[cat].required) {
            localStorage.removeItem(`${this.config.categoryPrefix}${cat}`);
          }
        });
        console.log('All consent withdrawn');
      }
      
      // Dispatch withdrawal event
      window.dispatchEvent(new CustomEvent('cookieConsentWithdrawn', {
        detail: { category, timestamp: Date.now() }
      }));
      
    } catch (error) {
      console.error('Error withdrawing consent:', error);
    }
  }

  // Get consent history/audit trail
  getConsentHistory() {
    const history = [];
    
    try {
      // Main consent
      const mainConsent = this.getConsentData(this.config.consentCookieName);
      if (mainConsent) {
        history.push({
          type: 'main',
          status: mainConsent.value,
          timestamp: mainConsent.timestamp,
          version: mainConsent.version
        });
      }

      // Category consents
      Object.keys(this.config.categories).forEach(category => {
        const categoryConsent = this.getConsentData(`${this.config.categoryPrefix}${category}`);
        if (categoryConsent) {
          history.push({
            type: 'category',
            category,
            status: categoryConsent.value,
            timestamp: categoryConsent.timestamp,
            version: categoryConsent.version
          });
        }
      });
      
    } catch (error) {
      console.error('Error getting consent history:', error);
    }
    
    return history.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Reset all consent data (for testing/development)
  resetAllConsent() {
    try {
      localStorage.removeItem(this.config.consentCookieName);
      localStorage.removeItem(this.config.declineCookieName);
      Object.keys(this.config.categories).forEach(category => {
        localStorage.removeItem(`${this.config.categoryPrefix}${category}`);
      });
      this.clearDOMCache();
      console.log('All consent data reset');
    } catch (error) {
      console.error('Error resetting consent:', error);
    }
  }

  // Public API for external scripts to check consent
  static checkConsent(category = null) {
    const manager = window.cookieConsentManager;
    if (!manager) return false;
    
    return category ? manager.hasCategoryConsent(category) : manager.hasConsented();
  }

  // Public API to withdraw consent
  static withdrawConsent(category = null) {
    const manager = window.cookieConsentManager;
    if (manager) {
      manager.withdrawConsent(category);
    }
  }

  // Public API to get consent history
  static getConsentHistory() {
    const manager = window.cookieConsentManager;
    return manager ? manager.getConsentHistory() : [];
  }
}

// Initialize the cookie consent manager
// Following Slater guidelines - no DOMContentLoaded wrapper needed
try {
  const cookieConsentManager = new CookieConsentManager();
  
  // Make available globally for other scripts
  window.cookieConsentManager = cookieConsentManager;
  
  // Development helper - expose reset function in dev mode
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('webflow.io')) {
    window.resetCookieConsent = () => cookieConsentManager.resetAllConsent();
  }
  
} catch (error) {
  console.error('Failed to initialize cookie consent manager:', error);
}
