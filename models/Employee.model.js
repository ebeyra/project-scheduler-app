// Employee model
const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
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
    reportsTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: "6206ded3e4558a8cdc273914",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
