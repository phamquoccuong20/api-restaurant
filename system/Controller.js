const { validationResult } = require("express-validator");

const validate = (req, res) => {
  try {
    const _errors = validationResult(req).array({ onlyFirstError: true });
    if (_errors.length > 0) throw _errors;

    return false;
  } catch (error) {
    console.log(error);
    const _infoErr = [];

    error.map((item) => {
      if (item.param.includes("user_image")) {
        _infoErr.push({ key: item.value.image_type, msg: item.msg });
      } else {
        _infoErr.push({ key: item.param, msg: item.msg });
      }
    });

    return res.status(400).json({
      status: "error",
      errors: _infoErr,
    });
  }
};
