const { Schema, model } = require("mongoose");

const managerSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    fullName: String,
    employeeID: {
      type: String,
      default: "temp",
    },
    hireDate: {
      type: String,
      default: "temp",
    },
    role: {
      type: String,
      enum: ["MGR", "FOH", "BOH"],
    },
    status: {
      type: String,
      enum: ["FT", "PT"],
    },
    admin: {
      type: String,
      on: true,
    },
    editor: {
      type: String,
      on: true,
    },
  },
  {
    timestamps: true,
  }
);

const Manager = model("Manager", managerSchema);

module.exports = Manager;
