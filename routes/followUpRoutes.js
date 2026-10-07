import express from 'express';
import { createOrUpdateFollowUp, getFollowUp } from '../controllers/followUpController.js';
import { protect, isDoctor } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isDoctor);

router.get('/:patientId', getFollowUp);
router.post('/:patientId', createOrUpdateFollowUp);
router.put('/:patientId', createOrUpdateFollowUp);

export default router;
