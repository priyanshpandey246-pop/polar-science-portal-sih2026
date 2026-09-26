const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, default: "" },
    expedition: { type: String, default: "" },
    date: { type: Date },
    description: { type: String, default: "" },
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", schema);