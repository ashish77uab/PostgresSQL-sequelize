import { Router } from 'express';
import {
  attemptTodayQuiz,
  createQuiz,
  createVideo,
  enroll,
  getHistory,
  getScores,
  getTodayContent,
  watchTodayVideo
} from '../controllers/session.controller.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.post('/enroll', auth, authorize('USER'), enroll);
router.post('/video', auth, authorize('ADMIN', 'SUPERADMIN'), createVideo);
router.post('/quiz', auth, authorize('ADMIN', 'SUPERADMIN'), createQuiz);
router.get('/today-content', auth, authorize('USER'), getTodayContent);
router.post('/watch-video', auth, authorize('USER'), watchTodayVideo);
router.post('/attempt-quiz', auth, authorize('USER'), attemptTodayQuiz);
router.get('/scores', auth, authorize('USER'), getScores);
router.get('/history', auth, authorize('USER'), getHistory);

export default router;
