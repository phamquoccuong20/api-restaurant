const Table = require("../models/table");
const cache = require("../cache/caching");

class TableService {
  async getAllTables(page, limit) {
    try {
      const cacheKey = `table_${page}_${limit}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "tables", data: cached };
      }
      const skip = (page - 1) * limit;

      const data = await Table.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

      const total = await Table.countDocuments({isActive: true});
      const totalPages = Math.ceil(total / limit);
          
      const tables = {
        data,
        total,
        totalPages,
        currentPage: page
      };

      cache.set(cacheKey, tables);

      return tables;
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
    const data =  await Table.findByIdAndUpdate( id,
      { isActive: false },
      { new: true }
    );
  }
  async softDelete(id) {
    const deletedTable = await Table.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true,
      }
    );
    if (!deletedTable) {
      throw new Error("Table not found");
    }
    return deletedTable;
  }
}

module.exports = new TableService();
