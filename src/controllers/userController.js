import User from '../models/User.js';
import LiveStream from '../models/LiveStream.js';
import WalletRequest from '../models/WalletRequest.js';

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { name, photo } = req.body;
  req.user.name = name || req.user.name;
  req.user.photo = photo || req.user.photo;
  await req.user.save();
  res.json(req.user);
};

export const requestLive = async (req, res) => {
  const existing = await LiveStream.findOne({ userId: req.user._id, status: { $in: ['pending', 'approved', 'live'] } });
  if (existing) return res.status(400).json({ message: 'Already requested or live' });
  const live = await LiveStream.create({ userId: req.user._id });
  res.json(live);
};

export const getWallets = async (req, res) => {
  res.json(req.user.wallets);
};

export const requestWithdraw = async (req, res) => {
  const { walletType, amount } = req.body;
  const wallet = req.user.wallets.find(w => w.type === walletType);
  if (!wallet || wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
  const wr = await WalletRequest.create({ userId: req.user._id, walletType, amount });
  res.json(wr);
};

export const getRewards = async (req, res) => {
  res.json({ rewardPoints: req.user.rewardPoints });
}; 