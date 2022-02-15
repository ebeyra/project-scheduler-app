// API data
const axios = require("axios");
const weatherForecast = {
  method: "GET",
  url: "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily",
  params: { lat: "25.7617", lon: "-80.1918" },
  headers: {
    "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
    "x-rapidapi-key": "f4ba7c63e8mshd3469625cf6b591p190b6bjsned2971a08c98",
  },
};

const currentWeatherInfo = {
  method: "GET",
  url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
  params: { lon: "-80.1918", lat: "25.7617" },
  headers: {
    "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
    "x-rapidapi-key": "f4ba7c63e8mshd3469625cf6b591p190b6bjsned2971a08c98",
  },
};

function getWeather() {
  axios.request(currentWeatherInfo).then((weatherInfo) => {
    let apiResponse = weatherInfo.data.data[0];
    let temperature = Math.floor(apiResponse.temp * (9 / 5) + 32);
    let weatherDesc = apiResponse.weather.description;
    res.render("index", { temperature, weatherDesc });
  });
}

// axios
//     .request(currentWeatherInfo)
//     .then((weatherInfo) => {
//       let apiResponse = weatherInfo.data.data[0];
//       let temperature = Math.floor(apiResponse.temp * (9 / 5) + 32) + "°";
//       let weatherDesc = apiResponse.weather.description;
//       let city = apiResponse.city_name;
//       res.render("admin/login", { temperature, weatherDesc, city });
//     })
//     .catch((err) => {
//       console.log("Something went wrong", err);
//     });
// });