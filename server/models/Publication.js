const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: String }],
    year: { type: Number, required: true },
    abstract: { type: String, required: true },
    category: { type: String, default: "Polar Science" },
    publicationUrl: { type: String, default: "" },
    sourceName: { type: String, default: "NCPOR" },
    sourceUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publication", schema);