// import express from 'express';
// import auth from '../middlewares/auth.js';
// import admin from '../middlewares/admin.js';
// import { getActive, comment, getComments, approveLive, rejectLive } from '../controllers/liveController.js';
// import audit from '../middlewares/audit.js';

// const router = express.Router();

// router.get('/active', getActive);
// router.post('/:id/comment', auth, comment);
// router.get('/:id/comments', getComments);

// // Admin routes (add admin middleware later)
// router.post('/admin/:id/approve', auth, admin, approveLive, audit('approveLive', req => req.params.id));
// router.post('/admin/:id/reject', auth, admin, rejectLive, audit('rejectLive', req => req.params.id));

// export default router; 

import express from 'express';
import { getActive, comment, getComments, approveLive, rejectLive } from '../controllers/liveController.js';
import audit from '../middlewares/audit.js';

const router = express.Router();

router.get('/active', getActive);
router.post('/:id/comment', comment);
router.get('/:id/comments', getComments);

// Admin routes without auth/admin for now
router.post('/admin/:id/approve', approveLive, audit('approveLive', req => req.params.id));
router.post('/admin/:id/reject', rejectLive, audit('rejectLive', req => req.params.id));

export default router;
