const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const resourceRoutes = require("./routes/resourceRoutes");
const authRoutes = require("./routes/authRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const eventRoutes = require("./routes/eventRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/discussion", discussionRoutes);

app.use("/api/events", eventRoutes);
app.get("/", (req, res) => {
  res.send("✅ Learning Resource Management Server is running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
