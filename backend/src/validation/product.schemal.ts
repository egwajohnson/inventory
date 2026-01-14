import Joi from "joi";

export const productschema = Joi.object({
  productName: Joi.string().trim().required(),
  productPrice: Joi.number().min(0).required(),
  slug: Joi.string().trim().optional(),
  quantity: Joi.number().integer().required(),
  description: Joi.string().trim().optional(),
  image: Joi.string().optional(),
});
