import express from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import { 
  getLiveRequests, 
  getUsers, 
  blockUser, 
  getWalletRequests, 
  approveWallet, 
  rejectWallet, 
  getAnalytics, 
  adminLogin,
  getAuditLogs
} from '../controllers/adminController.js';
import audit from '../middlewares/audit.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email address
 *         password:
 *           type: string
 *           description: Admin password
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         admin:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             role:
 *               type: string
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, blocked]
 *         rewardPoints:
 *           type: number
 *         wallets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               balance:
 *                 type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     LiveRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           $ref: '#/components/schemas/User'
 *         status:
 *           type: string
 *           enum: [pending, approved, live, ended]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     WalletRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           $ref: '#/components/schemas/User'
 *         walletType:
 *           type: string
 *           enum: [main, bonus]
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Analytics:
 *       type: object
 *       properties:
 *         users:
 *           type: number
 *           description: Total number of users
 *         lives:
 *           type: number
 *           description: Number of active live streams
 *         pendingLives:
 *           type: number
 *           description: Number of pending live requests
 *         walletReqs:
 *           type: number
 *           description: Number of pending wallet requests
 *     AuditLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         adminId:
 *           type: string
 *         adminEmail:
 *           type: string
 *         action:
 *           type: string
 *         target:
 *           type: string
 *         details:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', adminLogin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, blocked]
 *         description: Filter by user status
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/users', auth, admin, getUsers);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   post:
 *     summary: Block or unblock a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */
router.post('/users/:id/block', auth, admin, blockUser, audit('blockUser', req => req.params.id));

/**
 * @swagger
 * /api/admin/live-requests:
 *   get:
 *     summary: Get pending live requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending live requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiveRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/live-requests', auth, admin, getLiveRequests);

/**
 * @swagger
 * /api/admin/wallet-requests:
 *   get:
 *     summary: Get wallet requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by request status
 *     responses:
 *       200:
 *         description: List of wallet requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WalletRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/wallet-requests', auth, admin, getWalletRequests);

/**
 * @swagger
 * /api/admin/wallet-requests/{id}/approve:
 *   post:
 *     summary: Approve a wallet request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet request ID
 *     responses:
 *       200:
 *         description: Wallet request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Wallet request not found
 */
router.post('/wallet-requests/:id/approve', auth, admin, approveWallet, audit('approveWallet', req => req.params.id));

/**
 * @swagger
 * /api/admin/wallet-requests/{id}/reject:
 *   post:
 *     summary: Reject a wallet request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet request ID
 *     responses:
 *       200:
 *         description: Wallet request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WalletRequest'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Wallet request not found
 */
router.post('/wallet-requests/:id/reject', auth, admin, rejectWallet, audit('rejectWallet', req => req.params.id));

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Analytics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/analytics', auth, admin, getAnalytics);

/**
 * @swagger
 * /api/admin/audit-logs:
 *   get:
 *     summary: Get audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 50
 *         description: Number of logs per page
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/audit-logs', auth, admin, getAuditLogs);

export default router; 

// import express from 'express';
// import auth from '../middlewares/auth.js';
// import admin from '../middlewares/admin.js';
// import { 
//   getLiveRequests, 
//   getUsers, 
//   blockUser, 
//   getWalletRequests, 
//   approveWallet, 
//   rejectWallet, 
//   getAnalytics, 
//   adminLogin,
//   getAuditLogs
// } from '../controllers/adminController.js';
// import audit from '../middlewares/audit.js';

// const router = express.Router();

// // Add admin middleware for real use
// router.get('/live-requests', auth, admin, getLiveRequests);
// router.get('/users', auth, admin, getUsers);
// router.post('/users/:id/block', auth, admin, blockUser, audit('blockUser', req => req.params.id));
// router.get('/wallet-requests', auth, admin, getWalletRequests);
// router.post('/wallet-requests/:id/approve', auth, admin, approveWallet, audit('approveWallet', req => req.params.id));
// router.post('/wallet-requests/:id/reject', auth, admin, rejectWallet, audit('rejectWallet', req => req.params.id));
// router.get('/analytics', auth, admin, getAnalytics);
// router.get('/audit-logs', auth, admin, getAuditLogs);
// router.post('/login', adminLogin);

// export default router;
