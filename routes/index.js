const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const saltRounds = 10;

// Model imports
const Admin = require("../models/Admin.model");
const Manager = require("../models/Manager.model");
const Employee = require("../models/Employee.model");

// Middleware imports
const { isAdmin, isEditor } = require("../middleware/hasAuth");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

module.exports = router;
