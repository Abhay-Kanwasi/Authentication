import { Router } from 'express';
import UserController from '../controller/userController.js';

const router = Router();

// Public Routes
router.post('/register', UserController.userRegistration)

export default router