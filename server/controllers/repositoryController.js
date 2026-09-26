const createRepositoryController = (Model, label) => ({
  getAll: async (req, res) => {
    try {
      const data = await Model.find({ published: true }).sort({
        year: -1,
        date: -1,
        createdAt: -1,
      });

      res.json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Unable to fetch ${label}`,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const data = await Model.findOne({
        _id: req.params.id,
        published: true,
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: `${label} not found`,
        });
      }

      res.json({ success: true, data });
    } catch {
      res.status(400).json({
        success: false,
        message: `Invalid ${label} ID`,
      });
    }
  },
});

module.exports = createRepositoryController;