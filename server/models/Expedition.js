const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    reportUrl: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expedition", schema);