



// lib/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAdmin(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user?.role === 'admin';
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}
