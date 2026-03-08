import Joi from "joi";

export const productschema = Joi.object({
  productName: Joi.string().trim().required(),
  productPrice: Joi.number().min(0).required(),
  slug: Joi.string().trim().optional(),
  quantity: Joi.number().integer().required(),
  description: Joi.string().trim().optional(),
  category: Joi.string().trim().required(),
  image: Joi.string().optional(),
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
