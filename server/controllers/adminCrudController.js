const createAdminCrudController = (Model, label) => ({
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);

      res.status(201).json({
        success: true,
        message: `${label} created successfully`,
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${label} not found`,
        });
      }

      res.json({
        success: true,
        message: `${label} updated successfully`,
        data: item,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${label} not found`,
        });
      }

      res.json({
        success: true,
        message: `${label} deleted successfully`,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
});

module.exports = createAdminCrudController;