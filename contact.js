// Toggle between Image and Form content on Desktop
function toggleContent(targetId) {
    const contentDiv = document.getElementById('contentdiv');
    const imageDiv = document.getElementById('imagediv');
    const allContent = document.querySelectorAll('.contact-content');
    const defaultImg = document.getElementById('default');

    // Show the form container, hide the big side image
    imageDiv.style.display = 'none';
    contentDiv.style.display = 'block !important';
    contentDiv.setAttribute('style', 'display: block !important');

    // Hide all forms, show the selected one
    allContent.forEach(content => content.classList.remove('active'));
    defaultImg.classList.remove('active');
    
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    // Update active state on navigation links
    document.querySelectorAll('.navigation-link').forEach(link => {
        link.classList.toggle('active', link.dataset.target === targetId);
    });
}

function populateCountryDropdowns() {
    const mobileCountrySelect = document.getElementById('mobileCountry');
    const desktopCountrySelect = document.getElementById('desktopCountry');

    if (typeof COUNTRY_DATA === 'undefined') {
        console.error('COUNTRY_DATA not found. Make sure country-selector.js is loaded.');
        return;
    }

    const countries = [];
    COUNTRY_DATA.forEach(region => {
        region.countries.forEach(country => {
            countries.push(country.name);
        });
    });

    // Sort countries alphabetically
    countries.sort();

    const optionsHTML = countries.map(country => `
        <option value="${country}">${country}</option>
    `).join('');

    if (mobileCountrySelect) {
        mobileCountrySelect.innerHTML += optionsHTML;
        mobileCountrySelect.addEventListener('change', () => populateCountryCodeDropdowns(mobileCountrySelect.value, 'mobileCountryCode'));
    }

    if (desktopCountrySelect) {
        desktopCountrySelect.innerHTML += optionsHTML;
        desktopCountrySelect.addEventListener('change', () => populateCountryCodeDropdowns(desktopCountrySelect.value, 'desktopCountryCode'));
    }
    
    // Initial population of country codes based on default/first selected country
    populateCountryCodeDropdowns(mobileCountrySelect ? mobileCountrySelect.value : '', 'mobileCountryCode');
    populateCountryCodeDropdowns(desktopCountrySelect ? desktopCountrySelect.value : '', 'desktopCountryCode');
}


function populateCountryCodeDropdowns(selectedCountry, targetId) {
    const countryCodeSelect = document.getElementById(targetId);
    if (!countryCodeSelect) return;

    countryCodeSelect.innerHTML = '<option value="">Select Code*</option>'; // Clear previous options

    if (!selectedCountry) {
        return; // No country selected, keep only "Select Code"
    }

    const countryData = COUNTRY_DATA.flatMap(region => region.countries).find(country => country.name === selectedCountry);

    if (countryData && countryData.phoneCode) {
        const option = document.createElement('option');
        option.value = countryData.phoneCode;
        option.textContent = countryData.phoneCode;
        countryCodeSelect.appendChild(option);
    }
}



// Attach event listeners to Desktop Nav Links
document.querySelectorAll('.navigation-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        toggleContent(link.dataset.target);
    });
});

let activePanel = "default"; // start with image

function toggleContent(panelId) {
  const imageDiv = document.getElementById('imagediv');
  const contentDiv = document.getElementById('contentdiv');
  const panels = document.querySelectorAll(".contact-right > div");
  const rightContainer = document.querySelector(".contact-right");

  if (activePanel === panelId || panelId === 'default') {
    // Revert to image
    if (imageDiv) imageDiv.style.setProperty('display', 'block', 'important');
    if (contentDiv) contentDiv.style.setProperty('display', 'none', 'important');
    
    panels.forEach(p => p.classList.remove("active"));
    const defaultPanel = document.getElementById("default");
    if (defaultPanel) defaultPanel.classList.add("active");
    activePanel = "default";

    if (rightContainer) {
      rightContainer.classList.remove("details-active");
      rightContainer.classList.add("image-active");
    }
    return;
  }

  // Show content, hide image
  if (imageDiv) imageDiv.style.setProperty('display', 'none', 'important');
  if (contentDiv) contentDiv.style.setProperty('display', 'flex', 'important');
  
  panels.forEach(p => p.classList.remove("active"));
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) targetPanel.classList.add("active");
  activePanel = panelId;

  if (rightContainer) {
    rightContainer.classList.remove("image-active");
    rightContainer.classList.add("details-active");
  }
}



const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

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

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  // Only apply sticky on desktop (screens wider than 1024px)
  if (window.innerWidth > 1024) {
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

// Accordion toggle for mobile submenu (OUR JAGAT only)
const jagatAccordion = document.getElementById('jagatAccordion');
const jagatAccordionBody = document.getElementById('jagatAccordionBody');

jagatAccordion.addEventListener('click', () => {
  const isOpen = jagatAccordionBody.style.display === 'flex';
  jagatAccordionBody.style.display = isOpen ? 'none' : 'flex';
  jagatAccordion.classList.toggle('active', !isOpen);
});

document.addEventListener('DOMContentLoaded', () => {
    populateCountryDropdowns();

    const forms = document.querySelectorAll('.styled-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            alert('Form submitted successfully!'); // Show alert
            form.reset(); // Optionally reset the form fields
        });
    });
});


