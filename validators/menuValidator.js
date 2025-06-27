const Joi = require("joi");
const validation = require("../middleware/validationMiddleware");
const mongoose = require("mongoose");

// Check if a value is an ObjectId.
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const createMenuSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name must be a string.",
    }),

    price: Joi.number().required().messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description is required",
      "string.base": "Description must be a string",
    }),
    category: Joi.string().custom(objectIdValidator).required().messages({
      "any.required": "Category is required",
      "any.invalid": "Invalid category ID",
    }),
    image_url: Joi.string().uri().required().messages({
      "any.required": "Image URL is required",
      "string.uri": "Image URL must be a valid URI",
    }),
    isAvailable: Joi.boolean().optional(),
  }),
});

const updateMenuSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional(),
    category: Joi.string().custom(objectIdValidator).optional(),
    image_url: Joi.string().uri().optional(),
    isAvailable: Joi.boolean().optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const validateMenu = validation(createMenuSchema);
const validateUpdateMenu = validation(updateMenuSchema);

module.exports = {
  validateMenu,
  validateUpdateMenu,
};
