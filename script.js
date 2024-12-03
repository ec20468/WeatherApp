const apiKey = "4a626ac861a9ac5e5943595c545dbec9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const weatherInfoEl = document.querySelector(".feature");
const previousCardsContainer = document.getElementById("previousCards");

let previousLocations = [];

weatherInfoEl.addEventListener("pointermove", (ev) => {
  const rect = weatherInfoEl.getBoundingClientRect();
  weatherInfoEl.style.setProperty("--x", ev.clientX - rect.left);
  weatherInfoEl.style.setProperty("--y", ev.clientY - rect.top);
});

weatherInfoEl.addEventListener("pointerenter", () => {
  weatherInfoEl.style.setProperty("--x", "0");
  weatherInfoEl.style.setProperty("--y", "0");
});

weatherInfoEl.addEventListener("pointerleave", () => {
  weatherInfoEl.style.setProperty("--x", "0");
  weatherInfoEl.style.setProperty("--y", "0");
});

async function fetchWeather(location) {
  const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Location Not Found");
    }
    const data = await response.json();

    locationElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;

    const countryCode = data.sys.country;
    fetchCountryFlag(countryCode);

    addPreviousLocation(data);
  } catch (error) {
    console.error("Error fetching weather data: ", error);
  }
}

function fetchCountryFlag(countryCode) {
  const flagUrl = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
  document.getElementById("flag").src = flagUrl;
}

searchButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeather(location);
  } else {
    alert("Please enter a valid city name.");
  }
});

function addPreviousLocation(data) {
  if (!previousLocations.some((loc) => loc.name === data.name)) {
    previousLocations.push(data);
    displayPreviousLocations();
  }
}

window.onload = () => {
  fetchWeather("London");
};

function displayPreviousLocations() {
  previousCardsContainer.innerHTML = "";

  previousLocations.forEach((location) => {
    const card = document.createElement("div");
    card.classList.add("feature");

    card.innerHTML = `
      <img src="https://flagcdn.com/48x36/${location.sys.country.toLowerCase()}.png" alt="Flag">
      <h3>${location.name}</h3>
      <p>${Math.round(location.main.temp)}°C</p>
      <p>${location.weather[0].description}</p>
    `;

    card.addEventListener("pointermove", (ev) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", ev.clientX - rect.left);
      card.style.setProperty("--y", ev.clientY - rect.top);
    });

    card.addEventListener("pointerenter", () => {
      card.style.setProperty("--x", "0");
      card.style.setProperty("--y", "0");
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--x", "0");
      card.style.setProperty("--y", "0");
    });

    card.addEventListener("click", () => {
      locationElement.textContent = location.name;
      temperatureElement.textContent = `${Math.round(location.main.temp)}°C`;
      descriptionElement.textContent = location.weather[0].description;

      fetchCountryFlag(location.sys.country);
    });

    previousCardsContainer.appendChild(card);
  });
}
