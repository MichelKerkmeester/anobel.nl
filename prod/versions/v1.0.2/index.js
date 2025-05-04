var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
(function() {
  "use strict";
  Webflow.push(() => {
    const megaMenu = document.querySelector(".nav--mega-menu");
    const menuButton = document.querySelector(".btn--hamburger");
    if (!megaMenu || !menuButton) {
      console.error("Mega menu or menu button not found!");
      return;
    }
    function openMenu() {
      megaMenu.style.display = "flex";
      gsap.to(megaMenu, {
        duration: 0.8,
        height: "100svh",
        width: "100%",
        ease: "power2.out",
        delay: 0.2,
        onComplete: () => {
          megaMenu.style.borderRadius = "0rem";
        }
      });
    }
    function closeMenu() {
      megaMenu.style.borderRadius = "0.75rem";
      gsap.to(megaMenu, {
        duration: 0.4,
        height: "0svh",
        width: "100%",
        ease: "power2.in",
        onComplete: () => {
          megaMenu.style.display = "none";
        }
      });
    }
    let isOpen = false;
    menuButton.addEventListener("click", () => {
      if (!isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
      isOpen = !isOpen;
    });
  });
  const initDropdownMenu = () => {
    const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
    if (!dropdowns.length) {
      console.error("No dropdown elements found in the DOM!");
      return;
    }
    const navigation = document.querySelector(".nav--bar");
    if (!navigation) {
      console.error("Navigation container (.navigation) not found!");
      return;
    }
    const dropdownData = dropdowns.map((dropdown) => {
      const dropdownToggle = dropdown.querySelector(".btn--nav-dropdown");
      const dropdownMenu = dropdown.querySelector(".nav--dropdown-menu");
      const dropdownIcon = dropdown.querySelector(".icon--svg.is--nav");
      if (!dropdownToggle || !dropdownMenu || !dropdownIcon) {
        console.warn(
          "Some required elements (dropdownToggle, dropdownMenu, dropdownIcon) are missing in a .nav--dropdown!"
        );
        return null;
      }
      return {
        dropdown,
        toggle: dropdownToggle,
        // Button that triggers dropdown
        dropdownMenu,
        icon: dropdownIcon,
        // Rotation indicator for dropdown state
        isOpen: false,
        // Tracks if menu is visible
        animating: false
        // Prevents interaction during animations
      };
    }).filter((d) => d !== null);
    const createOpenTimeline = (d) => {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.3, ease: "power2.out" }
      ).to(d.icon, { rotation: 180, duration: 0.3, ease: "power2.out" }, "<").to(
        d.toggle,
        { backgroundColor: "var(--secondary--darkest)", duration: 0.3 },
        "<"
      );
      if (isDesktop) {
        tl.to(
          navigation,
          {
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
            duration: 0.3,
            ease: "power2.out"
          },
          "<"
        );
      }
      return tl;
    };
    const createCloseTimeline = (d) => {
      const tl = gsap.timeline({
        onStart: () => {
          d.animating = true;
        },
        onComplete: () => {
          d.animating = false;
        }
      });
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      tl.fromTo(
        d.dropdownMenu,
        { opacity: 1, height: d.dropdownMenu.scrollHeight },
        { opacity: 0, height: 0, duration: 0.3, ease: "power2.in" }
      ).to(d.icon, { rotation: 0, duration: 0.3, ease: "power2.in" }, "<").to(d.toggle, { backgroundColor: "", duration: 0.3 }, "<");
      if (isDesktop) {
        tl.to(
          navigation,
          {
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
            duration: 0.3,
            ease: "power2.in"
          },
          "<"
        );
      }
      return tl;
    };
    const closeAllDropdowns = (except = null) => {
      dropdownData.forEach((d) => {
        if (d !== except && d.isOpen && !d.animating) {
          closeDropdown(d);
        }
      });
    };
    const openDropdown = (d) => {
      createOpenTimeline(d).play();
      d.isOpen = true;
    };
    const closeDropdown = (d) => {
      createCloseTimeline(d).play();
      d.isOpen = false;
    };
    dropdownData.forEach((d) => {
      d.toggle.addEventListener("click", () => {
        if (d.animating) return;
        if (d.isOpen) {
          closeDropdown(d);
        } else {
          closeAllDropdowns(d);
          openDropdown(d);
        }
      });
    });
    document.addEventListener("click", (e) => {
      dropdownData.forEach((d) => {
        if (d.isOpen && !d.animating) {
          const clickedInside = d.dropdown.contains(e.target) || d.toggle.contains(e.target);
          if (!clickedInside) {
            closeDropdown(d);
          }
        }
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
      }
    });
  };
  Webflow.push(() => {
    initDropdownMenu();
  });
  const initLanguageSelector = () => {
    const languageBtn = document.querySelector('[class*="language--btn-w"]');
    const languageDropdown = document.querySelector(
      '[class*="language--dropdown-w"]'
    );
    const languageIcon = document.querySelector(".icon--svg.is--language");
    if (!languageBtn || !languageDropdown || !languageIcon) {
      console.error("Required elements not found!");
      return;
    }
    const toggleDropdown = (isOpen) => {
      gsap.to(languageIcon, {
        rotation: isOpen ? 180 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
      gsap.to(languageBtn, {
        backgroundColor: isOpen ? "var(--_color-tokens---bg-brand--darkest)" : "var(--_color-tokens---bg-brand--dark)",
        duration: 0.3
      });
      if (isOpen) {
        gsap.set(languageDropdown, {
          visibility: "visible",
          height: 0,
          opacity: 0
        });
        gsap.to(languageDropdown, {
          opacity: 1,
          height: "auto",
          duration: 0.5,
          ease: "power3.out"
        });
      } else {
        gsap.to(languageDropdown, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(languageDropdown, { visibility: "hidden" });
          }
        });
      }
    };
    languageBtn.addEventListener("mouseenter", () => {
      if (!languageBtn.classList.contains("clicked")) {
        gsap.to(languageBtn, {
          width: "4.75rem",
          backgroundColor: "var(--_color-tokens---bg-brand--dark)",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    languageBtn.addEventListener("mouseleave", () => {
      if (!languageBtn.classList.contains("clicked")) {
        gsap.to(languageBtn, {
          width: "2rem",
          backgroundColor: "var(--_color-tokens---bg-brand--dark)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    });
    languageBtn.addEventListener("click", () => {
      const isClicked = languageBtn.classList.toggle("clicked");
      toggleDropdown(isClicked);
    });
    document.addEventListener("click", (event) => {
      const isInside = languageBtn.contains(event.target) || languageDropdown.contains(event.target);
      const isDropdownTrigger = event.target.closest(".btn--nav-dropdown");
      if (!isInside && languageBtn.classList.contains("clicked") || isDropdownTrigger && !languageDropdown.contains(isDropdownTrigger)) {
        languageBtn.classList.remove("clicked");
        toggleDropdown(false);
        gsap.to(languageBtn, {
          width: "2rem",
          backgroundColor: "var(--_color-tokens---bg-brand--dark)",
          duration: 0.3,
          ease: "power2.in"
        });
      }
    });
  };
  Webflow.push(() => {
    initLanguageSelector();
  });
  function initBasicCustomCursor() {
    gsap.set(".cursor", { xPercent: -50, yPercent: -50 });
    let xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
    let yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });
    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
  }
  Webflow.push(() => {
    initBasicCustomCursor();
  });
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function() {
      document.querySelectorAll('.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover').forEach(function(el) {
        el.style.width = "0%";
        el.style.visibility = "hidden";
      });
      document.querySelectorAll('.btn--text-link[data-text-link-hover="Underline"]').forEach(function(link) {
        link.addEventListener("mouseenter", function() {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "100%",
              visibility: "visible",
              ease: "power1.out"
            });
          }
        });
        link.addEventListener("mouseleave", function() {
          const hoverElement = link.querySelector(".btn--text-link-hover");
          if (hoverElement && window.gsap) {
            window.gsap.to(hoverElement, {
              duration: 0.3,
              width: "0%",
              visibility: "hidden",
              ease: "power1.out"
            });
          }
        });
      });
    });
  }
  const btnContainerAnimation = () => {
    const btnContainers = document.querySelectorAll(".btn--cta");
    btnContainers.forEach((container) => {
      const buttons = container.querySelectorAll(".btn");
      const buttonAnimations = [];
      buttons.forEach((btn) => {
        const iconBase = btn.querySelector(".btn--icon.is--animated-base");
        const iconAbsolute = btn.querySelector(".btn--icon.is--animated-absolute");
        if (iconBase && iconAbsolute) {
          const timeline = gsap.timeline({ paused: true, reversed: true });
          const btnType = btn.getAttribute("data-btn-type");
          let hoverStyles = {};
          if (btnType === "CTA-Icon") {
            hoverStyles = {
              backgroundColor: "var(--_color-shades---primary--darker)",
              color: "var(--_color-tokens---content-neutral--white)",
              borderWidth: 0
            };
          } else if (btnType === "CTA-Light") {
            hoverStyles = {
              backgroundColor: "var(--_color-tokens---bg-neutral--white)",
              color: "var(--_color-tokens---content-neutral--black)",
              borderColor: "var(--_color-shades---primary--darkest)",
              borderWidth: "2px"
            };
          } else if (btnType === "CTA-Dark") {
            hoverStyles = {
              backgroundColor: "rgba(10, 10, 10, 0.25)",
              color: "var(--_color-tokens---content-neutral--white)",
              borderColor: "var(--_color-shades---primary--darkest)",
              borderWidth: "2px"
            };
          }
          timeline.set(iconAbsolute, { opacity: 0 }).to(
            iconAbsolute,
            {
              x: "0%",
              opacity: 1,
              duration: 0.3,
              ease: "power1.out"
            },
            0
          ).to(
            iconBase,
            {
              x: "200%",
              opacity: 0,
              duration: 0.3,
              ease: "power0"
            },
            0
          ).to(
            btn,
            __spreadProps(__spreadValues({}, hoverStyles), {
              duration: 0.3,
              ease: "power1.out"
            }),
            0
          );
          buttonAnimations.push(timeline);
          const oldEnterFn = btn._mouseenterFn;
          const oldLeaveFn = btn._mouseleaveFn;
          if (oldEnterFn) btn.removeEventListener("mouseenter", oldEnterFn);
          if (oldLeaveFn) btn.removeEventListener("mouseleave", oldLeaveFn);
        }
      });
      if (buttonAnimations.length > 0) {
        container.addEventListener("mouseenter", () => {
          buttonAnimations.forEach((timeline) => timeline.play());
        });
        container.addEventListener("mouseleave", () => {
          buttonAnimations.forEach((timeline) => timeline.reverse());
        });
      }
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    btnContainerAnimation();
  });
  document.addEventListener("DOMContentLoaded", () => {
    const isDesktop = window.matchMedia("(min-width: 992px) and (hover: hover)").matches;
    if (!isDesktop) return;
    const cards = document.querySelectorAll(".link--hero");
    cards.forEach((card) => {
      const tl = gsap.timeline({ paused: true });
      const description = card.querySelector(".link--description-w");
      const icon = card.querySelector(".link--icon");
      gsap.set(description, { height: "auto" });
      const naturalHeight = description.offsetHeight;
      gsap.set(description, { height: 0 });
      tl.to(card.querySelector(".link--divider-line"), {
        width: "100%",
        duration: 0.5,
        ease: "power2.out"
        // Smooth acceleration out
      }).to(
        description,
        {
          height: naturalHeight,
          duration: 0.45,
          ease: "power2.out"
        },
        "<"
      ).to(
        icon,
        {
          rotation: 180,
          duration: 0.45,
          ease: "power2.out"
        },
        "<"
      ).reverse();
      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".link--general");
    cards.forEach((card) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card.querySelector(".link--divider-line"), {
        width: "100%",
        duration: 0.6,
        ease: "power2.out"
      }).reverse();
      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[cmsnext-element='component']").forEach((componentEl) => {
      const cmsListEl = componentEl.querySelector(".w-dyn-items");
      const cmsItemEl = Array.from(cmsListEl.children);
      let currentItemEl = cmsItemEl.find(
        (item) => item.querySelector(".w--current")
      );
      let nextItemEl = currentItemEl.nextElementSibling;
      let prevItemEl = currentItemEl.previousElementSibling;
      if (componentEl.getAttribute("cmsnext-loop") === "true") {
        if (!nextItemEl) nextItemEl = cmsItemEl[0];
        if (!prevItemEl) prevItemEl = cmsItemEl[cmsItemEl.length - 1];
      }
      let displayEl = nextItemEl;
      cmsItemEl.forEach((item) => {
        if (item !== displayEl) item.remove();
      });
    });
    const projectImages = document.querySelectorAll(".project--pgn-image");
    projectImages.forEach((image) => {
      const footer = image.querySelector(".project--pgn-footer");
      image.addEventListener("mouseenter", () => {
        gsap.to(footer, {
          duration: 0.2,
          backgroundColor: "rgba(9, 25, 29, 0.50)",
          borderTopColor: "#fefdfd",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          ease: "power1.in"
        });
      });
      image.addEventListener("mouseleave", () => {
        gsap.to(footer, {
          duration: 0.1,
          backgroundColor: "rgba(19, 51, 58, 0.95)",
          borderTopColor: "rgba(19, 51, 58, 0.95)",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          ease: "power1.in"
        });
      });
    });
  });
  function initializeHeroStates() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded, cannot initialize hero animations");
      return false;
    }
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var isDesktop = vw >= 992;
    var isTablet = vw >= 768 && vw < 992;
    var isMobileTall = vw < 480 && vh >= 650;
    gsap.set(".page--wrapper", {
      opacity: 1,
      visibility: "visible",
      clearProps: "visibility"
      // Clean up the visibility property after setting
    });
    gsap.set(".hero--content.is--video", {
      opacity: 0,
      y: "100%",
      scale: 0.92,
      willChange: "opacity, transform"
      // Optimize for performance
    });
    gsap.set([".hero--header.is--video"], {
      opacity: 0,
      y: isDesktop ? "10vh" : isTablet ? "2rem" : "1rem",
      willChange: "opacity, transform"
      // Optimize for performance
    });
    gsap.set(".hero--section.is--video", {
      height: isDesktop ? "100svh" : isTablet ? "95svh" : isMobileTall ? "95svh" : "90svh"
    });
    gsap.set(".hero--video-container", { padding: 0 });
    gsap.set(".hero--video", {
      borderRadius: 0,
      scale: 1.05,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      perspective: 1e3,
      willChange: "transform"
      // Optimize for performance
    });
    return true;
  }
  function createHeroIntroTimeline({ phase1Delay, delayBetweenPhase1And2 }) {
    if (typeof gsap === "undefined") return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isDesktop = vw >= 992;
    const isTablet = vw >= 768 && vw < 992;
    const isMobileLarge = vw >= 480 && vw < 768;
    const isMobileTall = vw < 480 && vh >= 650;
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });
    tl.to({}, { duration: phase1Delay });
    tl.to(
      [".hero--video-container", ".hero--video-w"],
      {
        duration: 1,
        borderRadius: (index) => index === 1 ? "1rem" : 0,
        padding: (index) => {
          if (index === 0) {
            return isDesktop ? "2rem" : isTablet ? "7rem 2rem 0 2rem" : isMobileLarge ? "6.5rem 1.5rem 0 1.5rem" : "5rem 1.5rem 0 1.5rem";
          }
          return 0;
        },
        scale: 1,
        opacity: 1,
        ease: "expo.out"
      },
      "phase1"
    );
    tl.to({}, { duration: delayBetweenPhase1And2 });
    tl.to(
      ".hero--section.is--video",
      {
        height: isDesktop ? vh <= 800 ? "87.5svh" : vh <= 1049 ? "85svh" : "82.5svh" : isTablet ? "85svh" : isMobileTall ? "80svh" : "85svh",
        duration: 1.4,
        ease: "expo.inOut"
      },
      "-=0.8"
    );
    tl.to(
      ".hero--content.is--video",
      {
        opacity: 1,
        y: "0%",
        scale: 1,
        duration: 1.2,
        ease: "expo.out"
      },
      "-=2"
    );
    tl.to(
      [".hero--header.is--video"],
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        // Adjusted stagger for better flow
        ease: "expo.out"
      },
      "-=2"
    );
    return tl;
  }
  function initHeroVideo() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded, cannot initialize hero animations");
      return;
    }
    function initAnimations() {
      if (!document.querySelector(".hero--section.is--video")) {
        return;
      }
      if (!initializeHeroStates()) return;
      const timeline = createHeroIntroTimeline({
        phase1Delay: 0,
        // No delay to start immediately
        delayBetweenPhase1And2: 0.1
        // Reduced delay between phases
      });
      if (!timeline) return;
      gsap.to(".loader", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => gsap.set(".loader", { display: "none" })
      });
      if (typeof ScrollTrigger !== "undefined") {
        gsap.to(".hero--video", {
          scrollTrigger: {
            trigger: ".hero--section.is--video",
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          scale: 1.1,
          borderRadius: "2rem"
        });
      }
    }
    initAnimations();
  }
  Webflow.push(() => {
    initHeroVideo();
  });
  document.addEventListener("DOMContentLoaded", function() {
    var consentCookieName = "cookieConsent";
    var declineCookieName = "cookieDecline";
    function hasConsented() {
      return Cookies.get(consentCookieName) !== void 0;
    }
    function hasDeclined() {
      return Cookies.get(declineCookieName) !== void 0;
    }
    function disableTracking() {
      window["ga-disable-G-KGZWBC07S1"] = true;
      Cookies.set(declineCookieName, "true", { expires: 7 });
      document.cookie = "tracking=disabled; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    function hideBanner() {
      gsap.to("#cookie-consent", {
        y: "100vh",
        duration: 1,
        ease: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        onComplete: function() {
          document.getElementById("cookie-consent").style.display = "none";
        }
      });
    }
    function showBanner() {
      var bannerElement = document.getElementById("cookie-consent");
      bannerElement.style.display = "block";
      gsap.fromTo(
        bannerElement,
        { y: "100vh" },
        {
          y: "0vh",
          duration: 1,
          ease: "cubic-bezier(0.645, 0.045, 0.355, 1)"
        }
      );
    }
    document.getElementById("cookie-accept").addEventListener("click", function() {
      console.log("Cookies accepted");
      Cookies.set(consentCookieName, "true", { expires: 7 });
      hideBanner();
    });
    document.getElementById("cookie-decline").addEventListener("click", function() {
      console.log("Cookies declined");
      disableTracking();
      hideBanner();
    });
    if (!hasConsented() && !hasDeclined()) {
      document.getElementById("cookie-consent").style.display = "none";
      setTimeout(showBanner, 1e4);
    } else {
      document.getElementById("cookie-consent").style.display = "none";
    }
  });
  function initAfdelingCtaHover() {
    const ctaCards = document.querySelectorAll(".afdeling--card.is--cta");
    ctaCards.forEach((card) => {
      const btn = card.querySelector(".afdeling--btn");
      card.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          backgroundColor: "var(--secondary--darker)",
          duration: 0.2,
          ease: "power1.out"
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          backgroundColor: "var(--secondary--base)",
          duration: 0.2,
          ease: "power1.out"
        });
      });
    });
  }
  Webflow.push(() => {
    initAfdelingCtaHover();
  });
  console.log("Nobel website scripts initialized");
})();
