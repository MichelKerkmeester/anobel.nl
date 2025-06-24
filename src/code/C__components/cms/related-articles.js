// ───────────────────────────────────────────────────────────────
// CMS: Related Articles
// Blog article filtering and randomization
// ───────────────────────────────────────────────────────────────

(() => {
  /* ─────────────────────────────────────────────────────────────
     1. Page Context Validation
  ────────────────────────────────────────────────────────────────*/
  // Only run on article pages
  if (
    !window.location.pathname.includes("/blog/") ||
    window.location.pathname === "/blog" ||
    window.location.pathname === "/blog/"
  ) {
    return;
  }

  /* ─────────────────────────────────────────────────────────────
     2. Element Selection and Processing
  ────────────────────────────────────────────────────────────────*/
  document.querySelectorAll(".blog--list-w").forEach((wrapper) => {
    const list = wrapper.querySelector(".blog--list");
    if (!list) return;

    const items = Array.from(list.querySelectorAll(".blog--list-item"));
    if (items.length < 2) return;

    /* ─────────────────────────────────────────────────────────────
       3. Configuration and Current Item Detection
    ────────────────────────────────────────────────────────────────*/
    // Responsive article count: 3 on desktop, 4 on tablet/mobile
    const targetCount = window.matchMedia("(min-width: 992px)").matches ? 3 : 4;

    // Find current item
    const currentUrl = window.location.pathname;
    const currentSlug = currentUrl.split("/").pop() || "";

    const currentIndex = items.findIndex((item) => {
      // Check for Webflow's current indicator
      if (
        item.querySelector(".w--current") ||
        item.classList.contains("w--current")
      ) {
        return true;
      }

      // Check link URLs
      const link =
        item.querySelector("a[href]") || item.querySelector("[href]");
      if (link) {
        const href = link.getAttribute("href");
        if (href && href !== "#" && href !== "") {
          return (
            href === currentUrl ||
            (currentSlug && href.includes(currentSlug)) ||
            currentUrl.includes(href)
          );
        }
      }
      return false;
    });

    if (currentIndex === -1) return;

    /* ─────────────────────────────────────────────────────────────
       4. Article Selection and Randomization
    ────────────────────────────────────────────────────────────────*/
    // Get other articles and shuffle
    const otherArticles = items.filter((_, idx) => idx !== currentIndex);

    // Fisher-Yates shuffle
    for (let i = otherArticles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherArticles[i], otherArticles[j]] = [
        otherArticles[j],
        otherArticles[i],
      ];
    }

    // Select articles to keep
    const relatedItems = otherArticles.slice(
      0,
      Math.min(targetCount, otherArticles.length)
    );

    /* ─────────────────────────────────────────────────────────────
       5. DOM Manipulation and Cleanup
    ────────────────────────────────────────────────────────────────*/
    // Remove unselected items
    items.forEach((item) => {
      if (!relatedItems.includes(item)) {
        item.remove();
      }
    });

    // Add position indicators
    relatedItems.forEach((item, idx) => {
      item.setAttribute("data-related-position", (idx + 1).toString());
    });
  });
})();
