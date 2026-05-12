import express from 'express';
import { login, signup, logout } from '../services/auth.service.js';
import auth from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/login', validate('login'), login);
router.post('/signup', validate('signup'), signup);
router.post('/logout', auth, logout);

export default router;
