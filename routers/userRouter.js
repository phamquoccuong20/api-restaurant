const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const validateUser = require("../validators/userValidator");

const {
  isAuthenticated,
  isAdmin,
  isStaffOrAdmin,
} = require("../middleware/authMiddleware");

userRouter.post("/register", validateUser, userController.createUser);
userRouter.post("/login", userController.loginUser);

//user only
userRouter.get("/me", isAuthenticated, userController.getMe);

//admin only
userRouter.get("/", isAuthenticated, isAdmin, userController.getAllUsers);
userRouter.get("/:id", isAuthenticated, isAdmin, userController.getUserById);
userRouter.put("/:id", isAuthenticated, isAdmin, userController.updateUser);
userRouter.delete("/:id", isAuthenticated, isAdmin, userController.deleteUser);
//authenticated only
userRouter.post(
  "/change-password",
  isAuthenticated,
  userController.changePassword
);

module.exports = userRouter;

