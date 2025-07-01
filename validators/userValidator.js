const Joi = require("joi");
const validation = require("../middleware/validationMiddleware");
const { body } = require("express-validator");

// Login schema
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email là bắt buộc',
   }),
    password: Joi.string().min(6).required().messages({
      'any.required': 'Mật khẩu là bắt buộc',
    }),
  }),
});

const userSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-ZÀ-ỹà-ỹ_ ]+$/)
    .required()
    .messages({
      'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
      'string.max': 'Tên đăng nhập không được quá 50 ký tự',
      'string.pattern.base': 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
      "any.required": "Tên đăng nhập là bắt buộc",
    }),
    phone: Joi.string()
    .pattern(/^(0|\+84)(\d{9,10})$/)
    .required()
    .messages({
      'string.pattern.base': 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có từ 9 đến 10 số',
      'any.required': 'Số điện thoại là bắt buộc',
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "co", "org"] } })
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z]).*$/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.pattern.base': 'Mật khẩu phải chứa ít nhất một chữ hoa và một chữ thường',
      'any.required': 'Mật khẩu là bắt buộc',
    }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Password and confirm password do not match",
        "any.required": "Confirm password is required",
      }),
    dateOfBirth: Joi.date().less("now").required().messages({
      "date.less": "Date of birth must be in the past",
      "any.required": "Date of birth is required",
    }),
    role: Joi.string()
      .valid("ADMIN", "STAFF", "USER")
      .default("USER")
      .messages({
        "any.only": "Role must be either ADMIN, STAFF, or USER",
      }),
  }),
});

// const updateUserSchema = Joi.object({
//   body: Joi.object({
//     name: Joi.string().optional(),
//     password: Joi.string()
//     .min(6)
//     .pattern(/^(?=.*[a-z])(?=.*[A-Z]).*$/)
//     .optional()
//     .messages({
//       'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
//       'string.pattern.base': 'Mật khẩu phải chứa ít nhất một chữ hoa và một chữ thường',
//     }),
//     phone: Joi.string()
//     .pattern(/^(0|\+84)(\d{9,10})$/)
//     .optional()
//     .messages({
//       'string.pattern.base': 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có từ 9 đến 10 số)',
//     }),
//     dateOfBirth: Joi.date().less('now').optional()
//     .messages({
//       'date.less': 'Ngày sinh không hợp lệ',
//     }),
//     status: Joi.string().optional(),
//     confirmPassword: Joi.any().valid(Joi.ref('password')).when('password', {
//       is: Joi.exist(),
//       then: Joi.required().messages({
//         'any.only': 'Mật khẩu xác nhận không khớp',
//         'any.required': 'Xác nhận mật khẩu là bắt buộc khi thay đổi mật khẩu',
//       }),
//       otherwise: Joi.optional(),
//     }),
//   }),
//   params: Joi.object({
//     id: Joi.string().required(),
//   }),
// });

const validateLogin = validation(loginSchema);
const validateUser = validation(userSchema);
// const validateUpdateUser = validation(updateUserSchema);


module.exports = { validateLogin, validateUser };
