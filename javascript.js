const navLinks = document.getElementById("nav-links");
const country1Box = document.getElementById("country1");
const country2Box = document.getElementById("country2");
const chartCanvas = document.getElementById("comparisonChart");

let data = null;
let selected = [];
let chart = null;

/* FLAGS (emoji fallback) */
const flags = {
  sweden: "🇸🇪",
  norway: "🇳🇴",
  denmark: "🇩🇰",
  finland: "🇫🇮",
  iceland: "🇮🇸",
  germany: "🇩🇪",
  france: "🇫🇷",
  italy: "🇮🇹",
  spain: "🇪🇸",
  portugal: "🇵🇹",
  poland: "🇵🇱",
  netherlands: "🇳🇱",
  belgium: "🇧🇪",
  uk: "🇬🇧",
  ireland: "🇮🇪",
  greece: "🇬🇷",
  romania: "🇷🇴",
  bulgaria: "🇧🇬",
  croatia: "🇭🇷",
  slovenia: "🇸🇮",
  serbia: "🇷🇸",
  hungary: "🇭🇺",
  czechia: "🇨🇿",
  slovakia: "🇸🇰",
  ukraine: "🇺🇦",
  belarus: "🇧🇾",
};

/* REGIONS */
const regions = {
  North: ["sweden", "norway", "denmark", "finland", "iceland"],
  West: ["france", "belgium", "netherlands", "uk", "ireland"],
  Central: ["germany", "poland", "czechia", "slovakia", "hungary"],
  South: ["italy", "spain", "portugal", "greece"],
  East: [
    "romania",
    "bulgaria",
    "croatia",
    "slovenia",
    "serbia",
    "ukraine",
    "belarus",
  ],
};

/* LOAD DATA */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("data.json");
  data = await res.json();
  buildNavbar();
});

/* BUILD NAVBAR */
function buildNavbar() {
  Object.entries(regions).forEach(([region, countries]) => {
    const li = document.createElement("li");
    li.className = "region";

    li.innerHTML = `
      <span class="region-title">${region}</span>
      <div class="submenu">
        ${countries
          .filter((c) => data[c])
          .map(
            (c) =>
              `<a href="#" data-country="${c}">
                ${flags[c] || "🏳️"} ${c.toUpperCase()}
              </a>`,
          )
          .join("")}
      </div>
    `;

    navLinks.appendChild(li);
  });
}

/* CLICK HANDLER */
navLinks.addEventListener("click", (e) => {
  const regionTitle = e.target.closest(".region-title");
  const link = e.target.closest("a");

  if (regionTitle) {
    regionTitle.parentElement.classList.toggle("open");
    return;
  }

  if (link) {
    e.preventDefault();
    selectCountry(link.dataset.country);
  }
});

/* SELECT COUNTRY */
function selectCountry(country) {
  if (!data[country]) return;

  if (selected.length === 2) {
    selected = [];
    country1Box.innerHTML = `<span class="prompt">$</span> select first country`;
    country2Box.innerHTML = `<span class="prompt">$</span> select second country`;
  }

  selected.push(country);
  renderCountry(country, selected.length === 1 ? country1Box : country2Box);

  if (selected.length === 2) {
    renderChart(selected[0], selected[1]);
  }
}

/* RENDER COUNTRY INFO */
function renderCountry(country, box) {
  const info = data[country];
  const flag = flags[country] || "🏳️";

  box.innerHTML = `
    <span class="prompt">$</span> ${flag} ${country.toUpperCase()} loaded<br/>
    <img
      src="images/${country}.png"
      class="country-image"
      onerror="this.style.display='none'"
      alt="${country}"
    />
    cost_of_living: ${info.costOfLivingIndex}<br/>
    rent_index: ${info.rentIndex}<br/>
    groceries_index: ${info.groceriesIndex}<br/>
    restaurant_index: ${info.restaurantIndex}<br/>
    average_salary: €${info.averageSalary}
  `;
}

/* RENDER COMPARISON CHART */
function renderChart(c1, c2) {
  const d1 = data[c1];
  const d2 = data[c2];

  const labels = [
    "Cost of Living",
    "Rent",
    "Groceries",
    "Restaurants",
    "Salary",
  ];

  const values1 = [
    d1.costOfLivingIndex,
    d1.rentIndex,
    d1.groceriesIndex,
    d1.restaurantIndex,
    d1.averageSalary,
  ];

  const values2 = [
    d2.costOfLivingIndex,
    d2.rentIndex,
    d2.groceriesIndex,
    d2.restaurantIndex,
    d2.averageSalary,
  ];

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: c1.toUpperCase(),
          data: values1,
        },
        {
          label: c2.toUpperCase(),
          data: values2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#22c55e",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#22c55e" },
          grid: { color: "#14532d" },
        },
        y: {
          ticks: { color: "#22c55e" },
          grid: { color: "#14532d" },
        },
      },
    },
  });
}
