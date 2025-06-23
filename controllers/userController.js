const { HttpStatusCode } = require("axios");
const userService = require("../services/userService");
const { AppError } = require("../middleware/errorHandler");

const createUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, role, phone, confirmPassword } = req.body;
    const newuser = await userService.create({name, email, password, dateOfBirth, role, phone, confirmPassword});

    if(newuser.status !== 200) {
      throw new AppError(newuser.message, HttpStatusCode.BadRequest);
    }
    return res.status(HttpStatusCode.Created).json({
      status: 201, 
      message: "User created successfully"
    });
  } catch (error) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
      });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.loginService(email, password);

    if (data.status !== 200) {
        throw new AppError(data.message, HttpStatusCode.BadRequest);
      }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
};

module.exports = { createUser, loginUser };
