// Elements
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const countryLinks = document.querySelectorAll(".nav-links a");
const countryDataContainer = document.getElementById("country-data");

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Load country data
async function loadCountryData(country) {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const countryInfo = data[country];

    if (!countryInfo) {
      countryDataContainer.innerHTML = "<p>Country not found.</p>";
      return;
    }

    countryDataContainer.innerHTML = `
      <h2>${country}</h2>
      <p><strong>Cost of Living Index:</strong> ${countryInfo.costOfLivingIndex}</p>
      <p><strong>Rent Index:</strong> ${countryInfo.rentIndex}</p>
      <p><strong>Groceries Index:</strong> ${countryInfo.groceriesIndex}</p>
      <p><strong>Restaurant Index:</strong> ${countryInfo.restaurantIndex}</p>
      <p><strong>Average Salary (USD):</strong> $${countryInfo.averageSalary}</p>
    `;
  } catch (error) {
    countryDataContainer.innerHTML = "<p>Error loading data.</p>";
  }
}

// Click event for navbar links
countryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Highlight active link
    countryLinks.forEach((l) => l.classList.remove("active-link"));
    link.classList.add("active-link");

    const country = link.textContent.trim();
    loadCountryData(country);

    // Close mobile menu after click (mobile only)
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  });
});
