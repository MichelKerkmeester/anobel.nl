// ───────────────────────────────────────────────────────────────
// Motion.dev Utilities: Centralized Configuration
// Shared easing curves, initialization, and device detection
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. Centralized Easing Curves
────────────────────────────────────────────────────────────────*/
export const EASING = {
  // Power curves
  power1Out: [0.25, 0.46, 0.45, 0.94],
  power1In: [0.55, 0.055, 0.675, 0.19],
  power2Out: [0.33, 1, 0.68, 1],
  power2In: [0.55, 0, 1, 0.45],
  power3Out: [0.215, 0.61, 0.355, 1],
  power3In: [0.55, 0.055, 0.675, 0.19],
  power4Out: [0.165, 0.84, 0.44, 1],
  
  // Expo curves
  expoOut: [0.19, 1, 0.22, 1],
  expoInOut: [0.87, 0, 0.13, 1],
  
  // Ease curves
  easeInOut: [0.25, 0.46, 0.45, 0.94],
  linear: "linear"
};

/* ─────────────────────────────────────────────────────────────
   2. Motion.dev Initialization Utility
────────────────────────────────────────────────────────────────*/
export function initMotionWithRetry(callback, maxRetries = 10, delay = 100) {
  const { animate, inView } = window.Motion || {};
  
  if (!animate) {
    if (maxRetries > 0) {
      console.warn("Motion.dev not ready, retrying…");
      setTimeout(() => initMotionWithRetry(callback, maxRetries - 1, delay), delay);
    } else {
      console.error("Motion.dev failed to load after maximum retries");
    }
    return;
  }
  
  callback({ animate, inView });
}

/* ─────────────────────────────────────────────────────────────
   3. Device Detection Utilities
────────────────────────────────────────────────────────────────*/
export const DEVICE = {
  // Tablet breakpoints (consistent across components)
  TABLET_MIN: 768,
  DESKTOP_MIN: 1200,
  
  isTabletOrDesktop() {
    return window.matchMedia(`(min-width: ${this.TABLET_MIN}px)`).matches;
  },
  
  isDesktopOrTablet() {
    return this.isTabletOrDesktop(); // Alias for consistency
  },
  
  isMobileOrTablet() {
    const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const smallScreen = window.innerWidth <= this.DESKTOP_MIN;
    return touchDevice || smallScreen;
  },
  
  isMobile() {
    return window.matchMedia(`(max-width: ${this.TABLET_MIN - 1}px)`).matches;
  },
  
  isDesktop() {
    return window.matchMedia(`(min-width: ${this.DESKTOP_MIN}px)`).matches;
  }
};

/* ─────────────────────────────────────────────────────────────
   4. Webflow Integration Utility
────────────────────────────────────────────────────────────────*/
export function initWithWebflow(callback) {
  // @ts-ignore - Webflow global loaded externally
  if (typeof window.Webflow !== "undefined") {
    window.Webflow.push(callback);
  } else {
    // Fallback if Webflow is not available
    callback();
  }
}

/* ─────────────────────────────────────────────────────────────
   5. DOM Caching Utility
────────────────────────────────────────────────────────────────*/
export class DOMCache {
  constructor() {
    this.cache = new Map();
  }
  
  get(selector, context = document) {
    const key = `${selector}:${context === document ? 'document' : 'context'}`;
    
    if (!this.cache.has(key)) {
      const elements = context.querySelectorAll(selector);
      this.cache.set(key, elements);
    }
    
    return this.cache.get(key);
  }
  
  getFirst(selector, context = document) {
    const elements = this.get(selector, context);
    return elements.length > 0 ? elements[0] : null;
  }
  
  clear() {
    this.cache.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
   6. Animation Cleanup Manager
────────────────────────────────────────────────────────────────*/
export class AnimationManager {
  constructor() {
    this.activeAnimations = new Set();
    this.timers = new Set();
  }
  
  addAnimation(animation) {
    this.activeAnimations.add(animation);
    return animation;
  }
  
  addTimer(timer) {
    this.timers.add(timer);
    return timer;
  }
  
  cleanup() {
    // Cancel all active animations
    this.activeAnimations.forEach(animation => {
      if (animation && typeof animation.cancel === 'function') {
        animation.cancel();
      }
    });
    
    // Clear all timers
    this.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    
    this.activeAnimations.clear();
    this.timers.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
   7. Common Animation Patterns
────────────────────────────────────────────────────────────────*/
export const ANIMATIONS = {
  // Fade animations
  fadeIn: {
    opacity: [0, 1]
  },
  
  fadeOut: {
    opacity: [1, 0]
  },
  
  // Slide animations  
  slideUp: {
    y: ["100%", "0%"],
    opacity: [0, 1]
  },
  
  slideDown: {
    y: ["-100%", "0%"],
    opacity: [0, 1]
  },
  
  // Scale animations
  scaleIn: {
    scale: [0.8, 1],
    opacity: [0, 1]
  },
  
  scaleOut: {
    scale: [1, 0.8],
    opacity: [1, 0]
  }
};

/* ─────────────────────────────────────────────────────────────
   8. Performance Optimization Helpers
────────────────────────────────────────────────────────────────*/
export function optimizeForAnimation(element) {
  if (element instanceof HTMLElement) {
    element.style.willChange = "transform, opacity";
    element.style.backfaceVisibility = "hidden";
    element.style.perspective = "1000px";
  }
}

export function resetOptimization(element) {
  if (element instanceof HTMLElement) {
    element.style.willChange = "auto";
    element.style.backfaceVisibility = "";
    element.style.perspective = "";
  }
}