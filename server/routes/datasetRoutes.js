const express = require("express");
const Dataset = require("../models/Dataset");

const createController = require("../controllers/repositoryController");
const createAdminController = require("../controllers/adminCrudController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const publicController = createController(
  Dataset,
  "dataset"
);

const adminController = createAdminController(
  Dataset,
  "Dataset"
);

router.get("/", publicController.getAll);
router.get("/:id", publicController.getOne);

router.post("/", protect, adminController.create);
router.put("/:id", protect, adminController.update);
router.delete("/:id", protect, adminController.remove);

module.exports = router;