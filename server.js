require("dotenv").config();
console.log("MONGODB_URI loaded?", !!process.env.MONGODB_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();
const Submission = require("./models/Submission");

app.use(cors());
// helmet provides various security headers. disable default CSP so we can load
// external scripts/styles (Leaflet from CDN, etc.) during development.
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.static("public"));

mongoose.set("strictQuery", true);

// try to connect using helper, fall back to a local URI if missing
const startMongo = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arts-network-map";
  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000 // fail faster
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message || err);
    console.error("Continuing without DB connection — requests that need the DB may fail.");
  }
};

startMongo();

// convenience redirect for admin UI
app.get('/admin', (req, res) => {
  res.redirect('/admin.html');
});

// Create a submission
app.post("/api/submit", async (req, res) => {
  console.log("POST /api/submit body:", req.body);
  try {
    const { type, name, country, city, lat, lng, email, website, medium, affiliation, biography, disciplines, tags, description, consentPublic } = req.body;

    if (!type || !name || !country || !city || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "lat/lng must be numbers" });
    }
    // simple email validation
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(String(email).toLowerCase())) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const doc = await Submission.create({
      type,
      name,
      country,
      city,
      location: { type: "Point", coordinates: [lng, lat] },
      email,
      website: website || "",
      medium: medium || "",
      affiliation: affiliation || "",
      biography: biography || "",
      disciplines: Array.isArray(disciplines) ? disciplines : [],
      tags: Array.isArray(tags) ? tags : [],
      description: description || "",
      consentPublic: !!consentPublic,
      status: "approved"
    });

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("/api/submit error", err.stack || err);
    res.status(500).json({ error: "Server error" });
  }
});

// delete a submission by id. optionally require ADMIN_TOKEN env var to match
app.delete("/api/submit/:id", async (req, res) => {
  const id = req.params.id;
  const provided = req.query.token || req.headers['x-admin-token'];
  const secret = process.env.ADMIN_TOKEN || 'admintoken';
  if (secret && provided !== secret) {
    console.warn("Unauthorized delete attempt", {id, provided});
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const doc = await Submission.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    console.log("Deleted submission", id);
    res.json({ ok: true });
  } catch (err) {
    console.error("/api/submit delete error", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/points", async (req, res) => {
  try {
    const docs = await Submission.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(5000)
      .lean();

    const features = docs.map((d) => ({
      type: "Feature",
      geometry: d.location,
      properties: {
        id: d._id,
        type: d.type,
        name: d.name,
        country: d.country,
        city: d.city,
        website: d.website || "",
        medium: d.medium || "",
        affiliation: d.affiliation || "",
        biography: d.biography || "",
        disciplines: d.disciplines || [],
        tags: d.tags || [],
        description: d.description || ""
      }
    }));

    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error("❌ /api/points error:", err);
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

module.exports = server;