document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
      .country-popup {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      }
  
      .country-popup.active {
        display: flex;
      }
  
      .country-popup-content {
        background: #fff;
        color: #000;
        max-width: 600px;
        width: 90%;
        padding: 2.5rem 2rem;
        position: relative;
        text-align: center;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        font-family: 'Lato', sans-serif;
      }
  
      .country-popup h2 {
        margin: 0 0 1rem;
        font-size: 1.8rem;
        font-weight: 600;
      }
  
      .country-popup p {
        margin: 0 0 1.8rem;
        color: #555;
        font-size: 1.05rem;
      }
  
      .country-options {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
  
      .country-btn {
        flex: 1;
        padding: 10px 30px;
        background-color: var(--white, #fff);
        color: var(--black, #000);
        border: 1px solid var(--black, #000);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.05rem;
        font-family: "Arpona SemiBold", sans-serif;
        font-variation-settings: "wght" 400;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
        text-align: center;
      }
  
      .country-btn:hover,
      .country-btn:focus {
        background-color: #111;
        color: var(--white, #fff);
      }
  
      .country-btn:hover span,
      .country-btn:hover small,
      .country-btn:focus span,
      .country-btn:focus small {
        color: var(--white, #fff);
      }
  
      .small-note {
        font-size: 0.9rem;
        color: #777;
        margin-top: 1rem;
      }
  
      /* Mobile adjustments */
      @media (max-width: 768px) {
        .country-popup-content {
          padding: 2rem 1.5rem;
        }
      }
  
      @media (max-width: 600px) {
        .country-options {
          flex-direction: column;
        }
      }

      body.no-scroll {
        overflow: hidden;
      }
    `;
  document.head.appendChild(style);

  // 2. Inject HTML
  const popupHTML = `
      <div id="countrySelectorPopup" class="country-popup">
        <div class="country-popup-content">
          <h2>Where Would You Like to Shop?</h2>
          <p>Choose the country you’d like to continue shopping in.</p>
  
          <div class="country-options">
            <button class="country-btn" data-region="india">
              <span>India</span>
            </button>
  
            <button class="country-btn" data-region="outside_india">
              <span>Rest of the World</span>
            </button>
          </div>
  
          <p class="small-note">You can change this later in the footer</p>
        </div>
      </div>
    `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  // 3. Logic
  const popup = document.getElementById("countrySelectorPopup");
  const buttons = document.querySelectorAll(".country-btn");

  // We need to query these elements from the existing page
  const footerCountryName = document.querySelector('.footerCountryName');
  const footerCountryCurrency = document.querySelector('.footerCountryCurrency');
  // Also handle multiple instances if they exist (e.g. mobile vs desktop footer)
  const allFooterCountryNames = document.querySelectorAll('.footerCountryName');
  const allFooterCountryCurrencies = document.querySelectorAll('.footerCountryCurrency');

  const STORAGE_KEY = "user_region";

  // Function to close popup
  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  // Function to update all footer instances
  function updateFooterRegion(region) {
    // Query freshly in case footer was re-injected
    const allFooterCountryNames = document.querySelectorAll('.footerCountryName');
    const allFooterCountryCurrencies = document.querySelectorAll('.footerCountryCurrency');

    if (region === 'india') {
      allFooterCountryNames.forEach(el => el.textContent = 'INDIA');
      allFooterCountryCurrencies.forEach(el => el.textContent = '₹/EN');
      localStorage.setItem('country', 'INDIA');
      localStorage.setItem('currency', '₹');
      // Sync with country-selector.js
      localStorage.setItem('selectedCountry', 'India');
      localStorage.setItem('selectedCurrency', 'INR/₹');
    } else if (region === 'outside_india') {
      allFooterCountryNames.forEach(el => el.textContent = 'INTERNATIONAL');
      allFooterCountryCurrencies.forEach(el => el.textContent = '$/EN');
      localStorage.setItem('country', 'INTERNATIONAL');
      localStorage.setItem('currency', '$');
      // Sync with country-selector.js
      localStorage.setItem('selectedCountry', 'International');
      localStorage.setItem('selectedCurrency', 'USD/$');
    }
  }

  // Show popup only if region not selected
  if (!localStorage.getItem(STORAGE_KEY)) {
    popup.classList.add("active");
    document.body.classList.add("no-scroll");
  } else {
    // If user already selected, update footer
    updateFooterRegion(localStorage.getItem(STORAGE_KEY));
  }

  // User MUST select one option
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const region = btn.dataset.region; // india | outside_india
      localStorage.setItem(STORAGE_KEY, region);
      updateFooterRegion(region);
      closePopup();
    });
  });

  // Function to attach listeners to footer elements
  function attachFooterListeners() {
    const footerLocationSpans = document.querySelectorAll('.footer-location span, .Mobile-location');
    footerLocationSpans.forEach(span => {
      // Remove old listeners to avoid duplicates if possible, or just add new ones
      // Since we can't easily remove anonymous functions, we assume this is called only on new elements
      // But to be safe against double-clicks if called multiple times on same element:
      const newClone = span.cloneNode(true);
      span.parentNode.replaceChild(newClone, span);

      newClone.addEventListener('click', function (e) {
        // e.preventDefault(); // Prevent default if it's a link
        // Stop propagation if we want to prevent the inline onclick from firing?
        // The inline onclick in footer-fragment toggles #countrySelectorMenu
        // If we want THIS popup, we might want to stop that.
        // e.stopPropagation(); 

        // Open our popup
        popup.classList.add("active");
        document.body.classList.add("no-scroll");
      });
    });

    // Also handling the specific structure in footer-fragment which has onclick attributes
    // We can override them by finding elements with those specific onclick handlers if needed
    // For now, let's just stick to the text/span selectors
  }

  // Attach listeners initially
  attachFooterListeners();

  // Expose functions globally
  window.openLocationPopup = function () {
    popup.classList.add("active");
    document.body.classList.add("no-scroll");
  };

  window.updateLocationFooter = function () {
    const region = localStorage.getItem(STORAGE_KEY);
    if (region) {
      updateFooterRegion(region);
    }
  };

  window.attachLocationPopupListeners = attachFooterListeners;
});
