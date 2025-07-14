const express = require("express");
const searchController = require("../controllers/searchController");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
// search name
router.get("/", searchController.searchByController);

module.exports = router;
