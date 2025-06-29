var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
(function() {
  "use strict";
  (() => {
    if (!window.location.pathname.includes("/blog/") || window.location.pathname === "/blog" || window.location.pathname === "/blog/") {
      return;
    }
    document.querySelectorAll(".blog--list-w").forEach((wrapper) => {
      const list = wrapper.querySelector(".blog--list");
      if (!list) return;
      const items = Array.from(list.querySelectorAll(".blog--list-item"));
      if (items.length < 2) return;
      const targetCount = window.matchMedia("(min-width: 992px)").matches ? 3 : 4;
      const currentUrl = window.location.pathname;
      const currentSlug = currentUrl.split("/").pop() || "";
      const currentIndex = items.findIndex((item) => {
        if (item.querySelector(".w--current") || item.classList.contains("w--current")) {
          return true;
        }
        const link = item.querySelector("a[href]") || item.querySelector("[href]");
        if (link) {
          const href = link.getAttribute("href");
          if (href && href !== "#" && href !== "") {
            return href === currentUrl || currentSlug && href.includes(currentSlug) || currentUrl.includes(href);
          }
        }
        return false;
      });
      if (currentIndex === -1) return;
      const otherArticles = items.filter((_, idx) => idx !== currentIndex);
      for (let i = otherArticles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherArticles[i], otherArticles[j]] = [
          otherArticles[j],
          otherArticles[i]
        ];
      }
      const relatedItems = otherArticles.slice(
        0,
        Math.min(targetCount, otherArticles.length)
      );
      items.forEach((item) => {
        if (!relatedItems.includes(item)) {
          item.remove();
        }
      });
      relatedItems.forEach((item, idx) => {
        item.setAttribute("data-related-position", (idx + 1).toString());
      });
    });
  })();
  (() => {
    function setupInitialStates() {
      const pageWrapper = (
        /** @type {HTMLElement|null} */
        document.querySelector(".page--wrapper")
      );
      if (pageWrapper) {
        pageWrapper.style.opacity = "1";
        pageWrapper.style.visibility = "visible";
      }
      const heroSection = (
        /** @type {HTMLElement|null} */
        document.querySelector(".hero--section.is--video")
      );
      if (!heroSection) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isDesktop = vw >= 992;
      const isTablet = vw >= 768 && vw < 992;
      const isMobileTall = vw < 480 && vh >= 650;
      heroSection.style.height = isDesktop ? "100svh" : isTablet ? "97.5svh" : isMobileTall ? "97.5svh" : "92.5svh";
      const heroContent = heroSection.querySelector(".hero--content.is--video");
      if (heroContent) {
        const contentEl = (
          /** @type {HTMLElement} */
          heroContent
        );
        contentEl.style.opacity = "0";
        contentEl.style.transform = "translateY(100%) scale(0.92)";
        contentEl.style.willChange = "opacity, transform";
      }
      const headers = heroSection.querySelectorAll(".hero--header");
      headers.forEach((header) => {
        const headerEl = (
          /** @type {HTMLElement} */
          header
        );
        headerEl.style.opacity = "0";
        headerEl.style.transform = isDesktop ? "translateY(10vh)" : isTablet ? "translateY(2rem)" : "translateY(1rem)";
        headerEl.style.willChange = "opacity, transform";
      });
      const videoContainer = heroSection.querySelector(".hero--video-container");
      if (videoContainer) {
        const containerEl = (
          /** @type {HTMLElement} */
          videoContainer
        );
        containerEl.style.padding = "0";
        containerEl.style.opacity = "0";
        containerEl.style.willChange = "padding, opacity";
      }
      const videoWrapper = heroSection.querySelector(".hero--video-w");
      if (videoWrapper) {
        const wrapperEl = (
          /** @type {HTMLElement} */
          videoWrapper
        );
        wrapperEl.style.borderRadius = "0rem";
        wrapperEl.style.willChange = "border-radius";
      }
      const heroVideo = heroSection.querySelector(".hero--video");
      if (heroVideo) {
        const videoEl = (
          /** @type {HTMLElement} */
          heroVideo
        );
        videoEl.style.transform = "scale(1.05) translateZ(0)";
        videoEl.style.transformStyle = "preserve-3d";
        videoEl.style.backfaceVisibility = "hidden";
        videoEl.style.willChange = "transform";
        videoEl.style.transform3d = "translateZ(0)";
      }
    }
    function initHeroVideoAnimation() {
      const { animate, inView } = window.Motion || {};
      if (!animate || !inView) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initHeroVideoAnimation, 100);
        return;
      }
      const HERO_VIDEO_SELECTOR = ".hero--section.is--video";
      const getViewportType = () => {
        const vw = innerWidth;
        const vh = innerHeight;
        return {
          isDesktop: vw >= 992,
          isTablet: vw >= 768 && vw < 992,
          isMobileLarge: vw >= 480 && vw < 768,
          isMobileTall: vw < 480 && vh >= 650,
          isMobile: vw < 480,
          vh
        };
      };
      const expoOut = [0.16, 1, 0.3, 1];
      const power3Out = [0.215, 0.61, 0.355, 1];
      const power2InOut = [0.45, 0, 0.55, 1];
      const circOut = [0, 0.55, 0.45, 1];
      function buildHeroVideoAnimation(hero) {
        const { isDesktop, isTablet, isMobileLarge, isMobileTall, isMobile, vh } = getViewportType();
        const elements = {
          videoContainer: hero.querySelector(".hero--video-container"),
          videoWrapper: hero.querySelector(".hero--video-w"),
          heroVideo: hero.querySelector(".hero--video"),
          heroContent: hero.querySelector(".hero--content.is--video"),
          headers: hero.querySelectorAll(".hero--header"),
          heroSection: hero
        };
        const containerEase = circOut;
        const heightEase = power2InOut;
        const contentEase = expoOut;
        const headerEase = power3Out;
        const durContainer = isMobile ? 1 : 0.8;
        const durCollapse = isMobile ? 1.2 : 1;
        const durContent = isMobile ? 0.9 : 0.8;
        const durHeaders = isMobile ? 0.8 : 0.7;
        const phase1Delay = 0;
        const heightStartDelay = 0.3;
        const contentStartDelay = 0.2;
        const headerStartDelay = 0.6;
        if (elements.videoContainer) {
          const paddingTo = isDesktop ? "2rem" : isTablet ? "7rem 2rem 0 2rem" : isMobileLarge ? "6.5rem 1.5rem 0 1.5rem" : "5rem 1.5rem 0 1.5rem";
          animate(
            elements.videoContainer,
            {
              padding: ["0", paddingTo],
              opacity: [0, 1]
            },
            {
              duration: durContainer,
              easing: containerEase,
              delay: phase1Delay
            }
          );
        }
        if (elements.videoWrapper) {
          animate(
            elements.videoWrapper,
            {
              borderRadius: ["0rem", "1rem"]
            },
            {
              duration: durContainer,
              easing: containerEase,
              delay: phase1Delay
            }
          );
        }
        if (elements.heroVideo) {
          animate(
            elements.heroVideo,
            {
              scale: [1.05, 1]
            },
            {
              duration: durContainer,
              easing: containerEase,
              delay: phase1Delay
            }
          );
        }
        const finalHeight = isDesktop ? vh <= 800 ? "87.5svh" : vh <= 1049 ? "85svh" : "82.5svh" : isTablet ? "87.5svh" : isMobileTall ? "82.5svh" : "87.5svh";
        animate(
          elements.heroSection,
          {
            height: [
              isDesktop ? "100svh" : isTablet ? "97.5svh" : isMobileTall ? "97.5svh" : "92.5svh",
              finalHeight
            ]
          },
          {
            duration: durCollapse,
            easing: heightEase,
            delay: heightStartDelay
          }
        );
        if (elements.heroContent) {
          animate(
            elements.heroContent,
            {
              opacity: [0, 1],
              y: ["100%", "0%"],
              scale: [0.92, 1]
            },
            {
              duration: durContent,
              easing: contentEase,
              delay: contentStartDelay
            }
          );
        }
        if (elements.headers.length) {
          const headerY = isDesktop ? "10vh" : isTablet ? "2rem" : "1rem";
          elements.headers.forEach((header, index) => {
            animate(
              header,
              {
                opacity: [0, 1],
                y: [headerY, "0px"]
              },
              {
                duration: durHeaders,
                easing: headerEase,
                delay: headerStartDelay + index * 0.1
                // Reduced stagger for smoother flow
              }
            );
          });
        }
        const loader = document.querySelector(".loader");
        if (loader) {
          const loaderEl = (
            /** @type {HTMLElement} */
            loader
          );
          animate(
            loaderEl,
            {
              opacity: [1, 0]
            },
            {
              duration: 0.3,
              easing: expoOut,
              delay: 0.1,
              onStart: () => {
                document.dispatchEvent(new Event("preloaderFinished"));
              },
              onComplete: () => {
                loaderEl.style.display = "none";
              }
            }
          );
        }
      }
      const heroVideoSection = document.querySelector(HERO_VIDEO_SELECTOR);
      if (heroVideoSection) {
        const heroEl = (
          /** @type {HTMLElement} */
          heroVideoSection
        );
        if (heroEl.dataset.hVideoAnim !== "done") {
          heroEl.dataset.hVideoAnim = "done";
          buildHeroVideoAnimation(heroEl);
        }
      }
    }
    setupInitialStates();
    initHeroVideoAnimation();
  })();
  (() => {
    function setupInitialStates() {
      const pageWrapper = (
        /** @type {HTMLElement|null} */
        document.querySelector(".page--wrapper")
      );
      if (pageWrapper) {
        pageWrapper.style.opacity = "1";
        pageWrapper.style.visibility = "visible";
      }
      const heroSections = document.querySelectorAll(
        ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)"
      );
      heroSections.forEach((hero) => {
        const heroEl = (
          /** @type {HTMLElement} */
          hero
        );
        const frames = heroEl.querySelectorAll(".hero--frame.is--general");
        frames.forEach((frame) => {
          const frameEl = (
            /** @type {HTMLElement} */
            frame
          );
          frameEl.style.opacity = "0";
          frameEl.style.padding = "0rem";
        });
        const listWrapper = heroEl.querySelector(".hero--list-w.is--general");
        if (listWrapper) {
          listWrapper.style.borderRadius = "0rem";
        }
        const imgWrap = heroEl.querySelector(".hero--image-w");
        if (imgWrap) {
          imgWrap.style.height = "0%";
        }
        const headers = heroEl.querySelectorAll(".hero--header");
        headers.forEach((header) => {
          const headerEl = (
            /** @type {HTMLElement} */
            header
          );
          headerEl.style.opacity = "0";
          headerEl.style.transform = "translateX(-7.5rem)";
        });
        if (window.innerWidth >= 992) {
          const pointerLine = heroEl.querySelector(".hero--pointer-line");
          if (pointerLine) {
            pointerLine.style.height = "0%";
            pointerLine.style.transformOrigin = "top";
          }
          const pointerBullet = heroEl.querySelector(".hero--pointer-bullet");
          if (pointerBullet) {
            pointerBullet.style.transform = "scale(0)";
          }
          const subHeading = heroEl.querySelector(".hero--sub-heading");
          if (subHeading) {
            subHeading.style.opacity = "0";
          }
          const descContainer = heroEl.querySelector(
            ".hero--description .container"
          );
          if (descContainer) {
            descContainer.style.opacity = "0";
          }
          const cta = heroEl.querySelector(".hero--btn-w");
          if (cta) {
            cta.style.opacity = "0";
          }
        }
      });
    }
    function initHeroAnimation() {
      const { animate, inView, stagger } = window.Motion || {};
      if (!animate || !inView) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initHeroAnimation, 100);
        return;
      }
      const HERO_SECTION_SELECTOR = ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";
      const getViewportType = () => {
        const viewportWidth = innerWidth;
        return {
          isDesktop: viewportWidth >= 992,
          isMobile: viewportWidth < 992
        };
      };
      const easeOut = [0.22, 1, 0.36, 1];
      const expoOut = [0.16, 1, 0.3, 1];
      function buildHeroGeneralAnimation(hero) {
        const { isDesktop, isMobile } = getViewportType();
        const elements = {
          frames: hero.querySelectorAll(".hero--frame.is--general"),
          listWrapper: hero.querySelector(".hero--list-w.is--general"),
          imgWrap: hero.querySelector(".hero--image-w"),
          heroImage: hero.querySelector(".hero--image.is--general"),
          headers: hero.querySelectorAll(".hero--header"),
          pointerLine: hero.querySelector(".hero--pointer-line"),
          pointerBullet: hero.querySelector(".hero--pointer-bullet"),
          subHeading: hero.querySelector(".hero--sub-heading"),
          descContainer: hero.querySelector(".hero--description .container"),
          cta: hero.querySelector(".hero--btn-w")
        };
        const padFrom = "0rem";
        const padTo = isDesktop ? "2rem" : "0rem";
        const radiusTo = isDesktop ? "1rem" : "0rem";
        elements.frames.forEach((frame) => {
          const frameEl = (
            /** @type {HTMLElement} */
            frame
          );
          animate(
            frameEl,
            {
              padding: [padFrom, padTo],
              opacity: [0, 1]
            },
            { duration: 1, easing: easeOut }
          );
        });
        if (elements.listWrapper) {
          animate(
            elements.listWrapper,
            {
              borderRadius: ["0rem", radiusTo]
            },
            { duration: 1, easing: easeOut }
          );
        }
        const t0 = 0;
        const tPhase2 = t0 + 0.2;
        const imgDelay = isMobile ? 0.15 : 0.2;
        const imgDuration = isMobile ? 0.8 : 0.8;
        const headerDelay = tPhase2 + 0.1;
        const headerDuration = isMobile ? 0.8 : 0.6;
        const headerAnimation = isMobile ? {
          x: ["-7.5rem", "0rem"],
          opacity: [0, 1]
        } : {
          opacity: [0, 1]
        };
        if (elements.imgWrap) {
          animate(
            elements.imgWrap,
            { height: ["0%", "100%"] },
            {
              duration: imgDuration,
              easing: expoOut,
              delay: imgDelay
            }
          );
        }
        if (elements.headers.length) {
          animate(elements.headers, headerAnimation, {
            duration: headerDuration,
            easing: expoOut,
            delay: headerDelay
          });
        }
        if (isDesktop) {
          const pointerLineDelay = tPhase2 - 0.2;
          const pointerLineDuration = 1.4;
          const pointerBulletDelay = tPhase2 + 0.95;
          const pointerBulletDuration = 0.75;
          const fadeDelay = tPhase2 + 1.8;
          const fadeDuration = 0.3;
          const commonFadeOpts = {
            duration: fadeDuration,
            easing: easeOut,
            delay: fadeDelay
          };
          if (elements.pointerLine) {
            elements.pointerLine.style.transformOrigin = "top";
            animate(
              elements.pointerLine,
              { height: ["0%", "100%"] },
              {
                duration: pointerLineDuration,
                easing: "linear",
                delay: pointerLineDelay
              }
            );
          }
          if (elements.pointerBullet) {
            animate(
              elements.pointerBullet,
              { scale: [0, 1] },
              {
                duration: pointerBulletDuration,
                easing: expoOut,
                delay: pointerBulletDelay
              }
            );
          }
          elements.subHeading && animate(elements.subHeading, { opacity: [0, 1] }, commonFadeOpts);
          elements.descContainer && animate(elements.descContainer, { opacity: [0, 1] }, commonFadeOpts);
          if (elements.cta) {
            animate(
              elements.cta,
              {
                opacity: [0, 1]
              },
              commonFadeOpts
            );
          }
        }
        const loader = document.querySelector(".loader");
        if (loader) {
          const loaderEl = (
            /** @type {HTMLElement} */
            loader
          );
          animate(
            loaderEl,
            {
              opacity: [1, 0]
            },
            {
              duration: 0.2,
              easing: [0.76, 0, 0.24, 1],
              // power3.inOut equivalent
              delay: 0.1,
              onStart: () => {
                document.dispatchEvent(new Event("preloaderFinished"));
              },
              onComplete: () => {
                loaderEl.style.display = "none";
              }
            }
          );
        }
      }
      inView(
        HERO_SECTION_SELECTOR,
        (hero) => {
          if (hero.dataset.hAnim === "done") return;
          hero.dataset.hAnim = "done";
          buildHeroGeneralAnimation(hero);
        },
        { amount: 0.1 }
      );
    }
    setupInitialStates();
    initHeroAnimation();
  })();
  (() => {
    function setupInitialStates() {
      const pageWrapper = (
        /** @type {HTMLElement|null} */
        document.querySelector(".page--wrapper")
      );
      if (pageWrapper) {
        pageWrapper.style.opacity = "1";
        pageWrapper.style.visibility = "visible";
      }
      const heroSections = document.querySelectorAll(
        ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)"
      );
      heroSections.forEach((hero) => {
        const heroEl = (
          /** @type {HTMLElement} */
          hero
        );
        const headers = heroEl.querySelectorAll(".hero--header");
        headers.forEach((header) => {
          const headerEl = (
            /** @type {HTMLElement} */
            header
          );
          headerEl.style.opacity = "0";
          headerEl.style.transform = "translateX(-7.5rem)";
        });
        const productItems = heroEl.querySelectorAll(".hero--products > *");
        productItems.forEach((item) => {
          const itemEl = (
            /** @type {HTMLElement} */
            item
          );
          itemEl.style.opacity = "0";
          itemEl.style.transform = "translateY(7.5rem)";
        });
        const productContainers = heroEl.querySelectorAll(".hero--products");
        productContainers.forEach((container) => {
          const containerEl = (
            /** @type {HTMLElement} */
            container
          );
          containerEl.style.opacity = "1";
          containerEl.style.transform = "none";
        });
        const backgrounds = heroEl.querySelectorAll(".hero--background");
        backgrounds.forEach((background) => {
          const backgroundEl = (
            /** @type {HTMLElement} */
            background
          );
          const isMobile = window.innerWidth < 992;
          if (isMobile) {
            backgroundEl.style.opacity = "0";
          }
        });
        if (window.innerWidth >= 992) {
          const pointerLine = heroEl.querySelector(".hero--pointer-line");
          if (pointerLine) {
            pointerLine.style.height = "0%";
            pointerLine.style.transformOrigin = "top";
          }
          const pointerBullet = heroEl.querySelector(".hero--pointer-bullet");
          if (pointerBullet) {
            pointerBullet.style.transform = "scale(0)";
          }
          const subHeading = heroEl.querySelector(".hero--sub-heading");
          if (subHeading) {
            subHeading.style.opacity = "0";
          }
          const descContainer = heroEl.querySelector(
            ".hero--description .container"
          );
          if (descContainer) {
            descContainer.style.opacity = "0";
          }
          const cta = heroEl.querySelector(".hero--btn-w");
          if (cta) {
            cta.style.opacity = "0";
          }
        }
      });
    }
    function initHeroAnimation() {
      const { animate, inView, stagger } = window.Motion || {};
      if (!animate || !inView) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initHeroAnimation, 100);
        return;
      }
      const HERO_SECTION_SELECTOR = ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";
      const getViewportType = () => {
        const viewportWidth = innerWidth;
        return {
          isDesktop: viewportWidth >= 992,
          isMobile: viewportWidth < 992
        };
      };
      const easeOut = [0.22, 1, 0.36, 1];
      const easeIn = [0.55, 0, 0.55, 0.2];
      const expoOut = [0.16, 1, 0.3, 1];
      function buildHeroWebshopAnimation(hero) {
        const { isDesktop, isMobile } = getViewportType();
        const elements = {
          headers: hero.querySelectorAll(".hero--header"),
          products: hero.querySelectorAll(".hero--products"),
          backgrounds: hero.querySelectorAll(".hero--background"),
          pointerLine: hero.querySelector(".hero--pointer-line"),
          pointerBullet: hero.querySelector(".hero--pointer-bullet"),
          subHeading: hero.querySelector(".hero--sub-heading"),
          descContainer: hero.querySelector(".hero--description .container"),
          cta: hero.querySelector(".hero--btn-w")
        };
        const headerDuration = isMobile ? 0.8 : 1.1;
        const headerEasing = isMobile ? expoOut : easeOut;
        const headerDelay = 0;
        const productDuration = isMobile ? 0.6 : 0.6;
        const productEasing = isMobile ? expoOut : easeOut;
        const productDelay = isMobile ? 0.15 : (index) => 0.175 + index * 0.015;
        if (elements.headers.length) {
          animate(
            elements.headers,
            {
              x: ["-7.5rem", "0rem"],
              opacity: [0, 1]
            },
            {
              duration: headerDuration,
              easing: headerEasing,
              delay: headerDelay
            }
          );
        }
        if (elements.products.length) {
          const productChildren = hero.querySelectorAll(".hero--products > *");
          if (productChildren.length > 0) {
            animate(
              productChildren,
              {
                opacity: [0, 1],
                y: ["7.5rem", "0rem"]
              },
              {
                duration: productDuration,
                easing: productEasing,
                delay: productDelay
              }
            );
          }
        }
        const backgroundDuration = 0.9;
        const backgroundDelay = 0.2;
        if (elements.backgrounds.length && isMobile) {
          animate(
            elements.backgrounds,
            { opacity: [0, 1] },
            {
              duration: backgroundDuration,
              easing: easeOut,
              delay: backgroundDelay
            }
          );
        }
        if (isDesktop) {
          const tPhase2 = 0.2;
          const pointerLineDelay = tPhase2 - 0.2;
          const pointerLineDuration = 1.4;
          const pointerBulletDelay = tPhase2 + 0.95;
          const pointerBulletDuration = 0.75;
          const fadeDelay = tPhase2 + 1.7;
          const fadeDuration = 0.3;
          const commonFadeOpts = {
            duration: fadeDuration,
            easing: easeIn,
            delay: fadeDelay
          };
          if (elements.pointerLine) {
            elements.pointerLine.style.transformOrigin = "top";
            animate(
              elements.pointerLine,
              { height: ["0%", "100%"] },
              {
                duration: pointerLineDuration,
                easing: "linear",
                delay: pointerLineDelay
              }
            );
          }
          if (elements.pointerBullet) {
            animate(
              elements.pointerBullet,
              { scale: [0, 1] },
              {
                duration: pointerBulletDuration,
                easing: expoOut,
                delay: pointerBulletDelay
              }
            );
          }
          elements.subHeading && animate(elements.subHeading, { opacity: [0, 1] }, commonFadeOpts);
          elements.descContainer && animate(elements.descContainer, { opacity: [0, 1] }, commonFadeOpts);
          if (elements.cta) {
            animate(
              elements.cta,
              {
                opacity: [0, 1]
              },
              commonFadeOpts
            );
          }
        }
        const loader = document.querySelector(".loader");
        if (loader) {
          const loaderEl = (
            /** @type {HTMLElement} */
            loader
          );
          animate(
            loaderEl,
            {
              opacity: [1, 0]
            },
            {
              duration: 0.2,
              easing: [0.76, 0, 0.24, 1],
              // power3.inOut equivalent
              delay: 0.1,
              onStart: () => {
                document.dispatchEvent(new Event("preloaderFinished"));
              },
              onComplete: () => {
                loaderEl.style.display = "none";
              }
            }
          );
        }
      }
      inView(
        HERO_SECTION_SELECTOR,
        (hero) => {
          if (hero.dataset.hAnim === "done") return;
          hero.dataset.hAnim = "done";
          buildHeroWebshopAnimation(hero);
        },
        { amount: 0.1 }
      );
    }
    setupInitialStates();
    initHeroAnimation();
  })();
  (() => {
    function setupInitialStates() {
      const pageWrapper = (
        /** @type {HTMLElement|null} */
        document.querySelector(".page--wrapper")
      );
      if (pageWrapper) {
        pageWrapper.style.opacity = "1";
        pageWrapper.style.visibility = "visible";
      }
      const heroSections = document.querySelectorAll(
        ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)"
      );
      heroSections.forEach((hero) => {
        const heroEl = (
          /** @type {HTMLElement} */
          hero
        );
        const cardWrappers = heroEl.querySelectorAll(".hero--card-w");
        cardWrappers.forEach((cardW) => {
          const cardWEl = (
            /** @type {HTMLElement} */
            cardW
          );
          cardWEl.style.height = "0%";
        });
        const cardContents = heroEl.querySelectorAll(".hero--card-content");
        cardContents.forEach((content) => {
        });
        const headers = heroEl.querySelectorAll(".hero--header");
        headers.forEach((header) => {
          const headerEl = (
            /** @type {HTMLElement} */
            header
          );
          headerEl.style.opacity = "0";
          if (window.innerWidth < 992) {
            headerEl.style.transform = "translateX(-7.5rem)";
          } else {
            headerEl.style.transform = "scale(0.9)";
          }
        });
        const imageOverlays = heroEl.querySelectorAll(
          ".hero--card-image-overlay"
        );
        imageOverlays.forEach((overlay) => {
          const overlayEl = (
            /** @type {HTMLElement} */
            overlay
          );
          overlayEl.style.opacity = "0";
        });
        const cardContainers = heroEl.querySelectorAll(".hero--card-container");
        cardContainers.forEach((container) => {
          const containerEl = (
            /** @type {HTMLElement} */
            container
          );
          containerEl.style.transform = "translateY(100%)";
        });
      });
    }
    function initHeroAnimation() {
      const { animate, inView, stagger } = window.Motion || {};
      if (!animate || !inView) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initHeroAnimation, 100);
        return;
      }
      const HERO_SECTION_SELECTOR = ".hero--section:not(.w-dyn-empty):not(.w-dyn-bind-empty):not(.w-condition-invisible)";
      const getViewportType = () => {
        const viewportWidth = innerWidth;
        return {
          isDesktop: viewportWidth >= 992,
          isMobile: viewportWidth < 992
        };
      };
      const easeOut = [0.22, 1, 0.36, 1];
      const easeIn = [0.55, 0, 0.55, 0.2];
      const expoOut = [0.16, 1, 0.3, 1];
      function buildHeroCardsAnimation(hero) {
        const { isMobile } = getViewportType();
        const elements = {
          cardWrappers: hero.querySelectorAll(".hero--card-w"),
          cardContents: hero.querySelectorAll(".hero--card-content"),
          headers: hero.querySelectorAll(".hero--header"),
          imageOverlays: hero.querySelectorAll(".hero--card-image-overlay"),
          cardContainers: hero.querySelectorAll(".hero--card-container")
        };
        const cardWrapperDuration = isMobile ? 0.8 : 0.8;
        const cardWrapperEasing = isMobile ? expoOut : easeOut;
        const cardWrapperDelay = isMobile ? 0.15 : 0;
        const cardContentDuration = isMobile ? 1 : 1;
        const cardContentDelay = isMobile ? 1.4 : 0;
        const headerDuration = isMobile ? 0.8 : 1.1;
        const headerEasing = isMobile ? expoOut : easeOut;
        const headerDelay = isMobile ? 0.1 : 0;
        const headerAnimation = isMobile ? {
          opacity: [0, 1],
          x: ["-7.5rem", "0rem"]
        } : {
          scale: [0.9, 1],
          opacity: [0, 1]
        };
        if (elements.cardWrappers.length) {
          animate(
            elements.cardWrappers,
            {
              height: ["0%", "100%"]
            },
            {
              duration: cardWrapperDuration,
              easing: cardWrapperEasing,
              delay: cardWrapperDelay
            }
          );
        }
        if (elements.cardContents.length) {
          animate(
            elements.cardContents,
            {
              opacity: [1, 1]
            },
            {
              duration: cardContentDuration,
              easing: expoOut,
              delay: cardContentDelay
            }
          );
        }
        if (elements.headers.length) {
          animate(elements.headers, headerAnimation, {
            duration: headerDuration,
            easing: headerEasing,
            delay: headerDelay
          });
        }
        const overlayDuration = isMobile ? 0.7 : 0.9;
        const overlayDelay = 0.25;
        const containerDuration = isMobile ? 0.7 : 0.9;
        const containerDelay = 0.25;
        if (elements.imageOverlays.length) {
          animate(
            elements.imageOverlays,
            {
              opacity: [0, 1]
            },
            {
              duration: overlayDuration,
              easing: easeIn,
              delay: overlayDelay
            }
          );
        }
        if (elements.cardContainers.length) {
          animate(
            elements.cardContainers,
            {
              y: ["100%", "0%"]
            },
            {
              duration: containerDuration,
              easing: easeIn,
              delay: containerDelay
            }
          );
        }
        const loader = document.querySelector(".loader");
        if (loader) {
          const loaderEl = (
            /** @type {HTMLElement} */
            loader
          );
          animate(
            loaderEl,
            {
              opacity: [1, 0]
            },
            {
              duration: 0.2,
              easing: [0.76, 0, 0.24, 1],
              // power3.inOut equivalent
              delay: 0.1,
              onStart: () => {
                document.dispatchEvent(new Event("preloaderFinished"));
              },
              onComplete: () => {
                loaderEl.style.display = "none";
              }
            }
          );
        }
      }
      inView(
        HERO_SECTION_SELECTOR,
        (hero) => {
          if (hero.dataset.hAnim === "done") return;
          hero.dataset.hAnim = "done";
          buildHeroCardsAnimation(hero);
        },
        { amount: 0.1 }
      );
    }
    setupInitialStates();
    initHeroAnimation();
  })();
  const EASING = {
    // Power curves
    power1Out: [0.25, 0.46, 0.45, 0.94],
    power2Out: [0.33, 1, 0.68, 1],
    power2In: [0.55, 0, 1, 0.45],
    power3Out: [0.215, 0.61, 0.355, 1],
    power3In: [0.55, 0.055, 0.675, 0.19]
  };
  function initMotionWithRetry(callback, maxRetries = 10, delay = 100) {
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
  const DEVICE = {
    // Tablet breakpoints (consistent across components)
    TABLET_MIN: 768,
    DESKTOP_MIN: 1200,
    isTabletOrDesktop() {
      return window.matchMedia(`(min-width: ${this.TABLET_MIN}px)`).matches;
    },
    isDesktopOrTablet() {
      return this.isTabletOrDesktop();
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
  function initWithWebflow(callback) {
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(callback);
    } else {
      callback();
    }
  }
  class DOMCache {
    constructor() {
      this.cache = /* @__PURE__ */ new Map();
    }
    get(selector, context = document) {
      const key = `${selector}:${context === document ? "document" : "context"}`;
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
  class AnimationManager {
    constructor() {
      this.activeAnimations = /* @__PURE__ */ new Set();
      this.timers = /* @__PURE__ */ new Set();
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
      this.activeAnimations.forEach((animation) => {
        if (animation && typeof animation.cancel === "function") {
          animation.cancel();
        }
      });
      this.timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      this.activeAnimations.clear();
      this.timers.clear();
    }
  }
  function optimizeForAnimation(element) {
    if (element instanceof HTMLElement) {
      element.style.willChange = "transform, opacity";
      element.style.backfaceVisibility = "hidden";
      element.style.perspective = "1000px";
    }
  }
  function resetOptimization(element) {
    if (element instanceof HTMLElement) {
      element.style.willChange = "auto";
      element.style.backfaceVisibility = "";
      element.style.perspective = "";
    }
  }
  (() => {
    function initDropdownMenu() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initDropdownMenu, 100);
        return;
      }
      const dropdowns = Array.from(document.querySelectorAll(".nav--dropdown"));
      if (!dropdowns.length) {
        console.error("No dropdown elements found in the DOM!");
        return;
      }
      const navigation = document.querySelector(".nav--bar");
      if (!navigation) {
        console.error("Navigation container (.nav--bar) not found!");
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
          dropdownMenu,
          icon: dropdownIcon,
          isOpen: false,
          animating: false
        };
      }).filter((d) => d !== null);
      const power2Out = EASING.power2Out;
      const power2In = EASING.power2In;
      const openDropdown = (d) => {
        d.animating = true;
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const menuEl = (
          /** @type {HTMLElement} */
          d.dropdownMenu
        );
        menuEl.style.height = "auto";
        const naturalHeight = menuEl.offsetHeight;
        menuEl.style.height = "0px";
        animate(
          d.dropdownMenu,
          {
            opacity: [0, 1],
            height: ["0px", `${naturalHeight}px`]
          },
          {
            duration: 0.3,
            easing: power2Out
          }
        );
        animate(
          d.icon,
          {
            rotate: ["0deg", "180deg"]
          },
          {
            duration: 0.3,
            easing: power2Out
          }
        );
        animate(
          d.toggle,
          {
            backgroundColor: [
              "transparent",
              "var(--secondary--darkest)"
            ]
          },
          {
            duration: 0.3,
            easing: power2Out
          }
        );
        if (isDesktop) {
          animate(
            navigation,
            {
              borderBottomLeftRadius: ["1rem", "0rem"],
              borderBottomRightRadius: ["1rem", "0rem"]
            },
            {
              duration: 0.3,
              easing: power2Out,
              onComplete: () => {
                d.animating = false;
              }
            }
          );
        } else {
          setTimeout(() => {
            d.animating = false;
          }, 300);
        }
        d.isOpen = true;
      };
      const closeDropdown = (d) => {
        d.animating = true;
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const menuEl = (
          /** @type {HTMLElement} */
          d.dropdownMenu
        );
        const currentHeight = menuEl.scrollHeight;
        animate(
          d.dropdownMenu,
          {
            opacity: [1, 0],
            height: [`${currentHeight}px`, "0px"]
          },
          {
            duration: 0.3,
            easing: power2In
          }
        );
        animate(
          d.icon,
          {
            rotate: ["180deg", "0deg"]
          },
          {
            duration: 0.3,
            easing: power2In
          }
        );
        animate(
          d.toggle,
          {
            backgroundColor: [
              "var(--secondary--darkest)",
              "transparent"
            ]
          },
          {
            duration: 0.3,
            easing: power2In
          }
        );
        if (isDesktop) {
          animate(
            navigation,
            {
              borderBottomLeftRadius: ["0rem", "1rem"],
              borderBottomRightRadius: ["0rem", "1rem"]
            },
            {
              duration: 0.3,
              easing: power2In,
              onComplete: () => {
                d.animating = false;
              }
            }
          );
        } else {
          setTimeout(() => {
            d.animating = false;
          }, 300);
        }
        d.isOpen = false;
      };
      const closeAllDropdowns = (except = null) => {
        dropdownData.forEach((d) => {
          if (d !== except && d.isOpen && !d.animating) {
            closeDropdown(d);
          }
        });
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
    }
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(() => {
        initDropdownMenu();
      });
    } else {
      initDropdownMenu();
    }
  })();
  (() => {
    function initLanguageSelector() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initLanguageSelector, 100);
        return;
      }
      const languageBtn = document.querySelector('[class*="language--btn-w"]');
      const languageDropdown = document.querySelector(
        '[class*="language--dropdown-w"]'
      );
      const languageIcon = document.querySelector(".icon--svg.is--language");
      if (!languageBtn || !languageDropdown || !languageIcon) {
        console.error("Required language selector elements not found!");
        return;
      }
      const { power2Out, power2In, power3Out, power3In } = EASING;
      const toggleDropdown = (isOpen) => {
        animate(
          languageIcon,
          {
            rotate: [isOpen ? "0deg" : "180deg", isOpen ? "180deg" : "0deg"]
          },
          {
            duration: 0.4,
            easing: power2Out
          }
        );
        animate(
          languageBtn,
          {
            backgroundColor: [
              isOpen ? "var(--_color-tokens---bg-brand--dark)" : "var(--_color-tokens---bg-brand--darkest)",
              isOpen ? "var(--_color-tokens---bg-brand--darkest)" : "var(--_color-tokens---bg-brand--dark)"
            ]
          },
          {
            duration: 0.3,
            easing: power2Out
          }
        );
        if (isOpen) {
          const dropdownEl = (
            /** @type {HTMLElement} */
            languageDropdown
          );
          dropdownEl.style.visibility = "visible";
          dropdownEl.style.height = "auto";
          const naturalHeight = dropdownEl.offsetHeight;
          dropdownEl.style.height = "0px";
          animate(
            languageDropdown,
            {
              opacity: [0, 1],
              height: ["0px", `${naturalHeight}px`]
            },
            {
              duration: 0.5,
              easing: power3Out
            }
          );
        } else {
          const dropdownEl = (
            /** @type {HTMLElement} */
            languageDropdown
          );
          const currentHeight = dropdownEl.scrollHeight;
          animate(
            languageDropdown,
            {
              opacity: [1, 0],
              height: [`${currentHeight}px`, "0px"]
            },
            {
              duration: 0.5,
              easing: power3In,
              onComplete: () => {
                dropdownEl.style.visibility = "hidden";
              }
            }
          );
        }
      };
      languageBtn.addEventListener("mouseenter", () => {
        if (!languageBtn.classList.contains("clicked")) {
          animate(
            languageBtn,
            {
              width: ["2rem", "4.75rem"],
              backgroundColor: [
                "var(--_color-tokens---bg-brand--dark)",
                "var(--_color-tokens---bg-brand--dark)"
              ]
            },
            {
              duration: 0.3,
              easing: power2Out
            }
          );
        }
      });
      languageBtn.addEventListener("mouseleave", () => {
        if (!languageBtn.classList.contains("clicked")) {
          animate(
            languageBtn,
            {
              width: ["4.75rem", "2rem"],
              backgroundColor: [
                "var(--_color-tokens---bg-brand--dark)",
                "var(--_color-tokens---bg-brand--dark)"
              ]
            },
            {
              duration: 0.3,
              easing: power2In
            }
          );
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
          animate(
            languageBtn,
            {
              width: ["4.75rem", "2rem"],
              backgroundColor: [
                "var(--_color-tokens---bg-brand--darkest)",
                "var(--_color-tokens---bg-brand--dark)"
              ]
            },
            {
              duration: 0.3,
              easing: power2In
            }
          );
        }
      });
    }
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(() => {
        initLanguageSelector();
      });
    } else {
      initLanguageSelector();
    }
  })();
  (() => {
    function initHideNavOnScroll() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initHideNavOnScroll, 100);
        return;
      }
      const initHideNavOnScrollLogic = () => {
        let lastScrollTop = 0;
        const navbar = document.querySelector(".nav--bar");
        const scrollThreshold = 50;
        const tabletBreakpoint = 1200;
        if (!navbar) {
          console.error("Navigation bar (.nav--bar) not found!");
          return;
        }
        function handleScroll() {
          if (isMobileOrTablet()) return;
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          if (Math.abs(lastScrollTop - currentScroll) <= scrollThreshold) return;
          if (currentScroll > lastScrollTop && currentScroll > 50) {
            animate(
              navbar,
              {
                y: [navbar.style.transform.includes("translateY") ? "0%" : "0%", "-200%"]
              },
              {
                duration: 0.3,
                easing: [0.25, 0.46, 0.45, 0.94]
                // ease-in-out
              }
            );
          } else {
            animate(
              navbar,
              {
                y: [navbar.style.transform.includes("translateY") ? "-200%" : "-200%", "0%"]
              },
              {
                duration: 0.3,
                easing: [0.25, 0.46, 0.45, 0.94]
                // ease-in-out
              }
            );
          }
          lastScrollTop = currentScroll;
        }
        function isMobileOrTablet() {
          const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
          const smallScreen = window.innerWidth <= tabletBreakpoint;
          return touchDevice || smallScreen;
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
      };
      initHideNavOnScrollLogic();
    }
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(() => {
        initHideNavOnScroll();
      });
    } else {
      initHideNavOnScroll();
    }
  })();
  (() => {
    initWithWebflow(() => {
      initMotionWithRetry(({ animate }) => {
        const megaMenu = (
          /** @type {HTMLElement|null} */
          document.querySelector(".nav--mega-menu")
        );
        const menuButton = (
          /** @type {HTMLElement|null} */
          document.querySelector(".btn--hamburger")
        );
        if (!megaMenu || !menuButton) return;
        optimizeForAnimation(megaMenu);
        let isOpen = false;
        const OPEN_CONFIG = {
          duration: 0.8,
          easing: EASING.power2Out,
          delay: 200
        };
        const CLOSE_CONFIG = {
          duration: 0.4,
          easing: EASING.power2In
        };
        function openMenu() {
          megaMenu.style.display = "flex";
          animate(megaMenu, {
            height: ["0svh", "100svh"],
            width: ["100%", "100%"]
          }, OPEN_CONFIG).finished.then(() => {
            megaMenu.style.borderRadius = "0rem";
          });
        }
        function closeMenu() {
          megaMenu.style.borderRadius = "0.75rem";
          animate(megaMenu, {
            height: ["100svh", "0svh"],
            width: ["100%", "100%"]
          }, CLOSE_CONFIG).finished.then(() => {
            megaMenu.style.display = "none";
          });
        }
        menuButton.addEventListener("click", () => {
          if (!isOpen) {
            openMenu();
          } else {
            closeMenu();
          }
          isOpen = !isOpen;
        });
        window.addEventListener("beforeunload", () => {
          resetOptimization(megaMenu);
        });
      });
    });
  })();
  (() => {
    const isDesktopOrTablet = DEVICE.isTabletOrDesktop;
    function setupInitialStates() {
      if (!isDesktopOrTablet()) return;
      const btnContainers = document.querySelectorAll(".btn--cta");
      btnContainers.forEach((container) => {
        const buttons = container.querySelectorAll(".btn");
        buttons.forEach((btn) => {
          const iconBase = btn.querySelector(".btn--icon.is--animated-base");
          const iconAbsolute = btn.querySelector(".btn--icon.is--animated-absolute");
          if (iconBase && iconAbsolute) {
            const iconAbsoluteEl = (
              /** @type {HTMLElement} */
              iconAbsolute
            );
            const iconBaseEl = (
              /** @type {HTMLElement} */
              iconBase
            );
            iconAbsoluteEl.style.opacity = "0";
            iconAbsoluteEl.style.willChange = "opacity, transform";
            iconBaseEl.style.opacity = "1";
            iconBaseEl.style.transform = "translateX(0%)";
            iconBaseEl.style.willChange = "opacity, transform";
          }
        });
      });
    }
    function initBtnCtaAnimation() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initBtnCtaAnimation, 100);
        return;
      }
      const power1Out = EASING.power1Out;
      const power0 = [0, 0, 1, 1];
      function buildBtnCtaAnimation() {
        if (!isDesktopOrTablet()) return;
        const btnContainers = document.querySelectorAll(".btn--cta");
        btnContainers.forEach((container) => {
          const containerEl = (
            /** @type {HTMLElement} */
            container
          );
          const buttons = containerEl.querySelectorAll(".btn");
          const buttonAnimations = [];
          buttons.forEach((btn) => {
            const iconBase = btn.querySelector(".btn--icon.is--animated-base");
            const iconAbsolute = btn.querySelector(".btn--icon.is--animated-absolute");
            if (iconBase && iconAbsolute) {
              const iconAbsoluteEl = (
                /** @type {HTMLElement} */
                iconAbsolute
              );
              const iconBaseEl = (
                /** @type {HTMLElement} */
                iconBase
              );
              const hoverInAnimation = () => {
                animate(
                  iconAbsoluteEl,
                  {
                    x: "0%",
                    // Match GSAP: animate to 0% from current position
                    opacity: 1
                  },
                  {
                    duration: 0.3,
                    easing: power1Out
                  }
                );
                animate(
                  iconBaseEl,
                  {
                    x: "200%",
                    opacity: 0
                  },
                  {
                    duration: 0.3,
                    easing: power0
                  }
                );
              };
              const hoverOutAnimation = () => {
                animate(
                  iconAbsoluteEl,
                  {
                    opacity: 0
                  },
                  {
                    duration: 0.3,
                    easing: power0
                  }
                );
                animate(
                  iconBaseEl,
                  {
                    x: "0%",
                    opacity: 1
                  },
                  {
                    duration: 0.3,
                    easing: power1Out
                  }
                );
              };
              buttonAnimations.push({
                hoverIn: hoverInAnimation,
                hoverOut: hoverOutAnimation
              });
            }
          });
          if (buttonAnimations.length > 0) {
            if (containerEl.dataset.btnCtaAnimated !== "true") {
              containerEl.dataset.btnCtaAnimated = "true";
              containerEl.addEventListener("mouseenter", () => {
                buttonAnimations.forEach((animation) => animation.hoverIn());
              });
              containerEl.addEventListener("mouseleave", () => {
                buttonAnimations.forEach((animation) => animation.hoverOut());
              });
            }
          }
        });
      }
      buildBtnCtaAnimation();
    }
    window.btnAnimation = () => {
      console.log("btn--cta: Using Motion.dev animation instead of GSAP");
    };
    setupInitialStates();
    initBtnCtaAnimation();
  })();
  (() => {
    const isDesktopOrTablet = DEVICE.isTabletOrDesktop;
    const isTouchDevice = () => DEVICE.isMobileOrTablet();
    function setupInitialStates() {
      if (!isDesktopOrTablet()) return;
      const hoverElements = document.querySelectorAll(
        '.btn--text-link[data-text-link-hover="Underline"] .btn--text-link-hover'
      );
      hoverElements.forEach((el) => {
        const hoverEl = (
          /** @type {HTMLElement} */
          el
        );
        hoverEl.style.width = "0%";
        hoverEl.style.visibility = "hidden";
        hoverEl.style.willChange = "width";
      });
    }
    function initTextLinkAnimation() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initTextLinkAnimation, 100);
        return;
      }
      const power1Out = [0.25, 0.46, 0.45, 0.94];
      function buildTextLinkAnimation() {
        if (!isDesktopOrTablet()) return;
        const textLinks = document.querySelectorAll(
          '.btn--text-link[data-text-link-hover="Underline"]'
        );
        textLinks.forEach((link) => {
          const linkEl = (
            /** @type {HTMLElement} */
            link
          );
          const hoverElement = linkEl.querySelector(".btn--text-link-hover");
          if (!hoverElement) return;
          const hoverEl = (
            /** @type {HTMLElement} */
            hoverElement
          );
          if (linkEl.dataset.textLinkAnimated === "true") return;
          linkEl.dataset.textLinkAnimated = "true";
          const showUnderline = () => {
            animate(
              hoverEl,
              {
                width: ["0%", "100%"]
              },
              {
                duration: 0.3,
                easing: power1Out,
                onStart: () => {
                  hoverEl.style.visibility = "visible";
                }
              }
            );
          };
          const hideUnderline = () => {
            animate(
              hoverEl,
              {
                width: ["100%", "0%"]
              },
              {
                duration: 0.3,
                easing: power1Out,
                onComplete: () => {
                  hoverEl.style.visibility = "hidden";
                }
              }
            );
          };
          if (isTouchDevice()) {
            linkEl.addEventListener("touchstart", showUnderline);
            linkEl.addEventListener("touchend", hideUnderline);
          } else {
            linkEl.addEventListener("mouseenter", showUnderline);
            linkEl.addEventListener("mouseleave", hideUnderline);
          }
        });
      }
      buildTextLinkAnimation();
    }
    setupInitialStates();
    if (typeof window.Webflow !== "undefined") {
      window.Webflow.push(() => {
        initTextLinkAnimation();
      });
    } else {
      initTextLinkAnimation();
    }
  })();
  class BaseLinkAnimation {
    constructor(config) {
      this.config = {
        // Required configuration
        containerSelector: config.containerSelector,
        // e.g. '.link--blog'
        lineSelector: config.lineSelector,
        // e.g. '.link--blog-line'
        // Optional elements
        iconSelector: config.iconSelector || null,
        // e.g. '.link--blog-icon.is--arrow'
        descriptionSelector: config.descriptionSelector || null,
        // e.g. '.link--description-w'
        // Animation settings
        duration: config.duration || 0.6,
        easing: config.easing || EASING.power2Out,
        stagger: config.stagger || 0,
        // Animation types
        animations: config.animations || ["width"],
        // ['width', 'icon', 'height']
        // Special settings
        dynamicHeight: config.dynamicHeight || false,
        iconRotation: config.iconRotation || false,
        iconOpacity: config.iconOpacity || false,
        iconTranslate: config.iconTranslate || false,
        // Dataset flag for duplicate prevention
        datasetFlag: config.datasetFlag,
        // e.g. 'blogLinkAnimated'
        // Device restrictions
        desktopOnly: config.desktopOnly !== false
        // default true
      };
      this.domCache = new DOMCache();
      this.animationManager = new AnimationManager();
      this.init();
    }
    /* ─────────────────────────────────────────────────────────────
       2. Initialization
    ────────────────────────────────────────────────────────────────*/
    init() {
      this.setupInitialStates();
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
      if (line) {
        const lineEl = (
          /** @type {HTMLElement} */
          line
        );
        lineEl.style.width = "0%";
        lineEl.style.willChange = "width";
      }
      if (icon) {
        const iconEl = (
          /** @type {HTMLElement} */
          icon
        );
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
      if (description && this.config.dynamicHeight) {
        const descEl = (
          /** @type {HTMLElement} */
          description
        );
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
      const containerEl = (
        /** @type {HTMLElement} */
        container
      );
      if (containerEl.dataset[this.config.datasetFlag] === "true") return;
      containerEl.dataset[this.config.datasetFlag] = "true";
      const elements = this.getAnimationElements(container);
      if (!elements.line) return;
      const hoverInAnimation = () => this.createHoverInAnimation(elements);
      const hoverOutAnimation = () => this.createHoverOutAnimation(elements);
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
      if (elements.icon && this.config.animations.includes("icon")) {
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
      if (elements.description && this.config.animations.includes("height") && this.config.dynamicHeight) {
        const descEl = (
          /** @type {HTMLElement} */
          elements.description
        );
        const naturalHeight = parseInt(descEl.dataset.naturalHeight || "0", 10);
        currentDelay += this.config.stagger;
        const animation = this.animate(
          elements.description,
          { height: ["0px", `${naturalHeight}px`] },
          {
            duration: this.config.duration * 0.75,
            // Slightly faster for height
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
      if (elements.icon && this.config.animations.includes("icon")) {
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
      if (elements.description && this.config.animations.includes("height") && this.config.dynamicHeight) {
        const descEl = (
          /** @type {HTMLElement} */
          elements.description
        );
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
  const LINK_CONFIGS = {
    // Blog link configuration
    blog: {
      containerSelector: ".link--blog",
      lineSelector: ".link--blog-line",
      iconSelector: ".link--blog-icon.is--arrow",
      animations: ["width", "icon"],
      iconOpacity: true,
      stagger: 0.2,
      datasetFlag: "blogLinkAnimated"
    },
    // General link configuration
    general: {
      containerSelector: ".link--general",
      lineSelector: ".link--divider-line",
      animations: ["width"],
      datasetFlag: "generalLinkAnimated"
    },
    // Hero link configuration
    hero: {
      containerSelector: ".link--hero",
      lineSelector: ".link--divider-line",
      iconSelector: ".link--icon",
      descriptionSelector: ".link--description-w",
      animations: ["width", "icon", "height"],
      iconRotation: true,
      dynamicHeight: true,
      duration: 0.5,
      stagger: 0,
      // All animations start simultaneously
      datasetFlag: "heroLinkAnimated"
    }
  };
  new BaseLinkAnimation(LINK_CONFIGS.blog);
  new BaseLinkAnimation(LINK_CONFIGS.general);
  new BaseLinkAnimation(LINK_CONFIGS.hero);
  (() => {
    function initTabSystem() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initTabSystem, 100);
        return;
      }
      const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
      if (wrappers.length === 0) {
        console.warn(
          '⚠️ No tab wrappers found! Make sure elements have data-tabs="wrapper" attribute'
        );
        return;
      }
      wrappers.forEach((wrapper) => {
        const htmlWrapper = (
          /** @type {HTMLElement} */
          wrapper
        );
        const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
        const clickButtons = wrapper.querySelectorAll('[data-tabs="button"]');
        const numberedButtons = wrapper.querySelectorAll("[data-tabs-index]");
        const allButtons = [...clickButtons, ...numberedButtons];
        if (visualItems.length === 0) {
          return;
        }
        const autoplay = htmlWrapper.dataset.tabsAutoplay === "true";
        const autoplayDuration = parseInt(htmlWrapper.dataset.tabsAutoplayDuration || "1000") || 1e3;
        let singleProgressBar = null;
        if (autoplay) {
          singleProgressBar = wrapper.querySelector('[data-tabs="item-progress"]');
          if (!singleProgressBar) {
            console.warn(
              '⚠️ Autoplay is enabled but no progress bar found! Add a single data-tabs="item-progress" element'
            );
          }
        }
        let activeVisual = null;
        let isAnimating = false;
        let currentIndex = 0;
        let autoplayTimer = null;
        function resetProgressBar() {
          if (singleProgressBar) {
            const progressEl = (
              /** @type {HTMLElement} */
              singleProgressBar
            );
            progressEl.style.transform = "scaleX(0)";
            progressEl.style.transformOrigin = "left center";
          }
        }
        function startProgressBar(index) {
          if (autoplayTimer) {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
          }
          resetProgressBar();
          if (!singleProgressBar) {
            autoplayTimer = setTimeout(() => {
              if (!isAnimating && autoplay) {
                const nextIndex = (index + 1) % visualItems.length;
                switchTab(nextIndex);
              }
            }, autoplayDuration);
            return;
          }
          const progressEl = (
            /** @type {HTMLElement} */
            singleProgressBar
          );
          animate(
            progressEl,
            {
              scaleX: [0, 1]
            },
            {
              duration: autoplayDuration / 1e3,
              easing: "linear",
              onComplete: () => {
                if (!isAnimating && autoplay) {
                  const nextIndex = (index + 1) % visualItems.length;
                  switchTab(nextIndex);
                }
              }
            }
          );
        }
        function updateButtonStates(activeIndex) {
          clickButtons.forEach((btn, i) => {
            btn.classList.toggle("active", i === activeIndex);
          });
          numberedButtons.forEach((btn) => {
            const htmlBtn = (
              /** @type {HTMLElement} */
              btn
            );
            const btnIndex = parseInt(htmlBtn.dataset.tabsIndex || "-1");
            btn.classList.toggle("active", btnIndex === activeIndex);
          });
        }
        function switchTab(index) {
          if (isAnimating || visualItems[index] === activeVisual && currentIndex === index)
            return;
          isAnimating = true;
          currentIndex = index;
          if (autoplayTimer) {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
          }
          resetProgressBar();
          const outgoingVisual = activeVisual;
          const incomingVisual = visualItems[index];
          requestAnimationFrame(() => {
            visualItems.forEach((item) => item.classList.remove("active"));
            incomingVisual.classList.add("active");
            updateButtonStates(index);
          });
          const performTransition = () => __async(null, null, function* () {
            if (outgoingVisual) {
              yield animate(
                outgoingVisual,
                {
                  opacity: [1, 0]
                },
                {
                  duration: 0,
                  onComplete: () => {
                    outgoingVisual.style.visibility = "hidden";
                  }
                }
              );
            }
            const incomingEl = (
              /** @type {HTMLElement} */
              incomingVisual
            );
            incomingEl.style.visibility = "visible";
            yield animate(
              incomingVisual,
              {
                opacity: [0, 1]
              },
              {
                duration: 0
              }
            );
            activeVisual = incomingVisual;
            isAnimating = false;
            if (autoplay) {
              startProgressBar(index);
            }
          });
          performTransition();
        }
        function stopAllAnimations() {
          if (autoplayTimer) {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
          }
        }
        clickButtons.forEach((item, i) => {
          item.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetIndex = i % visualItems.length;
            if (currentIndex === targetIndex) return;
            stopAllAnimations();
            switchTab(targetIndex);
          });
        });
        numberedButtons.forEach((btn) => {
          const htmlBtn = (
            /** @type {HTMLElement} */
            btn
          );
          const targetIndex = parseInt(htmlBtn.dataset.tabsIndex || "");
          if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < visualItems.length) {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (currentIndex === targetIndex) return;
              stopAllAnimations();
              switchTab(targetIndex);
            });
          }
        });
        if (allButtons.length === 0) {
          visualItems.forEach((item, i) => {
            item.addEventListener("click", (e) => {
              e.stopPropagation();
              if (currentIndex === i) return;
              stopAllAnimations();
              switchTab(i);
            });
          });
        }
        if (visualItems.length > 0) {
          switchTab(0);
        }
      });
    }
    initTabSystem();
  })();
  (() => {
    function initTabMenu() {
      const { animate } = window.Motion || {};
      if (!animate) {
        console.warn("Motion.dev not ready, retrying…");
        setTimeout(initTabMenu, 100);
        return;
      }
      const tabMenuInit = () => {
        let activeTabIndex = 0;
        const tabMenu = document.querySelector(".tab--menu");
        if (!tabMenu) return;
        const tabButtons = tabMenu.querySelectorAll(".tab--menu-btn");
        if (!tabButtons.length) return;
        tabButtons.forEach((btn) => {
          const htmlBtn = (
            /** @type {HTMLElement} */
            btn
          );
          const originalFontWeight = htmlBtn.style.fontWeight;
          htmlBtn.style.fontWeight = "600";
          const maxWidth = htmlBtn.offsetWidth;
          htmlBtn.style.fontWeight = originalFontWeight;
          htmlBtn.style.minWidth = `${maxWidth}px`;
        });
        tabButtons.forEach((btn, index) => {
          if (btn.classList.contains("is--set")) {
            activeTabIndex = index;
            applyActiveStyles(btn);
          }
        });
        function applyActiveStyles(tabButton) {
          animate(
            tabButton,
            {
              fontWeight: ["400", "600"],
              color: [
                "var(--_color-tokens---content-brand--base)",
                "var(--_color-tokens---content-neutral--white)"
              ],
              backgroundColor: [
                "transparent",
                "var(--_color-tokens---bg-brand--base)"
              ],
              borderColor: [
                "var(--_color-tokens---border-neutral--dark)",
                "var(--_color-tokens---border-brand--base)"
              ]
            },
            {
              duration: 0.3,
              easing: [0.25, 0.46, 0.45, 0.94]
              // power1.out
            }
          );
        }
        function removeActiveStyles(tabButton) {
          animate(
            tabButton,
            {
              fontWeight: ["600", "400"],
              color: [
                "var(--_color-tokens---content-neutral--white)",
                "var(--_color-tokens---content-brand--base)"
              ],
              backgroundColor: [
                "var(--_color-tokens---bg-brand--base)",
                "transparent"
              ],
              borderColor: [
                "var(--_color-tokens---border-brand--base)",
                "var(--_color-tokens---border-neutral--dark)"
              ]
            },
            {
              duration: 0.3,
              easing: [0.25, 0.46, 0.45, 0.94]
              // power1.out
            }
          );
        }
        tabMenu.addEventListener("click", (e) => {
          if (!(e.target instanceof Element)) return;
          const clickedButton = e.target.closest(".tab--menu-btn");
          if (!clickedButton) return;
          const newIndex = Array.from(tabButtons).indexOf(clickedButton);
          if (newIndex === activeTabIndex) return;
          if (tabButtons[activeTabIndex]) {
            tabButtons[activeTabIndex].classList.remove("is--set");
            removeActiveStyles(tabButtons[activeTabIndex]);
          }
          clickedButton.classList.add("is--set");
          applyActiveStyles(clickedButton);
          activeTabIndex = newIndex;
        });
      };
      tabMenuInit();
    }
    initTabMenu();
  })();
  function initBasicFormValidation() {
    const forms = document.querySelectorAll("[data-form-validate]");
    forms.forEach((form) => {
      const fields = form.querySelectorAll(
        "[data-validate] input, [data-validate] textarea"
      );
      const submitButtonDiv = form.querySelector("[data-submit]");
      if (!submitButtonDiv) return;
      const submitInput = submitButtonDiv.querySelector('input[type="submit"]');
      if (!submitInput) return;
      const formLoadTime = (/* @__PURE__ */ new Date()).getTime();
      const validateField = (field) => {
        const parent = field.closest("[data-validate]");
        if (!parent) return false;
        const minLength = field.getAttribute("min");
        const maxLength = field.getAttribute("max");
        const type = field.getAttribute("type");
        let isValid = true;
        if (field.value.trim() !== "") {
          parent.classList.add("is--filled");
        } else {
          parent.classList.remove("is--filled");
        }
        if (minLength && field.value.length < parseInt(minLength, 10)) {
          isValid = false;
        }
        if (maxLength && field.value.length > parseInt(maxLength, 10)) {
          isValid = false;
        }
        if (type === "email" && !/\S+@\S+\.\S+/.test(field.value)) {
          isValid = false;
        }
        if (isValid) {
          parent.classList.remove("is--error");
          parent.classList.add("is--success");
        } else {
          parent.classList.remove("is--success");
          parent.classList.add("is--error");
        }
        return isValid;
      };
      const startLiveValidation = (field) => {
        field.addEventListener("input", function() {
          validateField(field);
        });
      };
      const validateAndStartLiveValidationForAll = () => {
        let allValid = true;
        let firstInvalidField = null;
        fields.forEach((field) => {
          const valid = validateField(field);
          if (!valid && !firstInvalidField) {
            firstInvalidField = field;
          }
          if (!valid) {
            allValid = false;
          }
          startLiveValidation(field);
        });
        if (firstInvalidField && typeof firstInvalidField.focus === "function") {
          firstInvalidField.focus();
        }
        return allValid;
      };
      const isSpam = () => {
        const currentTime = (/* @__PURE__ */ new Date()).getTime();
        const timeDifference = (currentTime - formLoadTime) / 1e3;
        return timeDifference < 5;
      };
      submitButtonDiv.addEventListener("click", function() {
        if (validateAndStartLiveValidationForAll()) {
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return;
          }
          if (typeof submitInput.click === "function") {
            submitInput.click();
          }
        }
      });
      form.addEventListener("keydown", function(event) {
        if (event && event.key === "Enter" && event.target && event.target.tagName !== "TEXTAREA") {
          event.preventDefault();
          if (validateAndStartLiveValidationForAll()) {
            if (isSpam()) {
              alert("Form submitted too quickly. Please try again.");
              return;
            }
            if (typeof submitInput.click === "function") {
              submitInput.click();
            }
          }
        }
      });
    });
  }
  if (window.Webflow) {
    window.Webflow.push(() => {
      initBasicFormValidation();
    });
  } else {
    initBasicFormValidation();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("using-keyboard");
    }
  });
  document.addEventListener("mousedown", () => {
    document.body.classList.remove("using-keyboard");
  });
  document.addEventListener(
    "touchstart",
    () => {
      document.body.classList.remove("using-keyboard");
    },
    { passive: true }
  );
  Webflow.push(function() {
    const inputs = document.querySelectorAll(
      "input[data-placeholder], textarea[data-placeholder], select[data-placeholder]"
    );
    inputs.forEach((input) => {
      input.addEventListener("mouseenter", () => {
        input.classList.add("hovered");
      });
      input.addEventListener("mouseleave", () => {
        input.classList.remove("hovered");
      });
    });
  });
  Webflow.push(() => {
    setTimeout(() => {
      const videos = document.querySelectorAll(
        "video.hero--video-element, video.blog--video-element"
      );
      if (!videos.length) return;
      videos.forEach((vid) => {
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      });
    }, 3e3);
  });
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    document.addEventListener(
      "click",
      (e) => {
        var _a, _b, _c;
        if (e.target.closest(".video--control-resize .video--control-btn")) {
          e.preventDefault();
          const video = (_a = e.target.closest(".rich-text--video-w")) == null ? void 0 : _a.querySelector("video");
          ((_b = video == null ? void 0 : video.webkitEnterFullscreen) == null ? void 0 : _b.call(video)) || ((_c = video == null ? void 0 : video.requestFullscreen) == null ? void 0 : _c.call(video));
        }
      },
      true
    );
  }
  function initMarquee() {
    if (typeof Swiper === "undefined") {
      const swiperScript = document.createElement("script");
      swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js";
      swiperScript.onload = initSwiperMarquee;
      document.head.appendChild(swiperScript);
    } else {
      initSwiperMarquee();
    }
  }
  function initSwiperMarquee() {
    const marqueeTrack = document.querySelector(".marquee--track");
    if (!marqueeTrack) return;
    new Swiper(".marquee--track", {
      wrapperClass: "marquee--container",
      // Wrapper container class
      slideClass: "marquee--item",
      // Individual slide class
      spaceBetween: 0,
      // No spacing (handled by CSS)
      allowTouchMove: false,
      // Disable touch/drag
      a11y: false,
      // Disable a11y for decorative content
      speed: 8e3,
      // Animation duration in ms
      loop: true,
      // Enable infinite loop
      slidesPerView: "auto",
      // Auto-fit slides
      autoplay: {
        delay: 0,
        // No transition delay
        disableOnInteraction: false
        // Keep running after interaction
      }
    });
  }
  Webflow.push(() => {
    initMarquee();
  });
  function safeInit() {
    try {
      initTimelineSwiper();
    } catch (error) {
      console.error("Timeline initialization failed:", error);
    }
  }
  function initTimelineSwiper() {
    const contentContainer = document.querySelector("#swiper-timeline");
    if (!contentContainer) {
      console.error("Timeline Swiper container not found.");
      return;
    }
    if (typeof Swiper === "undefined") {
      console.error("Swiper library not loaded.");
      return;
    }
    const slides = contentContainer.querySelectorAll(".swiper--slide");
    const slidesCount = slides.length;
    new Swiper(contentContainer, {
      // Basic settings
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      autoHeight: true,
      loop: slidesCount > 1,
      grabCursor: true,
      // Classes
      wrapperClass: "swiper--wrapper",
      slideClass: "swiper--slide",
      // Navigation
      navigation: {
        nextEl: '[timeline-navigation="next"]',
        prevEl: '[timeline-navigation="previous"]'
      },
      // Pagination - fraction type
      pagination: {
        el: ".swiper-pagination",
        type: "fraction"
      },
      // Autoplay
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      // Keyboard control
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      // Touch settings
      simulateTouch: true,
      touchEventsTarget: "container",
      // Accessibility
      a11y: {
        enabled: true
      },
      // Events
      on: {
        init: function(swiper) {
          console.log("Timeline swiper initialized with", slidesCount, "slides");
        }
      }
    });
    console.log(
      "Timeline swiper initialized successfully with native pagination."
    );
  }
  if (window.Webflow) {
    window.Webflow.push(() => {
      safeInit();
    });
  } else {
    safeInit();
  }
  (() => {
    const { animate } = window.motion || {};
    if (!animate) {
      console.warn("Motion.dev not found");
      return;
    }
    const isPointerHover = matchMedia("(min-width:768px) and (hover:hover)").matches;
    if (!isPointerHover) return;
    document.querySelectorAll(".grid--card-department.is--cta").forEach((card) => {
      const btn = card.querySelector("#cta");
      if (!btn) return;
      card.addEventListener("pointerenter", () => {
        animate(
          btn,
          { backgroundColor: "var(--_color-tokens---bg-brand--dark)" },
          {
            duration: 0.05,
            easing: "ease-out",
            fill: "forwards"
          }
        );
      });
      card.addEventListener("pointerleave", () => {
        animate(
          btn,
          { backgroundColor: "var(--_color-tokens---bg-brand--base)" },
          {
            duration: 0.05,
            easing: "ease-out",
            fill: "forwards"
          }
        );
      });
    });
  })();
  console.log("Nobel website scripts initialized");
})();
