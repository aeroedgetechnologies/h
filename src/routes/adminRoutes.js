import express from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import { getLiveRequests, getUsers, blockUser, getWalletRequests, approveWallet, rejectWallet, getAnalytics, adminLogin } from '../controllers/adminController.js';
import audit from '../middlewares/audit.js';

const router = express.Router();

// Add admin middleware for real use
router.get('/live-requests', auth, admin, getLiveRequests);
router.get('/users', auth, admin, getUsers);
router.post('/users/:id/block', auth, admin, blockUser, audit('blockUser', req => req.params.id));
router.get('/wallet-requests', auth, admin, getWalletRequests);
router.post('/wallet-requests/:id/approve', auth, admin, approveWallet, audit('approveWallet', req => req.params.id));
router.post('/wallet-requests/:id/reject', auth, admin, rejectWallet, audit('rejectWallet', req => req.params.id));
router.get('/analytics', auth, admin, getAnalytics);
router.post('/login', adminLogin);

export default router; 
