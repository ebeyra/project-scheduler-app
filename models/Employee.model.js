const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    admin: Boolean,
    editor: Boolean,
    employeeID: {
      type: String,
      default: "temp"
    },
    hireDate: {
      type: String,
      default: "temp"
    },
    role: {
      type: String,
      enum: ["MGR", "FOH", "BOH"],
    },
    status: {
      type: String,
      enum: ["FT", "PT"],
    },
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
