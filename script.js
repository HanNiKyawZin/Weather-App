/* =========================================
   API CONFIGURATION
   Define endpoints and API key for OpenWeatherMap
   ========================================= */
const apiKey = '6ab9253138085fd73541b497dac484f6'; // Store your API key securely
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

/* =========================================
   DOM ELEMENTS
   Cache frequently accessed DOM elements
   ========================================= */
const cityInput = document.getElementById('city-input'); // Search input
const suggestions = document.getElementById('suggestions'); // Auto-suggest dropdown
const locateBtn = document.getElementById('locate-btn'); // Current location button
const toggle = document.getElementById('toggle'); // Dark mode toggle button
const iconMoon = document.getElementById('iconMoon'); // Moon icon
const iconSun = document.getElementById('iconSun'); // Sun icon
const toggleTempUnit = document.getElementById('toggleTempUnit'); // °C/°F toggle

/* =========================================
   APPLICATION STATE VARIABLES
   Track current unit and weather data
   ========================================= */
let isCelsius = true; // Temperature unit state
let weatherData = null; // Current weather data
let forecastData = null; // Forecast data

/* =========================================
   AUTO-SUGGEST FEATURE
   Fetch matching cities as user types
   ========================================= */
cityInput.addEventListener('input', async () => {
    const value = cityInput.value.trim();
    if (value.length < 2) return (suggestions.innerHTML = ''); // Skip short inputs

    try {
        const res = await fetch(`${geoUrl}?q=${value}&limit=5&appid=${apiKey}`);
        const cities = await res.json();

        suggestions.innerHTML = ''; // Clear previous suggestions
        cities.forEach((city) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${city.name}, ${city.country}`;

            // Click on suggestion populates input and fetches weather
            li.addEventListener('click', () => {
                cityInput.value = city.name;
                suggestions.innerHTML = '';
                fetchWeather(city.name);
            });

            suggestions.appendChild(li);
        });
    } catch {
        suggestions.innerHTML = ''; // Clear suggestions if fetch fails
    }
});

/* =========================================
   SEARCH ON ENTER KEY
   Allows user to press Enter to fetch weather
   ========================================= */
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        suggestions.innerHTML = '';
        fetchWeather(cityInput.value.trim());
    }
});

/* =========================================
   DARK MODE TOGGLE
   Switch between light and dark themes
   ========================================= */
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode'); // Toggle class

    // Update icons based on current mode
    const isDark = document.body.classList.contains('dark-mode');
    iconMoon.style.display = isDark ? 'none' : 'inline';
    iconSun.style.display = isDark ? 'inline' : 'none';
});

/* =========================================
   TEMPERATURE UNIT TOGGLE
   Switch between Celsius and Fahrenheit
   ========================================= */
toggleTempUnit.addEventListener('click', () => {
    isCelsius = !isCelsius; // Toggle unit
    toggleTempUnit.textContent = isCelsius ? '°C' : '°F';

    // Update UI if weather data is already fetched
    if (weatherData && forecastData) {
        updateTemperatureDisplay(weatherData, forecastData);
    }
});

/* =========================================
   FETCH WEATHER FUNCTION
   Get current weather + forecast data for a city
   ========================================= */
async function fetchWeather(city) {
    try {
        // Fetch current weather
        const res = await fetch(
            `${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod !== 200) return alert('City not found'); // Error handling
        weatherData = data; // Save current weather

        // Fetch forecast
        const forecastRes = await fetch(
            `${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecast = await forecastRes.json();
        forecastData = forecast;

        // Update UI
        updateTemperatureDisplay(weatherData, forecastData);
    } catch (e) {
        alert('Failed to fetch weather.');
    }
}

/* =========================================
   FETCH UV INDEX FUNCTION
   Fetch UV index for given coordinates
   ========================================= */
async function fetchUVIndex(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const uv = await res.json();

        // Determine UV condition
        let condition = 'Low';
        if (uv.value > 7) condition = 'High';
        else if (uv.value > 5) condition = 'Moderate';

        // Update UI
        document.getElementById('uv-index').textContent = uv.value;
        document.getElementById('uv-condition').textContent = condition;
    } catch {
        // Fallback if fetch fails
        document.getElementById('uv-index').textContent = '--';
        document.getElementById('uv-condition').textContent = '--';
    }
}

/* =========================================
   UPDATE TEMPERATURE DISPLAY
   Updates UI with weather and forecast data
   ========================================= */
function updateTemperatureDisplay(data, forecast) {
    // Destructure important data
    let {
        name,
        sys: { country, sunrise, sunset },
        main: { temp, feels_like, humidity },
        weather,
        wind,
        visibility,
        coord: { lat, lon },
    } = data;

    // Calculate today's min/max temperatures from forecast
    let today = new Date().toISOString().split('T')[0];
    let todayForecasts = forecast.list.filter((f) =>
        f.dt_txt.startsWith(today)
    );
    let temps = todayForecasts.map((f) => f.main.temp);
    let min = Math.min(...temps);
    let max = Math.max(...temps);

    // Convert to Fahrenheit if needed
    if (!isCelsius) {
        const convert = (c) => (c * 9) / 5 + 32;
        temp = convert(temp);
        feels_like = convert(feels_like);
        min = convert(min);
        max = convert(max);
    }

    const symbol = isCelsius ? '°C' : '°F';

    // Update DOM elements
    document.getElementById('condition').textContent = capitalizeWords(
        weather[0].description
    );
    document.getElementById('location').textContent = `${name}, ${country}`;
    document.getElementById('currentTemp').textContent = `${Math.round(
        temp
    )}${symbol}`;
    document.getElementById('feels').textContent = `Feels like ${Math.round(
        feels_like
    )}${symbol}`;
    document.getElementById('temp-range').textContent = `Min ${Math.round(
        min
    )}${symbol} / Max ${Math.round(max)}${symbol}`;
    document.getElementById('humidity').textContent = humidity + '%';
    document.getElementById('humidity-status').textContent =
        humidity > 70 ? 'High' : 'Good';
    document.getElementById('wind').textContent = wind.speed;
    document.getElementById('visibility').textContent =
        (visibility / 1000).toFixed(1) + ' km';
    document.getElementById('visibility-condition').textContent =
        visibility > 8000 ? 'Clear' : 'Low';
    document.getElementById('sunrise').textContent = new Date(
        sunrise * 1000
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = new Date(
        sunset * 1000
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Weather icon
    const iconCode = weather[0].icon;
    document.getElementById(
        'weather-icon'
    ).innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}">`;

    // Fetch UV index separately
    fetchUVIndex(lat, lon);
}

/* =========================================
   LIVE CLOCK
   Updates time and date every second
   ========================================= */
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    document.getElementById('date').textContent = now.toLocaleDateString(
        undefined,
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    );
}, 1000);

/* =========================================
   CURRENT LOCATION WEATHER
   Fetch weather using browser geolocation
   ========================================= */
locateBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
            `${weatherUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        fetchWeather(data.name); // Fetch using city name
    });
});

/* =========================================
   HIDE SUGGESTIONS WHEN CLICKING OUTSIDE
   ========================================= */
document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !suggestions.contains(e.target))
        suggestions.innerHTML = '';
});

/* =========================================
   DEFAULT CITY WEATHER
   Fetch weather for Bangkok on page load
   ========================================= */
window.addEventListener('DOMContentLoaded', () => fetchWeather('Bangkok'));

/* =========================================
   HELPER FUNCTION
   Capitalizes first letter of each word
   ========================================= */
function capitalizeWords(str) {
    return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
