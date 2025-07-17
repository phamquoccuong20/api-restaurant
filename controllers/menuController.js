const menuService = require("../services/menuService");
const { HttpStatusCode } = require("axios");
const { AppError } = require("../middleware/errorHandler");

class MenuController {
  async getAll(req, res) {
    try {
      const { page, limit } = req.query;
      const menu = await menuService.getAllMenus(page, limit);
      if (!menu.data || menu.data.length === 0) {
        return res.status(401).json({ data: {}, message: "No data found" });
      }
      
      return res.status(200).json({
        status: "success",
        message: "Menu fetched successfully",
        menu,
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

      if (newMenu.status !== 201) {
        throw new AppError(newMenu.message, HttpStatusCode.BadRequest);
      }

      return res.status(HttpStatusCode.Created).json({
        status: "success",
        message: "Menu created successfully",
        data: newMenu,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
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
  };

  async searchByMenu(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ status: 400, message: 'Vui lòng nhập ký tự để tìm kiếm' });
      }
    
      const search = await menuService.searchByMenu(keyword);
    
      return res.status(200).json({ status: 200, data: search });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }

}
module.exports = new MenuController();
