import Joi from 'joi';

const userSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    userType: Joi.string().valid('student', 'tutor').required(),
    courses: Joi.array().items(Joi.string()).required(),
    rating: Joi.number().min(0).max(5).required(),
    ratingCount: Joi.number().min(0).required(),
});

export default userSchema;
