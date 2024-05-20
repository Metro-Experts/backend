
import express from 'express';
import {createUser, getUserById, updateUserById} from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.post('/', createUser);

export default router;
