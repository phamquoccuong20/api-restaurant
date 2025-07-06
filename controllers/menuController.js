const menuService = require("../services/menuService");
const { HttpStatusCode } = require("axios");
const { AppError } = require("../middleware/errorHandler");

class MenuController {
  async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      const menus = await menuService.getAllMenus(page, limit);
      if (!menus.data || menus.data.length === 0) {
        return res.status(204).json({ message: "No data found" }); // 204 = No Content
      }
      
      return res.status(200).json({
        status: "success",
        data: menus,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const menu = await menuService.getById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: menu,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
      });
    }
  }

  async create(req, res) {
    try {
      // link ảnh trên cloudinary
      const image_url = req.body.image_url;
      const menuData = { ...req.body, image_url };
      const newMenu = await menuService.create(menuData);

      return res.status(HttpStatusCode.Created).json({
        status: "success",
        data: newMenu,
        message: "Menu created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async update(req, res) {
    try {
      const updatedMenu = await menuService.update(req.params.id, req.body);

      if (!updatedMenu) {
        return res.status(404).json({
          status: "error",
          message: "Menu not found",
        });
      }
      return res.status(200).json(updatedMenu);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedMenu = await menuService.delete(req.params.id);
      if (!deletedMenu) {
        return res.status(404).json({
          status: "error",
          message: "Table not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Menu deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
module.exports = new MenuController();
