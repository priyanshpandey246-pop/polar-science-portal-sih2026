const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "Institutional" },
    images: [{ type: String }],
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", schema);