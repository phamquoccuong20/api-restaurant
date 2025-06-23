const userService = require("../services/userService");

const createUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const data = { name, email, password };
    if (!data.name || !data.email || !data.password) {
      return res.status(data.status).json({ message: data.message });
    }
    let users = await userService.create(data);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "System error. Please try again!!!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.loginService(email, password);

    if (data.status !== 200) {
      return res.status(data.status).json({ message: data.message });
    }

    return res.status(200).json(data);
  } catch (error) {}
};

module.exports = { createUser, loginUser };
