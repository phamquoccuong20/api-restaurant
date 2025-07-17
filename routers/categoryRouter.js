const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  validateCategory,
  validateUpdateCategory,
} = require("../validators/categoryValidator");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

//public routes
router.get("/all", categoryController.getAll);
router.get("/:id", categoryController.getById);

//protected routes (admin only)
router.post("/create", isAuthenticated, isAdmin, validateCategory, categoryController.create);
router.put("/update/:id", isAuthenticated, isAdmin, validateUpdateCategory, categoryController.update);
router.delete("/delete/:id", isAuthenticated, isAdmin, categoryController.delete);

router.get("/search/category", categoryController.searchByCategory);

module.exports = router;
