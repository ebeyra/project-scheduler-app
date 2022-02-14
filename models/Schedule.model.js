// Schedule model
const { Schema, model } = require("mongoose");

const scheduleSchema = new Schema(
  {
    mgr: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    foh: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    boh: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = model("Schedule", scheduleSchema);

module.exports = Schedule;
