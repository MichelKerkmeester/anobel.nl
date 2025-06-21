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
  Webflow.push(() => {
    const isDesktopOrTablet2 = window.matchMedia("(min-width: 768px)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isDesktopOrTablet2) return;
    document.querySelectorAll(
      '.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover'
    ).forEach(function(el) {
      el.style.width = "0%";
      el.style.visibility = "hidden";
    });
    document.querySelectorAll('.btn--text-link[data-text-link-hover="Underline"]').forEach(function(link) {
      if (isTouchDevice) {
        link.addEventListener("touchstart", function() {
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
        link.addEventListener("touchend", function() {
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
      } else {
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
      }
    });
  });
  const isDesktopOrTablet = () => {
    const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
    return isLargeScreen;
  };
  const btnContainerAnimation = () => {
    if (!isDesktopOrTablet()) {
      return;
    }
    const btnContainers = document.querySelectorAll(".btn--cta");
    btnContainers.forEach((container) => {
      const buttons = container.querySelectorAll(".btn");
      const buttonAnimations = [];
      buttons.forEach((btn) => {
        const iconBase = btn.querySelector(".btn--icon.is--animated-base");
        const iconAbsolute = btn.querySelector(
          ".btn--icon.is--animated-absolute"
        );
        if (iconBase && iconAbsolute) {
          const timeline = gsap.timeline({ paused: true, reversed: true });
          btn.getAttribute("data-btn-type");
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
          );
          buttonAnimations.push(timeline);
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
  btnContainerAnimation();
  Webflow.push(() => {
    const isTabletOrDesktop = window.matchMedia(
      "(min-width: 768px) and (hover: hover)"
    ).matches;
    if (!isTabletOrDesktop) return;
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
  Webflow.push(() => {
    const isTabletOrDesktop = window.matchMedia(
      "(min-width: 768px) and (hover: hover)"
    ).matches;
    if (!isTabletOrDesktop) return;
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
  console.log("🚀 Nobel Related Articles Script Started");
  const selectors = [
    "[related-articles='component']",
    ".blog-related-articles",
    ".w-dyn-list",
    "[data-w-dyn-bind]",
    ".collection-list",
    ".related-articles"
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
    const dynItems = document.querySelectorAll(".w-dyn-items");
    console.log(`📍 Found ${dynItems.length} .w-dyn-items elements`);
    dynItems.forEach((item, index) => {
      console.log(`   ${index}: ${item.children.length} children`, item);
    });
  }
  document.querySelectorAll(selectors.join(", ")).forEach((componentEl, index) => {
    console.log(`🎯 Processing element ${index + 1}:`, componentEl.className);
    const cmsListEl = componentEl.querySelector(".w-dyn-items") || componentEl.closest(".w-dyn-items") || (componentEl.classList.contains("w-dyn-items") ? componentEl : null);
    if (!cmsListEl) {
      console.log(`❌ No .w-dyn-items found in element ${index + 1}`);
      return;
    }
    console.log(
      `✅ Found .w-dyn-items with ${cmsListEl.children.length} children`
    );
    const cmsItemEl = Array.from(cmsListEl.children);
    if (cmsItemEl.length < 2) {
      console.log(`⚠️ Only ${cmsItemEl.length} items found, need at least 2`);
      return;
    }
    let currentItemEl = cmsItemEl.find((item) => {
      const hasWCurrent = item.querySelector(".w--current") || item.classList.contains("w--current");
      const hasAriaCurrent = item.querySelector("[aria-current]");
      const hasCurrentClass = item.querySelector(".current-article");
      return hasWCurrent || hasAriaCurrent || hasCurrentClass;
    });
    if (!currentItemEl) {
      console.log("❌ No current article found. Trying URL-based detection...");
      const currentUrl = window.location.pathname;
      currentItemEl = cmsItemEl.find((item) => {
        const link = item.querySelector("a[href]");
        if (link) {
          const linkHref = link.getAttribute("href");
          if (linkHref) {
            const currentSlug = currentUrl.split("/").pop();
            return currentUrl.includes(linkHref) || currentSlug && linkHref.includes(currentSlug);
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
    const currentIndex = cmsItemEl.indexOf(currentItemEl);
    console.log(`📍 Current article is at index: ${currentIndex}`);
    const previousItems = [];
    for (let i = 1; i <= 3; i++) {
      let prevIndex = currentIndex - i;
      if (prevIndex < 0) {
        prevIndex = cmsItemEl.length + prevIndex;
      }
      if (prevIndex >= 0 && prevIndex < cmsItemEl.length && prevIndex !== currentIndex) {
        previousItems.push(cmsItemEl[prevIndex]);
        console.log(`✅ Added article at index ${prevIndex} to previous items`);
      }
    }
    console.log(
      `🎯 Keeping ${previousItems.length} previous articles, removing ${cmsItemEl.length - previousItems.length} others`
    );
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
    });
    gsap.set([".hero--header"], {
      opacity: 0,
      y: isDesktop ? "10vh" : isTablet ? "2rem" : "1rem",
      willChange: "opacity, transform"
    });
    gsap.set(".hero--section.is--video", {
      height: isDesktop ? "100svh" : isTablet ? "97.5svh" : isMobileTall ? "97.5svh" : "92.5svh"
    });
    gsap.set(".hero--video-container", { padding: 0 });
    gsap.set(".hero--video", {
      borderRadius: 0,
      scale: 1.05,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      perspective: 1e3,
      willChange: "transform"
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
    const isMobile = vw < 480;
    const easeOut = isDesktop ? "power4.out" : "expo.out";
    const easeInOut = isDesktop ? "power2.inOut" : "expo.inOut";
    const durContainer = isMobile ? 1.3 : isDesktop ? 1.1 : 1;
    const durCollapse = isMobile ? 1.5 : isDesktop ? 1.2 : 1.2;
    const durContent = isMobile ? 1.1 : isDesktop ? 1.1 : 1;
    const durHeaders = isMobile ? 1 : isDesktop ? 0.9 : 0.9;
    const offsetContent = isMobile ? "-=1.4" : "-=0.9";
    const offsetHeaders = isMobile ? "-=1.1" : "-=0.7";
    const tl = gsap.timeline({
      // Provide a slightly longer default duration to make transitions feel more fluid on larger screens
      defaults: {
        ease: easeOut,
        duration: durContainer
      }
    });
    tl.to({}, { duration: phase1Delay });
    tl.to(
      [".hero--video-container", ".hero--video-w"],
      {
        duration: durContainer,
        borderRadius: (index) => index === 1 ? "1rem" : 0,
        padding: (index) => {
          if (index === 0) {
            return isDesktop ? "2rem" : isTablet ? "7rem 2rem 0 2rem" : isMobileLarge ? "6.5rem 1.5rem 0 1.5rem" : "5rem 1.5rem 0 1.5rem";
          }
          return 0;
        },
        scale: 1,
        opacity: 1,
        ease: easeOut
      },
      "phase1"
    );
    tl.to({}, { duration: delayBetweenPhase1And2 });
    tl.to(
      ".hero--section.is--video",
      {
        height: isDesktop ? vh <= 800 ? "87.5svh" : vh <= 1049 ? "85svh" : "82.5svh" : isTablet ? "87.5svh" : isMobileTall ? "82.5svh" : "87.5svh",
        duration: durCollapse,
        ease: easeInOut
      },
      "-=0.7"
    );
    tl.to(
      ".hero--content.is--video",
      {
        opacity: 1,
        y: "0%",
        scale: 1,
        duration: durContent,
        ease: easeOut
      },
      offsetContent
    );
    tl.to(
      [".hero--header"],
      {
        opacity: 1,
        y: 0,
        duration: durHeaders,
        stagger: 0.25,
        ease: easeOut
      },
      offsetHeaders
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
        onComplete: () => {
          gsap.set(".loader", { display: "none" });
        }
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
    const isTabletOrDesktop = window.matchMedia(
      "(min-width: 768px) and (hover: hover)"
    ).matches;
    if (!isTabletOrDesktop) return;
    const ctaCards = document.querySelectorAll(".afdeling--card.is--cta");
    ctaCards.forEach((card) => {
      const btn = card.querySelector(".afdeling--btn");
      card.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          backgroundColor: "var(--_color-tokens---bg-brand--darker)",
          duration: 0.2,
          ease: "power1.out"
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          backgroundColor: "var(--_color-tokens---bg-brand--base)",
          duration: 0.2,
          ease: "power1.out"
        });
      });
    });
  }
  Webflow.push(() => {
    initAfdelingCtaHover();
  });
  function initTabSystem() {
    const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
    if (wrappers.length === 0) {
      console.log("No tab wrappers found");
      return;
    }
    wrappers.forEach((wrapper) => {
      const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
      const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
      if (contentItems.length === 0) {
        console.log("No content items found in wrapper");
        return;
      }
      const autoplay = wrapper.getAttribute("data-tabs-autoplay") === "true";
      const autoplayDuration = parseInt(
        wrapper.getAttribute("data-tabs-autoplay-duration") || "5000"
      );
      let activeContent = null;
      let activeVisual = null;
      let isAnimating = false;
      let progressBarTween = null;
      function startProgressBar(index) {
        try {
          if (progressBarTween) progressBarTween.kill();
          const bar = contentItems[index].querySelector(
            '[data-tabs="item-progress"]'
          );
          if (!bar) return;
          if (typeof gsap === "undefined") {
            console.error("GSAP not loaded");
            return;
          }
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
          progressBarTween = gsap.to(bar, {
            scaleX: 1,
            duration: autoplayDuration / 1e3,
            ease: "none",
            // Linear progress like OSMO
            onComplete: () => {
              if (!isAnimating) {
                const nextIndex = (index + 1) % contentItems.length;
                switchTab(nextIndex);
              }
            }
          });
        } catch (error) {
          console.error("Error in startProgressBar:", error);
        }
      }
      function switchTab(index) {
        try {
          if (isAnimating || contentItems[index] === activeContent) return;
          if (typeof gsap === "undefined") {
            console.error("GSAP not loaded");
            return;
          }
          isAnimating = true;
          if (progressBarTween) progressBarTween.kill();
          const outgoingContent = activeContent;
          const outgoingVisual = activeVisual;
          const outgoingBar = outgoingContent == null ? void 0 : outgoingContent.querySelector(
            '[data-tabs="item-progress"]'
          );
          const incomingContent = contentItems[index];
          const incomingVisual = visualItems[index];
          const incomingBar = incomingContent.querySelector(
            '[data-tabs="item-progress"]'
          );
          contentItems.forEach((item) => {
            item.classList.remove("active");
            const button = item.querySelector(".tab--webshop.btn");
            if (button) button.classList.remove("tab--webshop-btn-active");
          });
          visualItems.forEach((item) => item.classList.remove("active"));
          incomingContent.classList.add("active");
          const activeButton = incomingContent.querySelector(".tab--webshop.btn");
          if (activeButton) activeButton.classList.add("tab--webshop-btn-active");
          incomingVisual == null ? void 0 : incomingVisual.classList.add("active");
          const tl = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.inOut" },
            onComplete: () => {
              activeContent = incomingContent;
              activeVisual = incomingVisual;
              isAnimating = false;
              if (autoplay) startProgressBar(index);
            }
          });
          if (outgoingContent) {
            if (outgoingBar) {
              tl.set(outgoingBar, { transformOrigin: "right center" }).to(
                outgoingBar,
                { scaleX: 0, duration: 0.3 },
                0
              );
            }
            if (outgoingVisual) {
              tl.to(
                outgoingVisual,
                {
                  autoAlpha: 0,
                  scale: 0.95,
                  duration: 0.6
                },
                0
              );
            }
            const outgoingDetails = outgoingContent.querySelector(
              '[data-tabs="item-details"]'
            );
            if (outgoingDetails) {
              tl.to(
                outgoingDetails,
                {
                  height: 0,
                  opacity: 0,
                  duration: 0.5
                },
                0
              );
            }
          }
          if (incomingVisual) {
            tl.fromTo(
              incomingVisual,
              { autoAlpha: 0, scale: 1.05 },
              { autoAlpha: 1, scale: 1, duration: 0.8 },
              0.2
            );
          }
          const incomingDetails = incomingContent.querySelector(
            '[data-tabs="item-details"]'
          );
          if (incomingDetails) {
            tl.fromTo(
              incomingDetails,
              { height: 0, opacity: 0 },
              { height: "auto", opacity: 1, duration: 0.6 },
              0.3
            );
          }
          if (incomingBar) {
            tl.set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
          }
        } catch (error) {
          console.error("Error in switchTab:", error);
          isAnimating = false;
        }
      }
      if (contentItems.length > 0) {
        contentItems[0].classList.add("active");
        const firstButton = contentItems[0].querySelector(".tab--webshop.btn");
        if (firstButton) firstButton.classList.add("tab--webshop-btn-active");
        if (visualItems[0]) visualItems[0].classList.add("active");
        activeContent = contentItems[0];
        activeVisual = visualItems[0] || null;
        if (autoplay) {
          startProgressBar(0);
        }
      }
      contentItems.forEach((item, i) => {
        item.addEventListener("click", () => {
          if (item === activeContent) return;
          switchTab(i);
        });
      });
      if (autoplay) {
        wrapper.addEventListener("mouseenter", () => {
          if (progressBarTween) progressBarTween.pause();
        });
        wrapper.addEventListener("mouseleave", () => {
          if (progressBarTween) progressBarTween.play();
        });
      }
    });
  }
  Webflow.push(() => {
    initTabSystem();
  });
  console.log("Nobel website scripts initialized");
})();
