export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import UserProfile from '../../../../../models/UserProfile';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

export async function GET(req) {
  try {
    await connectToDatabase();

    // Extract authorization header and validate it
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract and verify JWT token
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Find the user by ID decoded from token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Find the user's profile using the UserProfile model
    const userProfile = await UserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // Return the user's profile
    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

