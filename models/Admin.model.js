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
    admin: {
      type: Boolean,
      default: true,
    },
    editor: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
