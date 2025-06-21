// CMS Related Articles - Nobel Blog with Debug
// Previous Articles Display

console.log("🚀 Nobel Related Articles Script Started");

// Multiple targeting strategies
const selectors = [
  "[related-articles='component']",
  ".blog-related-articles",
  ".w-dyn-list",
  "[data-w-dyn-bind]",
  ".collection-list",
  ".related-articles",
];

let foundElements = 0;

selectors.forEach((selector) => {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    console.log(
      `✅ Found ${elements.length} elements with selector: ${selector}`
    );
    foundElements += elements.length;
  }
});

if (foundElements === 0) {
  console.log("❌ No target elements found. Looking for any CMS structure...");

  // Fallback: Look for any w-dyn-items
  const dynItems = document.querySelectorAll(".w-dyn-items");
  console.log(`📍 Found ${dynItems.length} .w-dyn-items elements`);

  dynItems.forEach((item, index) => {
    console.log(`   ${index}: ${item.children.length} children`, item);
  });
}

// Main targeting function
document
  .querySelectorAll(selectors.join(", "))
  .forEach((componentEl, index) => {
    console.log(`🎯 Processing element ${index + 1}:`, componentEl.className);

    // Look for the actual CMS items container
    const cmsListEl =
      componentEl.querySelector(".w-dyn-items") ||
      componentEl.closest(".w-dyn-items") ||
      (componentEl.classList.contains("w-dyn-items") ? componentEl : null);

    if (!cmsListEl) {
      console.log(`❌ No .w-dyn-items found in element ${index + 1}`);
      return;
    }

    console.log(
      `✅ Found .w-dyn-items with ${cmsListEl.children.length} children`
    );

    const cmsItemEl = Array.from(cmsListEl.children);

    // Skip if less than 2 items (need current + others)
    if (cmsItemEl.length < 2) {
      console.log(`⚠️ Only ${cmsItemEl.length} items found, need at least 2`);
      return;
    }

    // Enhanced current item detection
    let currentItemEl = cmsItemEl.find((item) => {
      const hasWCurrent =
        item.querySelector(".w--current") ||
        item.classList.contains("w--current");
      const hasAriaCurrent = item.querySelector("[aria-current]");
      const hasCurrentClass = item.querySelector(".current-article");

      return hasWCurrent || hasAriaCurrent || hasCurrentClass;
    });

    if (!currentItemEl) {
      console.log("❌ No current article found. Trying URL-based detection...");

      // URL-based detection for blog posts
      const currentUrl = window.location.pathname;
      currentItemEl = cmsItemEl.find((item) => {
        const link = item.querySelector("a[href]");
        if (link) {
          const linkHref = link.getAttribute("href");
          if (linkHref) {
            const currentSlug = currentUrl.split("/").pop();
            return (
              currentUrl.includes(linkHref) ||
              (currentSlug && linkHref.includes(currentSlug))
            );
          }
        }
        return false;
      });

      if (currentItemEl) {
        console.log("✅ Found current article via URL matching");
      } else {
        console.log("❌ Could not identify current article");
        return;
      }
    } else {
      console.log("✅ Found current article via class/attribute");
    }

    // Get current item index
    const currentIndex = cmsItemEl.indexOf(currentItemEl);
    console.log(`📍 Current article is at index: ${currentIndex}`);

    // Get 3 previous items with circular loop fallback
    /** @type {Element[]} */
    const previousItems = [];

    for (let i = 1; i <= 3; i++) {
      let prevIndex = currentIndex - i;

      // If we go below 0, wrap around to get newest articles
      if (prevIndex < 0) {
        prevIndex = cmsItemEl.length + prevIndex;
      }

      // Add the item (this ensures we always get 3 items in a loop)
      if (
        prevIndex >= 0 &&
        prevIndex < cmsItemEl.length &&
        prevIndex !== currentIndex
      ) {
        previousItems.push(cmsItemEl[prevIndex]);
        console.log(`✅ Added article at index ${prevIndex} to previous items`);
      }
    }

    console.log(
      `🎯 Keeping ${previousItems.length} previous articles, removing ${
        cmsItemEl.length - previousItems.length
      } others`
    );

    // Remove all items except the previous items we want to display
    let removedCount = 0;
    cmsItemEl.forEach((item) => {
      if (!previousItems.includes(item)) {
        item.remove();
        removedCount++;
      }
    });

    console.log(
      `✅ Successfully removed ${removedCount} items, kept ${previousItems.length} previous articles`
    );
  });
