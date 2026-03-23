import { Router } from 'express';
import { createAdmin } from '../controllers/admin.controller.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.post('/create', auth, authorize('SUPERADMIN'), createAdmin);

export default router;
