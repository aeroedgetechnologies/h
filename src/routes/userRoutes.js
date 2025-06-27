import express from 'express';
import auth from '../middlewares/auth.js';
import { getProfile, updateProfile, requestLive, getWallets, requestWithdraw, getRewards } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         photo:
 *           type: string
 *         loginMethods:
 *           type: array
 *           items:
 *             type: string
 *         wallets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               balance:
 *                 type: number
 *         rewardPoints:
 *           type: number
 *         status:
 *           type: string
 *           enum: [active, blocked]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         photo:
 *           type: string
 *           description: Profile photo URL
 *     LiveRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, live, ended]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Wallet:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [main, bonus]
 *         balance:
 *           type: number
 *     WithdrawRequest:
 *       type: object
 *       required:
 *         - walletType
 *         - amount
 *       properties:
 *         walletType:
 *           type: string
 *           enum: [main, bonus]
 *           description: Type of wallet to withdraw from
 *         amount:
 *           type: number
 *           minimum: 1
 *           description: Amount to withdraw
 *     Reward:
 *       type: object
 *       properties:
 *         points:
 *           type: number
 *         history:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *               points:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/profile', auth, updateProfile);

/**
 * @swagger
 * /api/user/request-live:
 *   post:
 *     summary: Request to go live
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Live request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveRequest'
 *       400:
 *         description: User already has a pending or active live request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is blocked
 */
router.post('/request-live', auth, requestLive);

/**
 * @swagger
 * /api/user/wallets:
 *   get:
 *     summary: Get user wallets
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User wallet information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/wallets', auth, getWallets);

/**
 * @swagger
 * /api/user/wallet/withdraw:
 *   post:
 *     summary: Request wallet withdrawal
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawRequest'
 *     responses:
 *       200:
 *         description: Withdrawal request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Withdrawal request submitted"
 *                 requestId:
 *                   type: string
 *       400:
 *         description: Insufficient balance or invalid amount
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is blocked
 */
router.post('/wallet/withdraw', auth, requestWithdraw);

/**
 * @swagger
 * /api/user/rewards:
 *   get:
 *     summary: Get user rewards
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User rewards information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reward'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/rewards', auth, getRewards);

export default router; 

// import express from 'express';
// import { getProfile, updateProfile, requestLive, getWallets, requestWithdraw, getRewards } from '../controllers/userController.js';
// import auth from '../middlewares/auth.js';

// const router = express.Router();

// router.get('/profile', auth, getProfile);
// router.put('/profile', auth, updateProfile);
// router.post('/request-live', auth, requestLive);
// router.get('/wallets', auth, getWallets);
// router.post('/wallet/withdraw', auth, requestWithdraw);
// router.get('/rewards', auth, getRewards);

// export default router;
