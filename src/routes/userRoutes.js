import express from 'express';
import auth from '../middlewares/auth.js';
import { getProfile, updateProfile, requestLive, getWallets, requestWithdraw, getRewards } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/request-live', auth, requestLive);
router.get('/wallets', auth, getWallets);
router.post('/wallet/withdraw', auth, requestWithdraw);
router.get('/rewards', auth, getRewards);

export default router; 
