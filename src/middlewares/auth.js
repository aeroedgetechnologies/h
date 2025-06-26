import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

    req.user = await User.findById(decoded.id);
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};


export default auth; 