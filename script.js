const weatherApiKey = 'eadf47f3820b8a78b80e7688a2b0ce59';
let map;
let marker;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([0, 0]).addTo(map);

    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        console.log(`Map clicked at latitude: ${lat}, longitude: ${lng}`);
        await getWeatherByCoords(lat, lng);
    });
});

async function getWeather() {
    const location = document.getElementById('location').value;
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = 'Loading...';
    console.log(`Fetching weather for location: ${location}`);

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
        console.log(`Fetch URL: https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();
        console.log('API response:', data);
        displayWeather(data);
        updateMap(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Error:', error); 
        weatherInfo.innerHTML = error.message;
    }
}

async function getWeatherByCoords(lat, lon) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = 'Loading...';
    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
        console.log(`Fetch URL: https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();
        console.log('API response:', data);
        displayWeather(data);
        updateMap(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Error:', error); 
        weatherInfo.innerHTML = error.message;
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function updateMap(lat, lon) {
    const location = [lat, lon];
    map.setView(location, 10);
    marker.setLatLng(location);
}
