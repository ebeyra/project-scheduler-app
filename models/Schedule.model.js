// Schedule model
const { Schema, model } = require("mongoose");

const scheduleSchema = new Schema({
  date: {
    type: String,
    default: "Date",
    unique: true,
  },
  mgr: [String],
  foh: [String],
  boh: [String],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const Schedule = model("Schedule", scheduleSchema);

module.exports = Schedule;
