const mongoose = require("mongoose");
require("dotenv/config");
const MONGODB_URI = process.env.MONGODB_URI

// Model imports
const Admin = require("../models/Admin.model");
const Schedule = require("../models/Schedule.model");
const Employee = require("../models/Employee.model");

const adminAccount = {
  username: "admin",
  password: "admin",
  fullName: "Administrator",
  employeeID: "adm001",
  hireDate: "2022-02-13",
  privilege: "Admin"
};

// Seeding database

mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

Admin.create(adminAccount)
  .then((results) => {
    console.log("Administrator added", results);
  })
  .catch((err) => {
    console.log("Something went wrong", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
