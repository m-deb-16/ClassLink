const express = require("express");
const Resource = require("../models/Resource");
const upload = require("../middleware/upload");
const router = express.Router();

// Upload resource

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const { title, type, description, tags, createdBy } = req.body;
      const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  
      const resource = await Resource.create({
        title,
        type,
        fileUrl,
        description,
        tags: JSON.parse(tags),
        createdBy,
      });

      const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim())));
    formData.append("createdBy", user._id); // or whatever user data you have
    formData.append("file", file);
  
      res.status(201).json(resource);
    } catch (err) {
      res.status(500).json({ error: "File upload failed" });
    }
  });

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

module.exports = router;
