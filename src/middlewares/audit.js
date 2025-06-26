import AuditLog from '../models/AuditLog.js';

const audit = (action, getTarget, getDetails) => async (req, res, next) => {
  try {
    await AuditLog.create({
      adminId: req.user?._id,
      adminEmail: req.user?.email,
      action,
      target: getTarget ? getTarget(req) : undefined,
      details: getDetails ? getDetails(req) : undefined,
    });
  } catch {}
  next();
};

export default audit; 