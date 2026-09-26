const express = require("express");
const Photo = require("../models/Photo");
const createController = require("../controllers/repositoryController");

const router = express.Router();
const controller = createController(Photo, "photo");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

module.exports = router;