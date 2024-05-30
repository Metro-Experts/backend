import Joi from 'joi';

const userSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().valid('student', 'tutor').required(),
    courses_student: Joi.array().items(Joi.string()),
    courses_tutor: Joi.array().items(Joi.string()),
    rating: Joi.number().min(0).max(5).required(),
    ratingCount: Joi.number().min(0).required(),
});

export default userSchema;
