const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["artist", "curator", "institution", "gallery", "collective", "other"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },

    // GeoJSON point
    location: {
      type: { type: String, enum: ["Point"], default: "Point", required: true },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },

    email: { type: String, required: true, trim: true, lowercase: true },
    website: { type: String, trim: true, default: "" },
    medium: { type: String, trim: true, default: "" },
    affiliation: { type: String, trim: true, default: "" },
    biography: { type: String, trim: true, default: "" },
    disciplines: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    description: { type: String, trim: true, default: "" },

    consentPublic: { type: Boolean, default: false },
    status: { type: String, enum: ["approved", "pending"], default: "approved" }
  },
  { timestamps: true }
);

SubmissionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Submission", SubmissionSchema);