import { Router } from 'express';
import { getOrganizations, sponsor } from '../controllers/org.controller.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.get('/', getOrganizations);
router.post('/sponsor', auth, authorize('ORG_ADMIN', 'SUPERADMIN'), sponsor);

export default router;
