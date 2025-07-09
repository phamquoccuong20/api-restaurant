const orderService = require("../services/orderService");
const { HttpStatusCode } = require("axios");
const { AppError } = require("../middleware/errorHandler");

class OrderController {
  async getAll(req, res) {
    try {
      const {page, limit} = req.query;

      const order = await orderService.getAllOrder(page, limit);

      if (!order.data || order.data.length === 0) {
        return res.status(401).json({ data: {}, message: "No data found" });
      }

      return res.status(200).json({
      status: "Success",
      message: "Order fetched successfully",
      order,
      
      });
    } catch (error) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }
  async getById(req, res) {
    try {
      const order = await orderService.getById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
      });
    }
  }

  async create(req, res) {
    try {
      const newOrder = await orderService.create(req.body);
      if (newOrder.status !== 201) {
        throw new AppError(newOrder.message, HttpStatusCode.BadRequest);
      }
      
      return res.status(HttpStatusCode.Created).json({
        status: "success",
        message: "Order created successfully",
        data: newOrder, 
      });
    } catch (error) {
    return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async update(req, res) {
    try {
      const updatedOrder = await orderService.update(req.params.id, req.body);

      if (!updatedOrder) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedOrder = await orderService.delete(req.params.id);
      if (!deletedOrder) {
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }
      return res.status(200).json({
        status: "success",
        message: "Menu deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
module.exports = new OrderController();
