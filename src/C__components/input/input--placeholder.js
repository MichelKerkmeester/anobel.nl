// Input field
/**
 * Adds hover class to inputs with data-placeholder attribute
 * This allows CSS to change placeholder color on hover
 */

Webflow.push(function () {
  // Select only inputs that have the data-placeholder attribute
  const inputs = document.querySelectorAll(
    "input[data-placeholder], textarea[data-placeholder], select[data-placeholder]"
  );

  // Add hover class on mouse enter
  inputs.forEach((input) => {
    input.addEventListener("mouseenter", () => {
      input.classList.add("hovered");
    });

    input.addEventListener("mouseleave", () => {
      input.classList.remove("hovered");
    });
  });
});
