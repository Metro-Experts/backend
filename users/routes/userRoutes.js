
import express from 'express';
import { getUserById, updateUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', updateUserById);

export default router;
