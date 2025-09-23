import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, requestPasswordReset, confirmPasswordReset, refresh } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const passwordRule = body('password')
  .isLength({ min: 8 })
  .matches(/[a-z]/)
  .matches(/[A-Z]/)
  .matches(/[0-9]/)
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must be 8+ chars and include upper, lower, number, special');

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    passwordRule,
    body('skinType').optional().isIn(['dry', 'oily', 'combination', 'sensitive', 'normal']),
    body('skinGoals').isString().isLength({ min: 10 })
  ],
  register
);

router.post('/login', [body('email').isEmail(), body('password').isString()], login);

router.post('/refresh', [body('refreshToken').isString()], refresh);

router.get('/profile', requireAuth, getProfile);
router.put(
  '/profile',
  requireAuth,
  [
    body('name').optional().isString().isLength({ min: 2, max: 100 }),
    body('skinType').optional().isIn(['dry', 'oily', 'combination', 'sensitive', 'normal']),
    body('skinGoals').optional().isString().isLength({ min: 10 })
  ],
  updateProfile
);

router.post('/reset', [body('email').isEmail()], requestPasswordReset);
router.put('/reset/:token', [passwordRule], confirmPasswordReset);

export default router;

