// Admin model
const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
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
    privilege: {
      type: String,
      enum: ["Admin", "Editor", "None"],
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
