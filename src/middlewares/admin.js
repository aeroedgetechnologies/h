import Admin from '../models/Admin.js';

const admin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  
  // Check if user is an admin (either by admin flag or by checking admin roles)
  if (req.user.admin || req.user.role === 'admin' || req.user.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin only' });
  }
};

export default admin; 
