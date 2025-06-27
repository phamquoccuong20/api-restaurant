const categoryService = require("../services/categoryService");
const { HttpStatusCode } = require("axios");
class CategoryController {

 async getAll(req, res) { 
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
    });
  }
 }
  async getById(req, res) {
    try {
      const category = await categoryService.getById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
      });
    }
  }

  async create(req, res) {
    try {
      const newCategory = await categoryService.create(req.body);

      if (newCategory.status !== 201) {
      throw new AppError(newCategory.message, HttpStatusCode.BadRequest);
    } else {
        return res.status(HttpStatusCode.Created).json({
        status: "success",
        data: newCategory,
        message: "Category created successfully",
      });
    }
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
}
module.exports = new CategoryController();
