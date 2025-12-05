import express from 'express';
import { sendMessage, getSuggestedQuestions } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { enrichChatContext } from '../middleware/chatContextMiddleware.js';

const router = express.Router();

// Chat endpoints
// Apply context enrichment middleware before sending message
router.post('/message', requireAuth, enrichChatContext, sendMessage);
router.get('/suggestions', requireAuth, getSuggestedQuestions);

export default router;
