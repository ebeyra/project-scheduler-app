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

// Log In

router.get("/login", (req, res, next) => {
  res.render("admin/login");
});

router.post("/login", (req, res, next) => {
  if (!req.body.username) {
    res.send("You did not include a username");
  } else if (!req.body.password) {
    res.send("You need a password");
  }

  Admin.findOne({ username: req.body.username })
    .then((foundAdmin) => {
      if (!foundAdmin) {
        return res.send("Incorrect username or password");
      }

      // const match = bcrypt.compareSync(req.body.password, foundAdmin.password);

      if (!(req.body.password === foundAdmin.password)) {
        return res.send("Incorrect username or password");
      }

      req.session.user = foundAdmin;
      res.render("admin/profile", { admin: req.session.user });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// If logged in, view profile, take actions

router.get("/profile", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin/profile");
});

// View all employees

router.get("/view-all", isLoggedIn, isAdmin, (req, res, next) => {
  Employee.find().then((results) => {
    res.render("admin/view-all", { roster: results });
  });
});

// Create employee

router.get("/create-employee", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin/create-employee");
});

router.post("/create-employee", isLoggedIn, isAdmin, (req, res, next) => {
  if (!req.body.username) {
    return res.send("You must enter a username");
  } else if (!req.body.password) {
    return res.send("You must enter a password");
  } else if (!req.body.fullName) {
    return res.send("You must enter a full name");
  } else if (!req.body.employeeID) {
    return res.send("You must enter an employee ID");
  } else if (!req.body.hireDate) {
    return res.send("You must enter a hire date");
  } else if (req.body.role === "Role") {
    return res.send("You must specify a role");
  } else if (req.body.status === "Status") {
    return res.send("You must specify a status");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  Employee.create({
    username: req.body.username,
    password: req.body.password,
    fullName: req.body.fullName,
    admin: req.body.admin,
    editor: req.body.editor,
    employeeID: req.body.employeeID,
    hireDate: req.body.hireDate,
    role: req.body.role,
    status: req.body.status,
  })
    .then((newEmployee) => {
      console.log("Employee created", newEmployee);
      res.redirect("/admin/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// View single employee

router.get("/:id", isLoggedIn, isAdmin, (req, res, next) => {
  Employee.findById(req.params.id)
    .then((results) => {
      res.render("admin/employee-details", { employee: results });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit employee

// router.get("/edit-employee", isAdmin, isLoggedIn, (req, res, next) => {
//   res.render("admin/edit-employee");
// });

// router.post("/edit-employee", isAdmin, isLoggedIn, (req, res, next) => {

// })

module.exports = router;
