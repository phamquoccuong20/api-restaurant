const { HttpStatusCode } = require("axios");
const userService = require("../services/userService");
const { AppError } = require("../middleware/errorHandler");

const createUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, role, phone, confirmPassword, status } = req.body;
    const newuser = await userService.create({ name, email, password, dateOfBirth, role, status, phone, confirmPassword });

    if (newuser.status !== 201) {
      throw new AppError(newuser.message, HttpStatusCode.BadRequest);
    } else {
        return res.status(HttpStatusCode.Created).json({
        status: 201,
        message: "User created successfully",
      });
    }
  } catch (error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
};


const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      status: 200,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword} = req.body;
    const user = req.user;
    const data = await userService.changePassword(user._id, oldPassword, newPassword);
    if(data.status !== 200) {
      throw new AppError(data.message, HttpStatusCode.BadRequest);
    } else {
      return res.status(200).json({
        status: 200,
        message: "Password changed successfully"
      });
    }
   
  }catch(error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.loginService(email, password);

    if (data.status !== 200) {
      throw new AppError(data.message, HttpStatusCode.BadRequest);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const user = await userService.getAllUsers(page, limit);
    if (!user.data || user.data.length === 0) {
      return res.status(401).json({ data: {}, message: "No data found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      user,
    });
  }catch(error) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
}
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if(!user) {
      throw new AppError("User not found", HttpStatusCode.NotFound);
    }
    return res.status(200).json({
      status: 200,
      message: "User fetched successfully",
      data: user
    });
  }catch(error) { 
     return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { id} = req.params;
    const data = req.body;
    const user = await userService.updateUser(id, data);
    if(!user) {
      throw new AppError("User not found", HttpStatusCode.NotFound);
    }
    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: user
    });
  }catch(error) { 
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message
    });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id} = req.params;
    const user = await userService.deleteUser(id);
    if(!user) {
      throw new AppError("User not found", HttpStatusCode.NotFound);
    }
    return res.status(200).json({
      status: 200,
      message: "User deleted successfully",
      data: user
    });
  }catch(error) { 
    return res.status(error.statusCode).json({  
      status: error.statusCode,
      message: error.message
    });
  }
}

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    const data = await userService.refresh(token);
    if (data.status !== 200) {
      throw new AppError(data.message, HttpStatusCode.BadRequest);
    }
    return res.status(200).json(data);
    
  } catch (error) {
     return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { name, email } = req.query;
    if ( !name && !email ) {
      return res.status(400).json({ message: 'Vui lòng nhập tên hoặc email để tìm kiếm' });
    }
    
    const users = await userService.searchUsersByName( name, email );
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { 
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  changePassword,
  refreshToken,
  searchUser
};
