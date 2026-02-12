// ============================
// ELEMENTS
// ============================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const country1DataContainer = document.getElementById("country1-data");
const country2DataContainer = document.getElementById("country2-data");
const exploreBtn = document.getElementById("explore-btn");

// ============================
// CACHE
// ============================
let cachedData = null;

// Track the selected countries
let selectedCountry1 = null;
let selectedCountry2 = null;

// ============================
// SHOW LOADING STATE
// ============================
function showLoading() {
  country1DataContainer.innerHTML = `
    <div class="card loading">
      <h3>Loading...</h3>
      <p>Please wait while we fetch the latest data.</p>
    </div>
  `;
  country2DataContainer.innerHTML = `
    <div class="card loading">
      <h3>Loading...</h3>
      <p>Please wait while we fetch the latest data.</p>
    </div>
  `;
}

// ============================
// SHOW ERROR STATE
// ============================
function showError(message) {
  country1DataContainer.innerHTML = `
    <div class="card error">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
  country2DataContainer.innerHTML = `
    <div class="card error">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
}

// ============================
// RENDER COUNTRY DATA
// ============================
function renderCountryData(country, info, container) {
  const stats = [
    { label: "Cost of Living Index", value: info.costOfLivingIndex },
    { label: "Rent Index", value: info.rentIndex },
    { label: "Groceries Index", value: info.groceriesIndex },
    { label: "Restaurant Index", value: info.restaurantIndex },
    { label: "Average Salary (USD)", value: `$${info.averageSalary}` },
  ];

  container.innerHTML = `
    <div class="card">
      <h3>${capitalize(country)}</h3>
      <div class="stats">
        ${stats
          .map((s) => `<p><strong>${s.label}:</strong> ${s.value ?? "N/A"}</p>`)
          .join("")}
      </div>
    </div>
  `;
}

// ============================
// FETCH COUNTRY DATA
// ============================
async function loadCountryData(countryKey, container) {
  showLoading();

  try {
    // If cached data is not yet loaded, fetch it
    if (!cachedData) {
      const response = await fetch("data.json");
      cachedData = await response.json();
    }

    const countryInfo = cachedData[countryKey];

    if (!countryInfo) {
      showError("Country not found.");
      return;
    }

    renderCountryData(countryKey, countryInfo, container);
  } catch (error) {
    showError("Failed to load data. Please try again later.");
    console.error("Error loading JSON:", error);
  }
}

// ============================
// NAVBAR COUNTRY CLICK EVENTS
// ============================
function loadCountryLinks() {
  // Ensure country data exists before proceeding
  if (!cachedData) {
    showError("Data not loaded yet.");
    return;
  }

  const countries = Object.keys(cachedData);

  // Clear existing navbar links
  navLinks.innerHTML = "";

  countries.forEach((country) => {
    const countryLink = document.createElement("li");
    countryLink.innerHTML = `<a href="#" data-country="${country}">${capitalize(country)}</a>`;
    navLinks.appendChild(countryLink);
  });

  const countryLinks = document.querySelectorAll(".nav-links a");

  countryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links
      countryLinks.forEach((l) => l.classList.remove("active-link"));

      // Add active class to clicked link
      link.classList.add("active-link");

      const countryKey = link.dataset.country;

      // Handle country selection
      if (!selectedCountry1) {
        selectedCountry1 = countryKey;
        loadCountryData(selectedCountry1, country1DataContainer);
      } else if (!selectedCountry2) {
        selectedCountry2 = countryKey;
        loadCountryData(selectedCountry2, country2DataContainer);
      } else {
        // Reset second country if both are selected
        selectedCountry1 = countryKey;
        selectedCountry2 = null;

        loadCountryData(selectedCountry1, country1DataContainer);
        country2DataContainer.innerHTML = `
          <div class="card">
            <h3>Select a second country to compare.</h3>
          </div>
        `;
      }
    });
  });
}

// ============================
// MOBILE MENU TOGGLE
// ============================
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// ============================
// HERO BUTTON SCROLL
// ============================
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    document.querySelector(".data-section").scrollIntoView({
      behavior: "smooth",
    });
  });
}

// ============================
// AUTO LOAD DEFAULT COUNTRY
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const defaultCountry = "sweden";
  const defaultLink = document.querySelector(
    `[data-country="${defaultCountry}"]`,
  );

  if (defaultLink) {
    defaultLink.classList.add("active-link");
    loadCountryData(defaultCountry, country1DataContainer);
  }

  // Load country links once data is loaded
  if (!cachedData) {
    showLoading();
  }
  loadCountryLinks();
});

// ============================
// UTIL FUNCTIONS
// ============================
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
