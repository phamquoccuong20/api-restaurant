const Category = require("../models/category");
const Users = require("../models/user");
const Tables = require("../models/table");
const Menus = require("../models/menu");

const searchAll = async (query) => {
  try {
    const result = {};

    if (query.user) {
      const regex = new RegExp(query.user, 'i');
      result.users = await Users.find({
        $or: [{ name: regex }, { email: regex }]
      });
    }

    if (query.category) {
      const regex = new RegExp(query.category, 'i');
      result.categories = await Category.find({ name: regex });
    }

    if (query.menu) {
      const regex = new RegExp(query.menu, 'i');
      result.menus = await Menus.find({ name: regex });
    }

    if (query.table) {
      const regex = new RegExp(query.table, 'i');
      result.tables = await Tables.find({ tableNumber: regex });
    }

    return result;
  } catch (error) {
    
  }
}

module.exports = { searchAll };