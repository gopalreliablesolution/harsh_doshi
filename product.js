// ============================================
// DYNAMIC PRODUCT LOADING (FROM 1ST CODE)
// ============================================

// Image navigation function
function showNextImage() {
  const images = document.querySelectorAll('#imageContainer img');
  if (images.length === 0) return;

  let currentIndex = 0;
  images.forEach((img, index) => {
    if (img.classList.contains('active')) {
      currentIndex = index;
      img.classList.remove('active');
    }
  });

  const nextIndex = (currentIndex + 1) % images.length;
  images[nextIndex].classList.add('active');

  // Update counter
  const currentCounter = document.querySelector('#imageCounter .current');
  if (currentCounter) {
    currentCounter.textContent = nextIndex + 1;
  }
}

// Carousel functionality
let currentImageIndex = 0;

function changeImage(direction) {
  const images = document.querySelectorAll('#imageContainer .carousel-image');
  const currentCounter = document.querySelector('#imageCounter .current');

  if (images.length === 0) return;

  images[currentImageIndex].classList.remove('active');
  currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
  images[currentImageIndex].classList.add('active');

  if (currentCounter) {
    currentCounter.textContent = currentImageIndex + 1;
  }
}

// Show loader
function showLoader() {
  const loader = document.getElementById('pageLoader');
  const content = document.getElementById('productContent');
  if (loader) loader.style.display = 'flex';
  if (content) content.classList.remove('loaded');
}

// Hide loader
function hideLoader() {
  const loader = document.getElementById('pageLoader');
  const content = document.getElementById('productContent');
  if (loader) {
    loader.style.display = 'none';
  }
  if (content) {
    content.classList.add('loaded');
  }
}

// Sort variable moved to appropriate scope or removed if duplicate
// let currentSort = 'recommended';

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

function loadRecommendedProducts(currentProductId) {
  const recommendedProducts = productsData.filter(p => p.id !== currentProductId).slice(0, 3);
  const productListContainer = document.getElementById('productList');
  const userRegion = localStorage.getItem('user_region') || 'india';
  const currencySymbol = userRegion === 'india' ? '₹' : '$';

  if (productListContainer) {
    productListContainer.innerHTML = '';
    recommendedProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';

      // Use formatMedusaPrice for consistent formatting
      const currencyCode = (product.currency_code || (userRegion === 'india' ? 'inr' : 'usd')).toLowerCase();
      const formattedPrice = formatMedusaPrice(product.price, currencyCode, userRegion);
      productElement.innerHTML = `
        <a href="products.html?id=${product.id}" class="product-link">
          <img src="${product.images[0]}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.metal}</p>
          <p class="price">${currencySymbol} ${formattedPrice}</p>
        </a>
      `;
      productListContainer.appendChild(productElement);
    });
  }
}

// ============================================
// MOBILE HEADER SCROLL BEHAVIOR (FROM 2ND CODE)
// ============================================

window.addEventListener('scroll', function () {
  if (window.matchMedia('(max-width: 768px)').matches) {
    const header = document.querySelector('.site-header');
    const productImagesWrapper = document.querySelector('.image-carousel');
    const logo = document.querySelector('.logo a');
    const menuToggleImg = document.querySelector('#menuToggle img');
    const blackCartIcon = document.querySelector('#blackCartIcon');
    const whiteCartIcon = document.querySelector('#whiteCartIcon');

    if (productImagesWrapper) {
      const productImagesWrapperBottom = productImagesWrapper.getBoundingClientRect().bottom;

      if (productImagesWrapperBottom <= 0) {
        header.style.backgroundColor = 'white';
        header.classList.remove('transparent');
        if (logo) logo.style.filter = 'invert(0)';
        if (menuToggleImg) menuToggleImg.style.filter = 'invert(0)';
        // if (whiteCartIcon) { whiteCartIcon.style.display = 'none'; whiteCartIcon.classList.remove(...whiteCartIcon.classList); whiteCartIcon.classList.add('desktop-only'); }
        // if (blackCartIcon) { blackCartIcon.style.display = 'block'; blackCartIcon.classList.remove(...blackCartIcon.classList); }
      } else {
        header.style.backgroundColor = 'transparent';
        // if (logo) logo.style.filter = 'invert(1)';
        // if (menuToggleImg) menuToggleImg.style.filter = 'invert(1)';
        // if (whiteCartIcon) { whiteCartIcon.style.display = 'block'; whiteCartIcon.classList.remove(...whiteCartIcon.classList); whiteCartIcon.classList.add('mobile-only'); }
        // if (blackCartIcon) { blackCartIcon.style.display = 'none'; blackCartIcon.classList.remove(...blackCartIcon.classList); }
      }
    } else {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'white';
        if (logo) logo.style.filter = 'invert(0)';
        if (menuToggleImg) menuToggleImg.style.filter = 'invert(0)';
        // if (whiteCartIcon) whiteCartIcon.style.display = 'none';
        // if (blackCartIcon) blackCartIcon.style.display = 'block';
      } else {
        header.style.backgroundColor = 'transparent';
        // if (logo) logo.style.filter = 'invert(1)';
        // if (menuToggleImg) menuToggleImg.style.filter = 'invert(1)';
        // if (whiteCartIcon) whiteCartIcon.style.display = 'block';
        // if (blackCartIcon) blackCartIcon.style.display = 'none';
      }
    }

    const scrollThreshold =
      document.documentElement.scrollHeight - window.innerHeight - 30;
    if (window.scrollY >= scrollThreshold) {
      header.classList.add("red-background");
      menuToggleImg.style.filter = 'invert(1)';
      logo.style.filter = 'invert(1)';
    } else {
      header.classList.remove("red-background");
    }
  }
});

// ============================================
// GLOBAL VARIABLES
// ============================================

let selectedMetal = '';
let selectedSize = '';

// ============================================
// CART FUNCTIONALITY (MERGED - PRIORITIZING 1ST CODE)
// ============================================

function addToBag() {
  const userRegion = localStorage.getItem('user_region') || 'india';
  if (userRegion !== 'india') {
    alert('International orders: Please use the Enquire button for assistance.');
    return;
  }

  const titleElement = document.getElementById('product-title-desktop') || document.getElementById('product-title-mobile');
  const descriptionElement = document.getElementById('product-description');
  const priceElement = document.getElementById('product-price-desktop') || document.getElementById('product-price-mobile');
  const imageElement = document.querySelector('#imageContainer img.active') || document.querySelector('.carousel-images-container img.active') || document.querySelector('#imageContainer img') || document.querySelector('.carousel-images-container img');

  if (typeof productsData !== 'undefined') {
    const productId = getProductIdFromUrl();
    const product = productsData.find(p => p.id === productId || p.id == productId) || productsData[0];

    const currentTitle = titleElement ? titleElement.textContent.trim() : product.title;
    const currentDescription = descriptionElement ? descriptionElement.textContent.trim() : (product.subDescription || product.description);
    const currentPrice = priceElement ? priceElement.textContent.trim() : `₹ ${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const currentImage = imageElement ? imageElement.src : product.images[0];

    const productDetails = {
      id: product.id,
      title: currentTitle,
      price: currentPrice,
      description: currentDescription,
      metal: selectedMetal || 'Default Metal',
      size: selectedSize || 'Free Size',
      image: currentImage
    };

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(productDetails);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    alert('Item added to bag successfully!');
    window.location.href = 'checkout.html';
  } else {
    if (!titleElement || !priceElement || !imageElement) {
      alert('Sorry, could not add to bag. Please try again.');
      return;
    }

    const productDetails = {
      title: titleElement.textContent.trim(),
      description: descriptionElement ? descriptionElement.textContent.trim() : '',
      price: priceElement.textContent.trim(),
      metal: selectedMetal || 'Default Metal',
      size: selectedSize || 'Free Size',
      image: imageElement.src
    };

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(productDetails);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    alert('Item added to bag successfully!');
    window.location.href = 'checkout.html';
  }
}

// ============================================
// DROPDOWN FUNCTIONALITY
// ============================================

function toggleDropdown(type) {
  const dropdown = document.getElementById(type + "Dropdown");
  document.querySelectorAll(".dropdown-content").forEach(d => {
    if (d !== dropdown) d.classList.remove("show");
  });
  dropdown.classList.toggle("show");
}

function selectOption(type, value) {
  const label = document.getElementById(type + "Label");
  label.textContent = value;
  const dropdown = document.getElementById(type + "Dropdown");
  dropdown.classList.remove("show");

  if (type === 'metal') {
    selectedMetal = value;
    if (typeof productsData !== 'undefined' && productsData.length > 0) {
      const productId = getProductIdFromUrl();
      const currentProduct = productsData.find(p => p.id === productId || p.id == productId) || productsData[0];
      if (currentProduct) {
        updateProductImagesByMetal(currentProduct, value);
        updateTitleSubtitle(currentProduct, value);
      }
    }
  }
  if (type === 'size') selectedSize = value;
}

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-content").forEach(d => d.classList.remove("show"));
  }
});

// ============================================
// SIDEBAR CONTENT DATA (FROM 2ND CODE - MORE COMPLETE)
// ============================================

const sidebarData = {
  description: {
    title: 'Description',
    content: `
      <div class="product-description" id="product-description-sidebar">
        Bandharan earrings with intricate hand-engraved patterns, featuring traditional Italian craftsmanship and premium diamonds.
      </div>
      
      <div class="product-specs">
        <div class="spec-item">Handcrafted Techniques</div>
        <ul class="spec-list">
          <li>Rigato engraving technique</li>
          <li>Modellato sculptural details</li>
          <li>Ornato decorative patterns</li>
        </ul>
        
        <div class="spec-item">Design Inspiration</div>
        <ul class="spec-list">
          <li>Classical Italian architecture</li>
          <li>Natural geometric forms</li>
          <li>Contemporary luxury aesthetic</li>
        </ul>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible('craftmanship')">
          Craftsmanship Details
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
        <div class="collapsible-content" id="craftmanship">
          Each piece represents hours of meticulous handwork by our master artisans. The traditional techniques used have been passed down through generations, ensuring authenticity and exceptional quality in every detail.
        </div>
      </div>
    `
  },
  details: {
    title: 'Product Details',
    content: `
      <div class="product-description">
        Bandharan earrings with premium diamonds, featuring 18k gold construction and hand-engraved detailing.
      </div>
      
      <div class="product-specs">
        <div class="spec-item">Material Specifications</div>
        <ul class="spec-list">
          <li>18k Yellow Gold</li>
          <li>18k White Gold option</li>
          <li>Premium diamonds VS1-VS2</li>
          <li>Band width: 0.62 cm</li>
          <li>Total weight: 3.2g (approx)</li>
        </ul>
        
        <div class="spec-item">Diamond Details</div>
        <ul class="spec-list">
          <li>Cut: Brilliant round</li>
          <li>Color: F-G grade</li>
          <li>Total carat: 0.25ct</li>
          <li>Setting: Prong setting</li>
        </ul>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible('care')">
          Product Care
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
        <div class="collapsible-content" id="care">
          Clean gently with soft brush and mild soap. Store in provided jewelry box. Avoid contact with perfumes and harsh chemicals. Professional cleaning recommended annually. Lifetime warranty against manufacturing defects included.
        </div>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible('warranty')">
          Warranty & Service
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
        <div class="collapsible-content" id="warranty">
          Lifetime warranty against manufacturing defects. Complimentary annual maintenance service. Free resizing within first year. Global repair service available at all authorized retailers.
        </div>
      </div>
    `
  },
  sizeGuide: {
    title: 'Size Guide',
    content: `
      <div class="product-description">
        Comprehensive sizing information for perfect fit and comfort.
      </div>
      
      <div class="product-specs">
        <div class="spec-item">Available Sizes</div>
        <ul class="spec-list">
          <li>Size 13: 16.5mm diameter</li>
          <li>Size 14: 17.3mm diameter</li>
          <li>Size 15: 18.1mm diameter</li>
          <li>Size 16: 18.9mm diameter</li>
          <li>Size 17: 19.7mm diameter</li>
          <li>Size 18: 20.5mm diameter</li>
        </ul>
        
        <div class="spec-item">Measurement Methods</div>
        <ul class="spec-list">
          <li>Existing ring comparison</li>
          <li>String wrap method</li>
          <li>Professional sizing</li>
        </ul>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible('measuring')">
          How to Measure
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
        <div class="collapsible-content" id="measuring">
          For accurate measurement, wrap string around finger at widest point. Mark overlap, measure length in mm, divide by 3.14 for diameter. Best measured at normal temperature. Visit our boutiques for professional sizing service.
        </div>
      </div>

      <div class="collapsible-section">
        <div class="collapsible-header" onclick="toggleCollapsible('fitting')">
          Fitting Tips
          <svg class="collapsible-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
        <div class="collapsible-content" id="fitting">
          Ring size varies throughout day due to temperature. Wider bands like this design fit more snugly. If between sizes, choose larger for comfort. Custom sizing available upon request.
        </div>
      </div>
    `
  }
};

// ============================================
// COLLAPSIBLE SECTIONS
// ============================================

function toggleCollapsible(id) {
  const content = document.getElementById(id);
  const arrow = content.previousElementSibling.querySelector('.collapsible-arrow');

  content.classList.toggle('active');
  arrow.classList.toggle('rotated');
}

// ============================================
// SIDEBAR FUNCTIONS
// ============================================

function openSidebar(section) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const title = document.getElementById('sidebarTitle');
  const content = document.getElementById('sidebarContent');

  if (window.innerWidth > 768) {
    if (sidebarData[section]) {
      title.textContent = sidebarData[section].title;

      // Update description content with API data if available
      if (section === 'description' && typeof productsData !== 'undefined') {
        const productId = getProductIdFromUrl();
        const product = productsData.find(p => p.id === productId || p.id == productId);

        if (product && product.description) {
          const description = product.description;
          let formattedContent = `<div class="product-description">${product.title.toUpperCase()} WITH PREMIUM CRAFTSMANSHIP AND DESIGN.</div><div class="product-specs">`;

          if (description.includes('\n-') || description.includes('\nâ€¢')) {
            const parts = description.split('\n');
            const mainText = parts[0];
            const bulletPoints = parts.slice(1).filter(point => point.trim().startsWith('-') || point.trim().startsWith('â€¢'));

            formattedContent += `<div class="spec-item">${mainText.toUpperCase()}</div><ul class="spec-list">`;
            bulletPoints.forEach(point => {
              const cleanPoint = point.replace(/^[\s-â€¢]+/, '').trim();
              formattedContent += `<li>${cleanPoint.toUpperCase()}</li>`;
            });
            formattedContent += '</ul>';
          } else {
            formattedContent += `<div class="spec-item">${description.toUpperCase()}</div>`;
          }

          formattedContent += '</div>';
          content.innerHTML = formattedContent;
        } else {
          content.innerHTML = sidebarData[section].content;
        }
      } else if (section === 'details' && typeof productsData !== 'undefined') {
        const productId = getProductIdFromUrl();
        const product = productsData.find(p => p.id === productId || p.id == productId);

        if (product && product.material) {
          const material = product.material;
          let formattedContent = `<div class="product-description">${product.title.toUpperCase()} WITH PREMIUM MATERIALS AND CONSTRUCTION.</div><div class="product-specs">`;

          if (material.includes('\n-') || material.includes('\nâ€¢')) {
            const parts = material.split('\n');
            const mainText = parts[0];
            const bulletPoints = parts.slice(1).filter(point => point.trim().startsWith('-') || point.trim().startsWith('â€¢'));

            formattedContent += `<div class="spec-item">MATERIAL SPECIFICATIONS</div><ul class="spec-list">`;
            bulletPoints.forEach(point => {
              const cleanPoint = point.replace(/^[\s-â€¢]+/, '').trim();
              formattedContent += `<li>${cleanPoint.toUpperCase()}</li>`;
            });
            formattedContent += '</ul>';
          } else {
            formattedContent += `<div class="spec-item">MATERIAL SPECIFICATIONS</div><ul class="spec-list"><li>${material.toUpperCase()}</li></ul>`;
          }

          formattedContent += '</div>';
          content.innerHTML = formattedContent;
        } else {
          content.innerHTML = sidebarData[section].content;
        }
      } else {
        content.innerHTML = sidebarData[section].content;
      }

      overlay.classList.add('active');
      sidebar.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  } else {
    document.getElementById('mobileAccordionOverlay').classList.add('active');
    document.getElementById('mobileAccordionModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Expand the requested section
    document.querySelectorAll('.accordion-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.accordion-title').forEach(el => el.classList.remove('active'));

    const targetContent = document.getElementById(section);
    const targetTitle = document.querySelector(`.accordion-title[data-section="${section}"]`);
    if (targetContent) targetContent.classList.add('active');
    if (targetTitle) targetTitle.classList.add('active');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function handleEnquire() {
  const metal = selectedMetal || 'Not selected';
  const size = selectedSize || 'Not selected';

  // Get product details
  const productId = getProductIdFromUrl();
  const product = productsData.find(p => p.id === productId || p.id == productId);

  if (!product) {
    alert('Product information not available');
    return;
  }

  // Prepare enquiry email data
  const enquiryData = {
    type: 'enquiry',
    productTitle: product.title,
    productId: product.id,
    metal: metal,
    size: size,
    productImage: product.thumbnail || (product.images && product.images[0]?.url),
    timestamp: new Date().toISOString()
  };

  // Check if email is enabled
  if (MEDUSA_CONFIG.EMAIL_ENABLED === false) {
    alert('Email enquiries are currently disabled.');
    return;
  }

  // Send enquiry email
  fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/send-enquiry-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
    },
    body: JSON.stringify(enquiryData)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Enquiry email sent:', data);
      alert(`Your enquiry has been submitted.\nProduct: ${product.title}\nMetal: ${metal}\nSize: ${size}\n\nWe will contact you shortly!`);
    })
    .catch(error => {
      console.error('Failed to send enquiry email:', error);
      alert(`Your enquiry has been submitted.\nMetal: ${metal}\nSize: ${size}`);
    });
}

function notifyMe(size) {
  alert(`You will be notified when size ${size} becomes available.`);
}

// ============================================
// PRODUCT LISTING & FILTERING (FROM 2ND CODE)
// ============================================

// COMMENTED OUT - Using API data instead of hardcoded products
/*
const products = [
  {
    title: 'Bandharan Bracelet',
    type: 'bracelet',
    metal: 'yellow',
    price: 6636,
    images: [
      'assets/product 2.png',
      'assets/bandharan-collection.png',
      'assets/product 3.png'
    ],
    url: "products.html"
  },
  {
    title: 'Bandharan Necklace',
    type: 'necklace',
    metal: 'white',
    price: 10636,
    image: 'assets/product 2.png',
    url: 'products.html'
  },
  {
    title: 'Bandharan Ring',
    type: 'ring',
    metal: 'yellow',
    price: 3636,
    image: 'assets/product 3.png',
    url: 'products.html'
  }
];
*/

const productList = document.getElementById('productList');
let currentSort = 'recommended';

function renderProducts(list) {
  if (!productList) return; // Safety check

  // Desktop Rendering
  productList.innerHTML = '';

  // Mobile Rendering Elements
  const recommendedWrapper = document.getElementById('recommendedWrapper');
  const recommendedName = document.getElementById('recommendedName');
  const recommendedDots = document.getElementById('recommendedDots');

  if (recommendedWrapper) recommendedWrapper.innerHTML = '';
  if (recommendedDots) recommendedDots.innerHTML = '';

  const shuffledList = [...list].sort(() => Math.random() - 0.7);
  const userRegion = localStorage.getItem('user_region') || 'india';
  const currencySymbol = userRegion === 'india' ? '₹' : '$';

  shuffledList.forEach((p, productIndex) => {
    // 1. Desktop Item
    const item = document.createElement('div');
    item.className = 'product';

    const imageHTML = p.images && p.images.length > 1 ? `
      <div class="product-image-carousel" data-product="${productIndex}">
        <img src="${p.images[0]}" alt="${p.title}" class="carousel-image" data-current="0" />
        <button class="carousel-prev" data-product="${productIndex}">â€¹</button>
        <button class="carousel-next" data-product="${productIndex}">â€º</button>
        <div class="carousel-dots">
          ${p.images.map((_, index) => `
            <span class="carousel-dot ${index === 0 ? 'active' : ''}" data-product="${productIndex}" data-slide="${index}" onclick="event.preventDefault(); event.stopPropagation();"></span>
          `).join('')}
        </div>
      </div>
    ` : `<img src="${p.images ? p.images[0] : p.image}" alt="${p.title}" />`;

    item.innerHTML = `
      <a href="${p.url}" class="product-link">
        ${imageHTML}
        <h4>${p.title}</h4>
        <p class="product-price">${currencySymbol} ${formatMedusaPrice(p.price, (p.currency_code || 'inr').toLowerCase(), userRegion)}</p>
      </a>
    `;
    // <p>${p.metal}</p>
    productList.appendChild(item);

    // 2. Mobile Item (Carousel Slide)
    if (recommendedWrapper) {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `
        <a href="${p.url}">
          <img src="${p.images ? p.images[0] : p.image}" alt="${p.title}">
        </a>
      `;
      recommendedWrapper.appendChild(slide);

      // Add dot for this slide
      if (recommendedDots) {
        const dot = document.createElement('span');
        dot.className = `dot ${productIndex === 0 ? 'active' : ''}`;
        dot.onclick = () => {
          recommendedWrapper.scrollTo({
            left: slide.offsetLeft,
            behavior: 'smooth'
          });
        };
        recommendedDots.appendChild(dot);
      }
    }
  });

  // Initialize Mobile Carousel Sync
  if (recommendedWrapper && recommendedName && list.length > 0) {
    recommendedName.textContent = list[0].title;

    recommendedWrapper.onscroll = () => {
      const index = Math.round(recommendedWrapper.scrollLeft / recommendedWrapper.offsetWidth);
      if (list[index]) {
        recommendedName.textContent = list[index].title;
        const dots = recommendedDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    };
  }

  // Initialize Desktop Carousel after rendering
  setTimeout(() => {
    initializeCarousel();
  }, 100);
}

function initializeCarousel() {
  // Check if productsData is available
  if (typeof productsData === 'undefined' || !productsData) {
    return;
  }

  // Handle navigation arrows
  document.querySelectorAll('.carousel-prev, .carousel-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productIndex = parseInt(btn.dataset.product);
      if (isNaN(productIndex)) return;

      const carousel = btn.closest('.product-image-carousel');
      if (!carousel) return;

      const img = carousel.querySelector('.carousel-image');
      const dots = carousel.querySelectorAll('.carousel-dot');

      if (!img || !productsData[productIndex] || !productsData[productIndex].images) return;

      const product = productsData[productIndex];
      let currentIndex = parseInt(img.dataset.current) || 0;

      if (btn.classList.contains('carousel-next')) {
        currentIndex = (currentIndex + 1) % product.images.length;
      } else {
        currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      }

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

      const productIndex = parseInt(dot.dataset.product);
      const slideIndex = parseInt(dot.dataset.slide);

      if (isNaN(productIndex) || isNaN(slideIndex)) return;

      const carousel = dot.closest('.product-image-carousel');
      if (!carousel) return;

      const img = carousel.querySelector('.carousel-image');
      const dots = carousel.querySelectorAll('.carousel-dot');

      if (!img || !productsData[productIndex] || !productsData[productIndex].images) return;

      const product = productsData[productIndex];
      if (slideIndex >= product.images.length) return;

      img.src = product.images[slideIndex];
      img.dataset.current = slideIndex;

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
  }
  return list;
}

function applyFilters() {
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
  let filtered = productsData.filter(product => {
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

// ============================================
// LIGHTBOX FUNCTIONALITY (FROM 2ND CODE)
// ============================================

// COMMENTED OUT - Using API data instead of hardcoded images
/*
const productImages = [
  "assets/single product 1.png",
  "assets/single product 2.png",
  "assets/newsletter_mobile.png"
];
*/

// ============================================
// DOM CONTENT LOADED - INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, checking for productsData...');

  // Show loader immediately when page loads
  showLoader();

  // Add click event to product images for lightbox
  const productImagesContainer = document.querySelectorAll('.product-images img');
  productImagesContainer.forEach((img, index) => {
    img.style.cursor = 'pointer';
  });

  // Close lightbox when clicking on overlay
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === this) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightboxOverlay');
    if (lightbox && lightbox.classList.contains('active')) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    }
  });

  // Make functions global for inline onclick
  window.toggleDropdown = toggleDropdown;
  window.selectOption = selectOption;
  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;
  window.addToBag = addToBag;
  window.handleEnquire = handleEnquire;
  window.notifyMe = notifyMe;
  window.toggleCollapsible = toggleCollapsible;

  // Load product data immediately
  loadProductData();

  // Update button visibility based on region
  const userRegion = localStorage.getItem('user_region') || 'india';
  const addToBagBtn = document.getElementById('mainAddToBagBtn');
  const stickyAddToBagBtn = document.getElementById('stickyAddToBagBtn');
  const enquireBtn = document.querySelector('.enquire-btn');

  if (userRegion === 'india') {
    if (addToBagBtn) addToBagBtn.style.display = 'block';
    if (stickyAddToBagBtn) stickyAddToBagBtn.style.display = 'block';
    if (enquireBtn) enquireBtn.style.display = 'none';
  } else {
    if (addToBagBtn) addToBagBtn.style.display = 'none';
    if (stickyAddToBagBtn) stickyAddToBagBtn.style.display = 'none';
    if (enquireBtn) enquireBtn.style.display = 'block';
  }
});

// Get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  let productId = urlParams.get('id');

  // Handle duplicate ID in URL (remove extra ?id= part)
  if (productId && productId.includes('?id=')) {
    productId = productId.split('?id=')[0];
  }

  return productId;
}

// Load product data from API
async function loadProductData() {
  showLoader();

  try {
    // 1. Fetch products if not already loaded
    if (typeof fetchProducts === 'function' && (typeof productsData === 'undefined' || productsData.length === 0)) {
      await fetchProducts();
    }

    // 2. Double check productsData
    if (typeof productsData === 'undefined' || productsData.length === 0) {
      console.warn('No products found after fetch');
      hideLoader();
      return;
    }

    const productId = getProductIdFromUrl();
    let currentProduct;

    if (productId) {
      currentProduct = productsData.find(p => p.id === productId || p.id == productId);
    }

    // Fallback to first product if no ID or product not found
    if (!currentProduct) {
      currentProduct = productsData[0];
    }

    // 3. Load product into UI
    loadProductDataWithProduct(currentProduct);

    // 4. Handle recommended products list if container exists
    const productListContainer = document.getElementById('productList');
    if (productListContainer && typeof renderProducts === 'function') {
      const otherProducts = productsData.filter(p => p.id !== currentProduct.id).slice(0, 3);
      renderProducts(otherProducts);
    }

    hideLoader();
  } catch (error) {
    console.error('Error in loadProductData:', error);
    hideLoader();
  }
}

// Original loadProductData function renamed
function loadProductDataWithProduct(product) {
  // console.log('=== loadProductDataWithProduct STARTED ===');
  // console.log('Product images:', product.images);

  // Update product title
  const titleDesktop = document.getElementById('product-title-desktop');
  const titleMobile = document.getElementById('product-title-mobile');
  if (titleDesktop) titleDesktop.textContent = product.title;
  if (titleMobile) titleMobile.textContent = product.title;

  // Update product price
  const priceDesktop = document.getElementById('product-price-desktop');
  const priceMobile = document.getElementById('product-price-mobile');

  console.log('Sample product data:', productsData[0]?.price);

  const userRegion = localStorage.getItem('user_region') || 'india';
  const currencyCode = product.currency_code ? product.currency_code.toLowerCase() : 'inr';
  const currencySymbol = currencyCode === 'inr' ? '₹' : '$';

  // Format price using helper
  const formattedPrice = typeof formatMedusaPrice === 'function'
    ? formatMedusaPrice(product.price, currencyCode, userRegion)
    : (product.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Fallback

  if (priceDesktop) priceDesktop.textContent = `${currencySymbol} ${formattedPrice}`;
  if (priceMobile) priceMobile.textContent = `${currencySymbol} ${formattedPrice}`;

  // Update product description
  const descriptionElement = document.getElementById('product-description');

  if (descriptionElement) {
    // console.log('Found description element, updating to:', product.subDescription);
    const description = product.subDescription;

    // Check if description contains bullet points (indicated by \n- or similar patterns)
    if (description && (description.includes('\n-') || description.includes('\nâ€¢'))) {
      // Split description into main text and bullet points
      const parts = description.split('\n');
      const mainText = parts[0];
      const bulletPoints = parts.slice(1).filter(point => point.trim().startsWith('-') || point.trim().startsWith('â€¢'));

      // Create formatted HTML
      let formattedHTML = mainText;
      if (bulletPoints.length > 0) {
        formattedHTML += '<br><br>';
        bulletPoints.forEach(point => {
          const cleanPoint = point.replace(/^[\s-â€¢]+/, '').trim();
          formattedHTML += `â€¢ ${cleanPoint}<br>`;
        });
      }

      descriptionElement.innerHTML = formattedHTML;
    } else {
      descriptionElement.textContent = description || 'Premium handcrafted jewelry piece.';
    }
  } else {
    // console.log('Description element not found');
  }

  // Update product images
  // console.log('Updating images with:', product.images);

  // Update desktop images - dynamically create if needed
  const imageContainer = document.getElementById('imageContainer');
  if (imageContainer) {
    // Clear existing images
    imageContainer.innerHTML = '';
    // console.log('Creating', product.images.length, 'desktop images');

    // Create images for each product image
    product.images.forEach((imageSrc, index) => {
      // console.log(`Creating image ${index + 1}: ${imageSrc}`);
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${product.title} Image ${index + 1}`;
      img.className = 'stacked-img';
      if (index === 0) img.classList.add('active');
      img.style.cursor = 'pointer';
      img.onclick = () => showNextImage();
      img.onload = () => console.log(`Image ${index + 1} loaded successfully`);
      img.onerror = () => console.error(`Image ${index + 1} failed to load:`, imageSrc);
      imageContainer.appendChild(img);
      // console.log(`Added image ${index + 1} to container`);
    });

    // Verify all images were created and reinitialize scroll
    const createdImages = imageContainer.querySelectorAll('img');
    // console.log('Total images created:', createdImages.length);

    // Reinitialize scroll navigation with new images
    setTimeout(() => {
      if (typeof window.initializeScrollImages === 'function') {
        window.initializeScrollImages();
      }
    }, 100);
  }

  // Update mobile images - dynamically create if needed
  const mobileContainer = document.querySelector('.carousel-images-container');
  if (mobileContainer) {
    // Clear existing images
    mobileContainer.innerHTML = '';

    // Create images for each product image
    product.images.forEach((imageSrc, index) => {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${product.title} Image ${index + 1}`;
      img.className = 'carousel-image';
      if (index === 0) img.classList.add('active');
      mobileContainer.appendChild(img);
      // console.log(`Created mobile image ${index}:`, imageSrc);
    });

    // Update mobile dots
    const dotsContainer = document.querySelector('.image-carousel .carousel-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      product.images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      });
    }

    // Initialize mobile carousel logic
    setTimeout(initializeMobileCarousel, 100);
  }

  // Update image counter total
  const totalCounter = document.querySelector('#imageCounter .total');
  if (totalCounter) {
    totalCounter.textContent = product.images.length;
  }

  // Update page title
  document.title = `${product.title} - Harssh Doshi`;

  // Preload images
  if (product.images) {
    product.images.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Update dropdowns with API data
  updateMetalDropdown(product);
  updateSizeDropdown(product);

  // Load recommended products
  loadRecommendedProducts(product.id);
}

// Update page content with API data
function updateProductContent(product) {
  // Update metal dropdown with API data
  updateMetalDropdown(product);

  // Update size dropdown with API data
  updateSizeDropdown(product);
}

// Update metal dropdown with API data
function updateMetalDropdown(product) {
  const metalDropdown = document.getElementById('metalDropdown');
  if (!metalDropdown || !product.metal) return;

  const metals = product.metal.split(', ');
  metalDropdown.innerHTML = '';

  metals.forEach(metal => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent = metal;
    item.onclick = () => selectOption('metal', metal);
    metalDropdown.appendChild(item);
  });

  // Select first option by default
  if (metals.length > 0) {
    selectOption('metal', metals[0]);

    // Only load images for the selected metal
    updateProductImagesByMetal(product, metals[0]);
  }
}

// Update size dropdown with API data
function updateSizeDropdown(product) {
  const sizeDropdown = document.getElementById('sizeDropdown');
  const sizeDropdownContainer = sizeDropdown ? sizeDropdown.closest('.dropdown-container') : null;

  if (!sizeDropdown || !product.size || !sizeDropdownContainer) {
    if (sizeDropdownContainer) {
      sizeDropdownContainer.style.display = 'none'; // Hide if no sizes or dropdown not found
    }
    return;
  }

  const sizes = product.size.split(', ');
  sizeDropdown.innerHTML = '';

  if (sizes.length === 1 && sizes[0].trim().toLowerCase() === 'free size') {
    sizeDropdownContainer.style.display = 'none';
  } else {
    sizeDropdownContainer.style.display = 'block'; // Ensure it's visible if multiple sizes or not 'Free Size'
    sizes.forEach(size => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = size;
      item.onclick = () => selectOption('size', size);
      sizeDropdown.appendChild(item);
    });

    // Select first option by defaultx
    if (sizes.length > 0) {
      selectOption('size', sizes[0]);
    }
  }
}

function updateProductImagesByMetal(product, name) {
  // console.log("product.images:", product.images);
  // console.log("name:", name);

  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  const filteredImages = product.images.filter(imgUrl => {
    const fileName = decodeURIComponent(imgUrl.split('/').pop())
      .toLowerCase()
      .replace(/[\s\-_]+/g, '');

    return fileName.includes(normalizedName);
  });

  // If no images match, show all images as fallback
  const displayImages = filteredImages.length > 0 ? filteredImages : product.images;

  // Desktop images
  const imageContainer = document.getElementById('imageContainer');
  if (imageContainer) {
    imageContainer.innerHTML = '';
    displayImages.forEach((imageSrc, index) => {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${product.title} Image ${index + 1}`;
      img.className = 'stacked-img';
      if (index === 0) img.classList.add('active');
      img.style.cursor = 'pointer';
      img.onclick = () => showNextImage();
      imageContainer.appendChild(img);
    });

    // Reinitialize scroll navigation
    setTimeout(() => {
      if (typeof window.initializeScrollImages === 'function') {
        window.initializeScrollImages();
      }
    }, 100);
  }

  // Mobile images
  const mobileContainer = document.querySelector('.carousel-images-container');
  const dotsContainer = document.querySelector('.image-carousel .carousel-dots');

  if (mobileContainer) {
    mobileContainer.innerHTML = '';
    displayImages.forEach((imageSrc, index) => {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${product.title} Image ${index + 1}`;
      img.className = 'carousel-image';
      if (index === 0) img.classList.add('active');
      mobileContainer.appendChild(img);
    });

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      displayImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      });
    }

    // Reinitialize mobile carousel logic
    setTimeout(initializeMobileCarousel, 100);
  }

  // Update counter
  const totalCounter = document.querySelector('#imageCounter .total');
  const currentCounter = document.querySelector('#imageCounter .current');
  if (totalCounter) {
    totalCounter.textContent = displayImages.length;
  }
  if (currentCounter) {
    currentCounter.textContent = '1';
  }
}

function updateTitleSubtitle(product, metal) {
  const titleElement = document.querySelector('#product-description');
  const subtitleElement = document.getElementById('product-description-sidebar');
  console.log("subtitleElement:", subtitleElement);

  const finalVariant = product.variants.find(v => v.options.find(o => o.value === metal) && !v.title.includes(metal));

  if (titleElement) {
    titleElement.textContent = finalVariant?.title || product.title;
  }
  if (subtitleElement) {
    subtitleElement.textContent = finalVariant?.material || product.subtitle || '';
  }
}

// Update images with API data
function updateProductImages(product) {
  if (!product.images || product.images.length === 0) return;

  // Desktop images
  const desktopImages = document.querySelectorAll('#imageContainer img');
  desktopImages.forEach((img, index) => {
    if (product.images[index]) {
      img.src = product.images[index];
      img.alt = `${product.title} Image ${index + 1}`;
    }
  });

  // Mobile images
  const mobileImages = document.querySelectorAll('.image-carousel img');
  mobileImages.forEach((img, index) => {
    if (product.images[index]) {
      img.src = product.images[index];
      img.alt = `${product.title} Image ${index + 1}`;
    }
  });

  // Update counter
  const totalCounter = document.querySelector('#imageCounter .total');
  if (totalCounter) {
    totalCounter.textContent = product.images.length;
  }
}

function initializeMobileCarousel() {
  const container = document.querySelector('.carousel-images-container');
  const dots = document.querySelectorAll('.image-carousel .dot');
  const currentCounter = document.querySelector('#imageCounter .current');

  if (!container || dots.length === 0) return;

  // Sync dots and counter on scroll
  container.addEventListener('scroll', () => {
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const index = Math.round(scrollLeft / width);

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update counter
    if (currentCounter) {
      currentCounter.textContent = index + 1;
    }
  });

  // Dot click functionality
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'smooth'
      });
    });
  });
}

