const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { title, description, date, capacity } = req.body;
  // console.log("Received data from client:", req.body);
  if (!title || !description || !date || !capacity) {
    return res
      .status(400)
      .json({
        message: "All fields (title, description, date, capacity) are required",
      });
  }
  if (isNaN(capacity) || capacity < 1) {
    return res
      .status(400)
      .json({ message: "Capacity must be a positive number" });
  }
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD" });
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const event = new Event({
    title: title.trim(),
    description: description.trim(),
    organizer: req.user._id,
    date: eventDate,
    capacity: parseInt(capacity, 10),
    status: "Open",
    enrolledUsers: [],
  });
  try {
    const savedEvent = await event.save();
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate("organizer", "name")
      .populate("enrolledUsers", "name");
    res.status(201).json(populatedEvent);
  } catch (error) {
    // console.error("Error saving event:", error);
    res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name")
      .populate("enrolledUsers", "name");
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name")
      .populate("enrolledUsers", "name");
    if (!event) return res.status(404).json({ message: "Event not found" });
    const isEnrolled = event.enrolledUsers.some(
      (user) => user._id.toString() === req.user._id.toString()
    );
    const isOrganizer =
      event.organizer._id.toString() === req.user._id.toString();
    if (!isEnrolled && !isOrganizer) {
      return res.json({
        title: event.title,
        description: event.description,
        date: event.date,
        status: event.status,
        capacity: event.capacity,
        enrolledUsers: event.enrolledUsers.length, // Return count for non-enrolled
      });
    }
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
});

router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "enrolledUsers",
      "name"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    const enrolledCount = event.enrolledUsers.length;
    if (enrolledCount >= event.capacity) {
      event.status = "Full"; // Ensure status is set
      await event.save();
      return res.status(400).json({ message: "Event is full" });
    }
    if (
      event.enrolledUsers.some(
        (user) => user._id.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({ message: "Already enrolled" });
    }
    if (event.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Organizer cannot enroll" });
    }
    event.enrolledUsers.push(req.user._id);
    if (event.enrolledUsers.length >= event.capacity) {
      event.status = "Full";
    } else {
      event.status = "Open";
    }
    await event.save();
    const updatedEvent = await Event.findById(req.params.id)
      .populate("organizer", "name")
      .populate("enrolledUsers", "name");
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to enroll", error: error.message });
  }
});

module.exports = router;
