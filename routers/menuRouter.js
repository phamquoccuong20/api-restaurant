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
router.get("/", menuController.getAll);
router.get("/:id", menuController.getById);

//protected routes (admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateMenu,
  upload.single("image_url"),
  menuController.create
);
router.put(
  "/:id",
  // isAuthenticated,
  // isAdmin,
  validateUpdateMenu,
  menuController.update
);
router.delete("/:id", isAuthenticated, isAdmin, menuController.delete);

module.exports = router;
