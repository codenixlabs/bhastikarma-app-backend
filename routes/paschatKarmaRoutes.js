import express from 'express';
import {
    createOrUpdatePaschatKarma,
    getPaschatKarma
} from '../controllers/paschatKarmaController.js';
import { protect, isDoctor } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isDoctor);

router.route('/:patientId')
    .get(getPaschatKarma)
    .put(createOrUpdatePaschatKarma);

export default router;
