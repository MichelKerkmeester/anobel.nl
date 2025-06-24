// ───────────────────────────────────────────────────────────────
// Link: Hero
// Hover Animation - Desktop & Tablet Only (Optimized)
// ───────────────────────────────────────────────────────────────

// Import the consolidated base animation utility
import { BaseLinkAnimation, LINK_CONFIGS } from '../utils/base-link-animation.js';

// Initialize hero link animations using the consolidated system
// This preserves all existing class selectors and behavior
new BaseLinkAnimation(LINK_CONFIGS.hero);