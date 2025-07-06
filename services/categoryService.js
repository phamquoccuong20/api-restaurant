const Category = require("../models/category");
const cache = require("../cache/caching");

class CategoryService {
  async getAllCategories(page, limit) {
    const cacheKey = `category_all_${page}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return { source: "cache", data: cached };
    }

    const skip = (page - 1) * limit;
    const data = await Category.find({ isActive: true })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    cache.set(cacheKey, data);

    const total = await Category.countDocuments({isActive: true});
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async getById(id) {
    return await Category.findById(id);
  }

  async create(data) {
    try {
      const category = await Category.create(data);
      cache.del("category_all");
      return {status: 200 , category};
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
  async deleteSoft(id) {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true }
    );
    return category;
  }
  async restore(id) {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
      },
      { new: true }
    );
    return category;
  }
}

module.exports = new CategoryService();
