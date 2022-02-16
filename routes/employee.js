const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const saltRounds = 10;
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Model imports
const Admin = require("../models/Admin.model");
const Schedule = require("../models/Schedule.model");
const Employee = require("../models/Employee.model");

// Middleware imports
const { isAdmin, isEditor, isEmployee } = require("../middleware/hasAuth");
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

// Profile view after leaving the profile welcome

router.get("/profile-after", isLoggedIn, (req, res, next) => {
  res.render("employee/profile-after");
});

// View schedule

router.get("/schedule/view-schedule", isLoggedIn, (req, res, next) => {
  Schedule.find().then((foundSchedule) => {
    res.render("employee/schedule/view-schedule", { foundSchedule });
  });
});

// View all employees

router.get("/view-all", isLoggedIn, (req, res, next) => {
  Schedule.find().then((foundSchedule) => {
    Employee.find().then((foundEmployees) => {
      let managers = [];
      let frontOfHouse = [];
      let backOfHouse = [];
      for (let i = 0; i < foundEmployees.length; i++) {
        if (foundEmployees[i].role === "MGR") {
          managers.push(foundEmployees[i]);
        }
        if (foundEmployees[i].role === "FOH") {
          frontOfHouse.push(foundEmployees[i]);
        }
        if (foundEmployees[i].role === "BOH") {
          backOfHouse.push(foundEmployees[i]);
        }
      }
      res.render("employee/view-all", {
        foundSchedule,
        managers,
        frontOfHouse,
        backOfHouse,
      });
    });
  });
});

// Create a schedule

router.get(
  "/schedule/create-schedule",
  isLoggedIn,
  isEditor,
  (req, res, next) => {
    Employee.find()
      .then((foundEmployees) => {
        let managers = [];
        let frontOfHouse = [];
        let backOfHouse = [];
        for (let i = 0; i < foundEmployees.length; i++) {
          if (foundEmployees[i].role === "MGR") {
            managers.push(foundEmployees[i]);
          }
          if (foundEmployees[i].role === "FOH") {
            frontOfHouse.push(foundEmployees[i]);
          }
          if (foundEmployees[i].role === "BOH") {
            backOfHouse.push(foundEmployees[i]);
          }
        }
        res.render("employee/schedule/create-schedule", {
          managers,
          frontOfHouse,
          backOfHouse,
        });
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
);

router.post(
  "/schedule/create-schedule",
  isLoggedIn,
  isEditor,
  (req, res, next) => {
    if (!req.body.date) {
      return res.send("You must enter a date");
    } else if (!req.body.mgr) {
      return res.send("You must schedule at least one manager");
    } else if (!req.body.foh) {
      return res.send("You must schedule at least one front of house employee");
    } else if (!req.body.boh) {
      return res.send("You must schedule at least one back of house employee");
    }

    Schedule.create({
      date: req.body.date,
      mgr: req.body.mgr,
      foh: req.body.foh,
      boh: req.body.boh,
    })
      .then((newSchedule) => {
        console.log("Schedule created", newSchedule);
        res.redirect("/employee/profile");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
);

// Create an employee account

router.get("/create-employee", isLoggedIn, isEditor, (req, res, next) => {
  Employee.find().then((foundEmployees) => {
    let managers = [];
    let frontOfHouse = [];
    let backOfHouse = [];
    for (let i = 0; i < foundEmployees.length; i++) {
      if (foundEmployees[i].role === "MGR") {
        managers.push(foundEmployees[i]);
      }
      if (foundEmployees[i].role === "FOH") {
        frontOfHouse.push(foundEmployees[i]);
      }
      if (foundEmployees[i].role === "BOH") {
        backOfHouse.push(foundEmployees[i]);
      }
    }
    res.render("employee/create-employee", {
      managers,
      frontOfHouse,
      backOfHouse,
    });
  });
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
  } else if (req.body.privilege === "Privilege") {
    return res.send("You must specify authorization level");
  } else if (req.body.reportsTo === "Reports To") {
    return res.send("You must specify reporting relationship");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  Employee.create({
    username: req.body.username,
    password: hashedPass,
    fullName: req.body.fullName,
    employeeID: req.body.employeeID,
    hireDate: req.body.hireDate,
    role: req.body.role,
    status: req.body.status,
    privilege: req.body.privilege,
    reportsTo: req.body.reportsTo,
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

//View details on a single schedule

router.get("/schedule/:id", isLoggedIn, isEditor, (req, res, next) => {
  Schedule.findById(req.params.id)
    .then((staff) => {
      const d = new Date(staff.date);
      let day = d.getDay();
      let dayOfWeek = weekday[day + 1];
      res.render("employee/schedule/schedule-details", { staff, dayOfWeek });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit employee details

router.get("/:id/edit-employee", isLoggedIn, isEditor, (req, res, next) => {
  Employee.find()
    .then((foundEmployees) => {
      let managers = [];
      let frontOfHouse = [];
      let backOfHouse = [];
      for (let i = 0; i < foundEmployees.length; i++) {
        if (foundEmployees[i].role === "MGR") {
          managers.push(foundEmployees[i]);
        }
        if (foundEmployees[i].role === "FOH") {
          frontOfHouse.push(foundEmployees[i]);
        }
        if (foundEmployees[i].role === "BOH") {
          backOfHouse.push(foundEmployees[i]);
        }
      }
      Employee.findById(req.params.id).then((results) => {
        res.render("employee/edit-employee", {
          employee: results,
          managers,
          frontOfHouse,
          backOfHouse,
        });
      });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

router.post("/:id/edit-employee", isLoggedIn, isEditor, (req, res, next) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  Employee.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    password: hashedPass,
    fullName: req.body.fullName,
    employeeID: req.body.employeeID,
    hireDate: req.body.hireDate,
    role: req.body.role,
    status: req.body.status,
    privilege: req.body.privilege,
    reportsTo: req.body.reportsTo
  })
    .then((results) => {
      console.log("Employee updated", results);
      res.redirect("/employee/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit a schedule

router.get(
  "/schedule/:id/edit-schedule",
  isLoggedIn,
  isEditor,
  (req, res, next) => {
    Schedule.findById(req.params.id).then((foundSchedule) => {
      Employee.find().then((foundEmployees) => {
        let managers = [];
        let frontOfHouse = [];
        let backOfHouse = [];
        for (let i = 0; i < foundEmployees.length; i++) {
          if (foundEmployees[i].role === "MGR") {
            managers.push(foundEmployees[i]);
          }
          if (foundEmployees[i].role === "FOH") {
            frontOfHouse.push(foundEmployees[i]);
          }
          if (foundEmployees[i].role === "BOH") {
            backOfHouse.push(foundEmployees[i]);
          }
        }
        res.render("employee/schedule/edit-schedule", {
          foundSchedule,
          managers,
          frontOfHouse,
          backOfHouse,
        });
      });
    });
  }
);

router.post(
  "/schedule/:id/edit-schedule",
  isLoggedIn,
  isEditor,
  (req, res, next) => {
    Schedule.findByIdAndUpdate(req.params.id, {
      mgr: req.body.mgr,
      foh: req.body.foh,
      boh: req.body.boh,
    })
      .then((results) => {
        console.log("Schedule updated", results);
        res.redirect("/employee/schedule/view-schedule");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
);

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

// Delete Schedule

router.post("/schedule/:id/delete", function (req, res, next) {
  Schedule.findByIdAndRemove(req.params.id)
    .then((results) => {
      console.log("The schedule deleted", results);
      res.redirect("/employee/schedule/view-schedule");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
