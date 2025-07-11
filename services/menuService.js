const Menu = require("../models/menu");
const cache = require("../cache/caching");

class MenuService {
  async getAllMenus(page, limit) {
    try {
      const cacheKey = `menu_page_${page}_limit_${limit}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "menus", data: cached };
      }
      const skip = (page - 1) * limit;

      const menus = await Menu.find({ isDeleted: false })
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
      const total = await Menu.countDocuments({isDeleted: false});
      const totalPages = Math.ceil( total / limit );
      const data = {
       menus,
       meta: {
          total,
          totalPages,
          currentPage: +page,
          limit: +limit
        }
      };
      cache.set(cacheKey, data);

      return { data };
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async getById(id) {
    return await Menu.findById(id);
  }

  async create(data) {
    try {
      const menu = await Menu.create(data);
      cache.del("menu_all");
      return {status: 201, menu };
    } catch (error) {
      console.log(error);
      return { status: 500, error: { msg: error.message } };
    }
  }

  async update(id, data) {
    try {
      const menu = await Menu.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        {
          new: true,
          runValidators: true,
        }
      );
      return menu;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async delete(id) {
    return await Menu.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }
}

module.exports = new MenuService();
