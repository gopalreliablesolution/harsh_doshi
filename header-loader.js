// header-loader.js
// Fetches the central header fragment and injects it into pages' .site-header
document.addEventListener('DOMContentLoaded', () => {
  const fragPath = 'header-fragment.html';
  fetch(fragPath)
    .then(resp => {
      if (!resp.ok) throw new Error('Failed to load header fragment');
      return resp.text();
    })
    .then(html => {
      // Insert or replace existing sticky-layout inside .site-header
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const siteHeader = document.querySelector('.site-header');
      if (!siteHeader) return;

      // Clear existing sticky layout if present to avoid duplicates
      const existingSticky = siteHeader.querySelector('.sticky-layout');
      if (existingSticky) existingSticky.remove();

      const existingCountryMenu = siteHeader.querySelector('#countrySelectorMenu');
      if (existingCountryMenu) existingCountryMenu.remove();

      // Append all children from fragment
      // Note: doc.body.children is a live collection, so we convert to array or use while loop
      while (doc.body.firstChild) {
        siteHeader.appendChild(doc.body.firstChild);
      }

      // After injection, re-run shopping bag update if available
      if (typeof updateShoppingBag === 'function') {
        updateShoppingBag();
      }

      // Update auth links based on login status
      updateAuthLinks();

      // Load country-selector.js dynamically
      const script = document.createElement('script');
      script.src = 'country-selector.js';
      document.body.appendChild(script);
    })
    .catch(err => {
      // Fail silently but log for debugging
      console.error('Header loader:', err);
    });
});


// Update authentication links in header
function updateAuthLinks() {
  if (typeof CustomerAuth === 'undefined') return;

  const accountLink = document.getElementById('accountLink');
  const loginLink = document.getElementById('loginLink');

  const mobileAccountLink = document.getElementById('mobileAccountLink');
  const mobileLoginLink = document.getElementById('mobileLoginLink');
  const mobileLogoutLink = document.getElementById('mobileLogoutLink');

  if (CustomerAuth.isAuthenticated()) {
    if (accountLink) {
      accountLink.style.display = 'inline-flex';
      accountLink.href = 'account.html';
      const user = CustomerAuth.getUser();
      // Icon is now static SVG, no text update needed
    }
    if (loginLink) loginLink.style.display = 'none';

    // Mobile
    if (mobileAccountLink) mobileAccountLink.style.display = 'block';
    if (mobileLogoutLink) mobileLogoutLink.style.display = 'block';
    if (mobileLoginLink) mobileLoginLink.style.display = 'none';

  } else {
    if (accountLink) accountLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'inline-flex';

    // Mobile
    if (mobileAccountLink) mobileAccountLink.style.display = 'none';
    if (mobileLogoutLink) mobileLogoutLink.style.display = 'none';
    if (mobileLoginLink) mobileLoginLink.style.display = 'block';
  }
}

// Global logout handler
window.handleLogout = async function (event) {
  if (event) event.preventDefault();
  if (typeof CustomerAuth !== 'undefined') {
    await CustomerAuth.logout();
    window.location.href = 'login.html';
  }
};
