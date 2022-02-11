const { Schema, model } = require("mongoose");

const managerSchema = new Schema(
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
      default: "temp",
    },
    hireDate: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

const Manager = model("Manager", managerSchema);

module.exports = Manager;
