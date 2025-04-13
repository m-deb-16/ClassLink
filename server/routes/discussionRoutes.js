// server/routes/discussionRoutes.js
const express = require("express");
const router = express.Router();
const Doubt = require("../models/Doubt");

// Post a new doubt
router.post("/post", async (req, res) => {
  const { studentName, doubtText } = req.body;
  try {
    const newDoubt = new Doubt({ studentName, doubtText });
    await newDoubt.save();
    res
      .status(201)
      .json({ message: "Doubt posted successfully", doubt: newDoubt });
  } catch (error) {
    res.status(500).json({ message: "Error posting doubt", error });
  }
});

// Get all doubts (sorted by createdAt, newest first)
router.get("/all", async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doubts", error });
  }
});

// Reply to a doubt
router.post("/reply/:doubtId", async (req, res) => {
  const { doubtId } = req.params;
  const { studentName, replyText } = req.body;
  try {
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }
    doubt.replies.push({ studentName, replyText });
    await doubt.save();
    res.status(200).json({ message: "Reply added successfully", doubt });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error });
  }
});

module.exports = router;
