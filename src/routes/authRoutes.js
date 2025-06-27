import express from 'express';
import passport from 'passport';
import { sendOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Bad request
 */
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // On success, issue JWT and redirect or respond
  // You can customize this as needed
  res.json({ token: req.user.token, user: req.user });
});

export default router; 
