

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization header missing or incorrect');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.error('User not found:', decoded.userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
