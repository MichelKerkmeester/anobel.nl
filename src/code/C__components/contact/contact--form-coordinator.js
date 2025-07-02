// ───────────────────────────────────────────────────────────────
// Contact
// Form Module Coordinator
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES:
   
   - Coordinates initialization of all contact form modules
   - Prevents duplicate event handlers and memory leaks
   - Manages module load order and dependencies
   - Provides centralized event bus for inter-module communication
   - Single MutationObserver for all form changes
   - Initialization guards to prevent conflicts
────────────────────────────────────────────────────────────────*/

(() => {
  // ─────────────────────────────────────────────────────────────
  // 0. Logger System
  // ─────────────────────────────────────────────────────────────
  
  const Logger = {
    isEnabled: false, // Set to true for debugging
    
    log: function(message, ...args) {
      if (this.isEnabled && typeof console !== 'undefined' && console.log) {
        console.log(`[ContactForm] ${message}`, ...args);
      }
    },
    
    warn: function(message, ...args) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[ContactForm] ${message}`, ...args);
      }
    },
    
    error: function(message, ...args) {
      if (typeof console !== 'undefined' && console.error) {
        console.error(`[ContactForm] ${message}`, ...args);
      }
    }
  };
  
  // Enable logging in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    Logger.isEnabled = true;
  }
  
  // ─────────────────────────────────────────────────────────────
  // 1. Configuration & State
  // ─────────────────────────────────────────────────────────────
  
  const CONFIG = {
    // Module initialization order (dependencies first)
    INIT_ORDER: [
      'attributes',  // Must load first - provides selectors
      'memory',      // Early initialization for auto-restore
      'validation',  // Before submit handling (now includes phone formatting)
      'shortcuts',   // Before submit handling
      'submission'   // Unified submission and post-action handling
    ],
    
    // Debounce timing
    DEBOUNCE_MS: 100,
    
    // Event namespaces
    EVENT_NAMESPACE: 'contact-form'
  };
  
  // Global state
  const STATE = {
    initializedModules: new Set(),
    initializedForms: new WeakSet(),
    eventListeners: new Map(),
    moduleInstances: new Map(),
    pendingInitializations: new Set()
  };
  
  // Event bus for inter-module communication
  const eventBus = new EventTarget();
  
  // ─────────────────────────────────────────────────────────────
  // 2. Module Registration System
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Register a module with the coordinator
   * @param {string} name - Module name
   * @param {Object} module - Module interface
   */
  function registerModule(name, module) {
    if (STATE.moduleInstances.has(name)) {
      Logger.warn(`Module ${name} already registered`);
      return;
    }
    
    STATE.moduleInstances.set(name, module);
    
    // If module has init function, prepare it for coordination
    if (module.init && typeof module.init === 'function') {
      module._originalInit = module.init;
      module.init = createCoordinatedInit(name, module._originalInit);
    }
    
    Logger.log(`Module ${name} registered with coordinator`);
  }
  
  /**
   * Create coordinated initialization function
   * @param {string} moduleName - Module name
   * @param {Function} originalInit - Original init function
   * @returns {Function} Coordinated init function
   */
  function createCoordinatedInit(moduleName, originalInit) {
    return function(container = document) {
      // Check if already initialized
      if (STATE.initializedModules.has(moduleName)) {
        return;
      }
      
      // Check dependencies
      const moduleIndex = CONFIG.INIT_ORDER.indexOf(moduleName);
      if (moduleIndex > 0) {
        const dependencies = CONFIG.INIT_ORDER.slice(0, moduleIndex);
        const missingDeps = dependencies.filter(dep => !STATE.initializedModules.has(dep));
        
        if (missingDeps.length > 0) {
          Logger.warn(`Module ${moduleName} waiting for dependencies:`, missingDeps);
          STATE.pendingInitializations.add(moduleName);
          return;
        }
      }
      
      // Initialize module
      try {
        originalInit.call(this, container);
        STATE.initializedModules.add(moduleName);
        
        // Emit initialization event
        eventBus.dispatchEvent(new CustomEvent(`module-initialized`, {
          detail: { module: moduleName }
        }));
        
        // Try to initialize pending modules
        processPendingInitializations();
        
        Logger.log(`Module ${moduleName} initialized`);
      } catch (error) {
        Logger.error(`Failed to initialize module ${moduleName}:`, error);
      }
    };
  }
  
  /**
   * Process pending module initializations
   */
  function processPendingInitializations() {
    const pending = Array.from(STATE.pendingInitializations);
    
    pending.forEach(moduleName => {
      const module = STATE.moduleInstances.get(moduleName);
      if (module && module.init) {
        STATE.pendingInitializations.delete(moduleName);
        module.init();
      }
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // 3. Form Management
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Initialize a form with all registered modules
   * @param {HTMLFormElement} form - Form element
   */
  function initializeForm(form) {
    // Skip if already initialized
    if (STATE.initializedForms.has(form)) {
      return;
    }
    
    // Mark as initialized early to prevent re-entry
    STATE.initializedForms.add(form);
    
    // Set up centralized submit handler BEFORE module initialization
    setupCentralizedSubmitHandler(form);
    
    // Initialize modules in order
    CONFIG.INIT_ORDER.forEach(moduleName => {
      const module = STATE.moduleInstances.get(moduleName);
      if (module && module.initForm && typeof module.initForm === 'function') {
        try {
          module.initForm(form);
        } catch (error) {
          Logger.error(`Failed to initialize ${moduleName} for form:`, error);
        }
      }
    });
    
    // Emit form initialized event
    eventBus.dispatchEvent(new CustomEvent('form-initialized', {
      detail: { form }
    }));
    
    Logger.log('Form initialized with all modules:', form);
  }
  
  /**
   * Setup centralized submit handler to prevent duplicate submissions
   * @param {HTMLFormElement} form - Form element
   */
  function setupCentralizedSubmitHandler(form) {
    // Store submission state
    const submissionState = {
      isSubmitting: false,
      lastSubmitTime: 0,
      debounceMs: 1000 // Prevent double-clicks
    };
    
    form._coordinatorSubmissionState = submissionState;
    
    // Single submit handler for the form
    form.addEventListener('submit', function(event) {
      const now = Date.now();
      
      // Debounce check
      if (submissionState.isSubmitting || 
          (now - submissionState.lastSubmitTime) < submissionState.debounceMs) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      
      // Update submission state
      submissionState.isSubmitting = true;
      submissionState.lastSubmitTime = now;
      
      // Emit pre-submit event for modules to handle
      const preSubmitEvent = new CustomEvent('coordinator:pre-submit', {
        detail: { 
          form, 
          originalEvent: event,
          preventDefault: () => event.preventDefault()
        },
        cancelable: true
      });
      
      const shouldContinue = eventBus.dispatchEvent(preSubmitEvent);
      
      // Reset state after processing
      setTimeout(() => {
        submissionState.isSubmitting = false;
      }, submissionState.debounceMs);
      
      // If any module cancelled the event, stop here
      if (!shouldContinue || event.defaultPrevented) {
        return;
      }
      
      // Emit post-submit event
      eventBus.dispatchEvent(new CustomEvent('coordinator:post-submit', {
        detail: { form, originalEvent: event }
      }));
    }, true); // Use capture phase to run before module handlers
  }
  
  /**
   * Cleanup form when removed from DOM
   * @param {HTMLFormElement} form - Form element
   */
  function cleanupForm(form) {
    if (!STATE.initializedForms.has(form)) {
      return;
    }
    
    // Cleanup modules in reverse order
    const reverseOrder = [...CONFIG.INIT_ORDER].reverse();
    reverseOrder.forEach(moduleName => {
      const module = STATE.moduleInstances.get(moduleName);
      if (module && module.cleanupForm && typeof module.cleanupForm === 'function') {
        try {
          module.cleanupForm(form);
        } catch (error) {
          Logger.error(`Failed to cleanup ${moduleName} for form:`, error);
        }
      }
    });
    
    STATE.initializedForms.delete(form);
    
    // Emit form cleanup event
    eventBus.dispatchEvent(new CustomEvent('form-cleanup', {
      detail: { form }
    }));
    
    Logger.log('Form cleaned up:', form);
  }
  
  /**
   * Stop DOM observation and cleanup
   */
  function stopDOMObservation() {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    
    if (STATE.intersectionObserver) {
      STATE.intersectionObserver.disconnect();
      STATE.intersectionObserver = null;
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // 4. Centralized DOM Observer
  // ─────────────────────────────────────────────────────────────
  
  let mutationObserver = null;
  let observerTimeout = null;
  
  /**
   * Handle DOM mutations with debouncing
   * @param {MutationRecord[]} mutations - Mutation records
   */
  function handleMutations(mutations) {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      processMutations(mutations);
    }, CONFIG.DEBOUNCE_MS);
  }
  
  /**
   * Process DOM mutations
   * @param {MutationRecord[]} mutations - Mutation records
   */
  function processMutations(mutations) {
    const formsToInit = new Set();
    const formsToCleanup = new Set();
    
    mutations.forEach(mutation => {
      // Handle added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          // Check if node is a form
          if (node.matches && node.matches('form')) {
            formsToInit.add(node);
          }
          // Check for forms within the node
          else if (node.querySelectorAll) {
            const forms = node.querySelectorAll('form');
            forms.forEach(form => formsToInit.add(form));
          }
        }
      });
      
      // Handle removed nodes
      mutation.removedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && node.matches('form')) {
            formsToCleanup.add(node);
          }
          else if (node.querySelectorAll) {
            const forms = node.querySelectorAll('form');
            forms.forEach(form => formsToCleanup.add(form));
          }
        }
      });
    });
    
    // Process form changes
    formsToCleanup.forEach(form => cleanupForm(form));
    formsToInit.forEach(form => initializeForm(form));
  }
  
  /**
   * Start centralized DOM observation
   */
  function startDOMObservation() {
    if (mutationObserver) {
      return; // Already observing
    }
    
    mutationObserver = new MutationObserver(handleMutations);
    
    // Optimize: Only observe containers likely to have forms
    const observeTargets = [
      document.body,
      ...document.querySelectorAll('.w-form, .form-container, [data-form-container]')
    ];
    
    // Set up intersection observer for performance
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target._formObserved) {
          entry.target._formObserved = true;
          // Only observe visible form containers
          mutationObserver.observe(entry.target, {
            childList: true,
            subtree: true,
            attributes: false, // Don't need attribute changes
            characterData: false // Don't need text changes
          });
        }
      });
    }, {
      rootMargin: '50px' // Start observing slightly before visible
    });
    
    // Observe main container and specific form areas
    observeTargets.forEach(target => {
      if (target === document.body) {
        // For body, only watch direct children to catch new sections
        mutationObserver.observe(target, {
          childList: true,
          subtree: false // Key optimization: don't watch entire subtree
        });
      } else {
        // Use intersection observer for form containers
        intersectionObserver.observe(target);
      }
    });
    
    // Store observers for cleanup
    STATE.intersectionObserver = intersectionObserver;
    
    Logger.log('Optimized DOM observation started');
  }
  
  // ─────────────────────────────────────────────────────────────
  // 5. Event Bus System
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Subscribe to coordinator events
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  function on(eventType, handler, options = {}) {
    eventBus.addEventListener(eventType, handler, options);
    
    // Track for cleanup
    if (!STATE.eventListeners.has(eventType)) {
      STATE.eventListeners.set(eventType, new Set());
    }
    STATE.eventListeners.get(eventType).add(handler);
  }
  
  /**
   * Unsubscribe from coordinator events
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler
   */
  function off(eventType, handler) {
    eventBus.removeEventListener(eventType, handler);
    
    const handlers = STATE.eventListeners.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }
  
  /**
   * Emit coordinator event
   * @param {string} eventType - Event type
   * @param {Object} detail - Event detail
   */
  function emit(eventType, detail = {}) {
    eventBus.dispatchEvent(new CustomEvent(eventType, { detail }));
  }
  
  // ─────────────────────────────────────────────────────────────
  // 6. Initialization
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Initialize all contact forms on the page
   */
  function initAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => initializeForm(form));
  }
  
  /**
   * Start the coordinator system
   */
  function start() {
    // Initialize existing forms
    initAllForms();
    
    // Start DOM observation
    startDOMObservation();
    
    // Integrate with Webflow
    if (typeof Webflow !== 'undefined' && Webflow.push) {
      Webflow.push(() => {
        initAllForms();
      });
    }
    
    Logger.log('Contact Form Coordinator started');
  }
  
  // ─────────────────────────────────────────────────────────────
  // 7. Public API
  // ─────────────────────────────────────────────────────────────
  
  window.ContactFormCoordinator = {
    // Module management
    register: registerModule,
    
    // Form management
    initForm: initializeForm,
    cleanupForm: cleanupForm,
    initAll: initAllForms,
    
    // Event system
    on,
    off,
    emit,
    
    // System control
    start,
    stop: stopDOMObservation,
    
    // Logger
    Logger,
    
    // State inspection (for debugging)
    getState: () => ({ ...STATE }),
    getRegisteredModules: () => Array.from(STATE.moduleInstances.keys()),
    isModuleInitialized: (name) => STATE.initializedModules.has(name),
    isFormInitialized: (form) => STATE.initializedForms.has(form)
  };
  
  // ─────────────────────────────────────────────────────────────
  // 8. Auto-Start
  // ─────────────────────────────────────────────────────────────
  
  // Start coordinator (Slater handles DOM ready)
  start();
  
})();