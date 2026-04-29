import Joi from "joi";

export const preValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  position: Joi.string().valid("admin", "staff").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userschema = Joi.object({
  title: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required().max(8).min(6),
  otp: Joi.string().required(),
  image: Joi.string(),
  gender: Joi.string().required(),
  DOB: Joi.date().required(),
  phoneNumber: Joi.string().required(),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string(),
    postcode: Joi.number(),
  },
  role: Joi.string().valid("admin", "customer", "merchant").required(),
});
export const profileSchema = Joi.object({
  imageUrl: Joi.string().uri().required(),
  imageType: Joi.string().valid("jpg", "jpeg", "png", "gif", "webp").required(),
  imageSize: Joi.number()
    .max(5 * 1024 * 1024)
    .required(), // Max 5MB
  publicId: Joi.string().required(),
});
