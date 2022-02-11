const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    admin: false,
    editor: false,
    employeeID: "temp",
    hireDate: "temp",
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
