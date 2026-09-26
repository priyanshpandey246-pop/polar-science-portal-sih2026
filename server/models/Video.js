const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    category: { type: String, default: "Outreach" },
    thumbnailUrl: { type: String, default: "" },
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", schema);