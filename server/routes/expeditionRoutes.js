const express = require("express");

const {
  getAllExpeditions,
  getExpeditionById,
  createExpedition,
  updateExpedition,
  deleteExpedition,
} = require("../controllers/expeditionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllExpeditions);
router.get("/:id", getExpeditionById);

router.post("/", protect, createExpedition);
router.put("/:id", protect, updateExpedition);
router.delete("/:id", protect, deleteExpedition);

module.exports = router;