const apiKey = "39c6f0ed474873c6fcaffada66148daa";
const FetchbuttonRef = document.getElementById("button");
const latilongiRef = document.querySelector("#text3");
const detail = document.getElementById("box");
const MapBoxRef = document.getElementById("MapBox");

function latitude_Longitude(latitude, longitude) {
  latilongiRef.innerHTML = `<span id="latgap" class="location-info-item">Lat: ${latitude.toFixed(6)}</span> <span id="longgap" class="location-info-item">Long: ${longitude.toFixed(6)}</span>`;
  MapBoxRef.src = `https://maps.google.com/maps?q=${latitude}, ${longitude}&output=embed`;
}

async function currentWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    DisplayData(result);
  } catch (error) {
    console.log(error);
    alert("Check Console for Error");
  }
}

function DisplayData(result) {
  const locationName = result.name;
  const speed = Math.round(result.wind.speed * 3.6);
  const humidity = result.main.humidity;
  const time = secondsToTimeZoneString(result.timezone);
  const pressure = Math.round(result.main.pressure / 1013.25);
  const direction = degreeToDirection(result.wind.deg);
  const temp = Math.round(result.main.temp - 273.15);
  detail.innerHTML = `<div id="data">
  <p>Location: ${locationName}</p>
</div>
<div id="data">
  <p>Wind Speed: ${speed}kmph</p>
</div>
<div id="data">
  <p>Humidity : ${humidity}</p>
</div>
<div id="data">
  <p>Time Zone : GMT ${time.sign}${time.hours}:${time.minutes}</p>
</div>
<div id="data">
  <p>Pressure: ${ pressure} Bar</p>
</div>
<div id="data">
  <p>Wind Direction : ${direction}</p>
</div>
<div id="data">
  <p>UV Index : ${500}</p>
</div>
<div id="data">
  <p>Feels like: ${temp}</p>
</div>`;
}

function secondsToTimeZoneString(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const sign = hours >= 0 ? '+' : '-';
  return {sign, hours: Math.abs(hours), minutes, seconds: remainingSeconds };
}

function degreeToDirection(degree) {
  if (degree >= 337.5 || degree < 22.5) {
    return "North";
  } else if (degree >= 22.5 && degree < 67.5) {
    return "North East";
  } else if (degree >= 67.5 && degree < 112.5) {
    return "East";
  } else if (degree >= 112.5 && degree < 157.5) {
    return "South East";
  } else if (degree >= 157.5 && degree < 202.5) {
    return "South";
  } else if (degree >= 202.5 && degree < 247.5) {
    return "South West";
  } else if (degree >= 247.5 && degree < 292.5) {
    return "West";
  } else {
    return "North West";
  }
}

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      latitude_Longitude(latitude, longitude);
      currentWeather(latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported in this browser.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const FetchbuttonRef = document.getElementById("button");
  if (FetchbuttonRef) {
    FetchbuttonRef.addEventListener("click", () => {
      window.location.href = "weather.html";
    });
  }
  getLocation();
});
