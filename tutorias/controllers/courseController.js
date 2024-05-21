import Course from '../models/Course.js';
import courseSchema from '../libs/validateCourse.js';

// Obtener un curso por ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).send('Course not found');
        res.json(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Crear un nuevo curso
export const createCourse = async (req, res) => {
    const { error } = courseSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Actualizar un curso por ID
export const updateCourseById = async (req, res) => {
    const { error } = courseSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).send('Course not found');
        res.json(course);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).send(error.message);
    }
};