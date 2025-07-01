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

const createOrderSchema = Joi.object({
  body: Joi.object({
    customer: Joi.string().min(2).max(50).custom(objectIdValidator).required()
    .messages({
      "any.required": "Customer is required",
      "any.invalid": "Invalid customer ID",
    }),
    table: Joi.string().custom(objectIdValidator).required()
    .messages({
      "any.required": "Table is required",
      "any.invalid": "Invalid table ID",
    }),
    menu: Joi.string().custom(objectIdValidator).required()
    .messages({
      "any.required": "Menu is required",
      "any.invalid": "Invalid menu ID",
    }),
    orderType: Joi.string().valid("dine-in", "takeaway").required()
    .messages({
      "string.empty": "orderType cannot be empty",
      "any.required": "orderType is required",
    }),
    status: Joi.string().valid("pending", "preparing", "served", "completed", "cancelled").optional(),
  }),
});

const updateOrderSchema = Joi.object({
  body: Joi.object({
    customer: Joi.string().custom(objectIdValidator).optional(),
    table: Joi.string().custom(objectIdValidator).optional(),
    manu: Joi.string().custom(objectIdValidator).optional(),
    orderType: Joi.string().valid("dine-in", "takeaway").required(),
    status: Joi.string().valid("pending", "preparing", "served", "completed", "cancelled").optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const validateOrder = validation(createOrderSchema);
const validateUpdateOrder = validation(updateOrderSchema);

module.exports = {
  validateOrder,
  validateUpdateOrder,
};
