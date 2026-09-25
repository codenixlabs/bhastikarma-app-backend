import express from 'express';
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    downloadPatientReport
} from '../controllers/patientController.js';
import { protect, isDoctor } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isDoctor);

router.route('/')
    .post(createPatient)
    .get(getPatients);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

router.route('/:id/pdf')
    .get(downloadPatientReport);

export default router;
