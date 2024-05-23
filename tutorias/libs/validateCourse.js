import Joi from "joi";

const courseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tutor: Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    id: Joi.string().required(),
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
  students: Joi.array().items(Joi.string()),
});

export default courseSchema;
