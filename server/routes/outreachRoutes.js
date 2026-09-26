const express = require("express");

const {
  generateOutreach,
  updateOutreach,
  changeStatus,
  getOutreach,
} = require("../controllers/outreachController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getOutreach);

router.post(
  "/generate",
  generateOutreach
);

router.put(
  "/:id",
  updateOutreach
);

router.patch(
  "/:id/status",
  changeStatus
);

module.exports = router;