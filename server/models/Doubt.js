// server/models/Doubt.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  replyText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const doubtSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  doubtText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema], // Array of replies
});

module.exports = mongoose.model("Doubt", doubtSchema);
