import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tutor: {
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        id: { type: String, required: true }
    },
    fechas: [
        {
            dia: { type: String, required: true },
            hora: { type: String, required: true }
        }
    ]
});

const Course = mongoose.model('materia', courseSchema);

export default Course;
