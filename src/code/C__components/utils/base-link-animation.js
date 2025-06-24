// ───────────────────────────────────────────────────────────────
// Base Link Animation Utility
// Consolidated animation system for all link types
// ───────────────────────────────────────────────────────────────

import { EASING, DEVICE, initMotionWithRetry, initWithWebflow, DOMCache, AnimationManager } from './motion-config.js';

/* ─────────────────────────────────────────────────────────────
   1. Base Link Animation Class
────────────────────────────────────────────────────────────────*/
export class BaseLinkAnimation {
  constructor(config) {
    this.config = {
      // Required configuration
      containerSelector: config.containerSelector, // e.g. '.link--blog'
      lineSelector: config.lineSelector, // e.g. '.link--blog-line'
      
      // Optional elements
      iconSelector: config.iconSelector || null, // e.g. '.link--blog-icon.is--arrow'
      descriptionSelector: config.descriptionSelector || null, // e.g. '.link--description-w'
      
      // Animation settings
      duration: config.duration || 0.6,
      easing: config.easing || EASING.power2Out,
      stagger: config.stagger || 0,
      
      // Animation types
      animations: config.animations || ['width'], // ['width', 'icon', 'height']
      
      // Special settings
      dynamicHeight: config.dynamicHeight || false,
      iconRotation: config.iconRotation || false,
      iconOpacity: config.iconOpacity || false,
      iconTranslate: config.iconTranslate || false,
      
      // Dataset flag for duplicate prevention
      datasetFlag: config.datasetFlag, // e.g. 'blogLinkAnimated'
      
      // Device restrictions
      desktopOnly: config.desktopOnly !== false // default true
    };
    
    this.domCache = new DOMCache();
    this.animationManager = new AnimationManager();
    
    this.init();
  }

  /* ─────────────────────────────────────────────────────────────
     2. Initialization
  ────────────────────────────────────────────────────────────────*/
  init() {
    // Set up initial states immediately to prevent flickering
    this.setupInitialStates();
    
    // Initialize animations when ready
    initWithWebflow(() => {
      initMotionWithRetry(({ animate }) => {
        this.animate = animate;
        this.buildAnimations();
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     3. Initial State Setup
  ────────────────────────────────────────────────────────────────*/
  setupInitialStates() {
    if (this.config.desktopOnly && !DEVICE.isTabletOrDesktop()) return;

    const containers = document.querySelectorAll(this.config.containerSelector);

    containers.forEach((container) => {
      this.setupContainerInitialState(container);
    });
  }

  setupContainerInitialState(container) {
    const line = container.querySelector(this.config.lineSelector);
    const icon = this.config.iconSelector ? container.querySelector(this.config.iconSelector) : null;
    const description = this.config.descriptionSelector ? container.querySelector(this.config.descriptionSelector) : null;

    // Set up line initial state
    if (line) {
      const lineEl = /** @type {HTMLElement} */ (line);
      lineEl.style.width = "0%";
      lineEl.style.willChange = "width";
    }

    // Set up icon initial state
    if (icon) {
      const iconEl = /** @type {HTMLElement} */ (icon);
      
      if (this.config.iconOpacity) {
        iconEl.style.opacity = "0";
        iconEl.style.willChange = "opacity";
      }
      
      if (this.config.iconRotation) {
        iconEl.style.transform = "rotate(0deg)";
        iconEl.style.willChange = "transform";
      }
      
      if (this.config.iconTranslate) {
        iconEl.style.transform = "translateX(0px)";
        iconEl.style.willChange = "transform";
      }
    }

    // Set up description initial state (dynamic height)
    if (description && this.config.dynamicHeight) {
      const descEl = /** @type {HTMLElement} */ (description);
      // Measure natural height and store it
      descEl.style.height = "auto";
      const naturalHeight = descEl.offsetHeight;
      descEl.dataset.naturalHeight = naturalHeight.toString();
      descEl.style.height = "0px";
      descEl.style.overflow = "hidden";
      descEl.style.willChange = "height";
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. Build Animations
  ────────────────────────────────────────────────────────────────*/
  buildAnimations() {
    if (this.config.desktopOnly && !DEVICE.isTabletOrDesktop()) return;

    const containers = document.querySelectorAll(this.config.containerSelector);

    containers.forEach((container) => {
      this.buildContainerAnimation(container);
    });
  }

  buildContainerAnimation(container) {
    const containerEl = /** @type {HTMLElement} */ (container);
    
    // Prevent duplicate event listeners
    if (containerEl.dataset[this.config.datasetFlag] === "true") return;
    containerEl.dataset[this.config.datasetFlag] = "true";

    const elements = this.getAnimationElements(container);
    if (!elements.line) return; // Line is required

    // Create hover animations
    const hoverInAnimation = () => this.createHoverInAnimation(elements);
    const hoverOutAnimation = () => this.createHoverOutAnimation(elements);

    // Add event listeners
    containerEl.addEventListener("mouseenter", hoverInAnimation);
    containerEl.addEventListener("mouseleave", hoverOutAnimation);
  }

  /* ─────────────────────────────────────────────────────────────
     5. Get Animation Elements
  ────────────────────────────────────────────────────────────────*/
  getAnimationElements(container) {
    return {
      line: container.querySelector(this.config.lineSelector),
      icon: this.config.iconSelector ? container.querySelector(this.config.iconSelector) : null,
      description: this.config.descriptionSelector ? container.querySelector(this.config.descriptionSelector) : null
    };
  }

  /* ─────────────────────────────────────────────────────────────
     6. Hover In Animation
  ────────────────────────────────────────────────────────────────*/
  createHoverInAnimation(elements) {
    let currentDelay = 0;

    // 1. Line animation (always first)
    if (elements.line) {
      const animation = this.animate(
        elements.line,
        { width: ["0%", "100%"] },
        {
          duration: this.config.duration,
          easing: this.config.easing,
          delay: currentDelay
        }
      );
      this.animationManager.addAnimation(animation);
    }

    // 2. Icon animation (with potential stagger)
    if (elements.icon && this.config.animations.includes('icon')) {
      currentDelay += this.config.stagger;
      
      let iconAnimation = {};
      
      if (this.config.iconOpacity) {
        iconAnimation.opacity = [0, 1];
      }
      
      if (this.config.iconRotation) {
        iconAnimation.rotate = ["0deg", "180deg"];
      }
      
      if (this.config.iconTranslate) {
        iconAnimation.x = ["0px", "4px"];
      }

      const animation = this.animate(
        elements.icon,
        iconAnimation,
        {
          duration: this.config.duration,
          easing: this.config.easing,
          delay: currentDelay
        }
      );
      this.animationManager.addAnimation(animation);
    }

    // 3. Description height animation (with potential stagger)
    if (elements.description && this.config.animations.includes('height') && this.config.dynamicHeight) {
      const descEl = /** @type {HTMLElement} */ (elements.description);
      const naturalHeight = parseInt(descEl.dataset.naturalHeight || "0", 10);
      
      currentDelay += this.config.stagger;

      const animation = this.animate(
        elements.description,
        { height: ["0px", `${naturalHeight}px`] },
        {
          duration: this.config.duration * 0.75, // Slightly faster for height
          easing: this.config.easing,
          delay: currentDelay
        }
      );
      this.animationManager.addAnimation(animation);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     7. Hover Out Animation
  ────────────────────────────────────────────────────────────────*/
  createHoverOutAnimation(elements) {
    // All animations reverse simultaneously (no stagger on hover out)
    
    // 1. Line animation
    if (elements.line) {
      const animation = this.animate(
        elements.line,
        { width: ["100%", "0%"] },
        {
          duration: this.config.duration,
          easing: this.config.easing
        }
      );
      this.animationManager.addAnimation(animation);
    }

    // 2. Icon animation
    if (elements.icon && this.config.animations.includes('icon')) {
      let iconAnimation = {};
      
      if (this.config.iconOpacity) {
        iconAnimation.opacity = [1, 0];
      }
      
      if (this.config.iconRotation) {
        iconAnimation.rotate = ["180deg", "0deg"];
      }
      
      if (this.config.iconTranslate) {
        iconAnimation.x = ["4px", "0px"];
      }

      const animation = this.animate(
        elements.icon,
        iconAnimation,
        {
          duration: this.config.duration,
          easing: this.config.easing
        }
      );
      this.animationManager.addAnimation(animation);
    }

    // 3. Description height animation
    if (elements.description && this.config.animations.includes('height') && this.config.dynamicHeight) {
      const descEl = /** @type {HTMLElement} */ (elements.description);
      const naturalHeight = parseInt(descEl.dataset.naturalHeight || "0", 10);

      const animation = this.animate(
        elements.description,
        { height: [`${naturalHeight}px`, "0px"] },
        {
          duration: this.config.duration * 0.75,
          easing: this.config.easing
        }
      );
      this.animationManager.addAnimation(animation);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     8. Cleanup
  ────────────────────────────────────────────────────────────────*/
  destroy() {
    this.animationManager.cleanup();
    this.domCache.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
   9. Predefined Configurations
────────────────────────────────────────────────────────────────*/
export const LINK_CONFIGS = {
  // Blog link configuration
  blog: {
    containerSelector: '.link--blog',
    lineSelector: '.link--blog-line',
    iconSelector: '.link--blog-icon.is--arrow',
    animations: ['width', 'icon'],
    iconOpacity: true,
    stagger: 0.2,
    datasetFlag: 'blogLinkAnimated'
  },

  // General link configuration
  general: {
    containerSelector: '.link--general',
    lineSelector: '.link--divider-line',
    animations: ['width'],
    datasetFlag: 'generalLinkAnimated'
  },

  // Hero link configuration
  hero: {
    containerSelector: '.link--hero',
    lineSelector: '.link--divider-line',
    iconSelector: '.link--icon',
    descriptionSelector: '.link--description-w',
    animations: ['width', 'icon', 'height'],
    iconRotation: true,
    dynamicHeight: true,
    duration: 0.5,
    stagger: 0, // All animations start simultaneously
    datasetFlag: 'heroLinkAnimated'
  }
};