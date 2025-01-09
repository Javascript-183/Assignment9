const weatherAPIKey = "0a51e32f73d75e775c90a079def3ac86";
document
  .getElementById("getWeatherByCoordinates")
  .addEventListener("click", async () => {
    const lat = document.getElementById("latitude").value;
    const lon = document.getElementById("longitude").value;

    if (!lat || !lon) {
      alert("გთხოვთ, შეიყვანოთ გრძედი და განედი.");
      return;
    }

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=metric`;

    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      displayWeather(data, "weatherByCoordinates");
    } catch (error) {
      console.error(error);
      alert("მონაცემთა მიღება ვერ მოხერხდა. გთხოვთ, შეამოწმოთ კოორდინატები.");
    }
  });

document
  .getElementById("getWeatherByCity")
  .addEventListener("click", async () => {
    const city = document.getElementById("city").value;

    if (!city) {
      alert("გთხოვ შეიყვანეთ ქალაქის სახელი.");
      return;
    }

    const geocodeURL = `https://geocode.maps.co/search?q=${city}`;

    try {
      const geocodeResponse = await fetch(geocodeURL);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
        alert("ქალაქი ვერ მოიძებნა, გთხოვთ სცადოთ თავიდან.");
        return;
      }

      const { lat, lon } = geocodeData[0];
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=metric`;

      const weatherResponse = await fetch(weatherURL);
      const weatherData = await weatherResponse.json();
      displayWeather(weatherData, "weatherByCity");
      displayWindInfo(weatherData.wind.speed);
    } catch (error) {
      console.error(error);
      alert(
        "მონაცემების მიღება ვერ მოხერხდა. გთხოვთ, შეამოწმოთ ქალაქის სახელი."
      );
    }
  });

function displayWeather(data, elementId) {
  const weather = `მდებარეობა: ${data.name}, ტემპერატურა: ${data.main.temp}°C, ტენიანობა: ${data.weather[0].description}`;
  document.getElementById(elementId).innerText = weather;
}

function displayWindInfo(speed) {
  const windInfoDiv = document.getElementById("windInfo");
  windInfoDiv.innerHTML = `ქარის სიჩქარე: ${speed} მ/წმ<br>`;

  let image = "";
  if (speed < 20) {
    image = "../image/low-wind.png";
  } else if (speed >= 20 && speed < 40) {
    image = "../image/medium-wind.png";
  } else {
    image = "../image/high-wind.png";
  }

  windInfoDiv.innerHTML += `<img src="${image}" alt="Wind speed indicator" style="width: 100px;">`;
}
