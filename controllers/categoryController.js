const categoryService = require("../services/categoryService");
const { HttpStatusCode } = require("axios");
const { AppError } = require("../middleware/errorHandler");

class CategoryController {
  async getAll(req, res) {
    try {
      const { page, limit, sort, field } = req.query;
      const category = await categoryService.getAllCategories(page, limit, sort, field);
      if (!category.data || category.data.length === 0) {
        return res.status(401).json({ data: {}, message: "No data found" });
      }

      return res.status(200).json({
        status: "success",
        message: "Category fetched successfully",
        category,
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
      });
    }
  }
  async getById(req, res) {
    try {
      const category = await categoryService.getById(req.params.id);
      return res.status(200).json(category);
    } catch (error) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newCategory = await categoryService.create(req.body);
      if (newCategory.status !== 201) {
        throw new AppError(newCategory.message, HttpStatusCode.BadRequest);
      }

      return res.status(HttpStatusCode.Created).json({
        status: "success",
        message: "Category created successfully",
        data: newCategory,
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
      const updatedCategory = await categoryService.update(
        req.params.id,
        req.body
      );

      if (!updatedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedCategory = await categoryService.delete(req.params.id);
      if (!deletedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteSoft(req, res) {
    try {
      const id = req.params.id;
      const deletedCategory = await categoryService.deleteSoft(id);
      if (!deletedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
      return res.status(200).json({
        status: "success",
        data: deletedCategory,
        message: "Category deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
module.exports = new CategoryController();
