const Joi = require("joi");
const validation = require("../middleware/validationMiddleware");

const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .required()
      .messages({
        "string.empty": "Category name is required",
        "any.required": "Category name is required",
      })
      .min(2)
      .max(50)
      .messages({
        "string.min": "Category name must be at least 2 characters long",
        "string.max": "Category name must be less than 50 characters long",
      }),
    description: Joi.string().optional().max(500).messages({
      "string.max": "Description must be less than 500 characters long",
    }),
  }),
});

const updateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    // image: Joi.string().optional(),
  }),
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

const validateCategory = validation(createCategorySchema);
const validateUpdateCategory = validation(updateCategorySchema);

module.exports = {
  validateCategory,
  validateUpdateCategory
}