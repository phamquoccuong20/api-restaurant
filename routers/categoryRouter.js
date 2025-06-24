const express = require("express");
const router = express.Router(); 
const categoryController = require("../controllers/categoryController");
const { validateCategory, validateUpdateCategory } = require("../validators/categoryValidator");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

//public routes
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

//protected routes (admin only)
router.post("/", isAuthenticated, isAdmin, validateCategory, categoryController.create);
router.put("/:id", isAuthenticated, isAdmin, validateUpdateCategory, categoryController.update);
router.delete("/:id", isAuthenticated, isAdmin, categoryController.delete);

module.exports = router;