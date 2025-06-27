const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableCotroller");
const {
  validateTable,
  validateUpdateTable,
} = require("../validators/tableValidator");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

//public routes
router.get("/", tableController.getAll);
router.get("/:id", tableController.getById);

//protected routes (admin only)
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  validateTable,
  tableController.create
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  validateUpdateTable,
  tableController.update
);
router.delete("/:id", isAuthenticated, isAdmin, tableController.delete);

module.exports = router;
