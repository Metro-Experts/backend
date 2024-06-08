import Joi from "joi";

const bankAccountSchema = Joi.object({
  cedula: Joi.string().required(),
  numcell: Joi.string().required(),
  bank: Joi.string().required(),
});

const courseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tutor: Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    id: Joi.string().required(),
    bankaccount: bankAccountSchema,
  }).required(),
  date: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        hour: Joi.string().required(),
      })
    )
    .required(),
  price: Joi.number().min(0).required(),
  modality: Joi.string().required(),
  students: Joi.array().items(Joi.string()),
  category: Joi.string(),
});

export default courseSchema;
