// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  role: { type: String, default: 'user' },
  phoneNumber: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
