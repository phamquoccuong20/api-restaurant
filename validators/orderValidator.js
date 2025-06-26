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
    customer: Joi.string().min(2).max(50).custom(objectIdValidator).required(),
    table: Joi.string().custom(objectIdValidator).optional(),
    orderType: Joi.string().valid("dine-in", "takeaway").required(),
    status: Joi.string()
      .valid("pending", "preparing", "served", "completed", "cancelled")
      .optional(),
  }),
});

const updateOrderSchema = Joi.object({
  body: Joi.object({
    customer: Joi.string().custom(objectIdValidator).optional(),
    table: Joi.string().custom(objectIdValidator).optional(),
    orderType: Joi.string().valid("dine-in", "takeaway").required(),
    status: Joi.string()
      .valid("pending", "preparing", "served", "completed", "cancelled")
      .optional(),
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
