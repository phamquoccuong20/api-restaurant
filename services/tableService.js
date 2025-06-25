const Table = require("../models/table");
const cache = require("../cache/caching");

class TableService {
  async getAllTables() {
    try {
      const cacheKey = "table_all";
      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "cache", data: cached };
      }
      const data = await Table.find({ isActive: true });
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async getById(id) {
    return await Table.findById(id);
  }

  async create(data) {
    try {
      const table = await Table.create(data);
      cache.del("table_all");
      return table;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async update(id, data) {
    try {
      const table = await Table.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return table;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async delete(id) {
    return await Table.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }
}

module.exports = new TableService();
