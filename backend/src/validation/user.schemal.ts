import Joi from "joi";


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userschema = Joi.object({
     title: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username:Joi.string().required(),
  password: Joi.string().required().max(8).min(6),
  email:Joi.string().email().required(),
  gender: Joi.string().required(),
  DOB: Joi.date().required(),
  phoneNumber: Joi.string().required(),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string(),
    postcode: Joi.number(),
  },
  position: Joi.string().required()

});

export const productschema = Joi.object({
    productName: Joi.string().required(),
    productPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    categories:Joi.string(),
    file: Joi.string(),
})

