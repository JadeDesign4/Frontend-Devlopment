const apiKey = "9e9c930c7265e59107c069cdc2ef4bfd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "https://openweathermap.org/img/wn/03d@2x.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "https://openweathermap.org/img/wn/01d@2x.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "https://openweathermap.org/img/wn/10d@2x.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "https://openweathermap.org/img/wn/09d@2x.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "https://openweathermap.org/img/wn/50d@2x.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
