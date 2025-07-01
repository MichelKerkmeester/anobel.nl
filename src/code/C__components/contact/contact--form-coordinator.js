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
  // 1. Configuration & State
  // ─────────────────────────────────────────────────────────────
  
  const CONFIG = {
    // Module initialization order (dependencies first)
    INIT_ORDER: [
      'attributes',  // Must load first - provides selectors
      'memory',      // Early initialization for auto-restore
      'validation',  // Before submit handling
      'phone',       // Formatting before validation
      'shortcuts',   // Before submit handling
      'setup',       // Formspark integration
      'submit'       // Final submit handling
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
      console.warn(`Module ${name} already registered`);
      return;
    }
    
    STATE.moduleInstances.set(name, module);
    
    // If module has init function, prepare it for coordination
    if (module.init && typeof module.init === 'function') {
      module._originalInit = module.init;
      module.init = createCoordinatedInit(name, module._originalInit);
    }
    
    console.log(`Module ${name} registered with coordinator`);
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
          console.warn(`Module ${moduleName} waiting for dependencies:`, missingDeps);
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
        
        console.log(`Module ${moduleName} initialized`);
      } catch (error) {
        console.error(`Failed to initialize module ${moduleName}:`, error);
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
    
    // Initialize modules in order
    CONFIG.INIT_ORDER.forEach(moduleName => {
      const module = STATE.moduleInstances.get(moduleName);
      if (module && module.initForm && typeof module.initForm === 'function') {
        try {
          module.initForm(form);
        } catch (error) {
          console.error(`Failed to initialize ${moduleName} for form:`, error);
        }
      }
    });
    
    // Emit form initialized event
    eventBus.dispatchEvent(new CustomEvent('form-initialized', {
      detail: { form }
    }));
    
    console.log('Form initialized with all modules:', form);
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
          console.error(`Failed to cleanup ${moduleName} for form:`, error);
        }
      }
    });
    
    STATE.initializedForms.delete(form);
    
    // Emit form cleanup event
    eventBus.dispatchEvent(new CustomEvent('form-cleanup', {
      detail: { form }
    }));
    
    console.log('Form cleaned up:', form);
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
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('Centralized DOM observation started');
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
    
    console.log('Contact Form Coordinator started');
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