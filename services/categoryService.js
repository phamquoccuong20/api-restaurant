const Category = require("../models/category");
const cache = require("../cache/caching");

class CategoryService {
  async getAllCategories() {
    const cacheKey = "category_all";
    const cached = cache.get(cacheKey);
    if (cached) {
      return { source: "cache", data: cached };
    }
    const data = await Category.find({ isActive: true });
    cache.set(cacheKey, data);

    return data;
  }

  async getById(id) {
    return await Category.findById(id);
  }

  async create(data) {
    try {
      const category = await Category.create(data);
      cache.del("category_all");
      return category;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async update(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return category;
  }

  async delete(id) {
    return await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }
}

module.exports = new CategoryService();
