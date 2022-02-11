const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    admin: true,
    editor: true,
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
