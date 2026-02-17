window.addEventListener('scroll', function () {
  const header = document.querySelector('.site-header');
  const shoppingBagLabel = document.querySelector('.shoppingBagIconFragment label');
  const twoColumnWhiteDesktop = document.querySelector('#two-column-section-white');

  if (twoColumnWhiteDesktop) {
    const twoColumnWhiteTop = twoColumnWhiteDesktop.getBoundingClientRect().top;

    if (twoColumnWhiteTop <= 0) {
      shoppingBagLabel.classList.add('force-black');
      header.classList.remove('red-background');
    } else {
      header.classList.add('red-background');
      shoppingBagLabel.classList.remove('force-black');
    }
  }

  if (window.matchMedia('(max-width: 768px)').matches) {
    const twoColumnWhite = document.querySelector('#two-column-section-white-mobile');
    const logo = document.querySelector('.logo a');
    const menuToggleImg = document.querySelector('#menuToggle img');
    const blackCartIcon = document.querySelector('#blackCartIcon');
    const whiteCartIcon = document.querySelector('#whiteCartIcon');

    const scrollThreshold =
        document.documentElement.scrollHeight - window.innerHeight - 30;
    
    if (twoColumnWhite) {
      const twoColumnWhiteTop = twoColumnWhite.getBoundingClientRect().top;

      if (twoColumnWhiteTop <= 60) {
        header.classList.remove('red-background');
        if (logo) logo.style.filter = 'invert(0)';
        if (menuToggleImg) menuToggleImg.style.filter = 'invert(0)'; // No invert
        if (whiteCartIcon) { whiteCartIcon.style.display = 'none'; whiteCartIcon.classList.remove(...whiteCartIcon.classList); whiteCartIcon.classList.add('desktop-only'); }
        if (blackCartIcon) { blackCartIcon.style.display = 'block'; blackCartIcon.classList.remove(...blackCartIcon.classList); }
      } else {
        header.classList.add('red-background');
        if (menuToggleImg) menuToggleImg.style.filter = 'invert(1)';
        if (whiteCartIcon) { whiteCartIcon.style.display = 'block'; whiteCartIcon.classList.remove(...whiteCartIcon.classList); whiteCartIcon.classList.add('mobile-only'); }
        if (blackCartIcon) { blackCartIcon.style.display = 'none'; blackCartIcon.classList.remove(...blackCartIcon.classList); }
      }
    }

    if (window.scrollY >= scrollThreshold) {
      header.classList.add('red-background');
      menuToggleImg.style.filter = 'invert(1)';
    }
  }
});

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const jagatMenu = document.getElementById('jagatMenu');
const jagatMenuToggle = document.getElementById('jagatMenuToggle');
const jagatMenuBackBtn = document.getElementById('jagatMenuBackBtn');
const closeDrawerBtn = document.getElementById('closeMenuBtn');
const jagatCloseMenuBtn = document.getElementById('jagatCloseMenuBtn');
const jagatAccordion = document.getElementById('jagatAccordion');
const jagatAccordionBody = document.getElementById('jagatAccordionBody');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('active'));
});

// Prevent menu from closing when clicking inside it
mobileMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Close menu when clicking outside (on document)
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  if (jagatMenu && jagatMenu.classList.contains('active') && !jagatMenu.contains(e.target) && jagatMenuToggle && !jagatMenuToggle.contains(e.target)) {
    jagatMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
});

if (jagatAccordion) {
  jagatAccordion.addEventListener('click', () => {
    const isOpen = jagatAccordionBody.style.display === 'flex';
    jagatAccordionBody.style.display = isOpen ? 'none' : 'flex';
    jagatAccordion.classList.toggle('active', !isOpen);
  });
}

if (jagatMenuToggle) {
  jagatMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.remove('active');
    jagatMenu.classList.add('active');
    document.body.classList.add('no-scroll');
  });
}

if (jagatMenuBackBtn) {
  jagatMenuBackBtn.addEventListener('click', () => {
    jagatMenu.classList.remove('active');
    mobileMenu.classList.add('active');
    document.body.classList.add('no-scroll');
  });
}

if (closeDrawerBtn) {
  closeDrawerBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    jagatMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
}

if (jagatCloseMenuBtn) {
  jagatCloseMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    jagatMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  // Only apply sticky on desktop (screens wider than 1024px)
  if (window.innerWidth > 768) {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      // header.classList.remove('sticky');
    }
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
    mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');

    // Also close all accordions
    document.querySelectorAll('.accordion-body').forEach(body => {
      body.style.display = 'none';
    });
  }
    
    // Remove sticky class when resizing to mobile/tablet
    const header = document.querySelector('.site-header');
    if (window.innerWidth <= 1024) {
      header.classList.remove('sticky');
    }
});

// function moved to cookie-consent.js

const slider = document.querySelector('.slider-container');
let isDown = false;
let startX;
let scrollLeft;




  document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    const openBtn = document.getElementById("openLightbox");
    const closeBtn = document.getElementById("closeLightbox");
  
    if (openBtn && lightbox && closeBtn) {
      openBtn.addEventListener("click", function () {
        lightbox.style.display = "flex";
      });
  
      closeBtn.addEventListener("click", function () {
        lightbox.style.display = "none";
        const video = document.getElementById("lightboxVideo");
        if (video) video.pause();
      });
    }
  });

// document.addEventListener("DOMContentLoaded", () => {
//     const trackElement = document.getElementById('carouselTrack');
//     const baseSlides = document.querySelectorAll('.carousel-slide');
//     const overlayElement = document.getElementById('zoomOverlay');
//     const overlayImage = document.getElementById('zoomImage');
//     const closeButton = document.getElementById('closeBtn');
//     // ✅ NEW: Navigation buttons
//     const prevButton = document.getElementById('prevBtn');
//     const nextButton = document.getElementById('nextBtn');
    
//     // Clone items multiple times for smooth infinite scroll
//     for (let i = 0; i < 10; i++) {
//         baseSlides.forEach(slide => {
//             const clonedSlide = slide.cloneNode(true);
//             trackElement.appendChild(clonedSlide);
//         });
//     }
    
//     // ✅ UPDATED: Hide scrollbar but keep scrolling functionality
//     trackElement.style.overflowX = "auto"; // Keep scrolling ability
//     trackElement.style.scrollBehavior = "smooth";
//     trackElement.style.display = "flex";
//     trackElement.style.gap = "30px";
//     trackElement.style.cursor = "grab"; // Show grab cursor
    
//     // ✅ NEW: Hide scrollbar with CSS
//     trackElement.style.scrollbarWidth = "none"; // Firefox
//     trackElement.style.msOverflowStyle = "none"; // IE/Edge
    
//     // ✅ NEW: Hide webkit scrollbar (Chrome/Safari)
//     const style = document.createElement('style');
//     style.textContent = `
//         #carouselTrack::-webkit-scrollbar {
//             display: none;
//         }
//         .carousel-slide img {
//             cursor: pointer;
//         }
//         .carousel-slide img:hover {
//             cursor: pointer;
//         }
//     `;
//     document.head.appendChild(style);
    
//     // ✅ NEW: Add smooth drag scrolling functionality
//     let isDown = false;
//     let startX;
//     let scrollLeft;
//     let animationId;
    
//     trackElement.addEventListener('mousedown', (e) => {
//         isDown = true;
//         trackElement.style.cursor = "grabbing";
//         trackElement.style.scrollBehavior = "auto"; // Disable smooth scroll during drag
//         startX = e.pageX - trackElement.offsetLeft;
//         scrollLeft = trackElement.scrollLeft;
//         e.preventDefault(); // Prevent text selection
//     });
    
//     trackElement.addEventListener('mouseleave', () => {
//         isDown = false;
//         trackElement.style.cursor = "grab";
//         trackElement.style.scrollBehavior = "smooth"; // Re-enable smooth scroll
//     });
    
//     trackElement.addEventListener('mouseup', () => {
//         isDown = false;
//         trackElement.style.cursor = "grab";
//         trackElement.style.scrollBehavior = "smooth"; // Re-enable smooth scroll
//     });
    
//     trackElement.addEventListener('mousemove', (e) => {
//         if (!isDown) return;
//         e.preventDefault();
        
//         // Cancel previous animation frame
//         if (animationId) {
//             cancelAnimationFrame(animationId);
//         }
        
//         // Use requestAnimationFrame for smooth animation
//         animationId = requestAnimationFrame(() => {
//             const x = e.pageX - trackElement.offsetLeft;
//             const walk = (x - startX) * 1.5; // Reduced speed for smoother control
//             trackElement.scrollLeft = scrollLeft - walk;
//         });
//     });
    

    
//     // Handle image errors + zoom
//     const images = Array.from(document.querySelectorAll('.carousel-slide img'));
//     let currentIndex = 0;
    
//     images.forEach((image, index) => {
//         image.addEventListener('error', function () {
//             this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1TDIyNSAxNzVIMTI1TDE3NSAxMjVaIiBmaWxsPSIjOWNhM2FmIi8+CjxjaXJjbGUgY3g9IjE0NSIgY3k9IjEwNSIgcj0iMTUiIGZpbGw9IiM5Y2EzYWYiLz4KPHRleHQgeD0iMjAwIiB5PSIyMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
//         });
        
//         // Zoom on click
//         image.addEventListener('click', function () {
//             currentIndex = index;
//             overlayImage.src = this.src;
//             overlayElement.classList.add('active');
//         });
//     });
    
//     // ✅ Navigation inside zoom
//     function showImage(index) {
//         overlayImage.src = images[index].src;
//     }
    
//     prevButton.addEventListener('click', () => {
//         currentIndex = (currentIndex - 1 + images.length) % images.length;
//         showImage(currentIndex);
//     });
    
//     nextButton.addEventListener('click', () => {
//         currentIndex = (currentIndex + 1) % images.length;
//         showImage(currentIndex);
//     });
    
//     // Close overlay
//     closeButton.addEventListener('click', () => {
//         overlayElement.classList.remove('active');
//         overlayImage.src = '';
//     });
    
//     overlayElement.addEventListener('click', (e) => {
//         if (e.target === overlayElement) {
//             overlayElement.classList.remove('active');
//             overlayImage.src = '';
//         }
//     });
// });
