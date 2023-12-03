function handleLocationError(error) {
    console.error(`Error getting user location: ${error.message}`);
}

function getCardinalDirection(degrees) {
    if (typeof degrees === 'number') {
        const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    } else {
        return 'Unknown';
    }
}

// Functions specific to index.html

const fetchDataBtn = document.getElementById('fetchDataBtn');

if (fetchDataBtn) {
    fetchDataBtn.addEventListener('click', () => {
        // Redirect to the weather page
        window.location.href = 'weather.html';
    });
}

// Functions specific to weather.html

const locationInfoElement = document.getElementById('locationInfo');
const mapElement = document.getElementById('map');
const weatherDataElement = document.getElementById('weatherData');

if (locationInfoElement && mapElement && weatherDataElement) {
    // Example: Fetch user's location and display map
    function fetchLocationAndDisplayMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showMap, handleLocationError);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    function showMap(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        mapElement.innerHTML = `<iframe
            width="100%"
            height="500"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            src="https://maps.google.com/maps?q=${latitude},${longitude}&output=embed">
        </iframe>`;

        // Update latitude and longitude in the locationInfo element
        document.getElementById('latitude').textContent = `Latitude: ${latitude.toFixed(6)}`;
        document.getElementById('longitude').textContent = `Longitude: ${longitude.toFixed(6)}`;

        // Show the locationInfo element
        document.getElementById('locationInfo').classList.remove('hidden');

        // Fetch weather data
        fetchWeatherData(latitude, longitude);
    }

    // Call the function to fetch location and display the map
    fetchLocationAndDisplayMap();
}

// Additional weather-related functionality goes here

// Example: Fetching weather data
function fetchWeatherData(latitude, longitude) {
    // Replace the following API key with your Weatherstack API key
    const apiKey = 'f356044ebb1fd76e30c491e112eb5093';
    const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Weatherstack API Response:", data);
            displayWeatherData(data);
        })
        .catch(error => console.error(`Error fetching weather data: ${error.message}`));
}

// Example: Displaying weather data
function displayWeatherData(data) {
    if (data && data.current) {
        const location = data.location.name;
        const temperature = data.current.temperature;
        const description = data.current.weather_descriptions[0];
        const windSpeed = data.current.wind_speed;
        const humidity = data.current.humidity;
        const pressure = data.current.pressure;
        const windDirection = getCardinalDirection(data.current.wind_degree);
        const uvIndex = data.current.uv_index;
        const timeZone = data.location.timezone_id;

        const currentDate = new Date();
        const currentTime = currentDate.toLocaleTimeString();

        weatherDataElement.innerHTML = `
            <h1 class="weather-item1">Your Weather Data</h1>
            <div class="weather-item">Location: ${location}</div>
            <div class="weather-item">Wind Speed: ${windSpeed} kmph</div>
            <div class="weather-item">Humidity: ${humidity}%</div>
            <div class="weather-item">Time Zone: ${timeZone}</div>
            <div class="weather-item">Pressure: ${pressure} hPa</div>
            <div class="weather-item">Wind Direction: ${windDirection}</div>
            <div class="weather-item">UV Index: ${uvIndex}</div>
            <div class="weather-item">Feels like: ${temperature} &deg;</div>
            <div class="weather-item">Description: ${description}</div>
            <div class="weather-item">Current Time: ${currentTime}</div>
        `;

        // Show the weather data element
        weatherDataElement.classList.remove('hidden');
    } else {
        console.error("Invalid or unexpected API response format.");
    }
}