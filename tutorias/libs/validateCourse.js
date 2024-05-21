import Joi from 'joi';

const courseSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    tutor: Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required(),
        id: Joi.string().required()
    }).required(),
    fechas: Joi.array().items(
        Joi.object({
            dia: Joi.string().required(),
            hora: Joi.string().required()
        })
    ).required()
});

export default courseSchema;
