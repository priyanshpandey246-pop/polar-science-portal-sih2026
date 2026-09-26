const express = require("express");

const Expedition = require("../models/Expedition");
const Publication = require("../models/Publication");
const Dataset = require("../models/Dataset");
const Photo = require("../models/Photo");
const Video = require("../models/Video");
const Activity = require("../models/Activity");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.json({
        success: true,
        query: "",
        total: 0,
        results: {
          expeditions: [],
          publications: [],
          datasets: [],
          photos: [],
          videos: [],
          activities: [],
        },
      });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [
      expeditions,
      publications,
      datasets,
      photos,
      videos,
      activities,
    ] = await Promise.all([
      Expedition.find({
        published: true,
        $or: [
          { name: regex },
          { location: regex },
          { description: regex },
        ],
      }).limit(10),

      Publication.find({
        published: true,
        $or: [
          { title: regex },
          { abstract: regex },
          { category: regex },
          { authors: regex },
        ],
      }).limit(10),

      Dataset.find({
        published: true,
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
        ],
      }).limit(10),

      Photo.find({
        published: true,
        $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { expedition: regex },
        ],
      }).limit(10),

      Video.find({
        published: true,
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
        ],
      }).limit(10),

      Activity.find({
        published: true,
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
        ],
      }).limit(10),
    ]);

    const total =
      expeditions.length +
      publications.length +
      datasets.length +
      photos.length +
      videos.length +
      activities.length;

    res.json({
      success: true,
      query: q,
      total,
      results: {
        expeditions,
        publications,
        datasets,
        photos,
        videos,
        activities,
      },
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

module.exports = router;