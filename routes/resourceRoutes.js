import express from 'express';
import { getResources, createResource } from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route('/')
    .get(getResources)
    .post(createResource);

export default router;
