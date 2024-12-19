

export const dynamic = 'force-dynamic';
// pages/api/auth/reset-password.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during password reset:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
