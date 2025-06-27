const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required. No token provided.",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        status: "error",
        message: "Token has expired",
      });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found or token is invalid",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admin access required.",
    });
  }
};
exports.isStaff = async (req, res, next) => {
  if (req.user && req.user.role === "STAFF") {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Staff access required.",
    });
  }
};

exports.isStaffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "STAFF")) {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Staff or Admin privileges required.",
    });
  }
};
