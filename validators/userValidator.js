const Joi = require("joi");
const validation = require("../middleware/validationMiddleware");

const userSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name cannot be empty",
      "any.required": "Name is required",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Phone cannot be empty",
      "any.required": "Phone is required",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "co", "org"] } })
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
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

module.exports = validation(userSchema);
