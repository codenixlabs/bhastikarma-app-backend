import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per 15 mins
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);

export default router;
