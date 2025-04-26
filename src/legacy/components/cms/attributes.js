// CMS collection lists
// Apply attributes to individual CMS items
document.addEventListener('DOMContentLoaded', function () {
  function applyAttributesToItems(selector, attributeName) {
    const items = document.querySelectorAll(selector); // Select all items

    if (items.length === 0) {
      // console.warn(`No items found for selector: ${selector}`);
      return;
    }

    items.forEach((item) => {
      const attributeField = item.getAttribute('cms-item'); // Use the cms-item attribute
      if (attributeField) {
        // Check if the cms-item attribute exists
        item.setAttribute(attributeName, attributeField); // Set the custom attribute
        console.log(`Set ${attributeName} to ${attributeField} for item`, item);
      } else {
        console.warn('cms-item attribute not found in item:', item); // Warn if cms-item is not found
      }
    });
  }

  // Apply attributes to project, process, and services items
  applyAttributesToItems('.footer--contact-links-list-item', 'teams--attribute');
});
