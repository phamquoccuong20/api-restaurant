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

      const tables = await Table.find({ isActive: true })
      .select("-deleted -isDeleted")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

      const total = await Table.countDocuments({isActive: true});
      const totalPages = Math.ceil(total / limit);
          
      const data = {
        tables,
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
    return await Table.findById(id);
  }

  async create(data) {
    try {
      const table = await Table.create(data);
      cache.del("table_all");
      return { status: 201, table };
    } catch (error) {
      console.log(error);
      return { status: 500, error: { msg: error.message } };
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
  };

  async searchByTable(keyword, limit, page) {
    try {
      const skip = (page - 1) * limit;

      const regex = new RegExp(keyword, 'i'); // không phân biệt hoa thường
      const search = await Table.find({ tableNumber: regex, isActive: true })
      .select("-deleted -isDeleted")
      .skip(skip)
      .limit(limit);

      const total = await Table.countDocuments({isActive: true});
      const totalPages = Math.ceil(total / limit);

      return {
        search,
        meta: {
          total,
          totalPages,
          currentPage: +page,
          limit: +limit
        }
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  };
}

module.exports = new TableService();
