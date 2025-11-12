// ===============================
// UrbanAware Backend - server.js
// ===============================

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // load .env

// Debug: check if MONGO_URI is loaded
console.log("MONGO_URI =", process.env.MONGO_URI);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// MongoDB Atlas Connection
// ===============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// Schema and Model
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

// 3rd argument explicitly sets your collection name
const District = mongoose.model("District", districtSchema, "October_dB");

// ===============================
// Routes
// ===============================

// Root route (test)
app.get("/", (req, res) => {
  res.send("UrbanAware API is running ✅");
});

// Get all district data
app.get("/api/districts", async (req, res) => {
  try {
    const districts = await District.find({});
    console.log("📊 Documents fetched:", districts.length);
    res.status(200).json(districts);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ message: "Server error while fetching data." });
  }
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
