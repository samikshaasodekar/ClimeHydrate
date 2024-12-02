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

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
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
            cityInput.value = '';

            if (intakeClicked) {
                updateWaterRecommendation();
            }
        } else {
            alert('City not found!');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Unable to fetch weather data.');
    }
}

intakeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let intakeAmount = parseFloat(intakeInput.value);

    if (!isNaN(intakeAmount) && intakeAmount >= 0) {
        totalWaterIntake += intakeAmount;
        intakeClicked = true;
        intakeInput.value = '';
        updateWaterRecommendation();
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'Enter a valid water intake amount.';
    }
});

document.getElementById('fetch-weather').addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('use-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.cod === 200) {
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
                    } else {
                        alert('Location weather data not found!');
                    }
                } catch (error) {
                    console.error('Error fetching weather:', error);
                    alert('Unable to fetch weather data.');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('User denied the request for Geolocation.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        alert('The request to get user location timed out.');
                        break;
                    case error.UNKNOWN_ERROR:
                        alert('An unknown error occurred.');
                        break;
                }
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

function calculateRecommendedIntake(weight, exerciseMinutes, temperature) {
    let weightInPounds = weight * 2.20462; 
    let recommendedIntakeOunces = weightInPounds * 
    recommendedIntakeOunces += (exerciseMinutes / 30) * 12; 
    if (temperature >= 20) {
        recommendedIntakeOunces += 16; 
    }
    return recommendedIntakeOunces;
}

function updateWaterRecommendation() {
    const weight = parseFloat(weightInput.value);
    const exerciseMinutes = parseFloat(exerciseInput.value);
    const maxWeight = 635; 
    const maxExercise = 1440; 
    if (!isNaN(weight) && weight > 0 && weight <= maxWeight && !isNaN(exerciseMinutes) && exerciseMinutes >= 0 && exerciseMinutes <= maxExercise && temperature !== null) {
        const recommendedIntakeOunces = calculateRecommendedIntake(weight, exerciseMinutes, temperature);
        const recommendedIntakeMl = recommendedIntakeOunces * 29.5735; // Convert ounces to ml
        const remainingIntake = recommendedIntakeMl - totalWaterIntake;
        const bottlesNeeded = Math.ceil(Math.max(remainingIntake, 0) / 500);
        weatherRecommendation.innerHTML = remainingIntake > 0
            ? `<p>You need to drink <strong>${remainingIntake.toFixed(1)} ml</strong> (${bottlesNeeded} bottles) more today.</p>`
            : `<p>You have met your water intake goal. Great job!</p>`;
        weightInput.value = '';
        exerciseInput.value = '';
    } else {
        if (isNaN(weight) || weight <= 0 || weight > maxWeight) {
            errorMessage.textContent = `Enter a valid weight (1 - ${maxWeight} kg).`;
        } else if (isNaN(exerciseMinutes) || exerciseMinutes < 0 || exerciseMinutes > maxExercise) {
            errorMessage.textContent = `Enter a valid exercise duration (0 - ${maxExercise} minutes).`;
        } else {
            errorMessage.textContent = 'Please enter valid weight and exercise duration.';
        }
    }
}

resetButton.addEventListener('click', () => {
    location.reload();
});
