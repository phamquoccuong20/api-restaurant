const tableService = require("../services/tableService");
const { HttpStatusCode } = require("axios");
const { AppError } = require("../middleware/errorHandler");

class TableController {
  async getAll(req, res) {
    try {
      const {page, limit} = req.query;
      
      const table = await tableService.getAllTables(page, limit);
      if (!table.data || table.data.length === 0) {
        return res.status(401).json({ data: {}, message: "No data found" });
      }

      return res.status(200).json({
        status: "success",
        message: "Table fetched successfully",
        table,
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
      const table = await tableService.getById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: table,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
      });
    }
  }

  async create(req, res) {
    try {
      const newTable = await tableService.create(req.body);
      if (newTable.status !== 201) {
        throw new AppError(newTable.message, HttpStatusCode.BadRequest);
      }

      return res.status(HttpStatusCode.Created).json({
        status: "success",
        message: "Table created successfully",
        data: newTable,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
  async update(req, res) {
    try {
      const updatedTable = await tableService.update(req.params.id, req.body);
      if (!updatedTable) {
        return res.status(404).json({
          status: "error",
          message: "Table not found",
        });
      }
      return res.status(200).json(updatedTable);
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedTable = await tableService.delete(req.params.id);
      if (!deletedTable) {
        return res.status(404).json({
          status: "error",
          message: "Table not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Table deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async softDelete(req, res) { 
    try { 
      const deletedTable= await tableService.softDelete(req.params.id);
      if(!deletedTable) { 
        return res.status(404).json({
          status: "error",
          message: "Table not found",
        })
      }
      return res.status(200).json({
        status: "success",
        message: "Table deleted successfully",
        data: deletedTable,
      }); 
    }catch(error) { 
      return res.status(500).json({
        status: "error", 
        message: error.message,
      })
    }
  };

  async searchByTable(req, res) {
    try {
      const { keyword, limit, page } = req.query;
      if (!keyword) {
        return res.status(400).json({ status: 400, message: 'Vui lòng nhập ký tự để tìm kiếm' });
      }
    
      const search = await tableService.searchByTable(keyword, limit, page);
    
      return res.status(200).json({ status: 200, data: search });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
}
module.exports = new TableController();
