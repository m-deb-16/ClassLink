// models/Resource.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["video", "pdf", "link", "doc", "image"],
    default: "link",
  },
  fileName: String,
  fileData: Buffer,
  fileType: String,
  description: String,
  tags: [String],
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resource", resourceSchema);
