require("dotenv").config();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const uuid = require("uuid");

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
        confirmPassword: data.confirmPassword,
      });
      return {
        status: 200,
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

module.exports = { create, loginService };
