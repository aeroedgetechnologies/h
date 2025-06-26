import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  adminEmail: { type: String },
  action: { type: String, required: true },
  target: { type: String }, // e.g., userId, liveId, etc.
  details: { type: Object },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('AuditLog', auditLogSchema); 