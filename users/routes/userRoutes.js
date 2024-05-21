import express from 'express';
import {createUser, getUserById, getUsersByIds, updateUserById} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.post('/', createUser);
router.post('/getUsersByIds', getUsersByIds);
router.get('/', (req, res) => {
    res.send('Hello from users');
});

export default router;