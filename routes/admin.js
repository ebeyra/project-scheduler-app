const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const axios = require("axios");
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

// Model imports
const Admin = require("../models/Admin.model");
const Schedule = require("../models/Schedule.model");
const Employee = require("../models/Employee.model");

// Middleware imports
const { isAdmin, isEditor, isEmployee } = require("../middleware/hasAuth");
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
        return res.send("Incorrect username");
      }
      const match = bcrypt.compareSync(req.body.password, foundAdmin.password);
      if (!match) {
        return res.send("Incorrect password");
      }
      req.session.user = foundAdmin;
      res.render("admin/profile", { admin: req.session.user });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Log Out

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.render("admin/logout");
});

// Profile view for creation actions

router.get("/profile", isLoggedIn, isAdmin, (req, res, next) => {
  // axios
  //   .request(currentWeatherInfo)
  //   .then((weatherInfo) => {
  //     let apiResponse = weatherInfo.data.data[0];
  //     let temperature = Math.floor(apiResponse.temp * (9 / 5) + 32) + "°";
  //     let weatherDesc = apiResponse.weather.description;
  //     let city = apiResponse.city_name;
  //     res.render("admin/profile", { temperature, weatherDesc, city });
  res.render("admin/profile");
});
// .catch((err) => {
//   console.log("Something went wrong", err);
// });
// });

// View schedule

router.get("/schedule/view-schedule", isLoggedIn, isAdmin, (req, res, next) => {
  Schedule.find().then((foundSchedule) => {
    res.render("admin/schedule/view-schedule", { foundSchedule });
  });
});

// View all employees

router.get("/view-all", isLoggedIn, isAdmin, (req, res, next) => {
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
      res.render("admin/view-all", {
        foundSchedule,
        managers,
        frontOfHouse,
        backOfHouse,
      });
    });
  });
});

// Create an admin account

router.get("/create-admin", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin/create-admin");
});

router.post("/create-admin", isLoggedIn, isAdmin, (req, res, next) => {
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
  } else if (req.body.privilege === "Privilege") {
    return res.send("You must specify authorization level");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  Admin.create({
    username: req.body.username,
    password: hashedPass,
    fullName: req.body.fullName,
    employeeID: req.body.employeeID,
    hireDate: req.body.hireDate,
    privilege: req.body.privilege,
  })
    .then((newAdmin) => {
      console.log("Admin created", newAdmin);
      res.redirect("/admin/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Create a schedule

router.get(
  "/schedule/create-schedule",
  isLoggedIn,
  isAdmin,
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
        res.render("admin/schedule/create-schedule", {
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
  isAdmin,
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
        res.redirect("/admin/profile");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
);

// Create an employee account

router.get("/create-employee", isLoggedIn, isAdmin, (req, res, next) => {
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
    res.render("admin/create-employee", {
      managers,
      frontOfHouse,
      backOfHouse,
    });
  });
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
  } else if (req.body.privilege === "Privilege") {
    return res.send("You must specify authorization level");
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
      res.redirect("/admin/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// View details on single account

router.get("/:id", isLoggedIn, isAdmin, (req, res, next) => {
  Employee.findById(req.params.id)
    .then((results) => {
      console.log("Employee found", results);
      res.render("admin/view-employee", { employee: results });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// View details on single schedule

router.get("/schedule/:id", isLoggedIn, isAdmin, (req, res, next) => {
  Schedule.findById(req.params.id)
    .then((staff) => {
      const d = new Date(staff.date);
      let day = d.getDay();
      let dayOfWeek = weekday[day + 1];
      res.render("admin/schedule/schedule-details", { staff, dayOfWeek });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit employee details

router.get("/:id/edit-employee", isLoggedIn, isAdmin, (req, res, next) => {
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
        console.log("Employee found", results);
        res.render("admin/edit-employee", {
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

router.post("/:id/edit-employee", isLoggedIn, isAdmin, (req, res, next) => {
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
    reportsTo: req.body.reportsTo,
  })
    .then((results) => {
      console.log("Employee updated", results);
      res.redirect("/admin/view-all");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Edit a schedule

router.get(
  "/schedule/:id/edit-schedule",
  isLoggedIn,
  isAdmin,
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
        res.render("admin/schedule/edit-schedule", {
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
  isAdmin,
  (req, res, next) => {
    Schedule.findByIdAndUpdate(req.params.id, {
      mgr: req.body.mgr,
      foh: req.body.foh,
      boh: req.body.boh,
    })
      .then((results) => {
        console.log("Schedule updated", results);
        res.redirect("/admin/schedule/view-schedule");
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
      res.redirect("/admin/view-all");
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
      res.redirect("/admin/schedule/view-schedule");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
