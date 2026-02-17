// const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");
    document.body.classList.toggle("no-scroll", mobileMenu.classList.contains("active"));
  });

  // Prevent menu from closing when clicking inside it
  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close menu when clicking outside (on document)
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
}

window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  // Only apply sticky on desktop (screens wider than 1024px)
  if (window.innerWidth > 1024) {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      // header.classList.remove("sticky");
    }
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");

    // Also close all accordions
    document.querySelectorAll(".accordion-body").forEach((body) => {
      body.style.display = "none";
    });
  }

  // Remove sticky class when resizing to mobile/tablet
  const header = document.querySelector(".site-header");
  if (window.innerWidth <= 1024) {
    header.classList.remove("sticky");
  }
});

// Accordion toggle for mobile submenu (OUR JAGAT only)
const jagatAccordion = document.getElementById("jagatAccordion");
const jagatAccordionBody = document.getElementById("jagatAccordionBody");

if (jagatAccordion && jagatAccordionBody) {
  jagatAccordion.addEventListener("click", () => {
    const isOpen = jagatAccordionBody.style.display === "flex";
    jagatAccordionBody.style.display = isOpen ? "none" : "flex";
    jagatAccordion.classList.toggle("active", !isOpen);
  });
}


// Audio and Cookie logic moved to cookie-consent.js


const slider = document.querySelector(".slider-container");
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile responsiveness
  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("touchend", () => {
    isDown = false;
  });
  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// Ensure only one slide is active at a time
const slides = document.querySelectorAll(".slide");
if (slides) {
  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      slides.forEach((s) => s.classList.remove("active"));
      slide.classList.add("active");
    });
  });
}
const openLightbox = document.getElementById("openLightbox");
const lightbox = document.getElementById("lightbox");
const closeLightbox = document.getElementById("closeLightbox");
const video = document.getElementById("lightboxVideo");

if (openLightbox && lightbox && video) {
  openLightbox.addEventListener("click", () => {
    lightbox.style.display = "flex";
    video.currentTime = 0;
    video.play();
  });
}

if (closeLightbox && lightbox && video) {
  closeLightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    video.pause();
    video.currentTime = 0;
  });
}

// Click outside the video to close
if (lightbox && video) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      video.pause();
      video.currentTime = 0;
    }
  });
}

const smallSlideWidth = 300;
const largeSlideWidth = 600;
const slideGap = 30;
const totalWidth =
  smallSlideWidth + largeSlideWidth + smallSlideWidth + slideGap * 2;

let currentX = 0;
let isPaused = false;
const scrollSpeed = 1;

const trackElement = document.getElementById("trackElement");

if (trackElement) {
  trackElement.style.transform = `translateX(0px)`;

  function animateCarousel() {
    if (!isPaused) {
      currentX -= scrollSpeed;
      if (Math.abs(currentX) >= totalWidth) {
        currentX = 0;
      }
      trackElement.style.transform = `translateX(${currentX}px)`;
    }
    requestAnimationFrame(animateCarousel);
  }
  animateCarousel();

  // Pause on hover
  trackElement.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  trackElement.addEventListener("mouseleave", () => {
    isPaused = false;
  });
}

// // Handle image errors + zoom
// document.querySelectorAll("img").forEach((image) => {
//   image.addEventListener("error", function () {
//     this.src =
//       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1TDIyNSAxNzVIMTI1TDE3NSAxMjVaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0NSIgY3k9IjEwNSIgcj0iMTUiIGZpbGw9IiM5Y2EzYWYiLz4KPHRleHQgeD0iMjAwIiB5PSIyMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWl5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+";
//   });

//   // Zoom on click
//   image.addEventListener("click", function () {
//     overlayImage.src = this.src;
//     overlayElement.classList.add("active");
//   });
// });

// Close overlay
const closeButton = document.getElementById("closeButton");
const overlayElement = document.getElementById("overlayElement");
const overlayImage = document.getElementById("overlayImage");

if (closeButton && overlayElement && overlayImage) {
  closeButton.addEventListener("click", () => {
    overlayElement.classList.remove("active");
    overlayImage.src = "";
  });
}

if (overlayElement && overlayImage) {
  overlayElement.addEventListener("click", (e) => {
    if (e.target === overlayElement) {
      overlayElement.classList.remove("active");
      overlayImage.src = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const headerNormal = document.querySelector(".header-normal");
  const mobileToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");
  const menuToggleImg = document.querySelector('#menuToggle img');
  const logo = document.querySelector('.logo a');

  const sections = document.querySelectorAll(
    ".collections-section, .two-column-section, .newsletter, .site-footer"
  );
  const closeDrawerBtn = document.getElementById("closeMenuBtn");
  const jagatCloseMenuBtn = document.getElementById("jagatCloseMenuBtn");
  const jagatMenuToggle = document.getElementById("jagatMenuToggle");
  const jagatMenu = document.getElementById("jagatMenu");
  const jagatMenuBackBtn = document.getElementById("jagatMenuBackBtn");

  // Sticky Header
  window.addEventListener("scroll", () => {
    if (window.innerWidth > 768) {
      // header.classList.toggle("sticky", window.scrollY > 0);
    } else {
      const scrollThreshold =
        document.documentElement.scrollHeight - window.innerHeight - 30;
      if (window.scrollY >= scrollThreshold) {
        header.classList.add("red-background");
        headerNormal.classList.add("red-background");
        if (menuToggleImg && (window.location.pathname === '/product.html' || window.location.pathname.endsWith('/product.html'))) menuToggleImg.style.filter = 'invert(1)';
        if (logo && (window.location.pathname === '/product.html' || window.location.pathname.endsWith('/product.html'))) logo.style.filter = 'invert(1)';
      } else {
        header.classList.remove("red-background");
        headerNormal.classList.remove("red-background");
      }
    }

    // Stacking Effect (exclude hero-section)
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom > 0;
      if (isInView) {
        section.style.zIndex = 10 + index;
        section.classList.remove("stacked");
      } else if (rect.top < 0) {
        section.classList.add("stacked");
        section.style.zIndex = 10 + index;
      } else {
        section.classList.remove("stacked");
        section.style.zIndex = 10 + index;
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }


  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Close button clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.remove("active");
    });
  }

  if (jagatCloseMenuBtn) {
    jagatCloseMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Close button clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.remove("active");
    });
  }

  if (jagatMenuToggle) {
    jagatMenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Jagat menu toggle clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.add("active");
    });
  }

  if (jagatMenuBackBtn) {
    jagatMenuBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("Jagat menu back button clicked");
      jagatMenu.classList.remove("active");
      mobileMenu.classList.add("active");
    });
  }

  // Image Carousel functionality - Works for ALL mobile carousels
  document.querySelectorAll('.image-carousel.mobile-only').forEach((carouselSection) => {
    const carouselContainer = carouselSection.querySelector('.carousel-images-container');
    const carouselImages = carouselSection.querySelectorAll('.carousel-image, .stacked-img'); // Supports both
    const carouselDots = carouselSection.querySelectorAll('.carousel-dots .dot');

    if (carouselImages.length === 0 || carouselDots.length === 0) return;

    let currentIndex = 0;
    let startTouchX = 0;
    let endTouchX = 0;

    function showImage(index) {
      carouselImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
        if (i === index) {
          img.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function goToNextImage() {
      currentIndex = (currentIndex + 1) % carouselImages.length;
      showImage(currentIndex);
    }

    function goToPrevImage() {
      currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
      showImage(currentIndex);
    }

    // Dot navigation
    carouselDots.forEach((dot, index) => {
      // dot.addEventListener('click', () => {
      //   currentIndex = index;
      //   showImage(currentIndex);
      // });
    });

    // Swipe functionality
    carouselContainer.addEventListener('touchstart', (e) => {
      startTouchX = e.touches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
      endTouchX = e.touches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
      const swipeThreshold = 50;
      const diff = startTouchX - endTouchX;

      if (diff > swipeThreshold) {
        goToNextImage(); // Swipe left → next
      } else if (diff < -swipeThreshold) {
        goToPrevImage(); // Swipe right → prev
      }

      startTouchX = 0;
      endTouchX = 0;
    });
  });
});
