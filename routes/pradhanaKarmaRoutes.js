import express from 'express';
import {
    createOrUpdatePradhanaKarma,
    addDailyObservation,
    updateDailyObservation,
    markPradhanaKarmaCompleted,
    getPradhanaKarma
} from '../controllers/pradhanaKarmaController.js';
import { protect, isDoctor } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(protect);
router.use(isDoctor);

// All routes require the patientId parameter in the URL
router.get('/:patientId', getPradhanaKarma);
router.put('/:patientId', createOrUpdatePradhanaKarma);
router.post('/:patientId/observations', addDailyObservation);
router.put('/:patientId/observations/:day', updateDailyObservation);
router.put('/:patientId/complete', markPradhanaKarmaCompleted);

export default router;
