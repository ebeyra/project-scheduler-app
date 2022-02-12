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

// Log In

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

// Log Out

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.render("employee/logout");
});

// Profile view for creation actions

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("employee/profile");
});

// View schedule

router.get("/view-schedule", isLoggedIn, (req, res, next) => {
  res.render("employee/view-schedule");
});

// View all employees

router.get("/view-all", isLoggedIn, isEditor, (req, res, next) => {
  Employee.find().then((foundEmployees) => {
    res.render("employee/view-all", { foundEmployees });
  });
});

// Create a schedule

router.get("/create-schedule", isLoggedIn, isEditor, (req, res, next) => {
  res.render("employee/create-schedule");
});

// Create an employee account

router.get("/create-employee", isLoggedIn, isEditor, (req, res, next) => {
  res.render("employee/create-employee");
});

router.post("/create-employee", isLoggedIn, isEditor, (req, res, next) => {
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
    password: hashedPass,
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
      res.redirect("/employee/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// View details on single account

router.get("/:id", isLoggedIn, isEditor, (req, res, next) => {
  Employee.findById(req.params.id)
    .then((results) => {
      console.log("Employee found", results);
      res.render("employee/view-employee", { employee: results });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit employee details

router.get("/:id/edit-employee", isLoggedIn, isEditor, (req, res, next) => {
  Employee.findById(req.params.id).then((results) => {
    res.render("employee/edit-employee", { employee: results });
  });
});

router.post("/:id/edit-employee", isLoggedIn, isEditor, (req, res, next) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  Employee.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    password: hashedPass,
    fullName: req.body.fullName,
    admin: req.body.admin,
    editor: req.body.editor,
    employeeID: req.body.employeeID,
    hireDate: req.body.hireDate,
    role: req.body.role,
    status: req.body.status,
  })
    .then((results) => {
      console.log("Employee updated", results);
      res.redirect("/employee/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Delete employee

router.post("/:id/delete", function (req, res, next) {
  Employee.findByIdAndRemove(req.params.id)
    .then((results) => {
      console.log("The employee has been deleted", results);
      res.redirect("/employee/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
