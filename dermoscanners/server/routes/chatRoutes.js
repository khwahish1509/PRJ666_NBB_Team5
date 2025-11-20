import express from 'express';
import { sendMessage, getSuggestedQuestions } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Chat endpoints
router.post('/message', requireAuth, sendMessage);
router.get('/suggestions', requireAuth, getSuggestedQuestions);

export default router;
