const orderService = require("../services/orderService");
const { HttpStatusCode } = require("axios");

class MenuController {
  async getAll(req, res) {
    try {
      const order = await orderService.getAllOrder();
      return res.status(200).json({
        status: "success",
        data: order,
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
      return res.status(HttpStatusCode.Created).json({
        status: "success",
        data: newOrder,
        message: "Order created successfully",
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
module.exports = new MenuController();
