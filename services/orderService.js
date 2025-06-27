const Order = require("../models/order");
const cache = require("../cache/caching");

class OrderService {
  async getAllOrder() {
    try {
      const cacheKey = "order_all";
      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "cache", data: cached };
      }
      const data = await Order.find({isAvailable: true}).populate('customer', "-password").populate('table');
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async getById(id) {
    return await Order.findById(id);
  }

  async create(data) {
    try {
      if (data.orderType === "dine-in" && !data.table) {
        throw new Error("Table is required for dine-in orders.");
      }

      if (data.orderType === "takeaway" && data.table) {
        delete data.table;
      }
      const menu = await Order.create(data);
      cache.del("order_all");
      return menu;
    } catch (error) {
      console.log(error);
      return { status: 500, errors: { msg: error.message } };
    }
  }

  async update(id, data) {
    try {
      const menu = await Order.findOneAndUpdate(
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
    return await Order.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

module.exports = new OrderService();
