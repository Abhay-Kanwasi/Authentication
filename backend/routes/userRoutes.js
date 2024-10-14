import { Router } from 'express';
import UserController from '../controller/userController.js';

const router = Router();

// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/verify-email', UserController.verifyEmail)
router.post('/login', UserController.userLogin)
router.post('/refresh-token', UserController.getNewAccessToken)

export default router