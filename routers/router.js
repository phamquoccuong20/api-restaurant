const express = require("express");
const userController = require("../controllers/userController");
const restaurantAPI = express.Router();

restaurantAPI.post("/login", userController.loginUser);
restaurantAPI.post("/register", userController.createUser);

module.exports = restaurantAPI;
