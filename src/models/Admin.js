import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: [{ type: String }],
  role: { type: String, enum: ['superadmin', 'moderator'], default: 'superadmin' },
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema); 