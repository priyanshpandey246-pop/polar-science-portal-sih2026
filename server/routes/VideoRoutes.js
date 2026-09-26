const express = require("express");
const Video = require("../models/Video");
const createController = require("../controllers/repositoryController");

const router = express.Router();
const controller = createController(Video, "video");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

module.exports = router;