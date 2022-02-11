const mongoose = require("mongoose");

// Model imports
const Admin = require("../models/Admin.model");
const Manager = require("../models/Manager.model");
const Employee = require("../models/Employee.model");

const adminAccount = {
  username: "master",
  password: "master",
  admin: true,
  editor: true,
};

const managerAccount = {
  username: "a.smith",
  password: "smith",
  admin: false,
  editor: true,
  employeeID: "mgr001",
  hireDate: new Date(2021, 02, 11),
  role: "MGR",
  status: "FT",
};

const employeeAccount = {
    username: "t.anderson",
    password: "anderson",
    admin: false,
    editor: false,
    employeeID: "emp001",
    hireDate: new Date(2021, 02, 11),
    role: "FOH",
    status: "FT"
};

// Seeding database

mongoose
  .connect("mongodb://localhost/project-scheduler-app")
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

Movie.create(movies)
  .then((results) => {
    console.log("Movies added", results);
  })
  .catch((err) => {
    console.log("Something went wrong", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
