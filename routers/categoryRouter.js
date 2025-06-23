const express = require("express");
const router = express.Router(); 
const categoryController = require("../controllers/categoryController");

//public routes
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

//protected routes (admin only)
router.post("/", isAuthenticated, isAdmin, categoryController.create);
router.put("/:id", isAuthenticated, isAdmin, categoryController.update);
router.delete("/:id", isAuthenticated, isAdmin, categoryController.delete);

module.exports = router;