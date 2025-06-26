import LiveStream from '../models/LiveStream.js';
import User from '../models/User.js';
import WalletRequest from '../models/WalletRequest.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const getLiveRequests = async (req, res) => {
  const lives = await LiveStream.find({ status: 'pending' }).populate('userId', 'name email');
  res.json(lives);
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.status = user.status === 'blocked' ? 'active' : 'blocked';
  await user.save();
  res.json(user);
};

export const getWalletRequests = async (req, res) => {
  const reqs = await WalletRequest.find({ status: 'pending' }).populate('userId', 'name email');
  res.json(reqs);
};

export const approveWallet = async (req, res) => {
  const { id } = req.params;
  const wr = await WalletRequest.findById(id);
  if (!wr || wr.status !== 'pending') return res.status(404).json({ message: 'Not found or not pending' });
  wr.status = 'approved';
  await wr.save();
  res.json(wr);
};

export const rejectWallet = async (req, res) => {
  const { id } = req.params;
  const wr = await WalletRequest.findById(id);
  if (!wr || wr.status !== 'pending') return res.status(404).json({ message: 'Not found or not pending' });
  wr.status = 'rejected';
  await wr.save();
  res.json(wr);
};

export const getAnalytics = async (req, res) => {
  const users = await User.countDocuments();
  const lives = await LiveStream.countDocuments({ status: 'live' });
  const pendingLives = await LiveStream.countDocuments({ status: 'pending' });
  const walletReqs = await WalletRequest.countDocuments({ status: 'pending' });
  res.json({ users, lives, pendingLives, walletReqs });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('Admin login attempt:', email);

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log('Admin not found');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    console.log('Invalid password');
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const secret = process.env.JWT_SECRET || 'mySuperSecretKey123';
  console.log('Using JWT_SECRET for signing:', secret);

  const token = jwt.sign(
    { id: admin._id, email: admin.email, admin: true, role: admin.role },
    secret,
    { expiresIn: '7d' }
  );

  console.log('Generated token:', token);
  res.json({ token, admin: { email: admin.email, role: admin.role } });
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await (await import('../models/AuditLog.js')).default.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
