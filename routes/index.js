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

module.exports = router;
