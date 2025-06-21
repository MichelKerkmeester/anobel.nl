// Contact
// Live form validation
function initBasicFormValidation() {
  const forms = document.querySelectorAll("[data-form-validate]");

  forms.forEach((form) => {
    const fields = form.querySelectorAll(
      "[data-validate] input, [data-validate] textarea"
    );
    const submitButtonDiv = form.querySelector("[data-submit]"); // The div wrapping the submit button
    if (!submitButtonDiv) return; // Skip if submit button div is not found

    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button
    if (!submitInput) return; // Skip if submit button is not found

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest("[data-validate]"); // Get the parent div
      if (!parent) return false;

      const minLength = field.getAttribute("min");
      const maxLength = field.getAttribute("max");
      const type = field.getAttribute("type");
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== "") {
        parent.classList.add("is--filled");
      } else {
        parent.classList.remove("is--filled");
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < parseInt(minLength, 10)) {
        isValid = false;
      }

      if (maxLength && field.value.length > parseInt(maxLength, 10)) {
        isValid = false;
      }

      // Validation logic for email input type
      if (type === "email" && !/\S+@\S+\.\S+/.test(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove("is--error");
        parent.classList.add("is--success");
      } else {
        parent.classList.remove("is--success");
        parent.classList.add("is--error");
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener("input", function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField && typeof firstInvalidField.focus === "function") {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) / 1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener("click", function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert("Form submitted too quickly. Please try again.");
          return; // Stop form submission
        }
        if (typeof submitInput.click === "function") {
          submitInput.click(); // Simulate a click on the <input type="submit">
        }
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener("keydown", function (event) {
      // Check if event is a keyboard event with key property
      if (
        event &&
        event.key === "Enter" &&
        event.target &&
        event.target.tagName !== "TEXTAREA"
      ) {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return; // Stop form submission
          }
          if (typeof submitInput.click === "function") {
            submitInput.click(); // Trigger our custom form submission
          }
        }
      }
    });
  });
}

// Initialize Basic Form Validation
if (window.Webflow) {
  window.Webflow.push(() => {
    initBasicFormValidation();
  });
} else {
  // Fallback if Webflow object is not available
  initBasicFormValidation();
}
