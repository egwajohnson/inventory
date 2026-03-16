import Joi from "joi";

export const productschema = Joi.object({
  productName: Joi.string().min(2).max(120).required(),
  productPrice: Joi.number().positive().required(),
  quantity: Joi.number().min(0).required(),
  image: Joi.allow(),
  category: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  supplierId: Joi.string().optional(),
});

export const updateCartItemSchema = Joi.object({
  cartId: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid cartId format",
    }),

  productId: Joi.string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid productId format",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({ "number.min": "Quantity must be at least 1" }),
});
