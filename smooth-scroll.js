let currentSection = 0;
let isScrolling = false;
let sections = [];
let isDesktop = false;
let wheelTimeout = null;
const skipSmoothScroll = false;

// Touch variables
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("DOMContentLoaded", function () {
  isDesktop = window.innerWidth > 768;
  const siteHeader = document.querySelector(".site-header");
  const skipSmoothScroll = window.location.href.includes("shop.html") || window.location.href.includes("checkout.html") || (!isDesktop && window.location.href.includes("DOSHI.html"));

  if (skipSmoothScroll) {
    return;
  }

  // === 1. Setup Environment (Mobile & Desktop) ===
  document.body.classList.add("desktop-scroll");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  // === 2. Select and Filter Sections ===
  const allSections = document.querySelectorAll("main > section");

  sections = Array.from(allSections).filter((section) => {
    // Skip if has desktop-only class on mobile
    if (!isDesktop && section.classList.contains("desktop-only")) {
      return false;
    }

    // Skip if has mobile-only class on desktop
    if (isDesktop && section.classList.contains("mobile-only")) {
      return false;
    }

    // For sections without these classes, check computed display
    const style = window.getComputedStyle(section);
    const display = style.display;
    const visibility = style.visibility;

    // Only exclude if display is none AND it's not a mobile-only section on mobile
    if (display === "none" && !(section.classList.contains("mobile-only") && !isDesktop)) {
      return false;
    }

    if (visibility === "hidden") {
      return false;
    }

    return true;
  });

  console.log(`Detected ${sections.length} visible sections for ${isDesktop ? 'desktop' : 'mobile'}`);
  console.log('Sections:', sections.map((s, i) => `${i}: ${s.id || s.className}`));

  if (sections.length === 0) {
    console.warn('No sections detected! Disabling smooth scroll.');
    return;
  }

  // === 3. Initial Layout Configuration ===
  sections.forEach((section, index) => {
    // Force display for mobile-only sections on mobile
    if (!isDesktop && section.classList.contains("mobile-only")) {
      section.style.display = "flex";
    }

    // Critical positioning for the slide effect
    section.style.position = "fixed";
    section.style.top = "0";
    section.style.left = "0";
    section.style.width = "100%";
    section.style.height = "100dvh";
    section.style.overflow = "hidden";
    section.style.zIndex = index + 10;
    section.style.transition = "none";

    // Set initial positions
    if (index === 0) {
      section.style.transform = "translateY(0)";
      section.style.visibility = "visible";
    } else {
      section.style.transform = "translateY(100%)";
      section.style.visibility = "visible";
    }
  });

  // Re-enable smooth transitions after the browser paints
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sections.forEach((section) => {
        section.style.transition = "transform 0.6s cubic-bezier(0.55, 0, 0.55, 1)";
      });
      console.log('Transitions enabled');
    });
  });

  // === 4. Mouse Wheel (Desktop Only) ===
  if (isDesktop) {
    const textContainerEl = document.getElementById('textContainer') || document.querySelector('.scrollable-text-container');
    let gestureCooldownUntil = 0;
    document.addEventListener("wheel", (e) => {
      if (textContainerEl && e.target && textContainerEl.contains(e.target)) return;
      if (Date.now() < gestureCooldownUntil) return;
      if (isScrolling) return;
      if (document.querySelector('.shopping-bag-sidebar.open')) {
        e.preventDefault();
        return; // Stop here if shopping bag is open
      }
      if (textContainerEl && e.target && textContainerEl.contains(e.target)) return;
      if (Date.now() < gestureCooldownUntil) return;
      const dy = e.deltaY;
      if (Math.abs(dy) < 15) return;
      e.preventDefault();
      if (dy > 0) goToNextSection();
      else goToPrevSection();
      gestureCooldownUntil = Date.now() + 700;
    }, { passive: false });
  }

  // === 5. Touch Events (Mobile Only) ===
  if (!isDesktop) {
    const textContainerEl = document.getElementById('textContainer') || document.querySelector('.scrollable-text-container');
    let touchStartTime = 0;
    let touchInTextContainer = false;

    document.addEventListener("touchstart", (e) => {
      if (document.querySelector('.shopping-bag-sidebar.open')) {
        return; // Stop here if shopping bag is open
      }
      touchInTextContainer = !!(textContainerEl && e.target && textContainerEl.contains(e.target));
      touchStartY = e.changedTouches[0].screenY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
      if (isScrolling) return;
      if (touchInTextContainer) {
        touchInTextContainer = false;
        return;
      }
      if (document.querySelector('.shopping-bag-sidebar.open')) {
        return; // Stop here if shopping bag is open
      }
      if (isScrolling) return;
      if (touchInTextContainer) {
        touchInTextContainer = false;
        return;
      }
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      // Ignore very quick taps (likely clicks)
      if (touchDuration < 50) return;

      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  // === 6. Keyboard Navigation ===
  document.addEventListener("keydown", (e) => {
    if (document.querySelector('.shopping-bag-sidebar.open')) {
      e.preventDefault();
      return; // Stop here if shopping bag is open
    }
    if (isScrolling) return;
    if (e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      goToNextSection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      goToPrevSection();
    }
  });

  // === HELPER FUNCTIONS ===

  function handleSwipe() {
    const threshold = 90;
    const swipeDistance = touchStartY - touchEndY;

    console.log('Swipe distance:', swipeDistance);

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        // Swiped Up -> Go Next
        console.log('Swipe up detected');
        goToNextSection();
      } else {
        // Swiped Down -> Go Prev
        console.log('Swipe down detected');
        goToPrevSection();
      }
    }
  }

  function goToNextSection() {
    if (currentSection < sections.length - 1) {
      isScrolling = true; // LOCK IMMEDIATELY
      currentSection++;

      const nextSlide = sections[currentSection];

      // Header Logic (Keep your existing logic here)
      if (siteHeader && isDesktop && currentSection > 0) {
        siteHeader.classList.add("sticky");
        siteHeader.classList.remove("transparent");
        siteHeader.classList.remove("red-background");
        if (window.location.href.includes("DOSHI.html")) {
          let cartLabel = document.querySelector(".shopping-bag-icon");
          if (cartLabel) cartLabel.style.filter = "invert(1)";
        }
      }
      if (siteHeader && !isDesktop && currentSection > 0) {
        if (window.location.href.includes("DOSHI.html")) siteHeader.classList.remove("red-background");
        if (currentSection === sections.length - 1) siteHeader.classList.add("red-background");
      }

      // Force Reflow
      void nextSlide.offsetHeight;

      // Animate
      nextSlide.style.transform = "translateY(0)";

      // FIX: Wait for animation (600ms) + buffer (400ms) before unlocking
      setTimeout(() => {
        isScrolling = false;
      }, 600);

    } else {
      console.log('Already at last section');
    }
  }

  function goToPrevSection() {
    if (currentSection > 0) {
      isScrolling = true; // LOCK IMMEDIATELY

      const currentSlide = sections[currentSection];
      currentSection--;

      // Header Logic (Keep your existing logic here)
      if (siteHeader && isDesktop && currentSection === 0) {
        if (window.location.href.includes("index.html") || window.location.href === MEDUSA_CONFIG.PRODUCTION_URL) siteHeader.classList.remove("sticky");
        if (window.location.href.includes("Mirage.html")) siteHeader.classList.add("transparent");
        if (window.location.href.includes("DOSHI.html")) siteHeader.classList.add("red-background");
      }

      if (siteHeader && !isDesktop) {
        if (window.location.href.includes("DOSHI.html") && currentSection === 0) siteHeader.classList.add("red-background");
        if (currentSection === sections.length - 2) siteHeader.classList.remove("red-background");
      }

      // Force Reflow
      void currentSlide.offsetHeight;

      // Animate
      currentSlide.style.transform = "translateY(100%)";

      // FIX: Wait for animation (600ms) + buffer (400ms) before unlocking
      setTimeout(() => {
        isScrolling = false;
      }, 600);

    } else {
      console.log('Already at first section');
    }
  }

  window.goToNextSection = goToNextSection;

  // === 7. Handle Window Resize ===
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const wasDesktop = isDesktop;
      const nowDesktop = window.innerWidth > 768;

      // Only reload if we actually switched between mobile/desktop
      if (wasDesktop !== nowDesktop) {
        console.log('Layout changed, reloading...');
        location.reload();
      }
    }, 500);
  });
});
