import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  addToHistory,
  getHistory,
  deleteHistoryEntry,
  clearHistory
} from '../controllers/scanHistoryController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Scan history routes
router.route('/')
  .get(getHistory)           // GET /api/history - Get user's scan history
  .post(addToHistory)        // POST /api/history - Add product to history
  .delete(clearHistory);     // DELETE /api/history - Clear all history

router.delete('/:id', deleteHistoryEntry); // DELETE /api/history/:id - Delete specific entry

export default router;

