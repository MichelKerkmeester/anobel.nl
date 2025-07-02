// ───────────────────────────────────────────────────────────────
// CMS: Conditional Visibility
// Performance Optimization
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
     Removes hidden CMS elements from DOM to prevent resource loading
     - Webflow hides with display: none but still loads content
     - This removes them entirely for better performance
  ────────────────────────────────────────────────────────────────*/
  
  // Remove all initially hidden elements
  document.querySelectorAll('.w-condition-invisible').forEach(el => {
    el.remove();
  });

  // Handle dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const element = /** @type {HTMLElement} */ (node);
          
          // Check if added node is invisible
          if (element.classList?.contains('w-condition-invisible')) {
            element.remove();
          }
          
          // Check for invisible children
          element.querySelectorAll?.('.w-condition-invisible')?.forEach(el => {
            el.remove();
          });
        }
      });
    });
  });

  // Start observing for DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();