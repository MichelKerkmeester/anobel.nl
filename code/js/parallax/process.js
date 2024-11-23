// Process
// GSAP Parallax
window.initProcessParallax = function () {
  function isDesktop() {
    return window.innerWidth >= 992; // Check if the device is a desktop
  }

  if (isDesktop()) {
    gsap.registerPlugin(ScrollTrigger); // Register the ScrollTrigger plugin for desktop only

    const processItems = document.querySelectorAll(
      ".process--list .w-dyn-item"
    ); // Select all process items

    function lerp(start, end, t) {
      return start * (1 - t) + end * t;
    }

    processItems.forEach((item, index) => {
      item.style.visibility = "visible"; // Ensure item is visible
      animateProcessItem(item, index + 1); // Animate each item based on its index (1-based)
    });

    function animateProcessItem(item, index) {
      const heading = item.querySelector(".process--heading");
      const description = item.querySelector(".process--description");
      const smallIllustration = item.querySelector(
        `.illustration.process--${index}-small`
      );
      const bigIllustration = item.querySelector(
        `.illustration.process--${index}-big`
      );

      // Speed control: Adjust this value to control overall animation speed
      const speed = 0.1; // Lower values = slower animation, Higher values = faster animation

      let progress = 0;
      let targetProgress = 0;

      // Specific animation settings for illustrations based on item index
      const illustrationSettings = {
        1: {
          small: { x: "6.25rem", y: "-12.5rem", rotation: -30, scale: 0.5 },
          big: { x: "6.25rem", y: "-3.125rem", rotation: 30, scale: 0.75 },
        },
        2: {
          small: { x: "-9.375rem", y: "-9.375rem", rotation: 25, scale: 0.5 },
          big: { x: "-3.125rem", y: "-3.125rem", rotation: -25, scale: 0.75 },
        },
        3: {
          small: { x: "9.375rem", y: "-9.375rem", rotation: -25, scale: 0.5 },
          big: { x: "3.125rem", y: "-3.125rem", rotation: 25, scale: 0.75 },
        },
        4: {
          small: { x: "-6.25rem", y: "-9.375rem", rotation: 30, scale: 0.5 },
          big: { x: "-9.375rem", y: "-3.125rem", rotation: -30, scale: 0.75 },
        },
        5: {
          small: { x: "-9.375rem", y: "-6.25rem", rotation: -25, scale: 0.5 },
          big: { x: "-12.5rem", y: "-6.25rem", rotation: 25, scale: 0.75 },
        },
        6: {
          small: { x: "-6.25rem", y: "-6.25rem", rotation: -25, scale: 0.5 },
          big: { x: "6.25rem", y: "-6.25rem", rotation: 25, scale: 0.75 },
        },
      };

      // Set initial states
      gsap.set(heading, { y: "7.5rem", opacity: 0.4 });
      gsap.set(description, { y: "10rem", opacity: 0.4 });
      gsap.set(smallIllustration, {
        ...illustrationSettings[index].small,
        opacity: 0,
      });
      gsap.set(bigIllustration, {
        ...illustrationSettings[index].big,
        opacity: 0,
      });

      ScrollTrigger.create({
        trigger: item,
        start: "top 90%",
        end: "bottom 65%",
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      function animateElements() {
        progress = lerp(progress, targetProgress, speed);

        // Animate heading
        gsap.to(heading, {
          y: 7.5 * (1 - progress) + "rem",
          opacity: 0.4 + 0.6 * progress,
          duration: 0,
        });

        // Animate description
        gsap.to(description, {
          y: 10 * (1 - progress) + "rem",
          opacity: 0.4 + 0.6 * progress,
          duration: 0,
        });

        // Animate small illustration
        gsap.to(smallIllustration, {
          opacity: progress,
          x:
            parseFloat(illustrationSettings[index].small.x) * (1 - progress) +
            "rem",
          y:
            parseFloat(illustrationSettings[index].small.y) * (1 - progress) +
            "rem",
          rotation: illustrationSettings[index].small.rotation * (1 - progress),
          scale:
            illustrationSettings[index].small.scale +
            (1 - illustrationSettings[index].small.scale) * progress,
          duration: 0,
        });

        // Animate big illustration
        gsap.to(bigIllustration, {
          opacity: progress,
          x:
            parseFloat(illustrationSettings[index].big.x) * (1 - progress) +
            "rem",
          y:
            parseFloat(illustrationSettings[index].big.y) * (1 - progress) +
            "rem",
          rotation: illustrationSettings[index].big.rotation * (1 - progress),
          scale:
            illustrationSettings[index].big.scale +
            (1 - illustrationSettings[index].big.scale) * progress,
          duration: 0,
        });

        requestAnimationFrame(animateElements);
      }

      animateElements();
    }
  }
};
