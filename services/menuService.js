const Menu = require("../models/menu");
const cache = require("../cache/caching");

class MenuService {
  async getAllMenus() {
    try {
      const cacheKey = "menu_all";
      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "cache", data: cached };
      }
      const data = await Menu.find({ isDeleted: false }).populate(
        "category",
        "name"
      );
      cache.set(cacheKey, data);

      return data;
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
      return menu;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
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
