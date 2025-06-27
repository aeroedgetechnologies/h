import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    // Use environment variable for secret, fallback to hardcoded for dev
    const secret = process.env.JWT_SECRET || 'mySuperSecretKey123';
    console.log('JWT verify using secret:', secret); // Debug line
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token payload:', decoded);

    // Check if it's an admin token
    if (decoded.admin) {
      console.log('Looking for admin with ID:', decoded.id);
      req.user = await Admin.findById(decoded.id);
      console.log('Found admin:', req.user ? 'Yes' : 'No');
      if (!req.user) throw new Error('Admin not found');
    } else {
      console.log('Looking for user with ID:', decoded.id);
      req.user = await User.findById(decoded.id);
      console.log('Found user:', req.user ? 'Yes' : 'No');
      if (!req.user) throw new Error('User not found');
    }
    
    console.log('Auth successful for:', req.user.email);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    console.error('Full error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth; 
