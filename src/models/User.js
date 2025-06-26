import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'main', 'bonus', etc.
  balance: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
  loginMethods: [{ type: String }], // e.g., ['google', 'otp']
  wallets: [walletSchema],
  rewardPoints: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema); 