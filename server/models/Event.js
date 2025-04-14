const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

eventSchema.virtual("isFull").get(function () {
  return this.enrolledUsers.length >= this.capacity;
});

eventSchema.virtual("status").get(function () {
  const now = new Date();
  if (this.date < now) return "Past";
  if (this.isFull) return "Full";
  return "Open";
});

module.exports = mongoose.model("Event", eventSchema);