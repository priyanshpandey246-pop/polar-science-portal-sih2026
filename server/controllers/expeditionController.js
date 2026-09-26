const Expedition = require("../models/Expedition");

const getAllExpeditions = async (req, res) => {
  try {
    const data = await Expedition.find({}).sort({ year: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch expeditions",
    });
  }
};

const getExpeditionById = async (req, res) => {
  try {
    const data = await Expedition.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Expedition not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Invalid expedition ID",
    });
  }
};

const createExpedition = async (req, res) => {
  try {
    const expedition = await Expedition.create(req.body);

    res.status(201).json({
      success: true,
      message: "Expedition created",
      data: expedition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateExpedition = async (req, res) => {
  try {
    const expedition = await Expedition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expedition) {
      return res.status(404).json({
        success: false,
        message: "Expedition not found",
      });
    }

    res.json({
      success: true,
      message: "Expedition updated",
      data: expedition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteExpedition = async (req, res) => {
  try {
    const expedition = await Expedition.findByIdAndDelete(req.params.id);

    if (!expedition) {
      return res.status(404).json({
        success: false,
        message: "Expedition not found",
      });
    }

    res.json({
      success: true,
      message: "Expedition deleted",
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Unable to delete expedition",
    });
  }
};

module.exports = {
  getAllExpeditions,
  getExpeditionById,
  createExpedition,
  updateExpedition,
  deleteExpedition,
};