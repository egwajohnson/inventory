import Joi from "joi";

const productSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required(),
  productPrice: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
});

export default productSchema;
