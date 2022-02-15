const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const saltRounds = 10;

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

  Employee.findOne({ username: req.body.username })
    .then((foundEmployee) => {
      if (!foundEmployee) {
        return res.send("Incorrect username");
      }

      const match = bcrypt.compareSync(
        req.body.password,
        foundEmployee.password
      );

      if (!match) {
        return res.send("Incorrect password");
      }

      req.session.user = foundEmployee;
      res.render("employee/profile", { employee: req.session.user });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
