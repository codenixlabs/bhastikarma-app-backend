import express from 'express';
import {
    updateNiruhaEligibility,
    updateAnuvasanaEligibility,
    updatePariksha,
    updateAgniAssessment,
    updateKosthaAssessment,
    updateSaamaNirama,
    updateBala,
    markPoorvaKarmaCompleted
} from '../controllers/poorvaKarmaController.js';
import { protect, isDoctor } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(protect);
router.use(isDoctor);

// All routes require the patientId parameter in the URL
router.put('/:patientId/niruha', updateNiruhaEligibility);
router.put('/:patientId/anuvasana', updateAnuvasanaEligibility);
router.put('/:patientId/pariksha', updatePariksha);
router.put('/:patientId/agni', updateAgniAssessment);
router.put('/:patientId/kostha', updateKosthaAssessment);
router.put('/:patientId/saama-nirama', updateSaamaNirama);
router.put('/:patientId/bala', updateBala);

router.put('/:patientId/complete', markPoorvaKarmaCompleted);

export default router;
