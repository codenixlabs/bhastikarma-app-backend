import {
  getPatterns,
  getDoseRules,
  getDiseases,
  getFormulationsByDisease,
} from '../controllers/masterDataController.js';
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/patterns', protect, getPatterns);
router.get('/dose-rules', protect, getDoseRules);
router.get('/diseases', protect, getDiseases);
router.get('/formulations/:diseaseId', protect, getFormulationsByDisease);

export default router;
