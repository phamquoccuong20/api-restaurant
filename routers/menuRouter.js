const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const {
  validateMenu,
  validateUpdateMenu,
} = require("../validators/menuValidator");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

//public routes
router.get("/all", menuController.getAll);
router.get("/:id", menuController.getById);

//protected routes (admin only)
router.post("/create", isAuthenticated, isAdmin, validateMenu, upload.single("image_url"), menuController.create);
router.put("/update/:id", isAuthenticated, isAdmin, validateUpdateMenu, menuController.update);
router.delete("/delete/:id", isAuthenticated, isAdmin, menuController.delete);

router.get("/search/menu", menuController.searchByMenu);

module.exports = router;
