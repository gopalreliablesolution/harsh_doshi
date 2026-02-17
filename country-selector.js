// country-selector.js
function selectMobileCountry(country, symbol) {
  const menu = document.getElementById("countrySelectorMenu");
  if (menu) menu.classList.remove("active");
  document.body.classList.remove("country-selector-active");
  updateFooterCountry(country);
  updateFooterCurrency(symbol);
}

const COUNTRY_DATA = [
  {
    region: "Americas",
    countries: [{ name: "USA", symbol: "USD/$", phoneCode: "+1" }],
  },
  {
    region: "Europe",
    countries: [
      { name: "Belgium", symbol: "EUR/€", phoneCode: "+32" },
      { name: "Denmark", symbol: "EUR/€", phoneCode: "+45" },
      { name: "France", symbol: "EUR/€", phoneCode: "+33" },
      { name: "Germany", symbol: "EUR/€", phoneCode: "+49" },
      { name: "Italy", symbol: "EUR/€", phoneCode: "+39" },
      { name: "Luxemburg", symbol: "EUR/€", phoneCode: "+352" },
      { name: "Netherlands", symbol: "EUR/€", phoneCode: "+31" },
      { name: "Monaco", symbol: "EUR/€", phoneCode: "+377" },
      { name: "Spain", symbol: "EUR/€", phoneCode: "+34" },
      { name: "Switzerland", symbol: "CHF/CHF", phoneCode: "+41" },
      { name: "UK", symbol: "GBP/£", phoneCode: "+44" },
    ],
  },
  {
    region: "Asia",
    countries: [
      // { name: "China", symbol: "CNY/¥" },
      // { name: "Hong Kong Sar. China", symbol: "HKD/$" },
      { name: "Japan", symbol: "JPY/¥", phoneCode: "+81" },
      { name: "Singapore", symbol: "SGD/$", phoneCode: "+65" },
      // { name: "South Korea", symbol: "KRW/₩" },
      { name: "Taiwan, China", symbol: "TWD/$", phoneCode: "+886" },
      // { name: "Thailand", symbol: "THB/฿" },
      { name: "India", symbol: "INR/₹", phoneCode: "+91" },
    ],
  },
  {
    region: "Middle East",
    countries: [{ name: "United Arab Emirates", symbol: "AED/د.إ", phoneCode: "+971" }],
  },
  // {
  //     region: "Oceania",
  //     countries: [
  //         { name: "Australia", symbol: "AUD/$" }
  //     ]
  // }
];

function renderCountries(regionData) {
  const countriesContainer = document.getElementById("countries");
  if (!countriesContainer) return;

  if (!regionData || !regionData.countries.length) {
    countriesContainer.innerHTML =
      '<p style="color:#999; font-style:italic;">No stores available</p>';
    return;
  }

  countriesContainer.innerHTML = `
      <div class="countries-grid">
        ${regionData.countries
          .map(
            (c) => `
          <a href="#" class="country-item" data-country="${c.name}">
            <span class="country-name">${c.name}</span>
            <span class="currency">${c.symbol}</span>
          </a>
        `
          )
          .join("")}
      </div>
    `;
}

function renderDesktopCountrySelector() {
  const continentsContainer = document.getElementById("continents");
  const countriesContainer = document.getElementById("countries");
  if (!continentsContainer || !countriesContainer) return;

  let continentsHTML = "";
  let activeRegion = COUNTRY_DATA.find((r) => r.region === "Americas"); // Default

  // Render all regions in left column
  COUNTRY_DATA.forEach((regionData) => {
    const regionSlug = regionData.region.toLowerCase().replace(/\s+/g, "-");
    const isActive = regionData.region === "Americas";

    continentsHTML += `
      <div class="continent-item ${isActive ? "active" : ""}" 
          data-region="${regionSlug}">
        <span class="continent-name">${regionData.region}</span>
        <span class="continent-arrow">${isActive ? ">" : ">"}</span>
      </div>
    `;
  });

  continentsContainer.innerHTML = continentsHTML;

  renderCountries(activeRegion);

  // Click handler: Switch region
  continentsContainer.addEventListener("click", function (e) {
    const continentItem = e.target.closest(".continent-item");
    if (!continentItem) return;

    const regionSlug = continentItem.dataset.region;
    const selectedRegion = COUNTRY_DATA.find(
      (r) => r.region.toLowerCase().replace(/\s+/g, "-") === regionSlug
    );

    if (!selectedRegion) return;

    // Update active state in left column
    continentsContainer.querySelectorAll(".continent-item").forEach((item) => {
      item.classList.remove("active");
      const nameSpan = item.querySelector(".continent-name");
      if (nameSpan) {
        nameSpan.style.borderBottom = "";
      }
      // item.querySelector('.continent-arrow').textContent = '>';
    });

    const clickedNameSpan = continentItem.querySelector(".continent-name");
    if (clickedNameSpan) {
      clickedNameSpan.style.borderBottom = "1.5px solid #000";
      clickedNameSpan.style.paddingBottom = "4px";
    }

    continentItem.classList.add("active");
    // continentItem.querySelector('.continent-arrow').textContent = '−';

    // Render countries on the right
    renderCountries(selectedRegion);
  });

  // Country selection
  countriesContainer.addEventListener("click", function (e) {
    const countryLink = e.target.closest(".country-item");
    if (!countryLink) return;

    e.preventDefault();
    const country = countryLink.querySelector(".country-name").textContent;
    const currency = countryLink.querySelector(".currency").textContent;

    document.getElementById("countrySelectorMenu").classList.remove("active");
    document.body.classList.remove("country-selector-active");
    
    updateFooterCountry(country);
    updateFooterCurrency(currency);
    
    // Reload products with new region
    if (typeof fetchProducts === 'function') {
      fetchProducts().then(() => {
        // Refresh product displays if on shop or product page
        if (typeof filterAndSortProducts === 'function') {
          filterAndSortProducts();
        }
        if (typeof loadProductData === 'function') {
          loadProductData();
        }
      });
    }
  });
}

function renderCountrySelectors() {
  const mobileContainer = document.getElementById("countryAccordionContainer");

  if (mobileContainer) {
    let mobileHTML = "";

    COUNTRY_DATA.forEach((regionData) => {
      const regionId = regionData.region.toLowerCase().replace(/\s+/g, "-");
      mobileHTML += `
        <div class="accordion-item">
          <button class="accordion-header" data-region="${regionId}">
            <span class="region-name">${regionData.region}</span>
            <span class="accordion-icon">+</span>
          </button>
          <div class="accordion-content">
            <ul>
              ${regionData.countries
                .map((c) => {
                  // Properly escape single quotes and special chars for inline JS
                  const escapedName = c.name.replace(/'/g, "\\'");
                  const escapedSymbol = c.symbol.replace(/'/g, "\\'");
                  return `
                <li class="country-item">
                  <a href="#" class="country-link" 
                     data-country="${c.name}" 
                     data-symbol="${c.symbol}"
                     onclick="selectMobileCountry('${escapedName}', '${escapedSymbol}'); return false;">
                    <img style="height: 1.25rem; width: 1.25rem;" src="assets/cart.png" alt="Cart Icon">
                    <span class="country-name">${c.name}</span> 
                    <span class="currency-symbol" style="padding-left: 0;">${c.symbol}</span>
                  </a>
                </li>
              `;
                })
                .join("")}
            </ul>
          </div>
        </div>
      `;
    });

    mobileContainer.innerHTML = mobileHTML;

    mobileContainer.querySelectorAll(".accordion-header").forEach((header) => {
      header.addEventListener("click", function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector(".accordion-icon");
        const isOpen = content.style.maxHeight;

        mobileContainer.querySelectorAll(".accordion-content").forEach((c) => {
          if (c !== content) {
            c.style.maxHeight = null;
            c.previousElementSibling.querySelector(
              ".accordion-icon"
            ).textContent = "+";
          }
        });

        if (isOpen) {
          content.style.maxHeight = null;
          icon.textContent = "+";
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
          icon.textContent = "−";
        }
      });
    });
  }

  // Optional: fallback event delegation (safer than inline onclick)
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".country-link");
    if (!link) return;

    e.preventDefault();
    const countryName =
      link.dataset.country || link.querySelector(".country-name")?.textContent;
    const currency =
      link.dataset.symbol ||
      link.querySelector(".currency")?.textContent ||
      "USD/$";

    const menu = document.getElementById("countrySelectorMenu");
    if (menu) menu.classList.remove("active");

    updateFooterCountry(countryName);
    updateFooterCurrency(currency);
    
    // Reload products with new region
    if (typeof fetchProducts === 'function') {
      fetchProducts().then(() => {
        // Refresh product displays if on shop or product page
        if (typeof filterAndSortProducts === 'function') {
          filterAndSortProducts();
        }
        if (typeof loadProductData === 'function') {
          loadProductData();
        }
      });
    }
  });
}

// Global helper function for inline onclick (safe now)
function selectMobileCountry(country, symbol) {
  const menu = document.getElementById("countrySelectorMenu");
  if (menu) menu.classList.remove("active");
  document.body.classList.remove("country-selector-active");

  updateFooterCountry(country);
  updateFooterCurrency(symbol);
  
  // Reload products with new region
  if (typeof fetchProducts === 'function') {
    fetchProducts().then(() => {
      // Refresh product displays if on shop or product page
      if (typeof filterAndSortProducts === 'function') {
        filterAndSortProducts();
      }
      if (typeof loadProductData === 'function') {
        loadProductData();
      }
    });
  }
}

// Initialize immediately if DOM is ready, or wait
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderDesktopCountrySelector();
    renderCountrySelectors();
  });
} else {
  renderDesktopCountrySelector();
  renderCountrySelectors();
}

// --------- Dynamic Footer Update & Geolocation ---------
function updateFooterCountry(name) {
  if (!name) return;
  localStorage.setItem("selectedCountry", name);
  document.querySelectorAll(".footerCountryName").forEach((el) => {
    el.textContent = name;
  });
  window.dispatchEvent(new CustomEvent("country-changed", { detail: { country: name } }));
}

function updateFooterCurrency(symbol) {
  const currency = symbol ?? "USD/$";
  localStorage.setItem("selectedCurrency", currency);
  document.querySelectorAll(".footerCountryCurrency").forEach((el) => {
    el.textContent = currency;
  });
}

// Initialize geolocation - DISABLED to rely only on user selection from popup
// Users must manually select country from footer popup
function initGeolocation() {
  // Check if user already selected a country from popup
  const savedCountry = localStorage.getItem('selectedCountry');
  const savedCurrency = localStorage.getItem('selectedCurrency');

  if (savedCountry && savedCurrency) {
    updateFooterCountry(savedCountry);
    updateFooterCurrency(savedCurrency);
    return; // Use saved selection, don't auto-detect
  }

  // Default to India if no selection made
  const defaultRegion = COUNTRY_DATA.find((r) => r.region === "Asia");
  if (defaultRegion) {
    const defaultCountry = defaultRegion.countries.find((c) => c.name === "India");
    if (defaultCountry) {
      updateFooterCountry(defaultCountry.name);
      updateFooterCurrency(defaultCountry.symbol || "INR/₹");
    }
  }
}

function updateSelectorUI(regionData) {
  const continentsContainer = document.getElementById("continents");
  if (!continentsContainer) return;

  continentsContainer.querySelectorAll(".continent-item").forEach((item) => {
    item.classList.remove("active");
    const nameSpan = item.querySelector(".continent-name");
    if (nameSpan) {
      nameSpan.style.borderBottom = "";
    }
  });

  const regionSlug = regionData.region.toLowerCase().replace(/\s+/g, "-");
  const activeContinentItem = continentsContainer.querySelector(
    `[data-region="${regionSlug}"]`
  );
  if (activeContinentItem) {
    activeContinentItem.classList.add("active");
    const clickedNameSpan =
      activeContinentItem.querySelector(".continent-name");
    if (clickedNameSpan) {
      clickedNameSpan.style.borderBottom = "1.5px solid #000";
      clickedNameSpan.style.paddingBottom = "4px";
    }
  }
}

function handleGeolocationFallback() {
  // Default to India
  const defaultRegion = COUNTRY_DATA.find((r) => r.region === "Asia");
  if (defaultRegion) {
    const defaultCountry = defaultRegion.countries.find((c) => c.name === "India");
    if (defaultCountry) {
      updateFooterCountry(defaultCountry.name);
      updateFooterCurrency(defaultCountry.symbol || "INR/₹");
    }
  }
}

// Initialize on page load - set default to India
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initGeolocation();
  });
} else {
  initGeolocation();
}
