require("dotenv").config();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const cache = require("../cache/caching");

const salt = bcrypt.genSaltSync(12);

const checkUserEmail = async (email) => {
  try {
    let emails = await Users.findOne({ email: email });
    if (emails) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const changePassword = async (id, oldPassword, newPassword) => {
  try {
    const user = await Users.findById(id);
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    const checkPassword = await bcrypt.compareSync(oldPassword, user.password);
    if (!checkPassword) {
      return { status: 400, message: "Invalid password" };
    }
    const hashSync = await hashPassword(newPassword);
    user.password = hashSync;
    await user.save();
  } catch (error) {
    return { status: 500, message: "Server error" };
  }
};

const hashPassword = async (password) => {
  try {
    const hashSyncPassword = await bcrypt.hashSync(password, salt);
    return hashSyncPassword;
  } catch (error) {
    return error;
  }
};

const create = async (data) => {
  try {
    let checkEmail = await checkUserEmail(data.email);
    if (checkEmail === true) {
      return { status: 400, message: "Email already exists" };
    } else {
      const hashSync = await hashPassword(data.password);
      const user = await Users.create({
        name: data.name,
        password: hashSync,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        role: data.role,
        status: data.status,
        confirmPassword: data.confirmPassword,
      });
      cache.del("user_all");
      return {
        status: 201,
        users: user,
      };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, errors: { msg: error.message } };
  }
};

const loginService = async (email, password) => {
  try {
    let user = await Users.findOne({ email: email });

    if (user) {
      const checkPassword = await bcrypt.compareSync(password, user.password);
      if (!checkPassword) {
        return {
          status: 400,
          message: "Invalid password or email",
        };
      } else {
        const refreshTokenSecret = nanoid();
        const payload = {
          userId: user._id,
          email: user.email,
          password: user.password,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPRIE,
        });

        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
          expiresIn: "7d",
        });

        return {
          status: 200,
          access_token,
          refreshToken,
        };
      }
    }
  } catch (error) {}
};
const getAllUsers = async () => {
  const cacheKey = "user_all";
  const cached = cache.get(cacheKey);
  if (cached) {
    return { source: "cache", data: cached };
  }
  const users = await Users.find({ isDeleted: false }).select("-password");
  cache.set(cacheKey, users);
  return users;
};

const getUserById = async (id) => {
  const cacheKey = id;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { source: "cache", data: cached };
  }
  const user = await Users.findById(id).select("-password");
  cache.set(cacheKey, user);
  return user;
};
const updateUser = async (id, data) => {
  const user = await Users.findByIdAndUpdate(id, data, { new: true });
  return user;
};
const deleteUser = async (id) => {
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    x;
    return user;
  } catch (error) {
    console.log(error);
    return { status: 500, errors: { msg: error.message } };
  }
};

module.exports = {
  create,
  loginService,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};

