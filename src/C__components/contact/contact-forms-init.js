// ───────────────────────────────────────────────────────────────
// Contact Forms - Main Entry Point
// Loads all modules in the correct order for Slater/Webflow
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   USAGE IN SLATER:
   
   1. Upload this file to Slater
   2. Add the following data attributes to your forms:
      - data-formspark-url="your-formspark-url"
      - data-botpoison-key="your-botpoison-public-key"
   3. The modules will auto-initialize in the correct order
   
   MODULE LOAD ORDER:
   1. Attributes (provides selectors)
   2. Coordinator (manages all modules)
   3. Memory (auto-save/restore)
   4. Validation (with phone formatting)
   5. Shortcuts (keyboard controls)
   6. Submission (form handling)
────────────────────────────────────────────────────────────────*/

// Check if already initialized
if (!window.__ContactFormsInitialized) {
  window.__ContactFormsInitialized = true;

  // Module URLs - Update these to match your Slater file URLs
  const MODULE_URLS = {
    attributes: '/contact--form-attributes.js',
    coordinator: '/contact--form-coordinator.js',
    memory: '/contact--form-memory.js',
    validation: '/contact--form-validation.js',
    shortcuts: '/contact--form-shortcuts.js',
    submission: '/contact--form-submission.js'
  };

  // Load order (dependencies first)
  const LOAD_ORDER = [
    'attributes',   // Must load first - provides selectors
    'coordinator',  // Must load second - manages modules
    'memory',       // Early for auto-restore
    'validation',   // Before submission
    'shortcuts',    // Before submission
    'submission'    // Last - depends on others
  ];

  /**
   * Load a script dynamically
   * @param {string} url - Script URL
   * @returns {Promise} Promise that resolves when script loads
   */
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = false; // Maintain load order
      
      script.onload = () => {
        console.log(`[Contact Forms] Loaded: ${url}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`[Contact Forms] Failed to load: ${url}`);
        reject(new Error(`Failed to load ${url}`));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Load all modules in sequence
   */
  async function loadAllModules() {
    console.log('[Contact Forms] Starting module initialization...');
    
    for (const moduleName of LOAD_ORDER) {
      const url = MODULE_URLS[moduleName];
      if (!url) {
        console.warn(`[Contact Forms] No URL defined for module: ${moduleName}`);
        continue;
      }
      
      try {
        await loadScript(url);
      } catch (error) {
        console.error(`[Contact Forms] Failed to load ${moduleName}:`, error);
        // Continue loading other modules even if one fails
      }
    }
    
    console.log('[Contact Forms] All modules loaded');
    
    // Start the coordinator now that all modules are registered
    if (window.ContactFormCoordinator && window.ContactFormCoordinator.start) {
      try {
        window.ContactFormCoordinator.start();
        console.log('[Contact Forms] Coordinator started successfully');
      } catch (error) {
        console.error('[Contact Forms] Failed to start coordinator:', error);
      }
    } else {
      console.warn('[Contact Forms] Coordinator not found or missing start method');
    }
  }

  // Start loading modules
  loadAllModules().catch(error => {
    console.error('[Contact Forms] Module loading failed:', error);
  });
}