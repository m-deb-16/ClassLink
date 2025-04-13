const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["video", "pdf", "link", "doc"], default: "link" },
  fileUrl: String, // or a link
  description: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // can skip groupId if not needed yet
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);
