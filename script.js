const UPDATE_INTERVAL = 60000; // 1 minute in milliseconds
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your OpenWeatherMap API key
const CITY = 'Pelmadulla,LK';

async function getWeatherData() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Weather API Response:", data); // Debugging log
        updateWeatherUI(data);
        updateWeatherAnimation(data.weather[0]?.main || "");
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById('error-message').style.display = 'block';
    }
}

function updateWeatherUI(data) {
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    document.getElementById('condition').textContent = data.weather[0].main;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weather-icon').innerHTML = 
        `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

    // Update last update time
    const now = new Date();
    document.getElementById('last-update').textContent = now.toLocaleTimeString();
}

function updateWeatherAnimation(weatherCondition) {
    const rainContainer = document.getElementById('rainContainer');
    const cloudContainer = document.getElementById('cloudContainer');
    const sunContainer = document.getElementById('sunContainer');

    if (!rainContainer || !cloudContainer || !sunContainer) return;

    rainContainer.style.display = 'none';
    cloudContainer.style.display = 'none';
    sunContainer.style.display = 'none';

    if (weatherCondition.toLowerCase().includes('rain')) {
        rainContainer.style.display = 'block';
        cloudContainer.style.display = 'block';
    } else if (weatherCondition.toLowerCase().includes('cloud')) {
        cloudContainer.style.display = 'block';
    } else if (weatherCondition.toLowerCase().includes('clear') || weatherCondition.toLowerCase().includes('sunny')) {
        sunContainer.style.display = 'block';
    }
}

// Clock Update
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours() % 12 || 12).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Initial Setup
updateClock();
setInterval(updateClock, 1000);
getWeatherData();
setInterval(getWeatherData, UPDATE_INTERVAL);
