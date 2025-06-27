import express from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import { getActive, comment, getComments, approveLive, rejectLive } from '../controllers/liveController.js';
import audit from '../middlewares/audit.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LiveStream:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, live, ended]
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         viewers:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         text:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CommentRequest:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *           minLength: 1
 *           maxLength: 500
 */

/**
 * @swagger
 * /api/live/active:
 *   get:
 *     summary: Get active live streams
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active live streams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiveStream'
 *       401:
 *         description: Unauthorized
 */
router.get('/active', getActive);

/**
 * @swagger
 * /api/live/{id}/comment:
 *   post:
 *     summary: Add a comment to a live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Live stream ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentRequest'
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Live stream not found
 */
router.post('/:id/comment', auth, comment);

/**
 * @swagger
 * /api/live/{id}/comments:
 *   get:
 *     summary: Get comments for a live stream
 *     tags: [Live Streaming]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Live stream ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Live stream not found
 */
router.get('/:id/comments', getComments);

/**
 * @swagger
 * /api/live/admin/{id}/approve:
 *   post:
 *     summary: Approve a live stream request (Admin only)
 *     tags: [Live Streaming - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Live stream request ID
 *     responses:
 *       200:
 *         description: Live stream approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveStream'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Live stream request not found
 */
router.post('/admin/:id/approve', auth, admin, approveLive, audit('approveLive', req => req.params.id));

/**
 * @swagger
 * /api/live/admin/{id}/reject:
 *   post:
 *     summary: Reject a live stream request (Admin only)
 *     tags: [Live Streaming - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Live stream request ID
 *     responses:
 *       200:
 *         description: Live stream rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveStream'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Live stream request not found
 */
router.post('/admin/:id/reject', auth, admin, rejectLive, audit('rejectLive', req => req.params.id));

export default router; 

// import express from 'express';
// import { getActive, comment, getComments, approveLive, rejectLive } from '../controllers/liveController.js';
// import audit from '../middlewares/audit.js';
// import auth from '../middlewares/auth.js';
// import admin from '../middlewares/admin.js';

// const router = express.Router();

// router.get('/active', getActive);
// router.post('/:id/comment', comment);
// router.get('/:id/comments', getComments);

// // Admin routes (add admin middleware)
// router.post('/admin/:id/approve', auth, admin, approveLive, audit('approveLive', req => req.params.id));
// router.post('/admin/:id/reject', auth, admin, rejectLive, audit('rejectLive', req => req.params.id));

// export default router;
