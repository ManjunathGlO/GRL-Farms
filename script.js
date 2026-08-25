const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  menuToggle.textContent = mobileNav.classList.contains("open") ? "×" : "☰";
});

mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  menuToggle.textContent = "☰";
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const galleryButtons = [...document.querySelectorAll("#galleryGrid button")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
let current = 0;

function openLightbox(index) {
  current = index;
  lightboxImage.src = galleryButtons[current].dataset.img;
  lightboxImage.alt = galleryButtons[current].querySelector("img").alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
function moveImage(direction) {
  current = (current + direction + galleryButtons.length) % galleryButtons.length;
  openLightbox(current);
}
galleryButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(index)));
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevImage").addEventListener("click", () => moveImage(-1));
document.getElementById("nextImage").addEventListener("click", () => moveImage(1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") moveImage(-1);
  if (e.key === "ArrowRight") moveImage(1);
});

/* =========================================
   GRL FARMS — LIVE WEATHER
   ========================================= */

const FARM_LATITUDE = 16.06747068185435;
const FARM_LONGITUDE = 75.21623844068637;

async function loadFarmWeather() {

  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const rainProbability = document.getElementById("rainProbability");
  const windSpeed = document.getElementById("windSpeed");
  const weatherUpdated = document.getElementById("weatherUpdated");

  try {

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${FARM_LATITUDE}` +
      `&longitude=${FARM_LONGITUDE}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
      `&hourly=precipitation_probability` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    /* Temperature */
    temperature.textContent =
      `${Math.round(data.current.temperature_2m)}°C`;

    /* Humidity */
    humidity.textContent =
      `${data.current.relative_humidity_2m}%`;

    /* Wind */
    windSpeed.textContent =
      `${Math.round(data.current.wind_speed_10m)} km/h`;

    // /* Rain probability */
    // const currentTime = data.current.time;

    // const hourIndex =
    //   data.hourly.time.indexOf(currentTime);

    // if (hourIndex !== -1) {

    //   const rain =
    //     data.hourly.precipitation_probability[hourIndex];

    //   rainProbability.textContent =
    //     `${rain}%`;

    // } else {

    //   rainProbability.textContent = "--%";

    // }

    // Find the closest hourly forecast to the current time
const currentTime = new Date(data.current.time).getTime();

let closestIndex = 0;
let smallestDifference = Infinity;

data.hourly.time.forEach((time, index) => {

  const forecastTime = new Date(time).getTime();

  const difference = Math.abs(
    forecastTime - currentTime
  );

  if (difference < smallestDifference) {
    smallestDifference = difference;
    closestIndex = index;
  }

});

const rain =
  data.hourly.precipitation_probability[closestIndex];

rainProbability.textContent =
  `${rain}%`;

    

    /* Last updated */
    const updated = new Date(data.current.time);

    weatherUpdated.textContent =
      `Live weather · Updated ${updated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })}`;

  } catch (error) {

    console.error("Weather error:", error);

    temperature.textContent = "--°C";
    humidity.textContent = "--%";
    rainProbability.textContent = "--%";
    windSpeed.textContent = "-- km/h";

    weatherUpdated.textContent =
      "Weather temporarily unavailable";
  }
}

/* Load weather */
loadFarmWeather();

/* Refresh every 15 minutes */
setInterval(loadFarmWeather, 15 * 60 * 1000);

/* =========================================
   ACTIVE NAVIGATION
   ========================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  ".desktop-nav > a:not(.nav-cta)"
);

window.addEventListener("scroll", () => {

  let currentSection = "";

  sections.forEach((section) => {

    const sectionTop = section.offsetTop - 180;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }

  });

  navLinks.forEach((link) => {

    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }

  });

});

