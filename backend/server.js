// ===============================
// UrbanAware Backend - server.js
// ===============================

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// MongoDB Atlas Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// Schema + Model
// ===============================
const districtSchema = new mongoose.Schema({
  District: String,
  Date: String,
  Murder: Number,
  Rape: Number,
  Abduction: Number,
  Theft: Number,
  Dengue: Number,
  Malaria: Number,
  CVD: Number,
  Asthma: Number,
  COVID19: Number,
  Tuberculosis: Number,
  Latitude: Number,
  Longitude: Number,
});

const District = mongoose.model("District", districtSchema, "October_dB");

// ===============================
// API Routes
// ===============================
app.get("/api/districts", async (req, res) => {
  try {
    const districts = await District.find({});
    res.status(200).json(districts);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ message: "Server error while fetching data." });
  }
});

// Test route
app.get("/api", (req, res) => {
  res.send("UrbanAware API is running ✅");
});

// ===============================
// Serve Frontend (React Build)
// ===============================

// Public folder holds your build folder content
app.use(express.static(path.join(__dirname, "public")));

// Catch-all: send React index.html for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
