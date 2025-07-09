const Joi = require("joi");
const validation = require("../middleware/validationMiddleware");

const createTableSchema = Joi.object({
  body: Joi.object({
    tableNumber: Joi.string()
      .required()
      .messages({
        "string.empty": "Number of tables required",
        "any.required": "Number of tables required",
      }),
    capacity: Joi.number()
      .required()
      .messages({
        "string.empty": "Capacity cannot be left empty",
        "number.base": "Capacity cannot be left empty",
      })
      .min(2)
      .max(15)
      .messages({
        "number.min": "Capacity must be at least 2.",
        "number.max": "Capacity cannot exceed 15.",
      }),
    status: Joi.string()
      .valid("AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE")
      .default("AVAILABLE")
      .messages({
        "any.only":
          "Status must be AVAILABLE, OCCUPIED, RESERVED or MAINTENANCE",
      }),
    location: Joi.string()
      .valid("INSIDE", "OUTSIDE", "BALCONY")
      .default("INSIDE")
      .messages({
        "any.only": "Location must be INSIDE, OUTSIDE or BALCONY",
      }),
  }),
});

const updateTableSchema = Joi.object({
  body: Joi.object({
    tableNumber: Joi.string().optional(),
    capacity: Joi.number().optional(),
    status: Joi.string().optional(),
    location: Joi.number().optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const validateTable = validation(createTableSchema);
const validateUpdateTable = validation(updateTableSchema);

module.exports = {
  validateTable,
  validateUpdateTable,
};
