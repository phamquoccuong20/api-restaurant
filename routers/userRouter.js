const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const validateUser = require("../validators/userValidator");

userRouter.post("/register", validateUser, userController.createUser);
userRouter.post("/login", userController.loginUser);

module.exports = userRouter;