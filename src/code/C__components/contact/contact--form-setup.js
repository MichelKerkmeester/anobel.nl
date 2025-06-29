// ───────────────────────────────────────────────────────────────
// Contact
// Formspark & Botpoison Integration
// ───────────────────────────────────────────────────────────────
(() => {
  /* ─────────────────────────────────────────────────────────────
       1. Configuration & Setup
    ────────────────────────────────────────────────────────────────*/

  // Formspark configuration - using let for dynamic updates
  let FORMSPARK_ACTION_URL = "https://submit-form.com/PbxxhNQQW";

  // Botpoison configuration - using let for dynamic updates
  let BOTPOISON_PUBLIC_KEY = "pk_011ee0f4-b613-4bd6-8cf2-f74653b42ae3";

  // Form selectors (compatible with live validation)
  const FORM_CONTAINER_SELECTOR = "[data-live-validate]";
  const WEBFLOW_FORM_SELECTOR = "form";
  const SUBMIT_BUTTON_SELECTOR = 'input[type="submit"], [type="submit"], [data-form-submit]';

  /* ─────────────────────────────────────────────────────────────
       2. Botpoison Integration
    ────────────────────────────────────────────────────────────────*/

  // Load Botpoison script dynamically
  function loadBotpoison() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Botpoison) {
        resolve(window.Botpoison);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@botpoison/browser@1.0.0";
      script.async = true;

      script.onload = () => {
        if (window.Botpoison) {
          resolve(window.Botpoison);
        } else {
          reject(new Error("Botpoison failed to load"));
        }
      };

      script.onerror = () =>
        reject(new Error("Failed to load Botpoison script"));

      document.head.appendChild(script);
    });
  }

  // Get Botpoison challenge solution with timeout
  async function getBotpoisonSolution() {
    try {
      const Botpoison = await loadBotpoison();

      // Add timeout for challenge (10 seconds max)
      const challengePromise = Botpoison.challenge(BOTPOISON_PUBLIC_KEY);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Botpoison timeout")), 10000)
      );

      const result = await Promise.race([
        challengePromise,
        timeoutPromise,
      ]);
      
      // Ensure we have a valid solution object
      if (!result || typeof result !== 'object' || !result.solution) {
        throw new Error('Invalid Botpoison response');
      }
      
      const { solution } = result;
      return solution;
    } catch (error) {
      console.warn("Botpoison challenge failed:", error);
      return null; // Continue without Botpoison if it fails
    }
  }

  /* ─────────────────────────────────────────────────────────────
       3. Form Data Processing
    ────────────────────────────────────────────────────────────────*/

  // Extract form data and prepare for submission
  function prepareFormData(form) {
    const formData = new FormData(form);
    const data = {};

    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes, multi-select)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Add timestamp for tracking
    data._timestamp = new Date().toISOString();

    // Add page information for context (sanitized)
    const url = new URL(window.location.href);
    data._page_url = `${url.origin}${url.pathname}`; // Remove query params and hash
    data._page_title = document.title.slice(0, 200); // Limit title length
    data._user_agent = navigator.userAgent.slice(0, 500); // Limit UA length

    return data;
  }

  /* ─────────────────────────────────────────────────────────────
       4. Formspark Submission
    ────────────────────────────────────────────────────────────────*/

  // Submit form data to Formspark
  async function submitToFormspark(formData, botpoisonSolution) {
    // Add Botpoison solution if available
    if (botpoisonSolution) {
      formData._botpoison = botpoisonSolution;
    }

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error("Formspark submission failed:", error);
      return { success: false, error: error.message };
    }
  }

  /* ─────────────────────────────────────────────────────────────
       5. UI State Management
    ────────────────────────────────────────────────────────────────*/

  // Show loading state
  function showLoadingState(form, submitButton) {
    submitButton.disabled = true;
    
    // Handle different types of submit elements
    if (submitButton.tagName.toLowerCase() === 'input') {
      submitButton.value = "Sending...";
    } else {
      // For custom elements (div, button, etc.)
      submitButton.textContent = "Sending...";
    }
    
    form.style.opacity = "0.7";
    form.style.pointerEvents = "none";
  }

  // Hide loading state
  function hideLoadingState(form, submitButton, originalButtonText) {
    submitButton.disabled = false;
    
    // Handle different types of submit elements
    if (submitButton.tagName.toLowerCase() === 'input') {
      submitButton.value = originalButtonText;
    } else {
      // For custom elements (div, button, etc.)
      submitButton.textContent = originalButtonText;
    }
    
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
  }

  // Show success message
  function showSuccessMessage(form) {
    // Check if form should reset after success
    const shouldReset = form.dataset.shouldReset === 'true';
    
    if (shouldReset) {
      // Prevent Webflow from hiding the form
      const formContainer = form.closest('.w-form');
      if (formContainer) {
        formContainer.style.display = 'block';
        form.style.display = 'block';
      }
      
      // Show success message while keeping form visible
      const successDiv = form.parentNode.querySelector(".contact--form-success");
      if (successDiv) {
        successDiv.style.display = "block";
        // Hide success message after 5 seconds
        setTimeout(() => {
          successDiv.style.display = "none";
        }, 5000);
      } else {
        // Create temporary success message above the form
        const successMsg = document.createElement("div");
        successMsg.className = "contact--form-success-temp";
        successMsg.style.cssText = "padding: 1rem; background: #10b981; color: white; border-radius: 8px; margin: 0 0 1rem 0; text-align: center;";
        successMsg.innerHTML = `<p style="margin: 0;">✅ Message sent successfully! Feel free to send another message.</p>`;
        form.parentNode.insertBefore(successMsg, form.parentNode.firstChild);
        // Remove after 5 seconds
        setTimeout(() => {
          if (successMsg.parentNode) {
            successMsg.remove();
          }
        }, 5000);
      }
      
      // Trigger form reset via custom event (after brief delay)
      setTimeout(() => {
        form.dispatchEvent(new CustomEvent('form-reset-requested'));
        
        // Double-check form visibility after reset
        setTimeout(() => {
          const formContainer = form.closest('.w-form');
          if (formContainer) {
            formContainer.style.display = 'block';
            form.style.display = 'block';
          }
        }, 100);
      }, 1000);
      
    } else {
      // Hide the form and show success state
      form.style.display = "none";
      
      const successDiv = form.parentNode.querySelector(".contact--form-success");
      if (successDiv) {
        successDiv.style.display = "block";
      } else {
        // Fallback: check for Webflow default
        const webflowSuccess = form.parentNode.querySelector(".w-form-done");
        if (webflowSuccess) {
          webflowSuccess.style.display = "block";
        } else {
          // Create fallback success message
          const successMsg = document.createElement("div");
          successMsg.className = "contact--form-success";
          successMsg.innerHTML = `
            <h3>Thank you!</h3>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
          `;
          form.parentNode.appendChild(successMsg);
        }
      }
    }
  }

  // Show error message
  function showErrorMessage(form, errorMessage) {
    // Show custom error state
    const errorDiv = form.parentNode.querySelector(".contact--form-error");
    if (errorDiv) {
      errorDiv.style.display = "block";
      // Update error message if element exists
      const errorText = errorDiv.querySelector(".contact--form-error-message");
      if (errorText) {
        errorText.textContent =
          errorMessage || "Something went wrong. Please try again.";
      }
    } else {
      // Fallback: check for Webflow default
      const webflowError = form.parentNode.querySelector(".w-form-fail");
      if (webflowError) {
        webflowError.style.display = "block";
        const errorText = webflowError.querySelector(".w-form-fail-message");
        if (errorText) {
          errorText.textContent =
            errorMessage || "Something went wrong. Please try again.";
        }
      } else {
        // Fallback: show alert
        alert(errorMessage || "Something went wrong. Please try again.");
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
       6. Main Form Handler
    ────────────────────────────────────────────────────────────────*/

  // Handle form submission with Formspark & Botpoison
  async function handleFormSubmission(
    event,
    form,
    submitButton,
    originalAction
  ) {
    event.preventDefault(); // Prevent default Webflow submission

    // Get original button text from the right property
    const originalButtonText = submitButton.tagName.toLowerCase() === 'input' 
      ? submitButton.value 
      : submitButton.textContent;

    try {
      // 1. Show loading state
      showLoadingState(form, submitButton);

      // 2. Prepare form data
      const formData = prepareFormData(form);

      // 3. Get Botpoison solution (in parallel with UI updates)
      const botpoisonSolution = await getBotpoisonSolution();

      // 4. Submit to Formspark
      const result = await submitToFormspark(formData, botpoisonSolution);

      // 5. Handle response
      if (result.success) {
        console.log("Form submitted successfully:", result.data);
        
        // Hide loading state before showing success message
        hideLoadingState(form, submitButton, originalButtonText);
        
        showSuccessMessage(form);

        // Optional: Track success with analytics
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: "Success",
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Formspark submission failed:", error);

      // Fallback: try Webflow's original form action
      if (originalAction && originalAction !== window.location.href) {
        console.log("Attempting Webflow fallback submission...");
        try {
          form.action = originalAction;
          form.method = "POST";
          hideLoadingState(form, submitButton, originalButtonText);
          form.submit(); // Let Webflow handle it
          return;
        } catch (fallbackError) {
          console.error("Webflow fallback also failed:", fallbackError);
        }
      }

      hideLoadingState(form, submitButton, originalButtonText);
      showErrorMessage(
        form,
        "Form submission failed. Please try again or contact us directly."
      );

      // Optional: Track error with analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "form_error", {
          event_category: "Contact",
          event_label: error.message,
        });
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
       7. Form Detection & Setup
    ────────────────────────────────────────────────────────────────*/

  // Set up Formspark integration for contact forms
  function initContactForms() {
    // Find all forms with live validation (compatible with your validation)
    const formContainers = document.querySelectorAll(FORM_CONTAINER_SELECTOR);

    formContainers.forEach((container) => {
      const form = container.querySelector(WEBFLOW_FORM_SELECTOR);
      const submitButton = form?.querySelector(SUBMIT_BUTTON_SELECTOR);

      if (!form || !submitButton) {
        console.warn("Contact form or submit button not found in:", container);
        return;
      }

      // Store original action for fallback
      const originalAction = form.action;

      // Store submit handler to avoid infinite loops with validation script
      let isSubmitting = false;

      // Override form submission with loop protection
      form.addEventListener("submit", (event) => {
        if (isSubmitting) return; // Prevent infinite loops
        isSubmitting = true;

        handleFormSubmission(event, form, submitButton, originalAction).finally(
          () => {
            isSubmitting = false;
          }
        );
      });
      
      // Handle custom submit elements that might not trigger form submit event
      if (submitButton && submitButton.tagName.toLowerCase() !== 'input') {
        // Mark as handled by Formspark to prevent conflicts with validation script
        submitButton.setAttribute('data-formspark-handled', 'true');
        
        submitButton.addEventListener('click', (event) => {
          event.preventDefault();
          if (isSubmitting) return;
          
          // Trigger form submission
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        });
      }
      
      // Store reset preference for use by logic script  
      if (submitButton && submitButton.hasAttribute("data-form-reset")) {
        form.dataset.shouldReset = "true";
      }

      console.log("Formspark integration initialized for form:", form);
    });
  }

  /* ─────────────────────────────────────────────────────────────
       8. Initialization
    ────────────────────────────────────────────────────────────────*/

  initContactForms();

  // Expose configuration for easy updates
  window.ContactFormConfig = {
    setFormspark: (actionUrl) => {
      FORMSPARK_ACTION_URL = actionUrl;
    },
    setBotpoison: (publicKey) => {
      BOTPOISON_PUBLIC_KEY = publicKey;
    },
  };
})();
