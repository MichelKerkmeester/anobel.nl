// About
// GSAP Animations

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Check viewport size and set appropriate suffix
const isMobileOrTablet = window.innerWidth < 992;
const suffix = isMobileOrTablet ? "--mobile" : "";

// Hero
// Animate on load
function animateHeroIntro() {
  // Define the elements to animate
  const elements = `#hero-caption${suffix}, #hero-heading-1${suffix}, #hero-heading-2${suffix}, #hero-female${suffix}, #hero-male${suffix}, #hero-other${suffix}, #hero-description${suffix}, #hero-marquee`;

  // Set initial state
  gsap.set(
    elements.split(",").map((s) => s.trim()),
    {
      opacity: 0,
      y: isMobileOrTablet ? "4rem" : "6rem",
      immediateRender: true,
    }
  );

  // Create animation timeline
  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: isMobileOrTablet ? 1.4 : 1.2 },
  });

  // Animate elements
  tl.to(
    elements.split(",").map((s) => s.trim()),
    {
      opacity: 1,
      y: 0,
      stagger: isMobileOrTablet ? 0.09 : 0.11,
    }
  );

  return tl;
}

// Run animation when DOM is ready
document.addEventListener("DOMContentLoaded", animateHeroIntro);

// Office
// Animate on load
function initOfficeAnimation() {
  // Find the office section
  const officeSection = document.querySelector(".section--office");
  if (officeSection) {
    // Set initial state: hidden and slightly below final position
    gsap.set(officeSection, {
      opacity: 0,
      y: isMobileOrTablet ? "5rem" : "12vh",
    });

    // Animate the element with delay
    gsap.to(officeSection, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      delay: 0.6,
      ease: "expo.out",
    });
  }
}

// Team - Heading
// Animate in view
function animateTeamHeading() {
  const teamHeading = document.querySelector(`#team-heading${suffix}`);
  if (teamHeading) {
    // Set initial state
    gsap.set(teamHeading, {
      opacity: 0,
      y: isMobileOrTablet ? "4rem" : "10vh",
    });

    // Animate the element into view
    gsap.to(teamHeading, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: teamHeading,
        start: "top 75%",
        end: "bottom 40%",
        toggleActions: "play none none none",
      },
    });
  }
}

// Team - Members
// Animate in view
function animateTeamMembers() {
  const teamListItems = gsap.utils.toArray(".team--list-item");
  if (teamListItems.length) {
    // Set initial state
    gsap.set(teamListItems, {
      opacity: 0,
      y: isMobileOrTablet ? "5rem" : "12vh",
    });

    // Animate items into view
    gsap.to(teamListItems, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".team--list",
        start: "top 75%",
        end: "bottom 40%",
        toggleActions: "play none none none",
      },
    });
  }
}

// Team - Members
// Animate card hover
const isDesktop = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

// Select all team list items
const teamItems = document.querySelectorAll(".team--list-item");

teamItems.forEach((item) => {
  const overlay = item.querySelector(".team--overlay");
  const member = item.querySelector(".team--member");
  const memberBio = item.querySelector(".team--member-bio");

  // Set initial states
  gsap.set(overlay, {
    height: "0%",
  });
  gsap.set([member, memberBio], {
    opacity: 0,
    yPercent: 100,
    scale: 0.95,
  });

  // Only add hover animations for desktop devices
  if (isDesktop) {
    // Create hover animation
    item.addEventListener("mouseenter", () => {
      // Kill any running animations
      gsap.killTweensOf([overlay, member, memberBio]);

      // Animate overlay background
      gsap.to(overlay, {
        duration: 1.2,
        ease: "power4.out",
        height: "100%",
      });

      // Animate member name
      gsap.to([member], {
        delay: 0.2,
        duration: 0.8,
        ease: "expo.out",
        opacity: 1,
        scale: 1,
        yPercent: 0,
      });

      // Animate member bio
      gsap.to([memberBio], {
        delay: 0.4,
        duration: 0.8,
        ease: "expo.out",
        opacity: 1,
        scale: 1,
        yPercent: 0,
      });
    });

    // Create hover out animation
    item.addEventListener("mouseleave", () => {
      // Kill any running animations
      gsap.killTweensOf([overlay, member, memberBio]);

      // Animate overlay background
      gsap.to(overlay, {
        duration: 0.6,
        ease: "expo.in",
        height: "0%",
      });

      // Animate member name and bio
      gsap.to([member, memberBio], {
        duration: 0.4,
        ease: "expo.in",
        opacity: 0,
        scale: 0.95,
        yPercent: 100,
      });
    });
  }
});

// Create a main initialization function
function initAnimations() {
  animateHeroIntro();
  initOfficeAnimation();
  animateTeamHeading();
  animateTeamMembers();
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", initAnimations);
