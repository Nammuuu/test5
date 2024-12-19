

export const dynamic = 'force-dynamic';
// pages/api/auth/request-reset.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // You'll need to configure this

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send email (configure nodemailer with your email service)

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    
    // const transporter = nodemailer.createTransport({ /* Your email service configuration */ });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`
    });

    return NextResponse.json({ message: 'Reset link sent' }, { status: 200 });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
