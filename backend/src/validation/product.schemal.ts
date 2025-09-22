import Joi from "joi";

export const productschema = Joi.object({
  productName: Joi.string().trim().required(),
  productPrice: Joi.number().required(),
  slug: Joi.string().trim().optional(),
  quantity: Joi.number().required(),
  description: Joi.string().trim().optional(),
  categories: Joi.string().trim().optional(),
  file: Joi.string().optional(),
});
