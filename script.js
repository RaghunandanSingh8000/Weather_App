const apiKey = "8334c00541a544e60dc480dcd77a380f"; // Replace with your OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const weatherBox = document.getElementById('weatherInfo');
  const container = document.querySelector('.container');

  if (!city) {
    weatherBox.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      weatherBox.innerHTML = `<p>City not found. Please try again.</p>`;
      container.style.background = "rgba(255,255,255,0.95)"; // Reset background
      return;
    }

    const data = await response.json();
    const { name, main, weather, wind, sys } = data;

    // Unique: Weather-based background color
    const weatherMain = weather[0].main.toLowerCase();
    let bg;
    if (weatherMain.includes("cloud")) bg = "rgba(200,220,255,0.95)";
    else if (weatherMain.includes("rain")) bg = "rgba(180,200,220,0.95)";
    else if (weatherMain.includes("clear")) bg = "rgba(255,255,220,0.95)";
    else if (weatherMain.includes("snow")) bg = "rgba(240,240,255,0.95)";
    else if (weatherMain.includes("thunder")) bg = "rgba(220,210,255,0.95)";
    else bg = "rgba(255,255,255,0.95)";
    container.style.background = bg;

    // Day or night icon
    const now = Math.floor(Date.now() / 1000);
    const isDay = sys && now > sys.sunrise && now < sys.sunset;
    const sunMoonIcon = isDay
      ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"
      : "https://cdn-icons-png.flaticon.com/512/1163/1163661.png";

    // OpenWeatherMap icon
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    // Weather info with fade-in
    weatherBox.innerHTML = `
      <div class="weather-header">
        <img src="${sunMoonIcon}" alt="${isDay ? 'Sun' : 'Moon'}" class="weather-icon"/>
        <h2>${name}, ${sys.country}</h2>
      </div>
      <img src="${weatherIcon}" alt="${weather[0].description}" title="${weather[0].description}" style="width:60px;height:60px;margin:8px auto;display:block;">
      <p><strong>Temperature:</strong> ${main.temp}°C (feels like ${main.feels_like}°C)</p>
      <p><strong>Weather:</strong> ${weather[0].main} (${weather[0].description})</p>
      <p><strong>Humidity:</strong> ${main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    `;
    weatherBox.classList.remove('fadeInWeather');
    void weatherBox.offsetWidth; // trigger reflow for animation
    weatherBox.classList.add('fadeInWeather');
  } catch (error) {
    weatherBox.innerHTML = `<p>Error fetching weather data.</p>`;
    container.style.background = "rgba(255,255,255,0.95)";
    console.error(error);
  }
}