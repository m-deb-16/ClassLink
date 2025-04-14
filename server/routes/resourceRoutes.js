// routes/resources.js
const express = require("express");
const Resource = require("../models/Resource");
const upload = require("../middleware/upload");

const router = express.Router();

// Upload a new resource
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, type, description, tags } = req.body;

    if (!req.file || !title || !type || !description || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const resource = await Resource.create({
      title,
      type: type.toLowerCase(),
      description,
      tags: JSON.parse(tags),
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
    });

    res.status(201).json({
      message: "Resource uploaded successfully",
      resourceId: resource._id,
      createdAt: resource.createdAt,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "File upload failed: " + err.message });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error("Error fetching resources:", err.message);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

// Serve file by resource ID
router.get("/file/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).send("File not found");

    res.set("Content-Type", resource.fileType);
    res.set("Content-Disposition", `inline; filename="${resource.fileName}"`);
    res.send(resource.fileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Failed to serve file");
  }
});

module.exports = router;
