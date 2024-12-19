


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    console.log("password", password)
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'pass same error Invalid email or password' }, { status: 401 });
    }
    console.log(isMatch)

    const referrerId = user._id; // Assuming the referrerId is the user's ID


    const token = jwt.sign({ userId: user._id, role: user.role, referrerId }, JWT_SECRET, { expiresIn: '72h' });
const refreshToken = jwt.sign({ userId: user._id, role: user.role, referrerId }, JWT_SECRET, { expiresIn: '7d' });

return NextResponse.json({ token, refreshToken }, { status: 200 });


    // return NextResponse.json({ token, refreshToken }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

