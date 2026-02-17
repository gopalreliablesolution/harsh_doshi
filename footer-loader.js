// footer-loader.js
// Fetches the central footer fragment and injects it into pages' footer area
document.addEventListener('DOMContentLoaded', () => {
  const fragPath = 'footer-fragment.html';
  fetch(fragPath)
    .then(resp => {
      if (!resp.ok) throw new Error('Failed to load footer fragment');
      return resp.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fragment = doc.body.firstElementChild;
      if (!fragment) return;

      const existingFooter = document.querySelector('.site-footer');
      if (existingFooter) {
        existingFooter.replaceWith(fragment.cloneNode(true));
      } else {
        document.body.appendChild(fragment.cloneNode(true));
      }

      // Integration with location-popup.js
      if (window.attachLocationPopupListeners) {
        window.attachLocationPopupListeners();
      }
      if (window.updateLocationFooter) {
        window.updateLocationFooter();
      }
    })
    .catch(err => console.error('Footer loader:', err));
});
