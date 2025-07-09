const Order = require("../models/order");
const cache = require("../cache/caching");

class OrderService {
  async getAllOrder(page, limit) {
    try {
      const cacheKey = `order_all_${page}_${limit}`;

      const cached = cache.get(cacheKey);
      if (cached) {
        return { source: "orders", data: cached };
      }
      const skip = (page - 1) * limit;

      const orders = await Order.find({isAvailable: true})
      .populate('customer', "name phone")
      .populate('table', "tableNumber capacity")
      .populate('menu', "name price")
      .skip(skip).limit(limit).sort({ createdAt: -1 });

      const total = await Order.countDocuments({isAvailable: true});
      const totalPages = Math.ceil(total / limit);

      const data = {
        orders,
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
      const order = await Order.create(data);
      cache.del("order_all");
      return { status: 201, order };
    } catch (error) {
      console.log(error);
      return { status: 500, error: { msg: error.message } };
    }
  }

  async update(id, data) {
    try {
      const menu = await Order.findOneAndUpdate(
        { _id: id, isAvailable: false },
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
      { isAvailable: false },
      { new: true }
    );
  }
}

module.exports = new OrderService();
