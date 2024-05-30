import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    lastName: String,
    userType: String,
    courses_student: [String],
    courses_tutor: [String],
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
});

const User = mongoose.model('usuario', userSchema);

export default User;
