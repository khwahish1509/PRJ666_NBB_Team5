import express from 'express';
import { findClinicians } from '../controllers/clinicianController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Find dermatologists near location
router.post('/find', requireAuth, findClinicians);

export default router;
