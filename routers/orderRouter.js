const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  validateOrder,
  validateUpdateOrder,
} = require("../validators/orderValidator");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

//public routes
router.get("/all", orderController.getAll);
router.get("/:id", orderController.getById);

//protected routes (admin only)
router.post("/create", isAuthenticated, isAdmin, validateOrder, orderController.create);
router.put("/update/:id", isAuthenticated, isAdmin, validateUpdateOrder, orderController.update);
router.delete("/delete/:id", isAuthenticated, isAdmin, orderController.delete);

module.exports = router;
