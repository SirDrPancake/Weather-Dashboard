var searchBarEl = document.querySelector('#searchInput');
var cityEl = document.querySelector('#city');
var temperatureEl = document.querySelector('#temperature');
var windEl = document.querySelector('#wind');
var humidityEl = document.querySelector('#humidity');
var forecastDataEl = document.querySelector('#forecastData');
var searchFormEl = document.querySelector('#search-form');


searchFormEl.addEventListener('submit', searchFormSubmitHandler);


function searchFormSubmitHandler(event) {
  event.preventDefault();

  var searchInput = searchBarEl.value.toLowerCase().trim();

  if (localStorage.getItem(searchInput)) {
    console.log('Weather data found in localStorage');
    renderWeather(searchInput);
  } else {
    console.log('Fetching weather data from the API');
    searchWeatherApi(searchInput);
  }
}


function renderWeather(searchInput) {
  var weatherResults = JSON.parse(localStorage.getItem(searchInput));

  cityEl.textContent = weatherResults.city;
  temperatureEl.textContent = 'Temp: ' + weatherResults.temperature + '° Fahrenheit';
  windEl.textContent = 'Wind: ' + weatherResults.wind + 'mph';
  humidityEl.textContent = 'Humidity: ' + weatherResults.humidity + '%';

  forecastDataEl.innerHTML = '';

  for (var i = 1; i <= 5; i++) {
    var forecastItemEl = document.createElement('p');
    forecastItemEl.textContent = 'Day ' + i + ' Forecast: ' + weatherResults.forecast[i];
    forecastDataEl.appendChild(forecastItemEl);
  }
}


function searchWeatherApi(searchInput) {
  var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  
  var apiUrl = `${weatherApiUrl}?q=${searchInput}&APPID=63fc50cdaace739209825a58b5e0b4e9&units=imperial`;

  fetch(apiUrl)
    .then(function(response) {
      if (!response.ok) {
        console.log("error");
      }
      return response.json();
    })
    .then(function(weatherInfo) {
      console.log(weatherInfo);

      var weatherDetails = {
        city: weatherInfo.city.name,
        temperature: weatherInfo.list[0].main.temp,
        wind: weatherInfo.list[0].wind.speed,
        humidity: weatherInfo.list[0].main.humidity,
        forecast: {}
      };

      for (var i = 1; i <= 5; i++) {
        weatherDetails.forecast[i] = weatherInfo.list[i].weather[0].description;
      }

      localStorage.setItem(searchInput, JSON.stringify(weatherDetails));
      renderWeather(searchInput);
    })
    .catch(function(error) {
      console.log(error);
    });
}