const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: Number, required: true },
    dataUrl: { type: String, default: "" },
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dataset", schema);