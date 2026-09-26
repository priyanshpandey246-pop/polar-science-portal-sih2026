const mongoose = require("mongoose");

const outreachContentSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      required: true,
      enum: ["expedition", "publication", "activity"],
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    sourceTitle: {
      type: String,
      required: true,
    },

    websiteSummary: {
      type: String,
      required: true,
    },

    linkedinPost: {
      type: String,
      required: true,
    },

    instagramCaption: {
      type: String,
      required: true,
    },

    xPost: {
      type: String,
      required: true,
    },

    announcement: {
      type: String,
      required: true,
    },

    generationMode: {
      type: String,
      enum: ["gemini-grounded", "template-fallback"],
      default: "template-fallback",
    },

    status: {
      type: String,
      enum: ["draft", "approved", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OutreachContent",
  outreachContentSchema
);