const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const country1DataContainer = document.getElementById("country1-data");
const country2DataContainer = document.getElementById("country2-data");
const exploreBtn = document.getElementById("explore-btn");
const resetBtn = document.getElementById("reset-btn");

let cachedData = null;
let selectedCountry1 = null;
let selectedCountry2 = null;

/* INIT */
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");
    cachedData = await response.json();

    loadCountryLinks();

    document.getElementById("year").textContent = new Date().getFullYear();
  } catch (error) {
    console.error("Failed to load data", error);
  }
});

/* NAV LINKS */
function loadCountryLinks() {
  const countries = Object.keys(cachedData);
  navLinks.innerHTML = "";

  countries.forEach((country) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" data-country="${country}">
      ${capitalize(country)}
    </a>`;
    navLinks.appendChild(li);
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const countryKey = link.dataset.country;

      if (!selectedCountry1) {
        selectedCountry1 = countryKey;
        renderCountry(countryKey, country1DataContainer);
      } else if (!selectedCountry2) {
        selectedCountry2 = countryKey;
        renderCountry(countryKey, country2DataContainer);
        compareCountries();
      } else {
        selectedCountry1 = countryKey;
        selectedCountry2 = null;

        renderCountry(countryKey, country1DataContainer);
        country2DataContainer.innerHTML =
          "<h3>Select a second country to compare</h3>";
      }

      navLinks.classList.remove("active");
    });
  });
}

/* RENDER */
function renderCountry(countryKey, container) {
  const data = cachedData[countryKey];

  container.innerHTML = `
    <h3>${capitalize(countryKey)}</h3>
    <p data-stat="costOfLivingIndex"><strong>Cost of Living:</strong> ${data.costOfLivingIndex}</p>
    <p data-stat="rentIndex"><strong>Rent:</strong> ${data.rentIndex}</p>
    <p data-stat="groceriesIndex"><strong>Groceries:</strong> ${data.groceriesIndex}</p>
    <p data-stat="restaurantIndex"><strong>Restaurants:</strong> ${data.restaurantIndex}</p>
    <p data-stat="averageSalary"><strong>Salary:</strong> $${data.averageSalary}</p>
  `;
}

/* COMPARE */
function compareCountries() {
  const stats = [
    "costOfLivingIndex",
    "rentIndex",
    "groceriesIndex",
    "restaurantIndex",
    "averageSalary",
  ];

  stats.forEach((stat) => {
    const v1 = cachedData[selectedCountry1][stat];
    const v2 = cachedData[selectedCountry2][stat];

    const el1 = country1DataContainer.querySelector(`[data-stat="${stat}"]`);
    const el2 = country2DataContainer.querySelector(`[data-stat="${stat}"]`);

    if (stat === "averageSalary") {
      if (v1 > v2) {
        el1.classList.add("better");
        el2.classList.add("worse");
      } else {
        el2.classList.add("better");
        el1.classList.add("worse");
      }
    } else {
      if (v1 < v2) {
        el1.classList.add("better");
        el2.classList.add("worse");
      } else {
        el2.classList.add("better");
        el1.classList.add("worse");
      }
    }
  });
}

/* RESET */
resetBtn.addEventListener("click", () => {
  selectedCountry1 = null;
  selectedCountry2 = null;

  country1DataContainer.innerHTML = "<h3>Select a country to compare</h3>";

  country2DataContainer.innerHTML =
    "<h3>Select a second country to compare</h3>";
});

/* HAMBURGER */
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

/* SCROLL */
exploreBtn.addEventListener("click", () => {
  document.querySelector(".data-section").scrollIntoView({
    behavior: "smooth",
  });
});

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
