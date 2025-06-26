import Admin from '../models/Admin.js';

const admin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const adminUser = await Admin.findOne({ email: req.user.email });
  if (!adminUser) return res.status(403).json({ message: 'Admin only' });
  next();
};

export default admin; 