import Joi from "joi";

const bankAccountSchema = Joi.object({
  cedula: Joi.string().required(),
  numcell: Joi.string().required(),
  bank: Joi.string().required(),
});

const userSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  cellphone: Joi.string().required(),
  lastName: Joi.string().required(),
  userType: Joi.string().valid("student", "tutor").required(),
  courses_student: Joi.array().items(Joi.string()),
  courses_tutor: Joi.array().items(Joi.string()),
  rating: Joi.number().min(0).max(5),
  ratingCount: Joi.number().min(0),
  gender: Joi.string().valid("M", "F").required(),
  bankaccount: bankAccountSchema,
});

export default userSchema;
