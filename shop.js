const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Seeded Pseudo-Random Number Generator
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return function () {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

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
});


document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const headerNormal = document.querySelector(".header-normal");
  const mobileToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");

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
      header.classList.toggle("sticky", window.scrollY > 0);
    } else {
      const scrollThreshold =
        document.documentElement.scrollHeight - window.innerHeight - 30;
      if (window.scrollY >= scrollThreshold) {
        header.classList.add("red-background");
        headerNormal.classList.add("red-background");
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
      document.body.classList.toggle("no-scroll", mobileMenu.classList.contains("active"));
    });
  }


  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Close button clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  }

  if (jagatCloseMenuBtn) {
    jagatCloseMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Close button clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  }

  if (jagatMenuToggle) {
    jagatMenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      // console.log("Jagat menu toggle clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.add("active");
      document.body.classList.add("no-scroll");
    });
  }

  if (jagatMenuBackBtn) {
    jagatMenuBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Jagat menu back button clicked");
      jagatMenu.classList.remove("active");
      mobileMenu.classList.add("active");
      document.body.classList.add("no-scroll");
    });
  }
});



window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  // Only apply sticky on desktop (screens wider than 1024px)
  if (window.innerWidth > 768) {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove('active');

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

// Accordion toggle for mobile submenu (OUR JAGAT only)
const jagatAccordion = document.getElementById('jagatAccordion');
const jagatAccordionBody = document.getElementById('jagatAccordionBody');

jagatAccordion.addEventListener('click', () => {
  const isOpen = jagatAccordionBody.style.display === 'flex';
  jagatAccordionBody.style.display = isOpen ? 'none' : 'flex';
  jagatAccordion.classList.toggle('active', !isOpen);
});

// Audio logic moved to cookie-consent.js

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

// Use shared products data (will be loaded from products-data.js)
let products = [];

const productList = document.getElementById('productList');
let currentSort = 'recommended';
// Helper function to format price
function formatMedusaPrice(amount, currencyCode, userRegion) {
  if (amount == null) return '0';

  // HOTFIX: For India, treat the API value as Rupees (major unit) directly
  // The user inputs '10000' for ₹10,000, so we should NOT divide by 100 for INR.
  if (currencyCode === 'inr' || userRegion === 'india') {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // Medusa prices are in minor units (cents) for other currencies
  const majorAmount = amount / 100;

  // For other currencies: Show decimals
  return majorAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderProducts(list) {
  if (!productList) return;

  productList.innerHTML = '';
  list.forEach((p, productIndex) => {
    const item = document.createElement('div');
    item.className = 'product';
    item.style.animationDelay = `${productIndex * 0.1}s`;

    // Get user region from index page popup
    const userRegion = localStorage.getItem('user_region') || 'india';
    // Use the currency code from the product, which we set in products-data.js
    const currencyCode = (p.currency_code || 'INR').toLowerCase();

    // Format price using the helper function (divides by 100)
    const formattedPrice = formatMedusaPrice(p.price, currencyCode, userRegion);

    // Determine symbol based on currency code
    const currencySymbol = currencyCode === 'inr' ? '₹' : '$';

    // Create image carousel HTML
    const imageHTML = p.images && p.images.length > 1 ? `
      <div class="product-image-carousel" data-product="${p.id}">
        <img src="${p.images[0]}" alt="${p.title}" class="carousel-image active" data-current="0" />
        <button class="carousel-prev" data-product="${p.id}" type="button">‹</button>
        <button class="carousel-next" data-product="${p.id}" type="button">›</button>
        <div class="carousel-dots">
          ${p.images.map((_, index) => `
            <span class="carousel-dot ${index === 0 ? 'active' : ''}" data-product="${p.id}" data-slide="${index}"></span>
          `).join('')}
        </div>
      </div>
    ` : `<img src="${p.images && p.images[0] ? p.images[0] : 'assets/placeholder.png'}" alt="${p.title}" />`;
    // console.log('Product ID for carousel:', p.id, 'Type:', typeof p.id);

    // Get first metal only from comma-separated string
    const firstMetal = p.metal ? p.metal.split(',')[0].trim() : '';
    const metalDisplay = firstMetal || 'Gold';

    item.innerHTML = `
      <a href="${p.url}" class="product-link">
        ${imageHTML}
        <h4>${p.title}</h4>
        <p class="product-price">${currencySymbol} ${formattedPrice}</p>
        </a>
        `;
    // <p>${p.metal}</p>
    productList.appendChild(item);
  });

  // Initialize carousel after rendering
  initializeCarousel();
}

// ADD this new function for carousel functionality
function initializeCarousel() {
  // Handle navigation arrows
  document.querySelectorAll('.carousel-prev, .carousel-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = btn.dataset.product;
      // console.log('Product ID from dataset:', productId);

      if (!productId) {
        // console.error('No product ID found');
        return;
      }
      const carousel = document.querySelector(`[data-product="${productId}"]`);
      const img = carousel?.querySelector('.carousel-image');
      const dots = carousel?.querySelectorAll('.carousel-dot');
      const product = products.find(p => p.id === productId);

      if (!carousel || !img || !product) {
        // console.error('Missing elements:', { carousel, img, product });
        return;
      }

      let currentIndex = parseInt(img.dataset.current);

      if (btn.classList.contains('carousel-next')) {
        currentIndex = (currentIndex + 1) % product.images.length;
      } else {
        currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      }

      // Update image and dots
      img.src = product.images[currentIndex];
      img.dataset.current = currentIndex;

      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
      }
    });
  });

  // Handle dot clicks
  document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = dot.dataset.product;
      const slideIndex = parseInt(dot.dataset.slide);
      const carousel = document.querySelector(`[data-product="${productId}"]`);
      const img = carousel?.querySelector('.carousel-image');
      const dots = carousel?.querySelectorAll('.carousel-dot');
      const product = products.find(p => p.id === productId);

      if (!carousel || !img || !product) return;

      // Update image and dots
      img.src = product.images[slideIndex];
      img.dataset.current = slideIndex;
      img.classList.add('active'); // Ensure the image itself is marked active

      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}

function sortProducts(list) {
  if (currentSort === 'low-to-high') {
    return [...list].sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high-to-low') {
    return [...list].sort((a, b) => b.price - a.price);
  } else if (currentSort === 'recommended') {
    const seed = 12345; // Use the same fixed seed as in initializeShop
    const random = seededRandom(seed);
    return [...list].sort(() => random() - 0.5);
  }
  return list;
}

function clearSelected() {
  document.querySelectorAll('.filter:checked').forEach(checkbox => {
    checkbox.checked = false;
  });

  // Uncheck all filter inputs
  document.querySelectorAll('.filter').forEach(input => {
    input.checked = false;
  });

  // Set "Recommended" as the default sort option
  const recommendedRadio = document.getElementById('recommended');
  if (recommendedRadio) {
    recommendedRadio.checked = true;
    currentSort = 'recommended'; // Update the currentSort variable
  }

  document.getElementById('clearAllButton').style.display = 'none';

  filterAndSortProducts();
}

function filterAndSortProducts() {
  const checkedFilters = document.querySelectorAll('.filter:checked');

  // Group filters by type
  const filterGroups = {
    type: [],
    metal: [],
    price: []
  };

  // Collect all checked filters
  checkedFilters.forEach(input => {
    if (input.dataset.type) {
      filterGroups.type.push(input.dataset.type);
    } else if (input.dataset.metal) {
      filterGroups.metal.push(input.dataset.metal);
    } else if (input.dataset.price) {
      filterGroups.price.push(parseInt(input.dataset.price));
    }
  });

  // Filter products
  let filtered = products.filter(product => {
    // If no filters are selected, show all products
    const hasFilters = filterGroups.type.length > 0 || filterGroups.metal.length > 0 || filterGroups.price.length > 0;
    if (!hasFilters) return true;

    // Check type filter
    if (filterGroups.type.length > 0 && !filterGroups.type.includes(product.type)) {
      return false;
    }

    // Check metal filter
    if (filterGroups.metal.length > 0 && !filterGroups.metal.includes(product.metal)) {
      return false;
    }

    // Check price filter
    if (filterGroups.price.length > 0) {
      const maxSelectedPrice = Math.max(...filterGroups.price);
      if (product.price > maxSelectedPrice) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sorted = sortProducts(filtered);
  renderProducts(sorted);
}

document.querySelectorAll('.filter').forEach(input => {
  input.addEventListener('change', filterAndSortProducts);
});

document.querySelectorAll('input[name="sort"]').forEach(radio => {
  radio.addEventListener('change', e => {
    currentSort = e.target.value;
    filterAndSortProducts();
  });
});

// Wait for products to load from API before rendering
async function initializeShop() {
  const productLoader = document.getElementById('productLoader');
  const productList = document.getElementById('productList');

  if (productLoader) {
    productLoader.style.display = 'block';
  }

  try {
    // Wait for products to be fetched
    const fetchedProducts = await fetchProducts();

    // Use the fetched products data
    products = fetchedProducts;

    // Apply initial filters and sorting
    filterAndSortProducts();

    // Initialize mobile product list
    initializeMobileProducts();

    // console.log('Shop initialized with', products.length, 'products');
  } catch (error) {
    products = [];
    renderProducts([]);
  } finally {
    if (productLoader) {
      productLoader.style.display = 'none';
    }
    if (productList) {
      productList.style.display = 'flex';
    }
  }
}

// Mobile Product List initialization
function initializeMobileProducts() {
  const container = document.getElementById('productListMobile');
  if (!container) return;

  container.innerHTML = ''; // Clear existing content

  // Render only the first image
  products.forEach((p) => {
    const imgSrc = p.images && p.images.length > 0 ? p.images[0] : 'assets/placeholder.png';
    const card = `
      <div class="product-card">
        <a href="${p.url}?id=${p.id}">
          <img src="${imgSrc}" alt="${p.title}" loading="lazy">
        </a>
      </div>`;
    container.insertAdjacentHTML('beforeend', card);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeShop();

  const clearAllButton = document.getElementById('clearAllButton');
  if (clearAllButton) {
    clearAllButton.style.display = 'none';
  }

  // Show clear all button when filters are selected
  document.querySelectorAll('.filter').forEach(input => {
    input.addEventListener('change', () => {
      if (document.querySelectorAll('.filter:checked').length > 0) {
        clearAllButton.style.display = 'block';
      } else {
        clearAllButton.style.display = 'none';
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const stickyFooter = document.getElementById("stickyFooter");
  const carousel = document.getElementById("carousel");

  if (carousel && stickyFooter) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stickyFooter.classList.add("visible");
          } else {
            stickyFooter.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px"
      }
    );
    observer.observe(carousel);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const headerNormal = document.querySelector(".header-normal");
  const mobileToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");

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
      // console.log("Jagat menu toggle clicked");
      mobileMenu.classList.remove("active");
      jagatMenu.classList.add("active");
    });
  }

  if (jagatMenuBackBtn) {
    jagatMenuBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // console.log("Jagat menu back button clicked");
      jagatMenu.classList.remove("active");
      mobileMenu.classList.add("active");
    });
  }
});

