require("dotenv").config();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const cache = require("../cache/caching");
const { getSortOption } = require("../utils/sort.helper");

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
    return { status: 500, error: { msg: error.message } };
  }
};

const loginService = async (email, password) => {
  try {
    let user = await Users.findOne({ email: email });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return {
        status: 400,
        message: "Invalid password or email",
      };
    }

    if (user) {
      const checkPassword = await bcrypt.compareSync(password, user.password);
      if (!checkPassword) {
        return {
          status: 400,
          message: "Invalid password or email",
        };
      } else {
        const payload = { userId: user._id, email: user.email };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPRIE });
        const refreshTokens = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

        user.refreshToken = refreshTokens;
        await user.save();

        user.password = undefined;
        user.deleted = undefined;
        user.isDeleted = undefined;
        user.refreshToken = undefined;
        return {
          status: 200,
          accessToken,
          refreshTokens,
          data: user,
        };
    }
  }
  } catch (error) {
    console.log(error);
    return { status: 500, errors: { msg: error.message } };
  }
};

const refresh = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await Users.findById(payload.id);
    if(!user || user.refreshToken !== token) {
     return { status: 400, message: "Invalid refresh token" };
    }

    const data = { userId: user._id, email: user.email };

    // Tạo access token mới.
    const accessToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPRIE });
    // Tạo refresh token mới
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { status: 200, accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
    return { status: 500, errors: { msg: error.message } };
  }
};

const getAllUsers = async (page, limit, sort, field) => {
  const cacheKey = `user_all_${page}_${limit}_${sort}_${field}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { source: "users", data: cached };
  }
  let sortOption = getSortOption(sort, field);

  
  const skip = (page - 1) * limit;
  const users = await Users.find({ isDeleted: false })
  .select("-password -refreshToken")
  .skip(skip)
  .limit(limit)
  .sort(sortOption);

  const total = await Users.countDocuments({isDeleted: false});
  const totalPages = Math.ceil(total / limit);

   const data = {
    users,
    meta: {
      total,
      totalPages,
      currentPage: +page,
      limit: +limit
    }
  };
  cache.set(cacheKey, data);

  return { data };
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
    const user = await Users.findByIdAndUpdate( id, {isDeleted: true}, {new: true} );
    return { status: 200, data: user };
  } catch (error) {
    console.log(error);
    return { status: 500, errors: { msg: error.message } };
  }
};

const searchUsersByName = async (keyword, page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const search = await Users.find({
      $or: [{ name: { $regex: keyword, $options: 'i' }}, { email: { $regex: keyword, $options: 'i' } }],
      isDeleted: false
    })
    .select("-password -refreshToken")
    .skip(skip)
    .limit(limit);

    const total = await Users.countDocuments({isDeleted: false});
    const totalPages = Math.ceil(total / limit);

    return {
      search,
      meta: {
      total,
      totalPages,
      currentPage: +page,
      limit: +limit
    }
    };
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
  refresh,
  searchUsersByName
};
