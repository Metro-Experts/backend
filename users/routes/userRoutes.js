import express from 'express';
import {
    addCourseToStudent, addCourseToTutor,
    createUser, deleteCourseFromStudent, deleteCourseFromTutor,
    getUserById,
    getUsersByIds,
    updateUserById
} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.post('/', createUser);
router.post('/getUsersByIds', getUsersByIds);
router.post('/:id/add-course-student', addCourseToStudent);
router.post('/:id/add-course-tutor', addCourseToTutor);
router.delete('/:id/delete-course-tutor', deleteCourseFromTutor);
router.delete('/:id/delete-course-student', deleteCourseFromStudent);
router.get('/', (req, res) => {
    res.send('Hello from users');
});

export default router;