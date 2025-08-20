import Joi from "joi";

export const productschema = Joi.object({
    productName: Joi.string().trim().required(),
    productPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    categories:Joi.string().trim().optional(),
    file: Joi.string().optional(),
})


