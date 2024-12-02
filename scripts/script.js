const apiKey = 'f216c49b84ff16ec867822231d69f8af';

const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');
const intakeForm = document.getElementById('intake-form');
const intakeInput = document.getElementById('intake');
const weightInput = document.getElementById('weight');
const exerciseInput = document.getElementById('exercise');
const weatherRecommendation = document.getElementById('weather-recommendation');
const errorMessage = document.getElementById('error-message');
const resetButton = document.getElementById('reset-button');

let totalWaterIntake = 0;
let temperature = null;
let intakeClicked = false;

// Function to fetch weather based on city name
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API error.');
        }
        const data = await response.json();
        temperature = data.main.temp;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        weatherInfo.innerHTML = `
            <div class="weather-info">
                <p>Weather in <strong>${data.name}</strong></p>
                <div class="weather-details">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
                    <span class="weather-description">${description}</span>
                    <span class="weather-temp">${temperature.toFixed(1)}°C</span>
                </div>
            </div>
        `;
        cityInput.value = ''; // Clear input field
        if (intakeClicked) {
            updateWaterRecommendation();
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        weatherInfo.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

// Event listener for "Get Weather"
document.getElementById('fetch-weather').addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Function to fetch weather using geolocation
async function fetchWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Location weather data not found or API error.');
        }
        const data = await response.json();
        temperature = data.main.temp;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        weatherInfo.innerHTML = `
            <div class="weather-info">
                <p>Weather in <strong>${data.name}</strong></p>
                <div class="weather-details">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
                    <span class="weather-description">${description}</span>
                    <span class="weather-temp">${temperature.toFixed(1)}°C</span>
                </div>
            </div>
        `;
        if (intakeClicked) {
            updateWaterRecommendation();
        }
    } catch (error) {
        console.error('Error fetching weather by location:', error);
        weatherInfo.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

// Event listener for "Use My Location"
document.getElementById('use-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByLocation(lat, lon);
            },
            (error) => {
                console.error('Geolocation error:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('Permission denied. Enable location services.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Position unavailable.');
                        break;
                    case error.TIMEOUT:
                        alert('Geolocation timed out.');
                        break;
                    default:
                        alert('Unknown error occurred.');
                }
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
