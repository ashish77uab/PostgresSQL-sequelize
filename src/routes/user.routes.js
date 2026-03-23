import { Router } from 'express';
import { completeProfile } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.post('/profile', auth, authorize('USER'), completeProfile);

export default router;
