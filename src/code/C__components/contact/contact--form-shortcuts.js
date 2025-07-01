// ───────────────────────────────────────────────────────────────
// Contact
// Form Shortcuts
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   FEATURES:
   - Ctrl + Enter: Submit form (validates first)
   - Ctrl + Shift + R: Reset form and clear memory
   - Ctrl + S: Save form state manually
   - Escape: Clear current field
   - Visual feedback on shortcut activation
   - Works with dynamic Webflow forms
   - Respects form validation
   - Accessibility compliant
────────────────────────────────────────────────────────────────*/

(() => {
  // Configuration
  const SHORTCUTS = {
    SUBMIT: { key: "Enter", modifiers: ["cmd", "ctrl"] },
    RESET: { key: "r", modifiers: ["cmd", "ctrl", "shift"] },
    SAVE: { key: "s", modifiers: ["cmd", "ctrl"] },
    CLEAR_FIELD: { key: "Escape", modifiers: [] },
  };

  const FEEDBACK_DURATION = 2000;
  const TOOLTIP_DELAY = 1000;

  // Cache for performance
  const formCache = new WeakMap();
  const tooltipCache = new WeakMap();

  /* 
     1. Core Shortcut Detection
  */

  function matchesShortcut(event, shortcut) {
    const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();

    const modifierChecks = {
      cmd: event.metaKey,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
    };

    const requiredModifiers = shortcut.modifiers || [];
    const activeModifiers = Object.keys(modifierChecks).filter(
      (mod) => modifierChecks[mod]
    );

    // Check if all required modifiers are pressed
    const hasAllRequired = requiredModifiers.every(
      (mod) => modifierChecks[mod]
    );

    // Check if any extra modifiers are pressed
    const hasOnlyRequired = activeModifiers.length === requiredModifiers.length;

    return keyMatches && hasAllRequired && hasOnlyRequired;
  }

  /* 
     2. Visual Feedback System
  */

  function showFeedback(message, type = "info") {
    // Remove existing feedback
    const existing = document.querySelector(".form-shortcut-feedback");
    if (existing) existing.remove();

    const feedback = document.createElement("div");
    feedback.className = "form-shortcut-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    const colors = {
      success: "#10b981",
      error: "#ef4444",
      info: "#3b82f6",
    };

    feedback.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${colors[type] || colors.info};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      font-size: 0.875rem;
      font-weight: 500;
      transform: translateY(100%);
      opacity: 0;
      transition: all 0.3s ease;
    `;

    feedback.textContent = message;
    document.body.appendChild(feedback);

    // Animate in
    requestAnimationFrame(() => {
      feedback.style.transform = "translateY(0)";
      feedback.style.opacity = "1";
    });

    // Remove after duration
    setTimeout(() => {
      feedback.style.transform = "translateY(100%)";
      feedback.style.opacity = "0";
      setTimeout(() => feedback.remove(), 300);
    }, FEEDBACK_DURATION);
  }

  /* 
     3. Tooltip System
  */

  function createTooltip(element, shortcuts) {
    if (tooltipCache.has(element)) return;

    const tooltip = document.createElement("div");
    tooltip.className = "form-shortcut-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-0.5rem);
      padding: 0.5rem 0.75rem;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 9998;
    `;

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modSymbol = isMac ? "" : "Ctrl";

    tooltip.innerHTML = shortcuts
      .map((s) => {
        const mods = s.modifiers.map((m) =>
          m === "cmd" || m === "ctrl"
            ? modSymbol
            : m.charAt(0).toUpperCase() + m.slice(1)
        );
        return `<div>${mods.join("+")}${mods.length ? "+" : ""}${s.key}: ${
          s.label
        }</div>`;
      })
      .join("");

    element.style.position = "relative";
    element.appendChild(tooltip);
    tooltipCache.set(element, tooltip);

    // Show/hide on hover
    let hoverTimeout;
    element.addEventListener("mouseenter", () => {
      hoverTimeout = setTimeout(() => {
        tooltip.style.opacity = "1";
      }, TOOLTIP_DELAY);
    });

    element.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);
      tooltip.style.opacity = "0";
    });
  }

  /* 
     4. Form Actions
  */

  function handleSubmit(form, event) {
    event.preventDefault();

    // Find submit button
    const submitBtn = form.querySelector(
      'input[type="submit"], [type="submit"], [data-form-submit]'
    );
    if (!submitBtn) return;

    // Check if form has validation
    const hasValidation = form.closest("[data-live-validate]");
    if (hasValidation) {
      // Trigger click to use existing validation flow
      submitBtn.click();
      showFeedback("Form submitted!", "success");
    } else {
      // Direct submit for non-validated forms
      if (form.checkValidity()) {
        submitBtn.click();
        showFeedback("Form submitted!", "success");
      } else {
        form.reportValidity();
        showFeedback("Please fix form errors", "error");
      }
    }
  }

  function handleReset(form, event) {
    event.preventDefault();

    // Dispatch custom event for form logic to handle
    form.dispatchEvent(new CustomEvent("form-reset-requested"));

    // Also reset the form directly
    form.reset();

    // Clear any cached data
    if (formCache.has(form)) {
      const cache = formCache.get(form);
      if (cache.clearMemory) cache.clearMemory();
    }

    showFeedback("Form reset!", "info");
  }

  function handleSave(form, event) {
    event.preventDefault();

    // Trigger save if form has memory feature
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Store in localStorage with form ID
    const formId = form.getAttribute("id") || `form_${Date.now()}`;
    const storageKey = `form_manual_save_${formId}`;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
      showFeedback("Form saved!", "success");
    } catch (e) {
      showFeedback("Failed to save form", "error");
    }
  }

  function handleClearField(event) {
    const target = event.target;
    if (target.matches("input, textarea") && target.value) {
      target.value = "";
      target.dispatchEvent(new Event("input", { bubbles: true }));
      showFeedback("Field cleared", "info");
    }
  }

  /* 
     5. Shortcut Handler
  */

  function handleKeydown(event) {
    const form = event.target.closest("form");
    if (!form) return;

    // Submit shortcut (exclude textareas)
    if (matchesShortcut(event, SHORTCUTS.SUBMIT)) {
      if (event.target.tagName !== "TEXTAREA") {
        handleSubmit(form, event);
      }
      return;
    }

    // Reset shortcut
    if (matchesShortcut(event, SHORTCUTS.RESET)) {
      handleReset(form, event);
      return;
    }

    // Save shortcut
    if (matchesShortcut(event, SHORTCUTS.SAVE)) {
      handleSave(form, event);
      return;
    }

    // Clear field shortcut
    if (matchesShortcut(event, SHORTCUTS.CLEAR_FIELD)) {
      handleClearField(event);
      return;
    }
  }

  /* 
     6. Form Enhancement
  */

  function enhanceForm(form) {
    if (formCache.has(form)) return;

    // Mark as enhanced
    formCache.set(form, { enhanced: true });

    // Add tooltips to submit buttons
    const submitBtns = form.querySelectorAll(
      'input[type="submit"], [type="submit"], [data-form-submit]'
    );
    submitBtns.forEach((btn) => {
      createTooltip(btn.parentElement || btn, [
        { ...SHORTCUTS.SUBMIT, label: "Submit" },
        { ...SHORTCUTS.RESET, label: "Reset" },
        { ...SHORTCUTS.SAVE, label: "Save" },
      ]);
    });

    // Add aria-label for screen readers
    form.setAttribute(
      "aria-label",
      form.getAttribute("aria-label") || "Form with keyboard shortcuts"
    );
  }

  /* 
     7. Initialization
  */

  function initFormShortcuts(container = document) {
    // Find all forms
    const forms = container.querySelectorAll("form");
    forms.forEach(enhanceForm);
  }

  // ─────────────────────────────────────────────────────────────
  // Module Interface for Coordinator
  // ─────────────────────────────────────────────────────────────
  
  const ShortcutsModule = {
    name: 'shortcuts',
    
    init: function(container = document) {
      initFormShortcuts(container);
      
      // Global keydown listener (only add once)
      if (!document._shortcutsListenerAdded) {
        document.addEventListener("keydown", handleKeydown);
        document._shortcutsListenerAdded = true;
      }
    },
    
    initForm: function(form) {
      enhanceForm(form);
    },
    
    cleanupForm: function(form) {
      if (formCache.has(form)) {
        formCache.delete(form);
      }
      
      // Remove tooltips
      const tooltip = tooltipCache.get(form);
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
        tooltipCache.delete(form);
      }
    }
  };

  // Export for debugging
  window.__formShortcuts = {
    showFeedback,
    shortcuts: SHORTCUTS,
  };
  
  // Register with coordinator
  if (window.ContactFormCoordinator) {
    window.ContactFormCoordinator.register('shortcuts', ShortcutsModule);
  } else {
    // Fallback if coordinator not available
    initFormShortcuts();
    document.addEventListener("keydown", handleKeydown);

    if (typeof Webflow !== "undefined" && Webflow.push) {
      try {
        Webflow.push(() => {
          initFormShortcuts();
        });
      } catch (e) {
        console.warn("Webflow integration failed for form shortcuts:", e);
      }
    }
  }
})();
