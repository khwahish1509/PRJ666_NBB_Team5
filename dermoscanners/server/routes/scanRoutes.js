import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createScan,
  getScans,
  updateScanNotes,
  deleteScan
} from '../controllers/scanController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Scan routes
router.route('/')
  .post(createScan)    // POST /api/scans - Create new scan record
  .get(getScans);      // GET /api/scans?userId=xxx - Get user's scans

router.route('/:id')
  .patch(updateScanNotes)  // PATCH /api/scans/:id - Update scan notes
  .delete(deleteScan);     // DELETE /api/scans/:id - Delete scan

export default router;
