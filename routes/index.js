const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const axios = require("axios");
const saltRounds = 10;

// API data

const currentWeatherInfo = {
  method: "GET",
  url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
  params: { lon: "-80.1918", lat: "25.7617" },
  headers: {
    "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
    "x-rapidapi-key": "f4ba7c63e8mshd3469625cf6b591p190b6bjsned2971a08c98",
  },
};

// Model imports
const Admin = require("../models/Admin.model");
const Schedule = require("../models/Schedule.model");
const Employee = require("../models/Employee.model");

// Middleware imports
const { isAdmin, isEditor } = require("../middleware/hasAuth");
const isLoggedIn = require("../middleware/isLoggedIn");

// Free routes

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/how-to-demo", (req, res, next) => {
  res.render("how-to-demo");
});

router.get("/not-logged-in", (req, res, next) => {
  res.render("not-logged-in");
});

router.get("/access-denied", (req, res, next) => {
  res.render("access-denied");
});

router.get("/login", (req, res, next) => {
  res.render("employee/login");
});

router.post("/login", (req, res, next) => {
  if (!req.body.username) {
    res.send("You did not include a username");
  } else if (!req.body.password) {
    res.send("You need a password");
  }
  Employee.findOne({ username: req.body.username }).then((foundEmployee) => {
    if (!foundEmployee) {
      return res.send("Incorrect username");
    }
    const match = bcrypt.compareSync(req.body.password, foundEmployee.password);
    if (!match) {
      return res.send("Incorrect password");
    }
    // axios
    //   .request(currentWeatherInfo)
    //   .then((weatherInfo) => {
    //     let apiResponse = weatherInfo.data.data[0];
    //     let temperature = Math.floor(apiResponse.temp * (9 / 5) + 32) + "°";
    //     let weatherDesc = apiResponse.weather.description;
    //     let city = apiResponse.city_name;
    //     req.app.locals.temperature = temperature;
    //     req.app.locals.city = city;
    //     req.app.locals.weatherDesc = weatherDesc;
    req.session.user = foundEmployee;
    req.app.locals.globalUser = foundEmployee;
    res.render("employee/profile", { employee: req.session.user });
    //     res.render("employee/profile", { temperature, weatherDesc, city });
    //   })
    //   .catch((err) => {
    //     console.log("Something went wrong", err);
    //   });
  });
});

module.exports = router;
