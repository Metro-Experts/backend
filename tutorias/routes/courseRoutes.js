import express from 'express';
import {createCourse, getAllCourses, getCourseById, updateCourseById} from '../controllers/courseController.js';

const router = express.Router();

router.get('/:id', getCourseById);
router.post('/', createCourse);
router.put('/:id', updateCourseById);
router.get('/', getAllCourses);

router.get('/', (req, res) => {
    res.send('Hello from courses');
});

export default router;
