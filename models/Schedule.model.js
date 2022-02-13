// Schedule model
const { Schema, model } = require("mongoose");

const scheduleSchema = new Schema(
  {
    type: String,
  },
  {
    timestamps: true,
  }
);

const Schedule = model("Schedule", scheduleSchema);

module.exports = Schedule;
