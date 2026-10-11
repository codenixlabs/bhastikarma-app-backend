import {
  getPatterns,
  getDoseRules,
  getDiseases,
  getFormulationsByDisease,
  addCustomDisease,
  addCustomFormulation,
  getCustomFormulations,
} from '../controllers/masterDataController.js';
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/patterns', protect, getPatterns);
router.get('/dose-rules', protect, getDoseRules);
router.get('/diseases', protect, getDiseases);
router.get('/formulations/:diseaseId', protect, getFormulationsByDisease);
router.post('/custom-disease', protect, addCustomDisease);
router.post('/custom-formulation', protect, addCustomFormulation);
router.post('/diseases/:diseaseId/custom-formulation', protect, addCustomFormulation);
router.get('/custom-formulations', protect, getCustomFormulations);

export default router;
