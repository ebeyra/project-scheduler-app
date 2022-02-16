const session = require("express-session");
const MongoStore = require("connect-mongo");

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "project-scheduler-app";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 6000000,
      // secure: true,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/lab-express-rooms-with-views",
      ttl: 6000000,
    }),
  })
);

const index = require("./routes/index");
app.use("/", index);

const admin = require("./routes/admin");
app.use("/admin", admin);

const employee = require("./routes/employee");
app.use("/employee", employee);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
