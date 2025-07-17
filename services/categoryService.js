const Category = require("../models/category");
const cache = require("../cache/caching");
const { getSortOption } = require("../utils/sort.helper");

class CategoryService {
  async getAllCategories(page, limit, sort, field) {
    const cacheKey = `category_all_${page}_${limit}_${sort}_${field}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return { data: cached };
    }

    let sortOption = getSortOption(sort, field);
    const skip = (page - 1) * limit;
    const categories = await Category.find({ isActive: true })
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

    const total = await Category.countDocuments({isActive: true});
    const totalPages = Math.ceil(total / limit);
    
    const data = {
      categories,
      meta: {
        total,
        totalPages,
        currentPage: +page,
        limit: +limit
      }
    };

    cache.set(cacheKey, data);

    return { data };
  }

  async getById(id) {
    return await Category.findById(id);
  }

  async create(data) {
    try {
      const category = await Category.create(data);
      cache.del("category_all");
      return {status: 201 , category};
    } catch (error) {
      console.log(error);
      return { status: 500, error: { msg: error.message } };
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
  };

  async searchByCategory(keyword) {
    try {
      const regex = new RegExp(keyword, 'i'); // không phân biệt hoa thường
      const search = await Category.find({ name: regex });

      return search;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryService();
